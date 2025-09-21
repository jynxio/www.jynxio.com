---
title: 'Beware the "async support" in React 19's startTransition'

abstract: "Starting with React 19, startTransition supports async functions, which sounds pretty good. But it has a hidden trap, and sometimes, it can be fatal."

publishedDate: "2025-09-2T00:00:00+08:00"

updatedDate:  "2025-09-2T00:00:00+08:00"

tags: ["React"]

hero: "hero.png"
---

在 React 19 之前，startTransition 是不支持异步函数的，如果要在 `await` 之后更新状态，那么就必须再包裹上一个 startTransition，就像下面这样。

```ts
startTransition(async () => {
  const res = await fetch("/api");

  startTransition(() => setData(res));
});
```

[从 React 19 起，startTransition 开始支持异步函数](https://react.dev/blog/2024/12/05/react-19)，这意味着现在可以这么写。

```diff
 startTransition(async () => {  
   const res = await fetch("/api");

-  startTransition(() => setData(res));
+  setData(res);
 });
```

我直说，新写法是有陷阱的，因为新写法和旧写法的效果有不同，而谁能想到居然还有这种事？

## 什么陷阱？

下面是一个远程搜索功能的核心代码，它用 startTransition 来渲染搜索结果，并采用了新写法。

> startTransition 是什么？
>
> React 把 startTransition 的入参叫做 Actions，把 Actions 里的状态更新叫做 Transitions。相比于普通的状态更新，Transitions 的优先级更低，React 在执行 Transitions 的时候，每完成一个组件，就会停下来，先去执行优先级更高的工作，然后再回来。
>
> React 把 Transitions 称为「可中断的后台渲染或并发更新」。请注意，这是通过对主线程做切片所模拟出来的效果，后台渲染（并发更新）实际仍发生在主线程上。

```tsx
const ref = useRef();
const [, setData] = useState();
const [isPending, startTransition] = useTransition();

function search(str) {
  ref.current?.abort();
  ref.current = new AbortController();

  startTransition(async () => {
    const url = `/api?search=${str}`;
    const res = await fetch(url, { signal: ref.current.signal })
      .then(raw => raw.json())
      .catch(() => void 0);

    res && setData(res);
  });
}
```

如果用户连续搜索了两次，那么页面就可能会出现问题。

什么问题？在第一次搜索发起之后，第二次搜索完成之前，页面都应当显示为加载状态，可实际上，在第二次搜索完成之前，页面就可能会显示出第一次搜索的结果，然后又再更新为第二次搜索的结果。

这难道不是网络请求的竞态问题吗？不是，请继续阅读。

## 什么原因？

下面是「用户连续搜索了两次」时的程序的执行步骤：

1. 执行第一次 startTransition（isPending 更新为 true）
2. 发起第一次网络请求
3. 完成第一次网络请求
4. 发起第一次后台渲染
5. 执行第二次 startTransition（isPending 维持为 true）
6. 发起第二次网络请求
7. 完成第一次后台渲染，页面显示出第一次搜索的结果（完成第一次 startTransition）
8. 完成第二次网络请求
9. 发起第二次后台渲染
10. 完成第二次后台渲染，页面显示出第二次搜索的结果（完成第二次 startTransition，isPending 更新为 false）

显然，问题发生在第七步，旧的后台渲染没有被终止，导致页面显示出了陈旧的搜索结果。

## 怎么解决？

解决方法就是「在发起新的后台渲染之后，就立即终止掉旧的后台渲染」。

该怎么做？下面是我的解决方案，它只需要改动一行代码——只要将 Await 后面的 `setData` 放到 `startTransition` 里，那么新的后台渲染就会自动终止掉旧的后台渲染，哪怕旧的后台渲染正在运行。

```diff
 startTransition(async () => {
   const url = `/api?search=${str}`;
   const res = await fetch(url, { signal: ref.current.signal })
     .then(raw => raw.json())
     .catch(() => void 0);

-    res && setData(res);
+    res && startTransition(() => setData(res));
 });
```

👋 嗨，注意到了吗？我们从 Transitions 的新写法回滚到了旧写法，这就是开篇讲的「新写法和旧写法的效果有不同」：

- 旧写法：新的后台渲染会自动终止旧的后台渲染，哪怕后台渲染正在运行；
- 新写法：新的后台渲染不会终止旧的后台渲染，后台渲染会继续完成自己；

因此，我决定总是使用旧写法，我也推荐你这么做，以避免掉入陷阱。

> 另外，新写法还有 2 个其他的问题。
>
> 新的后台渲染总是会等待旧的后台渲染，直到旧的后台渲染结束，新的后台渲染才会开始。这意味着，对于新写法来说，那些没有意义的旧的后台渲染，会因为没有被及时终止，而白白拖慢内容的呈现时间。
>
> 后台渲染是有数量上限的，一旦超过上限，主线程就会阻塞。这意味着，对于新写法来说，那些没有被终止的旧的后台渲染会导致程序更容易的触及数量上限，从而造成页面卡死。
