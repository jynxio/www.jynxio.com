---
title: "读 React 源码，找 Scripts 的 Bug"

abstract: "React v19 开始支持 Async Scripts，可如果用了 onLoad，那么 Scripts 就会失效。真是奇怪，不是吗？半年里，我陷进去了 2 次，于是决定读源码找原因。"

publishedDate: "2025-12-26T00:00:00+08:00"

updatedDate:  "2025-12-26T00:00:00+08:00"

tags: ["React"]

hero: "hero.png"
---

今年五月，我遇到了一件奇怪的事情：在 React 中，如果 Scripts 用了 `onLoad`，那么 Scripts 就会失效。

```
// 有效
<script async src="foo.js" />

// 失效
<script async src="boo.js" onLoad={() => {}} />
```

过去几天，我又遇到了一次，和上次一样，又陷进去了个把小时。

于是我决定读读源码，找找 Bug。

## 为何 Scripts 会失效？

根据源码，React 会把某些 Scripts 提升到 Head，就像下面这样：

```
// React
<head />

<script async src="foo.js" />
<script async src="boo.js" onLoad={() => {}} />

// HTML
<head>
  <script async src="foo.js" />
</head>

<script async src="boo.js" onLoad={() => {}} />
```

对于 Hoistable Scripts（会被提升到 Head 的 Scripts），[React 会用 `document.createElement` 来创建](https://github.com/facebook/react/blob/65eec428c40d542d4d5a9c1af5c3f406aecf3440/packages/react-dom-bindings/src/client/ReactFiberConfigDOM.js#L5504)。对于 Non-Hoistable Scripts，[React 则会用 `innerHTML`](https://github.com/facebook/react/blob/65eec428c40d542d4d5a9c1af5c3f406aecf3440/packages/react-dom-bindings/src/client/ReactFiberConfigDOM.js#L538)，而浏览器会故意忽略由 `innerHTML` 创建的 Scripts，这是 [HTML 规范的要求](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inhead)。

于是，Scripts 就失效了。

> 注意：提升异步脚本是合理的，因为既能提早下载资源，又不会有副作用。不提升带 `onLoad | onError` 的脚本也是合理的，因为如果资源下载完成/失败时，Scripts 的宿主组件还没有挂载，那么就会发生问题。

## 哪些 Scripts 会失效？

Non-Hoistable Scripts 都会失效，而符合下面任意一个条件的 Scripts 就是 Non-Hoistable Scripts（源码见 [此](https://github.com/facebook/react/blob/65eec428c40d542d4d5a9c1af5c3f406aecf3440/packages/react-dom-bindings/src/client/ReactFiberConfigDOM.js#L5923)）：

1. 没使用 `src`
2. 没使用 `async`
3. 使用了 `onLoad` 或 `onError`

## 如何修复？

这显然是一个 Bug，因为既然 Async Scripts 会有效，那么带 `onLoad` 的 Async Scripts 也应该有效，可实际却没有，并且用 `onLoad` 也算合理用法。

那么，只要不提升带 `onLoad` 的 Async Scripts，然后不“灭活”它，不就可以了吗？是的，我是这么想的。但源码看得越多，就越是觉得这是 React 团队故意的设计决策，比如为了防止某些 XSS，或配合 RSC 的水合。

最后，我决定先在 [相关 issue](https://github.com/facebook/react/issues/34008#issuecomment-3687143075) 上提供这些信息，如果 React 团队也认同这是一个 Bug，那么就修。

> React 有两个渲染器，Fiber 和 Fizz。
>
> Fiber 负责在 Client 端操纵 DOM，Fizz 负责在 Server 端生成 HTML 字符串，它们有各自的生成 Scripts 的实现，不过实现逻辑是一致的。尽管如此，Scripts 在 CSR 和 SSR 中的行为仍不完全相同，本文是在 CSR 的视角上写的。
