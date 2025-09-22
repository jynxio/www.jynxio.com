---
title: "How to Combine startTransition with @tanstack/react-query"

abstract: "This is a follow-up to the previous post \"Beware the 'async support' in React 19's startTransition\", offering a code snippet to demonstrate how to integrate startTransition with @tanstack/react-query."

publishedDate: "2025-09-23T00:00:00+08:00"

updatedDate:  "2025-09-23T00:00:00+08:00"

tags: ["React"]

hero: "hero.png"
---

In my blog post [Beware the "async support" in React 19's startTransition](https://www.jynxio.com/posts/react-19-async-transition-pitfall), I used `fetch` to demonstrate "how to use startTransition for network requests," like this:

```js
startTransition(async () => {
  const res = await fetch("/api");

  startTransition(() => setData(res));
});
```

This example is extremely simplified. As a result, when you try to apply it to production code, you'll find that it hardly works.

This is because we don't just use `fetch` to make network requests, we also need tools like `swr` or `@tanstack/react-query` to manage them. The latter significantly changes the coding paradigm, and you have to write a significant amount of additional code to make everything work.

Then, how should it be written? Below is my solution, which demonstrates how to combine startTransition with `@tanstack/react-query`.

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