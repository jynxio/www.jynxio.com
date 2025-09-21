---
title: "Beware the \"async support\" in React 19's startTransition"

abstract: "Starting with React 19, startTransition supports async functions, which sounds pretty good. But it has a hidden pitfall, and sometimes, it can be fatal."

publishedDate: "2025-09-22T00:00:00+08:00"

updatedDate:  "2025-09-22T00:00:00+08:00"

tags: ["React"]

hero: "hero.png"
---

Before React 19, startTransition didn't support async functions. If you wanted to update state after an `await`, you had to wrap it in another startTransition, like this:

```ts
startTransition(async () => {
  const res = await fetch("/api");

  startTransition(() => setData(res));
});
```

[Starting with React 19, startTransition now supports async functions](https://react.dev/blog/2024/12/05/react-19), which means you can write it like this:

```diff
 startTransition(async () => {  
   const res = await fetch("/api");

-  startTransition(() => setData(res));
+  setData(res);
 });
```

I'll be blunt: the new syntax has a pitfall. The new way and the old way behave differently — and who would have expected that?

## What's the Pitfall?

Below is the core logic for a remote search feature. It uses startTransition to render search results and adopts the new syntax.

> What is startTransition?
>
> React calls the argument of startTransition an "Action," and the state updates inside it "Transitions." Compared to regular state updates, Transitions have a lower priority. When React executes a Transition, it yields after rendering each component to check for higher-priority work before continuing.
>
> React calls this "interruptible background rendering or concurrent updates." Note that this is an effect simulated by slicing up work on the main thread, the background rendering (concurrent updates) still happens on the main thread.

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

If a user performs two searches in quick succession, the page might run into an issue.

If a user performs two consecutive searches, the page might run into an issue. What kind of issue? Between the first search request being sent and the second one completing, the page should consistently show a loading state. But in reality, the page might display the results of the first search, and then update again to the results of the second search.

Isn't this just a network race condition? No. Keep reading.

## What's the Cause?

Here are the steps when a user performs two consecutive searches:

1.  The 1st startTransition starts (`isPending` becomes `true`)
2.  The 1st network request starts
3.  The 1st network request completes
4.  The 1st background render starts
5.  The 2nd startTransition starts (`isPending` remains `true`)
6.  The 2nd network request starts
7.  The 1st background render completes, displaying the 1st search result on the page (the 1st startTransition completes)
8.  The 2nd network request completes
9.  The 2nd background render starts
10.  The 2nd background render completes, displaying the 2nd search result (the 2nd startTransition completes, `isPending` becomes `false`)

Clearly, the problem occurs at step 7. The old background render was not aborted, causing stale search results to be displayed.

## How to Fix It?

The solution is to "immediately abort the old background render after a new one starts."

How do we do that? Here's my solution, which requires changing just one line of code. By moving the `setData` after the `await` into its own startTransition, the new background render will automatically abort the old one, even if it's in progress.

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

👋 Hey, did you notice? We've rolled back from the new Transition syntax to the old one. This is what I meant at the beginning by "the new way and the old way behave differently":

-   The old way: A new background render automatically aborts the old one, even if it's in progress.
-   The new way: A new background render does not abort the old one, the old render will continue until it's finished.

Therefore, I've decided to always use the old syntax, and I recommend you do the same to avoid falling into this pitfall.

> By the way, the new syntax has two other problems.
>
> A new background render will always wait for the old one to finish before it can start. This means that, with the new syntax, meaningless old renders, by not being aborted in time, needlessly delay the presentation of new content.
>
> There's a limit to the number of concurrent background renders. Once this limit is exceeded, the main thread will block. This means that, with the new syntax, old renders that were not aborted make it easier to hit this limit, potentially causing the page to freeze.
