---
typora-root-url: ./..\..\image
---

# 输入事件与页面滚动

## 概述

本文将会介绍的是浏览器处理输入事件与更新页面的过程，不过在正式开始之前，我们需要先了解「重排」和「重绘」来作为前置知识。

## 什么是重排和重绘

回顾《浏览器页面的渲染》一文，Chrome 渲染页面的流程有 8 个步骤，分别是：1.构建 DOM、2.计算样式、3.计算布局、4.创建绘图指令、5.分层、6.分块、7.光栅化、8.合成。

如果页面重新排版了自己的布局，那么我们就认为页面发生了重排（reflow）。当页面发生了重排之后，浏览器就会按需的执行渲染流程中的某些步骤来更新页面，而浏览器到底需要执行哪些步骤则取决于引发重排的具体行为，比如：

- 如果浏览器窗口收窄了，页面就需要进行收缩，此时，浏览器只需要从第 2 步开始来执行渲染流程就可以渲染出收缩后的页面了，因为此时没有修改 DOM，所以不必再重新构建 DOM（第 1 步），不过样式计算（第 2 步）及其后续步骤显然都是必须的，因为遵循响应式布局的页面的元素都必不可少的会依赖 viewport 的尺寸。
- 如果增加、删除、移动了 DOM 中的节点，那么就需要重新执行完整的渲染流程，因为这改变了 DOM 的结构，而后续的所有步骤都是直接或间接的依赖 DOM 的。
- 如果修改了元素的尺寸，那么就需要从第 2 步开始来执行渲染流程，因为这个元素的样式发生了变化，并且其他元素的样式也可能会受其影响而发生变化。

如果元素只是更新了自己的背景颜色、背景样式等东西时，我们就认为页面发生了重绘（repaint），重绘所需执行的渲染流程的步骤更少一些，只需要重新计算样式、计算布局、创建绘图指令、光栅化、合成就够了。

根据浏览器的事件循环，如果主线程上的任务修改了页面，那么浏览器就会等待主线程执行完所有任务之后在渲染新的页面位图。由于重排和重绘的部分步骤是由主线程的执行的，比如第 1 步至第 5 步，所以重排和重绘会受到主线程的阻塞。具体来说，假设我们为页面绑定一个点击事件的监听器，该监听器会将页面的背景色改为粉色（重绘），同时该监听器会执行一个非常耗时的任务，那么当用户点击了页面之后，页面并不会立即变成粉色，而是会过一阵子才会变成粉色。

```js
globalThis.addEventListener( "click", _ => {
    
    document.body.style.backgroundColor = "pink";
    
    for ( let i = 0; i < 100000000; i++ ) new Date();
    
} );
```

如果页面没有立即响应用户的操作，用户就会感觉到卡顿。因为所有的重排和重绘都会受到主线程的阻塞，所以如果主线程上的任务非常耗时，那么在主线程努力处理任务的期间，页面上所有依赖重排和重绘的交互设计都将变得无响应，整个页面看起来就像陷入了假死状态。

不过，哪怕整个页面都陷入了假死状态，页面仍然可以流畅的滚动，这是因为页面滚动是使用合成来实现的。

## 什么是合成

「合成」是指浏览器只通过合成（第 8 步）来生成新的页面位图的行为，具体来说，合成器线程可以通过改变图块位图的状态（比如位置、旋转等）来让 GPU 直接合成出新的页面位图，由于这种渲染策略可以跳过大部分的渲染流程，并且合成器线程还可以和主线程并行工作，因此这种渲染策略可以很快的渲染出新的页面位图。

许多 CSS3 动画和页面滚动都是使用合成来实现的，由于合成可以不受主线程的阻塞，所以在页面假死期间，页面仍然可以流畅的滚动。

不过在最开始的时候，使用合成来实现的页面滚动也还是会被主线程阻塞，直至 Chrome 51 开始，Chrome 才利用 [Passive event listeners](https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md) 特性解决了这个问题。

## 什么是合成阻塞

许多输入事件都具有默认动作，比如

1. 复选框的点击事件的默认动作是勾选和取消勾选。
2. 超链接标签的点击事件的默认动作是修改字体颜色和跳转。
3. 鼠标滚轮的滚动事件的默认动作是滚动页面或元素。
4. 触控板的垂直滑动事件的默认动作是滚动页面或元素。
5. ......

> 诸如点击鼠标、键入文本、触摸屏幕、滚动滚轮等行为都属于输入事件，对浏览器而言，输入事件的含义是用户与浏览器的交互行为，而不是通俗理解的“输入某些内容”。

上述的默认动作都会修改元素或页面的样式，其中 1 和 2 是通过重绘来实现的，3 和 4 是通过合成来实现的。重绘是会被主线程阻塞的，而合成是可以不被主线程阻塞的，因为合成是由独立于主线程之外的另一条合成器线程来完成的。不过由于 `event.preventDefault()`，导致这类合成仍会被主线程阻塞。

具体来说，对于使用鼠标和触控板的设备，页面滚动和元素滚动是 `wheel` 事件的默认动作，对于使用触摸屏的设备，则是触摸事件的默认动作，触摸事件是指 `touchstart`、`touchmove`、`touchend` 事件。如果这些输入事件的事件监听器执行了 `event.preventDefault()`，那么页面滚动和元素滚动的默认动作就会被取消，由于页面和元素不会发生滚动，所以合成器线程就无需合成滚动后的页面位图，否则合成器线程就需要合成滚动后的页面位图来响应用户的操作。

因为事件监听器可以通过调用 `event.preventDefault()` 来取消默认动作，且合成器线程又无法提前得知默认动作是否会被取消，因此这时候合成器线程才会等待主线程处理完事件监听器之后再工作。不过，在实践中，合成器线程不仅仅只是被事件监听器阻塞，而是会被主线程阻塞，主线程上可能还会运行其他任务。

> 上文所说的“合成器线程不仅仅只是被事件监听器阻塞，而是会被主线程阻塞”不代表所有情况下的合成器线程的行为，只代表由默认动作所引发的合成行为这一种情况。
>
> 另外，不是所有输入事件的默认动作可以被取消的，你可以通过在事件监听器的内部调用 `event.cancelable` 来查询当前的输入事件的默认动作是否可以被取消。详见 [Event.cancelable](https://developer.mozilla.org/zh-CN/docs/Web/API/Event/cancelable)。

新建一个空白的页面，试试使用下面的代码，点击页面后立即使用触控板或滚轮来滚动页面，你会发现你根本就无法滚动页面，直至页面突变成白色之后，你才能重新滚动页面，再次点击页面就循环这个过程。之所以会出现这种情况，是因为页面滚动被主线程阻塞了，具体来说就是滑动滚轮或上下滑动触控板会触发一个默认动作，这个默认动作的影响就是滚动页面，滚动后的新页面位图是由合成器线程来合成的，而合成器线程会被主线程阻塞，刚好主线程要执行一个非常耗时的任务，在这期间合成器线程都无法合成出滚动后的页面位图来及时响应你的操作，于是你就体验到了页面的假死。

```css
body {
    height: 300vh;
    background-image: linear-gradient( red, blue );
}
```

```js
globalThis.addEventListener( "wheel", _ => {}, { passive: false } );
globalThis.addEventListener( "click", _ => {
    
    document.body.style.backgroundImage = "none";
    
    for ( let i = 0; i < 100000000; i++ ) new Date(); // 非常耗时的任务
    
} );
```

如果你对 JS 代码中的 `{ passive: false }` 感到困惑，请不用担心，因为文章的下一节（Passive event listeners）会阐述它的作用。不过可以提前告诉你，正是它引发了这个页面的假死。

## 如何消除滚动阻塞

[Passive event listeners](https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md) 是一项用于消除滚动阻塞的特性，它可以保障页面和元素滚动的流畅性，你可以从这篇 [DOM 规范](https://dom.spec.whatwg.org/#dom-addeventlisteneroptions-passive) 中找到它的详细定义，该特性从 Chrome 51 和 Firefix 49 开始生效。

该特性允许开发者在使用 `addEventListener` API 来绑定事件监听器的同时，为事件监听器指定一个名为 `passive` 的可选参数。如果 `passive` 的值为 `true`，那么浏览器就会假定事件监听器不会调用 `event.preventDefault()`，然后主线程会继续执行事件监听器（和其他任务），但是合成器线程不会停下来等待主线程，而是直接合成新的页面位图。如果 `passive` 的值为 `false`，那么合成器线程就会停下来等待主线程，直至主线程清空掉所有任务后，合成器线程才会开始工作。

> 如果 `passive` 的值为 `true`，且事件监听器又调用了 `event.preventDefault()`，那么浏览器就会忽略该语句，并在控制台中输出一条警告信息来提醒开发者做了自相矛盾的操作，合成器线程也不会停下来等待主线程。

修改一下上个例子中的代码，将 `{ passive: false }` 改为 `{ passive: true }`，然后再为页面增加一个带有 `:hover` 特效的。再次运行这个例子，点击页面后立即使用触控板或滚轮来滚动页面，同时也将光标不断的移入和移出 DIV 元素，你会发现你可以流畅的滚动页面，但是 DIV 元素的 `:hover` 特效失效了，直至页面突变成白色之后，DIV 元素的 `:hover` 特效才会重新生效。

这是因为浏览器已经知道事件监听器不会调用 `event.preventDefault()` 了，所以合成器线程也就不必再停下来等待主线程了，合成器线程会立即开始合成滚动后的页面位图，由于这个合成过程非常迅速，合成的频率可以达到屏幕的刷新率，所以用户才可以流畅的滚动页面。不过，由于 `:hover` 的特效是依靠重绘来实现的，而重绘会被主线程阻塞，所以 `:hover` 特效才会在页面假死期间失效。

```css
body {
    height: 300vh;
    background-image: linear-gradient( red, blue );
}
div {
    width: 50vmin;
    height: 50vmin;
    background-color: pink;
}
div:hover {
    background-color: teal;
}
```

```js
globalThis.addEventListener( "wheel", _ => {}, { passive: true } );
globalThis.addEventListener( "click", _ => {
    
    document.body.style.backgroundImage = "none";
    
    for ( let i = 0; i < 100000000; i++ ) new Date(); // 非常耗时的任务
    
} );
```

对于触摸事件和 `wheel` 事件而言，通常我们只有在想要禁用滚动时才会调用 `event.preventListener()`，如果你根本就不打算禁用页面或元素的滚动，那么就请记得总是为这些事件监听器应用 `{ passive: true }` 来提升滚动的流畅性。否则，随着你的页面越来越复杂，主线程很可能会在不知不觉之间要处理越来越多的任务，那么你的页面的滚动体验也会在不知不觉之间变得越来越差。你可以直接观看 [这个视频](https://www.youtube.com/watch?v=NPM6172J22g) 来感受一下 passive event listeners 特性对一个新闻网站的影响，没有使用 `{ passive: true }` 时的滚动体验实在是太糟糕了。

另外，Chrome 和 Firefox 默认将 `window`、`document`、`document.body` 等文档级节点的触摸事件和 `wheel` 事件的 `passive` 设置为了 `true`，对于其他的元素而言，则仍然是 `false`。

## 输入事件的处理流程

现在，我们已经把最难理解的内容都讲完了，接下来我们就来了解一下渲染进程是如何处理输入事件的。

1. 当用户与浏览器发生了交互之后，浏览器会捕捉到这个交互的输入事件，然后将该事件的类型（如 `click`）和坐标（如 `(x,y)`）发送给渲染进程。
2. 渲染进程的合成器线程会首先接收到这则信息，然后合成器线程会根据输入事件的发生地点来判断这个输入事件是否会触发事件监听器。
3. 如果合成器线程判断出这个输入事件不会触发任何事件监听器，那么合成器线程就会直接生产新的页面位图。
4. 如果合成器判断出这个输入事件会触发事件监听器，那么合成器线程就会将这则消息发送给主线程，由主线程来找到并调用相应的事件监听器。如果事件监听器的 `passive` 为 `true`，那么合成器线程就不会停下来等待主线程，而是在将输入事件的消息发送给主线程之后，就立即开始自己的工作。如果事件监听器的 `passive` 为 `false`，那么合成器线程就会停下来等待主线程，直至主线程处理完所有任务之后再开始工作。

![输入事件的信息](/browser/input-event-and-page-scroll/input-event-information.png)

另外，主线程是如何找到相应的事件监听器的呢？当主线程接收到来自合成线程的信息后，主线程会使用输入事件的坐标来和绘图指令（渲染流程第 4 步的输出结果）来进行对比，然后找到相应的 `event.target`，最后在 `event.target` 上找到需要被调用的事件监听器。

![寻找事件监听器](/browser/input-event-and-page-scroll/finding-event-target.png)

## Non-Fast Scrollable Region

为什么合成器线程可以根据输入事件的发生地来判断输入事件是否会触发事件监听器呢？因为合成器线程会将绑定了事件监听器的区域标记为 non-fast scrollable region，如果输入事件发生在标记区域的范围内，合成器线程就会将输入事件的信息发送给主线程，否则就不会。

![non-fast-scrollable-region](/browser/input-event-and-page-scroll/non-fast-scrollable-region.png)

我们经常会使用事件代理来为元素绑定事件监听器，它的具体原理是：将事件监听器绑定在祖先节点的身上，然后通过判断输入事件究竟发生在哪个子孙节点的身上来决定应该执行哪些任务。

不过，事件代理会扩大 non-fast scrollable region 的范围，比如，如果将事件监听器绑定在了 `globalThis` 节点上，那么整个页面都将会被标记为 non-fast scrollable region。这样一来，无论输入事件发生在页面的哪个位置，合成器线程都必须与主线程通信，哪怕输入事件根本没有触发任何事件监听器。而且，如果主线程还会阻塞合成器线程的话，那么一旦事件监听器的执行时间较长，原本流畅的页面就会变得卡顿，使用 `{ passive: true }` 可以减轻这种负面影响。

![事件代理的代价](/browser/input-event-and-page-scroll/event-delegation.png)

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
