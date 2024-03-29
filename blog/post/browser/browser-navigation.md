---
typora-root-url: ./..\..\image
---

# 浏览器的导航原理

## 概述

「导航」是指浏览器从旧页面进入到新页面的过程，本文将会讲述浏览器的导航过程。导航分为 7 个步骤，其中前 6 个是必须的，第 7 个是可选的，它们分别是：处理输入、开始导航、发起网络请求、读取响应数据、分配渲染进程、完成导航、beforeunload。

不过，在正式开始本文之前，我们还需要先了解一下浏览器进程的作用。在 Chrome 中，选项卡之外的所有内容都由浏览器进程来处理，它有 UI 线程、网络线程、存储线程等线程，其中 UI 线程负责绘制浏览器界面（比如按钮、地址栏等），网络线程负责从互联网下载数据，存储线程负责控制文件访问。

> Chrome 已经将与网络传输相关的功能重构为网络服务，浏览器进程会视情况来决定网络服务应当运行在哪个进程或线程中。对于大多数平台，网络服务都运行在实用程序进程的 IO 线程上，对于 Android，网络服务运行在浏览器进程的网络线程上。
>
> 本文假设网络服务运行在浏览器进程的网络线程上。

![浏览器进程](/browser/browser-navigation/browser-process.png)

## Step 1 - 处理输入

当用户键入地址栏时（按下回车键之前），UI 线程就会解析输入的内容，来判断这是一个 URL（如 `www.mysite.com`）还是一个搜索词条（如 `mysite`）。

![UI 线程解析地址栏](/browser/browser-navigation/ui-thread-parse-address-bar.png)

## Step 2 - 开始导航

当用户按下回车键时，UI 线程就会根据地址栏的内容来合成一段新的 URL。如果地址栏的内容就是一个 URL，UI 线程就会直接拿来使用，如果地址栏的内容是一个搜索词条，UI 线程就会使用搜索引擎来合成一段带有这个搜索词条的 URL。比如，如果搜索词条是 `mysite` 且地址栏使用的是 Google 搜索的话，UI 线程就会构造出如下的 URL。

```
https://www.google.com/search?q=mysite&oq=mysite&aqs=chrome..69i57j0i12i512j0i512j0i12i512l2j0i512l2j0i12i512j0i512.2999j0j7&sourceid=chrome&ie=UTF-8
```

总之，UI 线程最后得到了一个 URL，这个 URL 代表一个站点。然后 UI 线程会命令网络线程向这个站点发起网络请求，以获取这个站点的内容，同时，UI 线程会在选项卡的左侧显示一个旋转的加载标识。

> 如果网络服务运行在另一个进程中，而不是运行在浏览器进程中的网络线程的话，浏览器进程就需要通过 IPC 来将站点 URL 发送给网络服务所在的进程，然后再发起网络请求。

![网络线程发起网络请求](/browser/browser-navigation/network-thread-network-request.png)

## Step 3 - 发起网络请求

在网络线程正式发起网络请求之前，它会先在本地缓存中查找是否存在副本数据，如果找到了就会直接使用副本，然后提前结束该次网络请求，否则就会正式发起网络请求。

当网络线程正式发起网络请求后，它会先在本地 DNS 缓存中查找是否存在副本数据（待解析的域名的 IP 地址），如果找到了就会直接使用副本，否则就会使用 DNS 服务来解析域名的 IP 地址，另外如果 URL 使用了 HTTPS，那么网络线程还需要为其建立 TLS 连接。

然后网络线程会根据 IP 地址来找到目标站点的服务器，并与服务器建立 TCP 连接，建立好 TCP 连接之后，网络线程就会构建请求行、请求头等信息，然后通过 HTTP 请求来向服务器发送请求信息。其中，与该站点相关的 Cookie 等数据会附加到请求头中去。

## Step 4 - 读取响应数据

服务器接收到请求信息后，就会根据请求信息来生成响应信息，包括响应行、响应头、响应体，然后将响应信息发送给网络线程。

网络线程会在接收到响应行和响应头的数据后就开始解析它们，如果发现状态码是 `301`、`302` 之类的重定向信息，那么网络线程就会从响应头的 `Location` 字段中读取重定向的 URL，然后网络线程就会使用重定向的 URL 来发起另一个新的网络请求。

如果响应行的状态吗是 `200`，网络线程就会继续往下处理。

![响应头和响应体](/browser/browser-navigation/response-header-and-body.png)

首先，网络线程会查看响应头的 `Content-type` 字段，来判断响应体的数据的类型，以决定该如何处理响应体的数据。比如，如果 `Content-type` 是 `application/octet-stream`，就代表响应体的数据是字节流类型，那么网络线程就会将数据传递给下载管理器，然后结束本次导航。如果 `Content-type` 是 `text/html`，就代表响应体的数据是 HTML 格式的文本，那么网络线程就会将数据传递给渲染进程。

另外，当网络线程开始接收到响应体的数据后，网络线程会在必要时查看其前几个字节数据，来判断响应体的数据的类型，这种行为称为 MIME Type sniffing（嗅探 MIME 的类型）。之所以要这么做，是因为 `Content-type` 字段有时候会丢失，有时候也会出错（如服务器运维人员不小心给资源指定了错误的数据类型）。

最后，这个环节也会进行安全检查。如果域和响应信息与已知的恶意站点是匹配的，那么网络线程就会弹出警告页面。另外，如果数据资源（如 HTML、XML、JSON 等）是跨站点的，网络线程就不会将这些数据传递给渲染进程的内存，除非服务器通过 [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) 明确表示该数据资源可被跨域访问。

## Step 5 - 分配渲染进程

一旦完成了第 4 步的内容（即完成了所有的数据下载和检查），网络线程就会告诉 UI 线程自己已经准备好数据了，然后 UI 线程就会分配一个渲染进程来渲染网页。

其实在第 2 步（开始导航）的时候，UI 线程就开始着手渲染进程的分配工作了，当网络线程完成第 4 步后（这个过程通常需要几百毫秒），渲染进程早已准备就绪了。不过如果发生了导航重定向，那么就会抛弃这个渲染进程，重新分配一个新的渲染进程，因为旧渲染进程是为之前的站点而准备的。

## Step 6 - 完成导航

现在数据和渲染进程都已经准备就绪了，浏览器进程会通过 IPC 向渲染进程发送消息（该消息被称为“提交导航”），同时还会向渲染进程持续的传输 HTML 数据，渲染进程一旦开始接收到数据，就会开始渲染页面，同时 UI 线程就会更新地址栏的安全标识，还有前进和后退按钮的指向。

![完成导航](/browser/browser-navigation/finish-navigation.png)

当渲染进程“完成”了页面的渲染后，渲染进程就会通过 IPC 向浏览器进程发送消息，该消息代表“页面已渲染完毕”。浏览器进程接收到消息后，UI 线程就会隐藏选项卡上的加载标识，并显示站点的 favicon 标识。

![确认提交导航](/browser/browser-navigation/finish-navigation-confirmation.png)

不过，上文的“完成”是带双引号的，它代表渲染进程完成了基本的渲染，渲染进程在后续可能还会加载额外的资源来渲染出新的内容。至此，整个导航就结束了。

## Step 7 - beforeunload

「beforeunload」是一个额外的可选步骤，仅当当前页面绑定了 `beforeunload` 事件时，该步骤才会被触发。

`beforeunload` 事件会弹出一个对话框，来询问用户是否真的要离开当前页面，如果用户点击了确认，就会离开该页面，否则就会撤销离开操作，继续停留在该页面。用户关闭选项卡、关闭浏览器、通过地址栏重新导航至新地址、通过 JavaScript 重新导航至新地址等操作都会触发该事件。

如果当前页面绑定了 `beforeunload` 事件，那么在导航开始之前会先触发该事件，直至用户点击「确认」按钮后，才会导航至新页面。

因为 `beforeunload` 事件是由渲染进程来处理的，所以如果是通过浏览器进程来发起的导航（比如通过地址栏），浏览器进程就需要在导航开始之前询问渲染进程是否需要执行 `beforeunload` 事件。如果是通过渲染进程来发起的导航（比如页面中的链接、`window.open` 等 API），渲染进程就会在导航开始之前先检查自身是否有要执行的 `beforeunload` 事件。

## 参考资料

以下是本文的参考资料。

- [Inside look at modern web browser (part 1)](https://developer.chrome.com/blog/inside-browser-part1/)
- [Inside look at modern web browser (part 2)](https://developer.chrome.com/blog/inside-browser-part2/)
- [Inside look at modern web browser (part 3)](https://developer.chrome.com/blog/inside-browser-part3/)
- [Inside look at modern web browser (part 4)](https://developer.chrome.com/blog/inside-browser-part4/)
- [Multi-process Architecture](https://www.chromium.org/developers/design-documents/multi-process-architecture/)
- [Populating the page: how browsers work - MDN](https://developer.mozilla.org/en-US/docs/Web/Performance/How_browsers_work)

另外，Chromium 的更新速度很快，本文无法代表最新的 Chromium，如果你想了解最新的 Chromium 的内容，可以尝试从阅读下述资料开始。

- [Chromuim 概述](https://source.chromium.org/chromium/chromium/src/+/main:cc/README.md)
- [Chromium 工作原理](https://source.chromium.org/chromium/chromium/src/+/main:docs/how_cc_works.md)

另外，http://chromium.org 上的不少资料已经过期了，你可以从 [这里](https://cs.chromium.org/chromium/src/docs/) 找到最新的 Chromium 的资料。
