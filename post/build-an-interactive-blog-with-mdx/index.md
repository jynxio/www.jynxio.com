---
title: "Build an Interactive Blog with MDX"

abstract: "Use Next.js and MDX to develop an interactive static blog, then deploy it to a static server (such as GitHub Pages) using SSG mode."

date: "2024-06-21T00:00:00+08:00"

tags: ["Next.js", "MDX"]

hero: "hero.png"
---
我在 2022 年就开始搭建自己的博客了，那时是因为我积累了很多的学习笔记，我希望可以把它们发布到公共网络上，但我不想被绑定在任何的内容平台上，所以我需要一个独立的博客。

我花了至少两个月来搭建我的第一版博客，它很简陋也很称手，他的工作原理非常简单：使用 Node.js 和 marked.js 来将 Markdown 转译成 HTML，然后在 HTML 中加上提前写好的 CSS，然后就发布了... 简单的甚至让人感到简陋，对吧？但我爱你。

到现在，我的博客已经来到第三个版本了，我在其中学到许多，并希望这些知识可以帮助到你。

## Before Getting Started

这篇文章会教你如何使用 Next.js 和 MDX 来制作一个可交互的博客，你可以从 [这个 GitHub Pages](https://jynxio.github.io/build-an-interactive-blog-with-mdx/) 来提前预览最终效果，相关代码托管在 [这个仓库](https://github.com/jynxio/build-an-interactive-blog-with-mdx)，你可以从 [solution 分支的 Commits](https://github.com/jynxio/build-an-interactive-blog-with-mdx/commits/solution/) 里找到每一步的答案。

这篇文章不适合所有人！你必须至少掌握初级的 Web 前端开发知识，以及了解 markdown 的语法。

祝你好运。😉

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

> 为什么这样存储文章？因为文章会有很多配套资源，将它们放在独立的专有的文件夹中会更好打理。

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

> `reqPost` 是什么？好吧，它就是一个用来读取本地文件的 Node.js 脚本，我用它来读取 Markdown 的内容。
>
> ```tsx
> // 📃 src/helper/post.ts
> import path from "node:path";
> import fs from "node:fs/promises";
> import matter from "gray-matter";
> 
> async function reqPost(url: string): Promise<Post> {
>     // Read all the content of the markdown.
>     const raw = await readFile(url);
>     
>     // Extract the body content and front matter
>     const { data: metadata, content } = matter(raw);
> 
>     return {
>         content,
>         slug: "",
>         hero: metadata.hero,
>         date: metadata.date,
>         title: metadata.title,
>         abstract: metadata.abstract,
>     };
> }
> 
> function readFile(targetPath: string) {
>     return fs.readFile(path.join(process.cwd(), targetPath), "utf8");
> }
> ```
>
> `gray-matter` 是什么？它是用来解析 markdown 的 front-matter 的第三方库。front-matter 又是什么？它是 markdown 开头用 `---` 栅栏围起来的东西，用来存放文章的信息，这些信息十分重要，你需要靠这些信息来制作文章清单，以及对文章做排序或归类。
>
> ```md
> ---
> title: "Title of your post"
> date: "1970-01-01T00:00:00+00:00"
> abstract: "Abstract of your post"
> ---
> 
> ## Title
> 
> Here's the main content...
> ```

## Beautify Post Page

页面现在很简陋，这是因为我直接把 Markdown 源码渲染到网页上去了，但这不是我想要的。怎样美化它呢？很简单，将 Markdown 转译成 HTML，然后再增加一些 CSS。

我使用 Hashicorp 的 [`next-mdx-remote`](https://github.com/hashicorp/next-mdx-remote) 来做转译工作，这个第三方库简单、靠谱、还支持 RSC。

```diff
  // 📃 src/app/page.tsx
  import { reqPost } from "@/helper/post";
+ import { MDXRemote } from "next-mdx-remote/rsc";

  async function Page() {
      const post = await reqPost("/post/build-interative-blog/index.md");

+     return <MDXRemote source={post.content} />;
  }
```

> 为什么不用 Next.js 官方的 [`@next/mdx`](https://nextjs.org/docs/pages/building-your-application/configuring/mdx#nextmdx)？因为在我写作的时候，它还有很多问题，比如官方文档中关于处理 JSX 的部份是行之无效的😅。
>
> 但现在不一样了，因为文档健全多了，我推荐你尝试一下它。

然后我用 [`water.css`](https://github.com/kognise/water.css) 来给页面添加样式，它是一整套预定义好的 CSS，非常适合用在这里来做原型演示。

```diff
  // 📃 src/app/layout.tsx
  import "./index.css";

  function RootLayout({ children }: { children: React.ReactNode }) {
      return (
          <html lang="en">
              <head>
+                 <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/water.css@2/out/dark.css" />
              </head>

              <body>{children}</body>
          </html>
      );
  }
```

## Adding Syntax Highlighting

你注意到了吗？网页中的代码块还没有语法高亮，这是因为这就是代码块原本的模样。

语法高亮的原理是根据语法来解析代码字符串，然后拆分成不同的碎片，并给不同的碎片赋予不同的颜色。社区有很多第三方库都可以做这件事情，我选择 [`shiki`](https://github.com/shikijs/shiki)，因为它支持 VSCode 的所有颜色主题，并且还是 Astro 的底层依赖。

`shiki` 的用法很简单，把代码字符串和语言类型丢给它，它就会给你输出一段包含样式的 HTML，这就是你想要的拥有语法高亮的代码块。`CodeSnippet` 是一个封装了 `shiki` 的组件。

```tsx
// 📃 src/component/code-snippet/CodeSnippet.tsx
import { codeToHtml } from "shiki";

type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLPreElement>, HTMLPreElement> & {
    children?: any;
};

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

把 `CodeSnippet` 像下面这样传递给 `<MDXRemote />`，它会接管 `<MDXRemote />` 对代码块的处理工序。

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

这样一来，代码块就好看多了！

## Parsing JSX in Markdown

Markdown 还有一种名为 MDX 的扩展语法，MDX = Markdown + JSX，也就是说我们可以在 Markdown 中使用 JSX！

<NativeJsx />

它的原理是什么？MDX 转译器会在转译的时候就执行掉 JSX，比如 JavaScript 表达式和原生的 JSX 元素。等等... 只有原生的 JSX 元素吗？那么自定义的 JSX 组件呢？答案是「当然支持」😁，但前提是你必须事先将自定义组件传递给转译器，因为转译器怎么可能可以在不知道自定义组件是什么的前提下就处理它呢。

项目事先创建好了一个 `<MousePosition>` 组件，你可以从 `post/build-interative-blog/component/mouse-position` 文件夹找到它，先来看看它的效果吧！

<CustomJsx />

这是怎么实现的呢？首先在 Markdown 中引用这个自定义组件。

```diff
  // 📃 post/build-interative-blog/index.md
  ...
+ <MousePosition />
  ...
```

然后将 `<MousePosition>` 组件传递给 `<MDXRemote>`，就像 `<CodeSnippet>` 组件那样。

```diff
  // 📃 src/app/page.tsx
  import { reqPost } from "@/helper/post";
  import { MDXRemote } from "next-mdx-remote/rsc";
  import CodeSnippet from "@/component/code-snippet";
+ import MousePosition from "$/post/build-interative-blog/component/mouse-position";

  async function Page() {
      const post = await reqPost("/post/build-interative-blog/index.md");
+     const components = { pre: CodeSnippet, MousePosition };

      return <MDXRemote source={post.content} components={components} />;
  }
```

大功告成！快检查你的页面。

## Extra | Adding More Posts

真正的博客会有很多篇文章，你需要使用 Next.js 的 [Dynamic Routes](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes) 来实现一个动态的文章页，这需要重构 `src/app` 的目录结构。另外，还要创建一个文章清单页。

💡 答案：[Commit - Add More Posts](https://github.com/jynxio/build-an-interactive-blog-with-mdx/commit/52d2f2837d3357c99ae93ce0dde8b927856d0d52)。

## Extra | Adding an RSS Feed to the Site

许多内容型网站都会有 RSS 和 Newsletter，这两个工具的作用都是通知用户「网站更新了」，接下来我要给网站添加一个 RSS Feed，不过在那之前，RSS Feed究竟是什么？

[这](http://localhost:3000/rss) 就是本站的 RSS Feed，它就是一串 XML 格式的字符串数据，代表本站的内容摘要，我会在发布新文章之后更新这个 RSS Feed。用户可以把这个 RSS Feed 丢给 RSS 阅读器，RSS 阅读器会监控这个 RSS Feed，然后在检测到更新行为之后通知用户。

> RSS（Really Simple Syndication）是数据格式，RSS Feed 是符合 RSS 格式的数据。

我的 RSS Feed 会根据文章清单来自动更新，这是用 Next.js 的 [Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) 来实现的。Route Handlers 是什么？一个用来处理「当用户向 `https://www.jynxio.com/rss` 这个 URL 发送网络请求时，服务器应该向用户返回什么内容」这件任务。显然，我的 Route Handlers（`src/app/rss/route.ts`）会向 GET 请求返回一个 RSS Feed。

💡 答案：[Commit - Add RSS Feed](https://github.com/jynxio/build-an-interactive-blog-with-mdx/commit/1e9d70e70ba422bbb122e09221fc37bb112088aa)。

## Extra | Adding Metadata

Metadata 是那些不直接显示在网页上，但又非常重要的信息，比如浏览器标签的 icon 和 title、社媒的 Open Graph。

💡 答案：[Commit - Metadata](https://github.com/jynxio/build-an-interactive-blog-with-mdx/commit/b95b0b8a4e3ae6702d4862d3a366020eb006fe3a)。

设置好 Open Graph 之后，你需要去社媒的开发平台激活你的 Open Graph，比如 [Twitter - Card Validator](https://cards-dev.twitter.com/validator)。

> 答案故意没有展示所有的 Metadata，不过你可以从类型文件中找到所有的 Metadata，请检查这个地址 `node_modules/next/dist/lib/metadata/types/metadata-interface.d.ts`。😉

## Extra | Deploy to GitHub Pages

Next.js 在默认情况下采用 [SSR](https://nextjs.org/docs/pages/building-your-application/rendering/server-side-rendering) 模式，所以你不能将它直接部署到静态服务器上，因为这会无法工作，不过你可以直接部署到 [Vercel](https://vercel.com/) 上，因为 Vercel 提供了开箱即用级别的支持。

> 众所周知，Vercel 是 Next.js 的维护者。

Next.js 也支持 SSG 模式，这可以让你将项目部署到静态服务器上，比如 GitHub Pages。

💡 答案：[Commit - Deploy to GitHub Pages](https://github.com/jynxio/build-an-interactive-blog-with-mdx/commit/c641dcddd3acd9919827e2d7311b99bdb32e24c9)。
