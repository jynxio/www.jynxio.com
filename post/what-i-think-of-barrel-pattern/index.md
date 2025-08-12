---
title: "What Do I Think of the Barrel Pattern?"

abstract: "起初，我为了美化导入语句而使用 Barrel Pattern，直到后来，我才意识到它真正的魅力——文件的访问控制。然而，它也有众所周知的问题，于是我开始构想一种新的方案。"

publishedDate: "2025-07-19T00:00:00+08:00"

updatedDate:  "2025-07-19T00:00:00+08:00"

tags: ["Module Pattern"]

hero: "hero.png"
---
Barrel Pattern 是一种文件的组织模式，简单来说就是通过 index.ts 来重导出那些你希望暴露给外界的模块，就像下面这样：

```ts
// 📄 index.ts
export { a } from './a.ts';
export { b } from './b.ts';
```

其中，index.ts 就叫做 Barrel files，它显式的定义了「哪些模块会被导出，哪些不会」，这就是文件的访问控制，文件的访问控制是一项实用的特性，因为它可以显著提升代码的可维护性。

可是，Barrel Pattern 也有众所周知的问题：1）降低开发服务器的性能，比如拖慢冷启动和热更新；2）诱发循环引用。而实诚地说，这是构建工具的问题，而不是 Barrel Pattern 的。

于是，我开始构想一种新的方案，它既能提供文件访问控制，又能免去 Barrel Pattern 的问题。

## The good parts

Barrel Pattern 所提供的文件访问控制是它最吸引我的地方，文件访问控制是什么意思？比如：

将 `Login` 模块拆分成多个子模块，然后将大家存放在一个文件夹内，最后再通过 index.ts 来导出 component.ts，就像下面这样：

```
|- src
   |- app.ts
   |- login
      |- index.ts
      |- hooks.ts
      |- helper.ts
      |- service.ts
      |- component.ts
```

```ts
// 📄 src/login/index.ts
export { Login } from './component.ts';
```

component.ts 是外界唯一需要关心的模块，它应对外部可见。其他的 hooks.ts、helper.ts、service.ts 都是专为 component.ts 服务的私有模块，它们应对外部隐藏，只对 component.ts 可见。

如此一来，调用者就可以明确的知道，他需要关心什么（component.ts）和不需要关心什么（hooks.ts、helper.ts、service.ts），而且，对于维护者而言，只要保证公共接口（component.ts）不变，那么任何代码的变更就都是安全的，哪怕是大刀阔斧的重构。

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

1）诱发循环引用。

循环引用可能会导致热更新失灵，一旦失灵，每次更新代码，开发服务器都会重载整个网页。另外，构建工具也会在打包时发出一些恼人的警告。

然后，事情也没有那么糟糕，构建工具可以处理一些简单的循环引用，比如 2 个文件之间的循环引用，但是如果可以，应尽可能的杜绝循环引用。

2）降低开发服务器的性能，比如让冷启动和热更新变慢。

这是怎么发生的？

开发服务器是不做 Tree Shaking 的，所以它会加载导入路径上的所有资源，比如虽然 app.ts 只导入了 a.ts，但是开发服务器也会全量加载 b.ts 和 `lucide-react`，因为它们都在导入路径上，而 `lucide-react` 有 1800+ 个图标。

> 库的入口文件都是 Barrel files，正如下述代码所示。

```ts
// 📄 src/app.ts
import { a } from 'src/barrel';

// 📄 src/barrel/index.ts
export { a } from './a.ts';
export { b } from './b.ts';

// 📄 src/barrel/b.ts
import { Smile } from 'lucide-react';

// 📄 node_modules/lucide-react/dist/esm/icons/index.js
export { default as Smile } from './smile.js';
export { default as Reply } from './reply.js';
export { default as Shrub } from './shrub.js';
export { default as Stamp } from './stamp.js';
```

这意味着 Barrel Pattern 会诱使开发服务器加载更多的资源，而加载的资源越多，开发服务器就会越慢。

如果你在使用 Next.js，那么事情会更乐观一些，因为 Next.js 的构建工具对此做了针对性的优化。它会分析第三方库，然后计算出目标资源的精确路径，以绕过入口文件，从而避免全量加载，就像下面这样：

```ts
// Before
import { Smile } from 'lucide-react';

// After
import Smile from 'lucide-react/dist/esm/icons/smile.js';
```

细节请见 [optimizePackageImports](https://nextjs.org/docs/app/api-reference/config/next-config-js/optimizePackageImports)，原理请见 [How we optimized package imports in Next.js](https://vercel.com/blog/how-we-optimized-package-imports-in-next-js#new-solution:-optimizepackageimports)。

## The trade off

我推崇 Barrel Pattern 所提供的文件访问控制，也愿意为此让渡一些开发体验，而事情的关键在于「需要让渡多少」。

最糟的情况就是 Barrel Pattern 将所有资源都串联在了一起，冷启动和每次热更新都要全量加载所有资源，这对大型项目来说是不可接受的，因为这绝对会超级慢，但对于小型项目而言，则无所谓。

所以，我会在小型项目上使用 Barrel Pattern，其余情况下，则不会。

## Superior alternative

我构想了一种新的方案，叫做 Underscore Pattern。

它是 Barrel Pattern 的上位替代，既提供文件访问控制，又克服了后者的问题，它的使用规则只有一条：下划线开头的文件只对同目录下的其他文件可见。

如下图所示，`_helpers.ts` 的可见范围是暗蓝色区域（即该区域内的文件都可以访问它），`_input.ts | _button.ts` 的可见范围是亮蓝色区域（即该区域内的文件都可以访问它们）。

![Underscore Pattern rules](./img/underscore-pattern-rule.png)

因为 Underscore Pattern 使用文件名来控制访问权限，而不是 index.ts，所以它克服了 Barrel Pattern 的问题。

最后，为了辅助使用 Underscore Pattern，我制作了 [`@jynxio/eslint-plugin`](https://github.com/jynxio/eslint-plugin) 这个 ESLint 插件，如果导入语句的资源路径不合法，那么就会飘红。

如果没有这个插件，那么 Underscore Pattern 就要依赖约定来运作，而约定是脆弱的，尤其是在团队合作时，而且计算资源路径的合法与否很烧脑。

我现在总是使用它们，比如这个站点，它们工作的很棒。
