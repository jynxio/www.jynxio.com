---
title: "在 Base UI 看到一个有趣的 API 设计"

abstract: "今天，Base UI 发布了 1.0 版本，然后，我看到了一个有趣的 API 设计 —— 组件即类型。可遗憾的是..."

publishedDate: "2025-12-12T00:00:00+08:00"

updatedDate:  "2025-12-12T00:00:00+08:00"

tags: ["React", "UI"]

hero: "hero.png"
---

今天，Base UI 发布了 1.0 版本。在浏览官网示例时，我注意到了一个很有意思的 API 设计，大致如下：

```tsx
import { Tooltip } from '@base-ui/react/tooltip';

const App = (props: Tooltip.Props) => <Tooltip {...props} />
```

你发现了吗？`Tooltip` 的入参类型是 `Tooltip.Props`，而不是 `TooltipProps`，也不是 `Tooltip['Props']`，这意味着 `Tooltip` 既是组件又携带类型！

这种「组件即类型」的 API 设计让组件的调用显得非常整洁。

## Tooltip.Props 是怎么实现的？

我很好奇它是如何实现的，于是翻看了一下 [源码](https://github.com/mui/base-ui/blob/06b07073f9928361331c83807e0c21e1be3e5f2f/packages/react/src/tooltip/root/TooltipRoot.tsx#L258)，实现方案大致如下：

```tsx
export namespace Tooltip {
  export type Props = { title: string };
}

export function Tooltip(props: Tooltip.Props) {
  return props.title;
}
```

嗯，居然使用了 `namespace`。

模仿一下这种写法，然后你就会发现 `namespace` 被 [@typescript-eslint/no-namespace](https://typescript-eslint.io/rules/no-namespace/)  禁用了。简而言之，这是因为 `namespace` 是 TypeScript 在 ECMAScript Modules 尚未普及时的遗产，对现代工程来说，它有诸多的陷阱。

比如，`namespace` 会把值和类型混合在一起，然后 Bundler（esbuild、babel、swc）就很难判断出哪些东西是类型，哪些东西是值，于是 Tree Shaking 就会失效，甚至打包出 bug。

那么，Zod 的 `z.infer` 呢？它也有类似的 API 设计，不是吗？

```ts
import { z } from 'zod';

type User = z.infer<typeof user>;

const user = z.object({ id: string });
```

## z.infer 是怎么实现的？

Zod 的 `z.infer` 是不是也用了 `namespace`，还是有更好的解决方案？于是我翻看了一下 [源码](https://github.com/colinhacks/zod/blob/497272785a2b34fe32ca6211278970225ad87be2/packages/zod/src/v4/classic/external.ts#L13)，实现方案大致如下：

```ts
// zod/core.ts
export type infer<T> = T;
export const object = () => {};

// zod/index.ts
export * as z from './core';
```

喔，事实上，Zod 的 API 设计并不是「组件即类型」，它和 Base UI 虽然相似但不相同，它们之间有一个细微但关键的区别。

| Library | 区别                                             |
| ------- | ------------------------------------------------ |
| Zod     | 挂载类型 `infer` 的 `z` 是一个朴素的对象         |
| Base UI | 挂载类型 `Props` 的 `Tooltip` 是一个可调用的函数 |

举例来说，如果把 Zod 的 API 设计套用给 Base UI，那么 Base UI 就会变成下面这样：

```tsx
// base-ui/core.ts
export type Props = { title: string };
export const Comp = (props: Props) => props.title;

// base-ui/index.ts
export * as Tooltip from './core';
```

```ts
// your-project.ts
import { Tooltip } from '@base-ui/react/tooltip';

const App = (props: Tooltip.Props) => <Tooltip.Comp {...props} />
```

## 选 Tooltip.Props，还是 z.infer？

我喜欢 Base UI 的「组件即类型」这种设计，它真是漂亮。出于工程考虑，我不会采用它，因为我不想和 `namespace` 的陷阱做斗争。

> Oops，`namespace` 是实现「组件即类型」的唯一方法。

事实上，Base UI 已经碰到 [陷阱](https://github.com/mui/base-ui/pull/2324) 了，然后就 [转向了直接导出 `TooltipProps` 这种传统设计](https://github.com/mui/base-ui/pull/2912)，`Tooltip.Props` 则计划报废。

总而言之，今天看到了一件漂亮的设计。
