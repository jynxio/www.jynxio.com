---
typora-root-url: ./..\..\image
---

# 现代浏览器的架构

## 前置知识

本文将会讲述现代浏览器的架构，在正式开始之前，我们需要先了解以下前置知识。

### 什么是 CPU

CPU 是 Center Processing Unit 的简写，汉译为中央处理器。CPU 是计算机的大脑，一个 CPU 内核就像图中的一个工作人员，它会一个一个的处理手头上的任务。过去的 CPU 普遍只有一个芯片，现在的 CPU 普遍拥有多个芯片。

![CPU](/browser/browser-architecture/cpu.png)

### 什么是 GPU

GPU 是 Graphics Processing Unit 的简写，汉译为图形处理器。GPU 特点是擅长并发的处理简单的任务。

![GPU](/browser/browser-architecture/gpu.png)

计算机或手机上的应用程序是由 CPU 与 GPU 来驱动的，不过应用程序通常都需要借助操作系统所提供的机制来调用 CPU 和 GPU，这样就形成了“三层结构”，底层是硬件（包括 CPU、GPU 和其它），中间层是操作系统，顶层是应用程序。

![三层结构](/browser/browser-architecture/three-layers.png)

### 什么是进程和线程

进程（process）是应用程序的执行程序。线程（thread）存在于进程的内部，它负责执行进程的任务，一个进程可以拥有一个或多个线程。

![进程和线程](/browser/browser-architecture/process-and-thread.png)

启动应用程序时，操作系统就会为其创建进程来保证其的运行，进程又可能会创建自己的线程来帮助自己的工作（可选的）。操作系统在创建进程的时候就会为进程分配一块内存，应用程序的所有数据都会保存在这块内存上，当应用程序关闭的时候，操作系统就会关闭相应的进程和完全回收这些进程所占用的内存，无论进程的内部是否发生了内存泄漏。

![为进程分配内存](/browser/browser-architecture/process-using-memory.png)

对于使用多个进程的应用程序而言，每个进程都会分配得到自己专属的内存，如果这些进程之间需要通信，那么就需要使用「进程间通信」（IPC）来实现。

![IPC](/browser/browser-architecture/ipc.png)

另外，同一个进程内的所有线程都可以读写这个进程的内存，这意味着线程之间可以共享数据。并且，因为不同的进程之间是相互隔绝的，所以即使某个进程发生了故障，这个故障的进程也不会影响到其它的进程，其他的进程仍然会正常运行，但是如果进程内的任意一个线程发生了错误，那么这整个进程都会崩溃。

## 单进程架构

单进程架构是指应用程序只使用一个进程的架构，这意味着应用程序的所有功能模块都会运行在一个进程中，在 2006 年前后的浏览器都采用了这种架构。下图是某种假设的单进程架构，单进程架构也当然可以设计成其它样子。

![假想的单进程架构](/browser/browser-architecture/single-process-architecture.png)

不过采用单进程架构的浏览器都有不稳定、不流畅的缺点。

关于「不稳定」，那时的浏览器需要借助插件来实现视频和游戏等功能，由于插件的质量良莠不齐容易崩溃，就导致浏览器也容易崩溃。并且当 JavaScript 非常复杂时也容易引起渲染引擎的崩溃，进而导致浏览器崩溃，这是单进程架构的浏览器不稳定的原因。

关于「不流畅」，如果某些选项卡会发生内存泄漏，那么随着浏览器运行的时间越来越长、打开过选项卡越来越多，内存泄漏就会越来越多，内存占用也会越拉越多，浏览器也可能会变得越来越慢，这是单进程架构的浏览器不流畅的原因。

## 多进程架构

多进程架构是指应用程序使用多个进程的架构，多进程架构可以设计成许多种不同的样子，不过本文只介绍 Chrome 的多进程架构，下图是 2018 年时 Chrome 的架构，来自 [Inside look at modern web browser (part 1)](https://developer.chrome.com/blog/inside-browser-part1/)。

![2018年Chrome的多进程架构](/browser/browser-architecture/2018-chrome-multi-process-architecture.png)

| 进程             | 作用                                                         |
| ---------------- | ------------------------------------------------------------ |
| Browser Process  | 控制浏览器的界面，比如地址栏、书签、前进和后退按钮。处理一些隐形的任务，比如网络请求、文件访问。管理其它的进程。 |
| Renderer Process | 渲染视图的内容，比如解析站点的资源然后渲染出选项卡的内容，其内运行着 Blink 和 V8。为了防止恶意代码利用浏览器漏洞来攻击操作系统，该进程被运行在沙箱中。Chrome 和 Chromium 遵循 Process-per-site-instance 策略来创建渲染进程，如果进程数量达到了上限，浏览器创建渲染进程的行为也会相应调整，详见下文。 |
| Plugin Process   | 控制浏览器的插件，每个运行的插件都会创建一个插件进程，对于某些操作系统，插件进程会运行在沙箱中。 |
| GPU Process      | 处理 GPU 任务，比如绘制浏览器的 UI 界面位图和视图位图。      |
| ...              | 除上述的进程外，还存在着其他的进程，比如扩展进程、代理进程、实用程序进程等等。 |

多进程架构的优点是更加稳定、更加流程、更加安全，缺点是会更占内存。

关于「更加稳定」，因为某个进程的崩溃不会影响到其它的进程，所以当选项卡或插件发生崩溃时，也不会影响到其它的选项卡或整个浏览器，因此多进程架构的浏览器更不容易崩溃。

关于「更加流畅」，因为操作系统可以完全回收死亡进程的所有内存，所以只要用户善于清理选项卡，哪怕浏览器的运行时间再长，浏览器也不容易累积内存泄漏，因此多进程架构的浏览器会更加流畅。

关于「更加安全」，渲染进程和插件进程所执行的代码来自于网络和插件开发者，为了避免潜在的恶意代码利用浏览器漏洞来攻击操作系统，浏览器将渲染进程和插件进程放了在 [沙箱](https://chromium.googlesource.com/chromium/src/+/HEAD/docs/design/sandbox.md) 中运行，之所以可以使用沙箱技术，是因为操作系统提供了限制进程权限的能力。比如 Chrome 就限制了选项卡读写系统文件的权限。这就是多进程架构的浏览器更安全的原因。另外，在某些操作系统中，插件进程还会运行在沙箱中。

关于「更占内存」，因为进程之间是相互隔离的，所以进程们无法像“同一个进程内的线程可以共享该进程内的数据”那样来向彼此共享数据，这导致了进程们无法复用相同的组件，哪怕一个进程想要使用一个大家都在用的组件，它也只能拷贝并使用这个组件的副本，所以多进程架构的浏览器会占用更多的内存。一个例子是，每个渲染进程都有一个 Blink 和 V8 的副本。

接下来，让我们来详细的看看浏览器进程和渲染进程的内部构造。

![渲染进程的结构](/browser/browser-architecture/rendering-process-construction.png)

| 名称              | 作用                                                         |
| ----------------- | ------------------------------------------------------------ |
| RenderProcess     | 每个渲染进程都有一个全局的 RenderProcess 对象，用于和浏览器进程进行通信（使用 [IPC](https://www.chromium.org/developers/design-documents/inter-process-communication/)，即 Inter Process Communication），并维护渲染进程的内部状态。 |
| RenderProcessHost | 浏览器进程的内部有一至多个 RenderProcessHost 对象，每个 RenderProcessHost 都对应一个渲染进程的 RenderProcess。它用于和渲染进程进行通信（使用 IPC），并维护渲染浏览器进程的状态。 |
| RenderView        | 渲染进程的内部有一至多个 RenderView 对象，每个 RenderView 都对应一个视图，并拥有一个在该渲染进程内唯一的 ID，RenderView 由 RenderProcess 所管理。它代表视图的内容。 |
| RenderViewHost    | RenderProcess 对象会管理一至多个 RenderViewHost 对象，每个 RenderViewHost 都对应一个 RenderView（在相应的渲染进程中）。RenderViewHost 的作用是指导 RenderProcessHost 来向对应的 RenderProcess 发送消息，消息最后会到达 RenderVIewHost 对应的 RenderView。 |

> 你可以通过 [Multi-process Architecture](https://www.chromium.org/developers/design-documents/browser-architecture/#components-and-interfaces) 和 [How Chromium Displays Web Pages](https://www.chromium.org/developers/design-documents/displaying-a-web-page-in-chrome/) 来了解更详细的信息。

## 服务化架构

为了节省内存，Chrome 至早从 2018 年起就决定逐步迁移至服务化的架构，这种架构的特点是以 service 的形式来运行浏览器的各个功能，以便于根据硬件的性能（如内存大小、CPU 算力）来弹性的控制进程数量。比如当硬件性能较强时，Chrome 就会将每个服务拆分为不同的进程来提供更高的稳定性和流畅性。

![更多的进程](/browser/browser-architecture/more-process.png)

比如当硬件性能较弱时，Chrome 就会将多个服务整合到一个进程中来节省内存。

![更少的进程](/browser/browser-architecture/less-process.png)

一个实际的案例是，原本与网络传输（比如 http、sockets、web sockets）相关的功能是由浏览器进程中的网络线程来负责的，现在它被重构为了“网络服务”。浏览器进程会视情况来决定应该在哪个进程或线程中运行网络服务，在大多数平台上，网络服务都会运行在实用程序进程的 IO 线程上，在 Android 上，网络服务则会运行在浏览器进程中的某条线程上（对于 Chrome os 而言，是 IO 线程），你可以从 [Network Service](https://chromium.googlesource.com/chromium/src/+/HEAD/services/network/README.md) 这篇文章找到更多资料。

这次架构转型是一个长期的过程，直至 2022 年，Chrome 还处在过渡阶段。

## 站点隔离：保护站点的数据

站点隔离（Site Isolation）是 Chrome 的一项安全策略，它用于阻止恶意代码窃取站点数据。

它的具体做法是将不同的站点分隔到不同的渲染进程中去，无论这个站点是一个选项卡还是一个内嵌的 iframe，这样就可以借助进程之间相互隔离的特性来阻止恶意代码访问其他站点的数据。同时，它还会阻止渲染进程获取跨域的数据资源，除非服务器通过 [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) 明确表示该数据资源可被跨域访问。

> 关于数据资源，浏览器从服务器那拿到的资源可以分为两种类型，一种是数据资源，比如 HTML、XML、JSON 等，另一种是媒体资源，比如图像、JavaScript、CSS 等。站点可以接收任意来源的媒体资源，但站点只能接收符合同源策略的数据资源或被 CORS 批准的跨站点资源。不过，`<img>` 和 `<script>` 拥有可以下载任意来源的资源的能力，攻击者会利用这两个标签来下载敏感数据，如此一来，敏感数据就进入了渲染进程的内存中，然后攻击者会通过某种手段来嗅探渲染进程中的内存以获得这些数据。
>

> 关于同一站点（same site），Chrome 是这样来定义“同一站点”这个概念的：如果两个 URL 的协议和根域名是相同，那么就认为它们属于同一个站点。同一站点和同源这两个概念很相似，但区别是同一站点是不考虑子域名、端口和路径的，比如 `https://example.com` 和 `https://foo.example.com:8080` 就属于同一个站点。
>

[Site Isolation for web developers](https://developers.google.com//web/updates/2018/07/site-isolation#full-page_layout_is_no_longer_synchronous) 和 [Mitigating Spectre with Site Isolation in Chrome](https://security.googleblog.com/2018/07/mitigating-spectre-with-site-isolation.html) 这两篇文章详细介绍了站点隔离是如何保护站点数据的，[Site Isolation Design Document](https://www.chromium.org/developers/design-documents/site-isolation/) 这篇文章详细阐述了站点隔离在 Chromium 中的实现。

最后，对于 Windows、Mac、Linux、Chrome OS，从 Chrome 67 开始就已经全面启用了站点隔离。对于安卓，仅对内存大于 2GB 且有用户登录行为的站点启用站点隔离。你可以通过 [这篇文章](https://www.chromium.org/Home/chromium-security/site-isolation/) 来了解更详细的情况，另外站点隔离会导致各平台的 Chrome 占用更多的内存，大约是 3%~13%，你也可以在这篇文章中找到更详细的统计数据。

## 进程模型：进程的创建策略

[进程模型](https://www.chromium.org/developers/design-documents/process-models/) 是 Chromium 创建渲染进程的策略，Chromium 有 4 种进程模型，分别是：

- Process-per-site-instance
- Process-per-site
- Process-per-tab
- Single process

其中，Process-per-site-instance 是 Chromium 默认使用的进程模型，这种进程模型与站点隔离息息相关。对于 Chromium，如果想要使用另外 3 种进程模型，就必须使用命令行来启动 Chromium，同时附带上相应的参数，比如 `--process-per-site`。对于 Chrome，它目前只使用 Process-per-site-instance。

另外，Chromium 创建的渲染进程的数量是有上限的，上限与主机的内存量成正比。如果 Chromium 所创建的进程数量达到了上限，那么 Chromium 就会开始复用已有的渲染进程，即用单个渲染进程来渲染多个站点，目前这种复用是随机的，不过 Chromium 表示其未来可能会开发更智能的方式来复用渲染进程。这个规则同样适用于 Chrome。

### Process-per-site-instance

这是 Chromium 默认使用的进程模型，它会将每个站点都分配给独立的渲染进程，无论这个站点是一个选项卡还是一个 iframe，这意味着可能会发生一个选项卡拥有多个渲染进程的情况。

![站点隔离示意图](/browser/browser-architecture/site-isolation.png)

另外，如果符合同一站点规则的两个站点是单独打开的，那么这两个站点将会分配给两个独立的渲染进程，比如通过地址栏分别打开站点 a（`http://192.168.0.100:8080/a.html`）和站点 b（`http://192.168.0.100:8080/b.html`）站点 a 将会分配给 `51798` 渲染进程，站点 b 将会分配给 `51814` 渲染进程。

![不共享渲染进程](/browser/browser-architecture/doesnt-share-rendering-process.png)

如果站点 b 是通过站点 a 来打开的，那么站点 a 和站点 b 就会分配给同一个渲染进程 `51798`。

![共享的渲染进程](/browser/browser-architecture/share-rendering-process.png)

其中，站点 a 是通过 `window.open` API 来打开站点 b 的，站点 a 的 `<body>` 代码如下：

```html
<body>
    <h1>This is A.</h1>
    <h1>Turn to B.</h1>
    <script>
        document.querySelectorAll( "h1" )[ 1 ].addEventListener( "click", window.open( "http://192.168.0.100:8080/b.html" ), false );
    </script>
</body>
```

如果通过 `右键-在新标签页中打开链接` 来打开站点 b，那么站点 b 也会被分配给另一个独立的渲染进程。

另外，根据 MDN 的 [描述](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/a#attr-target)，如果通过 `<a href="http://192.168.0.100:8080/b.html" target="_blank"></a>` 来打开的站点 b，站点 b 也会和站点 a 共享同一个渲染进程。但是实践发现，站点 b 还是会分配给另一个独立的渲染进程，MDN 的描述似乎错了。

### Process-per-site

所有属于同一站点的站点都将被分配给同一个渲染进程，不属于同一站点的站点将会被分配给不同的渲染进程。

### Process-per-tab

每个选项卡一个渲染进程。

### Single process

整个浏览器都将运行在一个进程中。

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
