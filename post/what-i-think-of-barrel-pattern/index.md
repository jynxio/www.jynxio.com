---
title: "What Do I Think of the Barrel Pattern?"

abstract: "起初，我是为了美化导入语句才使用 Barrel Pattern 的，直到后来，我才意识到它真正的威力——文件的访问控制。然而，由于众所周知的性能问题，我开始构想一种新的方案。"

publishedDate: "2025-07-19T00:00:00+08:00"

updatedDate:  "2025-07-19T00:00:00+08:00"

tags: ["Module Pattern"]

hero: "hero.png"
---
Barrel Pattern 是一种文件的组织模式，简单来说就是通过 index.ts 来重导出那些你希望暴露给外界的模块，就像下面这样：

```ts
// 📃 src/app.tsx
import { a } from '@/barrel';

// 📃 src/barrel/index.ts
export { a } from './a.ts';
export { b } from './b.ts';
```

其中，index.ts 就叫做 Barrel files，它显式的定义了「哪些模块会被导出，哪些不会」，这其实就是文件的访问控制，文件的访问控制是一项实用的特性，因为它可以显著提升代码的可维护性。

可是，Barrel Pattern 也有明显的坏处：1）降低开发服务器的性能，比如拖慢冷启动和热更新；2）诱发循环引用。而实诚地说，这是构建工具的问题，而不是 Barrel Pattern 的。

后来，我想了一种解决方案——Underscore Pattern。它是一种新的文件组织模式，提供等效的文件访问控制，且克服了 Barrel Pattern 的坏处。我现在总是使用它，比如这个站点，它很棒。

## The good parts

Barrel Pattern 所提供的文件访问控制是它最吸引我的地方，文件访问控制是什么意思？比如：

将 `Login` 组件拆分成多个子组件，然后将大家存放在一个文件夹内，最后再通过 index.ts 来导出 component.ts，就像下面这样：

```ts
// 📁
// |- src
//    |- app.tsx
//    |- login
//       |- index.ts
//       |- hooks.ts
//       |- helper.ts
//       |- service.ts
//       |- component.ts


// 📃 src/login/index.ts
export { Login } from './component.ts';
```

component.ts 是外界唯一需要关心的组件，其他的 hooks.ts、helper.ts、service.ts 都是专为 component.ts 服务的，它们应对外部隐藏，只对 component.ts 可见。

如此一来，调用者就可以明确的知道，他需要关心什么（component.ts）和不需要关心什么（hooks.ts、helper.ts、service.ts），同时对于维护者而言，只要保证公共接口（component.ts）不变，那么任何代码的变更就都是安全的，哪怕是大刀阔斧的重构。

这真的很棒。

在网络上，大家还讨论了 Barrel Pattern 的另一个好处，那就是可以美化导入语句，因为它可以简化导入语句，就像下面这样：

```ts
// Before
import { a } from '@/barrel/a.ts';
import { b } from '@/barrel/b.ts';

// After
import { a, b } from '@/barrel';
```

## The bad parts

> 注：本文提到的构建工具是指 Vite@7.0 和 next@15.4。

Barrel Pattern 的第一个坏处是：降低开发服务器的性能，比如让冷启动和热更新变慢。

这是怎么发生的？因为开发服务器是不做 Tree Shaking 的，所以它会加载导入路径上的所有资源，比如虽然 app.ts 只引用了 a.ts，但是开发服务器也会全量加载 b.ts 的内容，而 `lucide-react` 的入口文件也是一个 Barrel files，所以开发服务器也会全量加载 `lucide-react` 的内容。

```ts
// 📃 src/app.ts
import { a } from '@/barrel';

// 📃 src/barrel/index.ts
export { a } from './a.ts';
export { b } from './b.ts';

// 📃 src/barrel/b.ts
import { Smile } from 'lucide-react';

// 📃 node_modules/lucide-react/dist/esm/icons/index.js
export { default as Smile } from './smile.js';
export { default as Reply } from './reply.js';
export { default as Shrub } from './shrub.js';
export { default as Stamp } from './stamp.js';
// ...
```

然而，`lucide-react` 有 1800+ 个图标。而且，库的入口文件几乎都是 Barrel files。这意味着，Barrel Pattern 会导致开发服务器加载更多的冗余资源，而加载的资源越多，开发服务器就会越慢。

> 注：
>
> Next.js 的构建工具有额外的优化，它的 [optimizePackageImports](https://nextjs.org/docs/app/api-reference/config/next-config-js/optimizePackageImports) 可以通过分析第三方库来计算出实际的引用路径，以绕过入口文件（即 Barrel files），这样就可以避免全量加载整个库了。
>
> ```ts
> // Before
> import { Smile } from 'lucide-react';
> 
> // After
> import Smile from 'lucide-react/dist/esm/icons/smile.js';
> ```
>
> optimizePackageImports 已预置了一批库，比如 `lucide-react`，对于原理，请见 [How we optimized package imports in Next.js](https://vercel.com/blog/how-we-optimized-package-imports-in-next-js#new-solution:-optimizepackageimports)。

Barrel Pattern 的第二个坏处是：诱发循环引用，这可能会导致热更新失灵，一旦热更新失灵，每次更新代码，开发服务器就会重载整个网页，并且构建工具也会在打包时因为循环引用而发出一些恼人的警告。

> 注：构建工具是可以处理一些简单的循环引用的，比如 2 个文件之间的循环引用，但是对于更复杂的情况，则无能为力了

## The trade off

Barrel Pattern 是一把双刃剑，如果想要使用它的文件访问控制，那么就需要让渡一些开发体验，事情的关键在于「需要让渡多少」。

最糟的情况就是 Barrel Pattern 将所有资源都串联在了一起，冷启动和每次热更新都需要全量加载所有资源，这对大型项目来说是不可接受的，因为这绝对会卡到爆炸，但对于小型项目而言，则无所谓。

所以，我会在小型项目上使用 Barrel Pattern，其余情况下，则不会。

## Superior alternative

Underscore Pattern 是 Barrel Pattern 的上位替代，它既提供文件访问控制，又克服了后者的坏处，它的使用规则只有一条：下划线开头的文件只对同目录下的其他文件可见。

![Underscore Pattern rules](./img/underscore-pattern-rule.png)

因为 Underscore Pattern 采用了文件名来控制文件的访问权限，而不是 index.ts，所以它不会遭遇 Barrel Pattern 的问题。

我制作了一个 ESLint 插件 [`@jynxio/eslint-plugin`](https://github.com/jynxio/eslint-plugin) 来辅助 Underscore Pattern，如果资源的导入路径不合法，那么导入语句就会飘红，就像上图那样。

如果没有 ESLint 插件，那么 Underscore Pattern 就要依赖约定来运作，而约定是脆弱的，尤其是在团队合作的时候，并且计算路径的合法与否也是一件麻烦的事情。
