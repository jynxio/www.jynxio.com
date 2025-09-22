---
title: '如何结合 startTransition 和 @tanstack/react-query'

abstract: "这是上一篇博文「Beware the \"async support\" in React 19's startTransition」的延续，它提供了一份代码片段，用于演示如何将 startTransition 和 @tanstack/react-query 结合在一起。"

publishedDate: "2025-09-23T00:00:00+08:00"

updatedDate:  "2025-09-23T00:00:00+08:00"

tags: ["React"]

hero: "hero.png"
---

我在博文 [Beware the "async support" in React 19's startTransition](https://www.jynxio.com/posts/react-19-async-transition-pitfall) 中使用了 `fetch` 来演示了「如何使用 startTransition 来做网络请求」，就像下面这样。

```js
startTransition(async () => {
  const res = await fetch("/api");

  startTransition(() => setData(res));
});
```

这个示例经过了极度的简化，于是，当你尝试将这个示例运用到工业代码时，你就会发现这个示例几乎无法工作。

这是因为，我们不仅需要使用 `fetch` 来发起网络请求，还需要使用 `swr` 或 `@tanstack/react-query` 等工具来管理网络请求，而后者会显著的改变代码的编写范式，你必须要补充更多的代码，才能让一切工作起来。

那么该怎么写呢？下面是我的解决方案，它演示了如何将 startTransition 和 `@tanstack/react-query` 结合在一起。

```js
import qs from "qs";
import { useQuery } from "@tanstack/react-query";

function useGet() {
  const [data, setData] = useState();
  const [queryParams, setQueryParams] = useState();
  const [isPending, startTransition] = useTransition();
  const [needRequest, setNeedRequest] = useState(false);

  const get = i => (setQueryParams(i), setNeedRequest(true));
  const { refetch } = useQuery({
    enabled: false,
    queryKey: ["/api", queryParams],
    queryFn: ({ signal, queryKey: [path, queryParams] }) =>
      fetch(`${path}?${qs.stringify(queryParams)}`, { signal }),
  });

  useEffect(() => {
    if (!needRequest) return;

    setNeedRequest(false);
    startTransition(async () => {
      const { isSuccess, data } = await refetch();
      if (!isSuccess) return;

      startTransition(() => setData(data));
    });
  }, [refetch, queryParams, needRequest]);

  return { get, data, isPending };
}
```
