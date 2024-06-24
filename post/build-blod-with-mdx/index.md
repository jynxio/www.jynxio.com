---
title: "Build the interactive blog with MDX"

abstract: "A step-by-step guide to building interactive static blogs using MDX, while harnessing Next.js's SSG capabilities to dramatically boost your web page performance."

date: "2024-06-21T00:00:00+0800"

tags: "Next.js"

hero: "hero.png"
---
# Build the interactive blog with MDX

我在 2022 年就开始搭建自己的博客了，那时是因为我积累了很多的学习笔记，我希望可以把它们发布到公共网络上，但我不想被绑定在任何的内容平台上，所以我需要一个独立的博客。

我花了至少两个月来搭建我的第一版博客，它很简陋也很称手，他的工作原理非常简单：使用 Node.js 和 marked.js 来将 markdown 转译成 HTML，然后在 HTML 中加上提前写好的 CSS，然后就可以发布了... 简单的甚至让人感觉到简陋，对吧？但我永远爱你。

到现在，我的博客已经来到第三个版本了，我在其中学到许多，并希望这些知识可以帮助到你。

## 开始之前

这篇文章会教你如何使用 Next.js 和 MDX 来制作一个可交互的博客，你可以从 [这个 GitHub Pages](https://github.com/jynxio/build-the-interactive-blog-with-mdx) 来提前预览最终效果，相关代码也全部托管在 [这个 GitHub 仓库](https://github.com/jynxio/build-the-interactive-blog-with-mdx) 里，你可以从 Branch 中找到每一步的答案，祝你好运。😉

这篇文章不适合所有人！你必须至少掌握初级的 Web 前端开发知识，并对元框架（如 Next.js、Nuxt.js、Astro.js）的路由系统有了解，以及了解 markdown 的语法。

## 搭建项目

[项目的初始模板]() 已经为你搭建好了，克隆仓库并安装依赖，然后启程。

## 新建页面

项目的根目录下有一个 post 文件夹，里面预先放置了一篇 markdown 文章，接下来我们要把它渲染到网页上去。

```
|- ...
|- post
   |- build-blog-with-mdx
      |- img
      |- index.md
|- ...
```

我喜欢用这种文件结构来存储文章，因为它清晰又简洁。文件夹的名字就代表文章的 slug、index.md 就是文章，文章的元信息会存储在 front-matter 中，文章的配图都存储在隔壁的 img 文件夹里。

然后创建一个静态路由来映射这篇文章。

```diff
  |- ...
  |- src
+    |- build-interative-blog
+       |- page.tsx
  |- ...
```

```tsx
// 👀 page.tsx
import { reqPost } from '@/helper';

async function Page(props: Props) {
    const url = '/post/build-interative-blog/index.md';
    const { content } = await reqPost(url);
    
    return <article>{ content }</article>;
}

export default Page;
```

`reqPost` 是什么？好吧，它就是一个用来读取本地文件的 Node.js 脚本，我用它来读取 markdown 的内容。

```tsx
import fs from 'fs/promises';
import matter from 'gray-matter';

type Post = {
    date: string;
    title: string;
    abstract: string;
    content: string;
};

async function reqPost(url: string): Promise<Post> {
    const raw = await readFile(url);

    // 👀 What is the matter?
    const { data: metadata, content } = matter(raw);
    const post: Post = {
        content,
        date: metadata.date,
        title: metadata.title,
        abstract: metadata.abstract,
    };

    return post;
}

function readFile(targetPath: string) {
    return fs.readFile(path.join(process.cwd(), targetPath), 'utf8');
}

export reqPost;
```

`gray-matter` 是什么？好吧，它是用来解析 markdown 的 front-matter 的第三方库。

front-matter 又是什么？它是 markdown 开头用 `---` 栅栏围起来的东西，用来存放文章的信息，这些信息十分重要，你需要靠这些信息来制作文章清单，以及对文章做排序或归类。

```
---
title: "Build the interactive blog"
date: "2024-06-21T00:00:00+0800"
abstract: "A step-by-step guide to building interactive static blogs using MDX, while harnessing Next.js's SSG capabilities to dramatically boost your web page performance."
---

## 开始之前

Here's the main content...
```

大功告成！最后我们会得到一个朴素的文章页面。

<PlainPost />

## 美化页面

现在的页面很朴素，这是因为我直接把 Markdown 源码渲染在了网页上，但这不是我想要的。接下来，我要把 Markdown 源码转译成 HTML 代码，然后再添加一些 CSS，来让它更好看。

将 Markdown 代码转译成 HTML 代码需要转译器，我选择 Hashicorp 的 [`next-mdx-remote`](https://github.com/hashicorp/next-mdx-remote)，因为它简单和靠谱。

> 为什么不用 Next.js 官方的 [`@next/mdx`](https://nextjs.org/docs/pages/building-your-application/configuring/mdx#nextmdx)？因为我根据官方文档的介绍来使用它时，发现无论如何都没办法处理 JSX，我已经彻底失去耐心了。😅

```diff
  import { reqPost } from '@/helper';
+ import { MDXRemote } from 'next-mdx-remote/rsc';

  async function Page() {
      const url = '/post/build-interative-blog/index.md';
      const { content } = await reqPost(url);

+     return <MDXRemote source={content} />;
  }
```

我用 [`matcha.css`](https://github.com/lowlighter/matcha) 来添加样式，它是一套预先就定义好的 CSS，非常适合用在这里来做原型演示。

<GorgeousPost />

## 语法高亮

你注意到了吗？网页中的代码块还没有任何样式，这是因为代码块本来就是没有颜色的。

<PlainCodeSnippet />

我要用第三方库来给代码添加语法高亮，其原理是根据语法规则来拆分代码字符串，然后给不同部份添加不同的样式。有很多第三方库都可以做这件事情，我选择 [`shiki`](https://github.com/shikijs/shiki)，因为它支持 VSCode 的所有颜色主题，并且还是 Astro 的底层依赖。

`shiki` 的用法很简单，把代码块的源码和语言丢给它，它就会给你输出一段有样式的 HTML，然后直接使用这段 HTML 就好了。

```tsx
import { codeToHtml } from 'shiki';

async function CodeSnippet(props) {
    const code = props.children.props.children;
    const lang = props.children.props.className?.split('language-')[1] ?? '';
    const html = await codeToHtml(code, { lang, theme: 'vitesse-dark' });

    return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
```

可是 `CodeSnippet` 该怎么用呢？答案是「传递给 `<MDXRemote />`」。

```diff
  import { reqPost } from '@/helper';
  import { MDXRemote } from 'next-mdx-remote/rsc';
+ import CodeSnippet from 'path/to/CodeSnippet';

  async function Page() {
      const url = '/post/build-interative-blog/index.md';
      const { content } = await reqPost(url);
+     const components = { pre: CodeSnippet };

+     return <MDXRemote source={content} components={components} />;
  }

  export default Page;
```

`CodeSnippet` 会接管 `MDXRemote` 对代码块的处理工作，然后就可以得到具有语法高亮的代码块了。

<GorgeousCodeSnippet />

## 处理 JSX

MDX 等于 Markdown + JSX，即你可以在 Markdown 中使用 JSX 语法，包括 JS 表达式和 JSX 组件，Markdown 的转译器负责解析和执行这些 JSX。

```md
## JS表达式

`圆周率 = {Math.PI.toFixed(8)}`

## 原生的JSX组件

<button>Btn</button>

## 自定义的JSX组件

<Counter />
```

`MDXRemote` 

Markdown 转译器可以处理 JS 表达式和原生的 JSX 组件，但是无法处理自定义的 JSX 组件 `<Counter />`，因为它根本不知道这是什么。除非你主动告诉它，否则程序就会崩溃。

```diff
  import { reqPost } from '@/helper';
  import { MDXRemote } from 'next-mdx-remote/rsc';
  import CodeSnippet from 'path/to/CodeSnippet';
+ import Counter from 'path/to/Counter';

  async function Page() {
      const url = '/post/build-interative-blog/index.md';
      const { content } = await reqPost(url);
+     const components = { pre: CodeSnippet, Counter };

      return <MDXRemote source={content} components={components} />;
  }

  export default Page;
```

其实 `CodeSnippet` 就是一个自定义的 JSX 组件！所以你早就已经掌握了，只是没有发觉而已。

## 生成 RSS

RSS（Really Simple Syndication）是 XML 格式的内容摘要，它的作用和 Newsletter 类似，RSS 阅读器订阅网页的 Rss feed，然后在网页更新之后通知用户。

> RSS 是指「数据格式」这种概念，RSS feed 是指「RSS 格式的数据」这种实物。

[这](http://localhost:3000/rss) 就是本站的 RSS feed，你可以看到它就是一串 XML 格式的数据，每当本站更新文章之后，某个路由就会更新 RSS feed，然后订阅了这个网站的 RSS 阅读器就会发现我更新了，然后通知给它们的用户。

我要创建一个 [Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) 才能处理这项任务，Route Handlers 就是一个脚本，当用户向网站的某个 URL 发送请求时，这个脚本决定向用户返回什么内容。比如我的 `src/app/rss/route.ts` 会给发往 `/rss` 的 GET 请求返回一个 RSS feed。

```diff
  |- ...
  |- src
     |- app
+       |- rss
+          |- route.ts
  |- ...
```

```tsx
// 👀 route.ts
import RSS from 'rss';
import { reqPost } from '@/helper';

export async function GET() {
    const url = '/post/build-interative-blog/index.md';
    const { title, date, abstract } = await reqPost(url);
    const feed = new RSS({
        title: `Jynxio's Website`,
        description: '',
        feed_url: 'https://www.jynxio.com/rss.xml',
        site_url: 'https://www.jynxio.com',
        copyright: 'CC BY-NC-ND 4.0',
        language: 'en, zh-CN',
        categories: ['Web Technology'],
    });

    feed.item({
        date,
        title,
        description: abstract,
        url: 'https://www.jynxio.com/build-interative-blog';
    });

    return new Response(feed.xml({ indent: true }), {
        headers: { 'Content-Type': 'application/xml' },
    });
}
```
