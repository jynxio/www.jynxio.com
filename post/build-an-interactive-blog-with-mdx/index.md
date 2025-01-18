---
title: "使用 Next.js 构建博客"

abstract: "使用 Markdown 来写作，使用 Next.js（SSG）来制作博客，使用 MDX 来添加可交互的组件，这个站点就是如此。"

publishedDate: "2024-06-21T00:00:00+08:00"

updatedDate: "2025-01-18T00:00:00+08:00"

tags: ["Next.js", "MDX"]

hero: "hero.png"
---
Next.js 的 SSG 很适合用来创建内容型站点，因为它可以在打包时就将 markdown 编译成 HTML，这意味着站点的加载速度会很快。

这篇文章教你怎么做。

## Before Getting Started

开始之前，你可以从 [这个 GitHub Pages](https://jynxio.github.io/build-an-interactive-blog-with-mdx/) 预览到最终效果。它的代码托管在 [这个仓库](https://github.com/jynxio/build-an-interactive-blog-with-mdx)，solution 分支的一系列 [Commits](https://github.com/jynxio/build-an-interactive-blog-with-mdx/commits/solution/) 对应了下文的每一个小节，所以 Commits 也是一个 Step by step 的代码攻略。

## Setting Up the Project

初始项目已经为你搭建好了，克隆 [这个仓库](https://github.com/jynxio/build-an-interactive-blog-with-mdx/tree/50c81e848160500e6fd4cba1815933b6575b821c)，然后开始。

## Rendering Post on the Web

项目预先创建好了 2 篇 Markdown 文章，它们在：

```diff
  |- ...
  |- post
+    |- build-blog-with-mdx
+    |- what-is-css-modules
  |- ...
```

接下来，你要把 build-blog-with-wdx 加载到网页中去。怎么做？直接用 Node.js 读取它，然后注入到网页中去，就像下面这样。

```tsx
// 📃 src/app/page.tsx
import { reqPost } from "@/helper/post";

async function Page() {
   const post = await reqPost("/post/build-interative-blog/index.md");

   return <article>{post.content}</article>;
}
```

现在，文章渲染到网页上去了，虽然很简陋。

`reqPost` 是什么？一个使用 Node.js 来读取 Markdown 文件的工具函数，它已经预先写好了，它还会处理 Markdown 的 Front Matter 信息。

Front Matter 是什么？位于 Markdown 顶部的用栅栏语法包围起来的东西，适合用来存放诸如创建日期之类的信息，就像下面这样。

```markdown
---
date: "1970-01-01T00:00:00+00:00"
---

Here's the main content...
```

## Beautify Post Page

页面现在很简陋，这是因为我直接把 Markdown 源码渲染到网页上去了，但这不是我想要的。怎样美化它呢？很简单，将 Markdown 转译成 HTML，然后再增加一些 CSS。

我使用 Hashicorp 的 [`next-mdx-remote`](https://github.com/hashicorp/next-mdx-remote) 来做转译工作，这个第三方库简单、靠谱、还支持 RSC。

```diff
  // 📃 src/app/page.tsx
  import { reqPost } from "@/helper/post";
+ import { MDXRemote } from "next-mdx-remote/rsc";

  async function Page() {
    const post = await reqPost("/post/build-interative-blog/index.md");

+   return <MDXRemote source={post.content} />;
  }
```

> 为什么不用 Next.js 官方的 [`@next/mdx`](https://nextjs.org/docs/pages/building-your-application/configuring/mdx#nextmdx)？因为在我写作的时候，它还有很多问题，但现在好多了。
>

为了更好的演示，我添加了 [`water.css`](https://github.com/kognise/water.css)，它是一套预定义好的全局样式。

```diff
  // 📃 src/app/layout.tsx
  <head>
+   <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/water.css@2/out/dark.css" />
  </head>
```

## Adding Syntax Highlighting

语法高亮对可读性很重要。

我采用 [`shiki`](https://github.com/shikijs/shiki)，因为它支持大部份语法，以及 VSCode 的所有颜色主题。语法高亮的原理是将代码字符串解析成抽象语法树，然后转译为 HTML，最后给各个元素赋予 CSS 样式。

我将代码高亮的工作封装为 `CodeSnippet`。

```tsx
// 📃 src/component/code-snippet/CodeSnippet.tsx
import { codeToHtml } from "shiki";

type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLPreElement>, HTMLPreElement> & { children?: any };

async function CodeSnippet(props: Props) {
  // Extract the code string.
  const code = props.children.props.children;

  // Extract the code language type.
  const lang = props.children.props.className?.split("language-")[1] ?? "";

  // Convert the code string into an HTML string.
  const html = await codeToHtml(code, { lang, theme: "github-dark-dimmed" });

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
```

然后将 `CodeSnippet` 传递给 `<MDXRemote />`，它会接管 `<MDXRemote />` 对代码块的处理工序。

```diff
  // 📃 src/app/page.tsx
  import { reqPost } from "@/helper/post";
  import { MDXRemote } from "next-mdx-remote/rsc";
+ import CodeSnippet from "@/component/code-snippet";

  async function Page() {
      const post = await reqPost("/post/build-interative-blog/index.md");
+     const components = { pre: CodeSnippet };

+     return <MDXRemote source={post.content} components={components} />;
  }
```

这样一来，语法高亮就做好了✨。

## Parsing JSX in Markdown

只要为 Markdown 解析器配置对应的 JSX 组件，那么就可以在 Markdown 中使用 JSX 了。

<buildBlogWithNextJs.MdxDemo />

怎么做？首先在 Markdown 中引用这个自定义组件。

```diff
  // 📃 post/build-interative-blog/index.md
  ...
+ <MousePosition />
  ...
```

然后将 `<MousePosition>` 组件传递给解析器（`<MDXRemote>`），如此一来，就完成了。

```diff
  // 📃 src/app/page.tsx
  import CodeSnippet from "@/component/code-snippet";
+ import MousePosition from "$/post/build-interative-blog/component/mouse-position";

  async function Page() {
    const post = await reqPost("/post/build-interative-blog/index.md");
+   const components = { pre: CodeSnippet, MousePosition };
```

`<MDXRemote />` 会将 Markdown 解析成抽象语法树，然后转译成 JSX，然后根据 `components` 来调用 JSX，这就是原理，`<MousePosition />` 和 `<CodeSnippet />` 都是如此生效的。另外，JavaScript 表达式也会在编译阶段被执行掉。

这就是 MDX，即 Markdown + JSX。

## Extra | Adding More Posts

真正的博客会有很多篇文章，你需要使用 Next.js 的 [Dynamic Routes](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes) 来实现一个动态的文章页，这需要重构 `src/app` 的目录结构。另外，还要创建一个文章清单页。

📦 实现代码：[Commit - Add More Posts](https://github.com/jynxio/build-an-interactive-blog-with-mdx/commit/52d2f2837d3357c99ae93ce0dde8b927856d0d52)。

## Extra | Adding an RSS Feed to the Site

RSS Feed 是什么？它是内容摘要，订阅器会通过检查它来判断站点更新与否，所以许多内容型站点都是配置它。比如 [这](http://localhost:3000/rss) 就是本站的 RSS Feed，它就是一串 XML 格式的字符串数据。

我采用 Next.js 的 [Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) 来自动生成 RSS Feed，当用户访问 `https://www.jynxio.com/rss` 时，服务器就会返回 RSS Feed。

📦 实现代码：[Commit - Add RSS Feed](https://github.com/jynxio/build-an-interactive-blog-with-mdx/commit/1e9d70e70ba422bbb122e09221fc37bb112088aa)。

## Extra | Adding Metadata

Metadata 是那些不直接显示在网页上，但又非常重要的信息，比如浏览器标签的 icon 和 title、社媒的 Open Graph。

设置好 Open Graph 之后，你需要去社媒的开发平台激活你的 Open Graph，比如 [Twitter - Card Validator](https://cards-dev.twitter.com/validator)。

> 实现代码没有展示所有的 Metadata，如果需要，你可以从类型文件中找到所有的 Metadata，😉请检查这个地址：`node_modules/next/dist/lib/metadata/types/metadata-interface.d.ts`。

📦 实现代码：[Commit - Metadata](https://github.com/jynxio/build-an-interactive-blog-with-mdx/commit/b95b0b8a4e3ae6702d4862d3a366020eb006fe3a)。

## Extra | Deploy to GitHub Pages

Next.js 在默认情况下采用 [SSR](https://nextjs.org/docs/pages/building-your-application/rendering/server-side-rendering) 模式，所以你不能将它直接部署到静态服务器上，因为这会无法工作，不过你可以直接部署到 [Vercel](https://vercel.com/) 上，因为 Vercel 提供了开箱即用级别的支持。

Next.js 也支持 SSG 模式，这可以让你将项目部署到静态服务器上，比如 GitHub Pages。

📦 实现代码：[Commit - Deploy to GitHub Pages](https://github.com/jynxio/build-an-interactive-blog-with-mdx/commit/c641dcddd3acd9919827e2d7311b99bdb32e24c9)。
