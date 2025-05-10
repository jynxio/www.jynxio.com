---
title: "如何将 Antd 集成进 Tailwind CSS？"

abstract: '我想在 Tailwind CSS@4 的类名中使用 Antd@5 的 Design Token，就像 <div class="colorPrimary"> 这样，这里就有一个方案。'

publishedDate: "2025-04-08T00:00:00+08:00"

updatedDate: "2025-04-08T00:00:00+08:00"

tags: ["Antd", "Tailwind CSS"]

hero: "hero.png"
---

我的项目同时使用了 Antd@5 和 Tailwind CSS@4（简称 tw），我希望能在 tw 类名中直接引用 Antd 的 Design Token（简称 Token），实现如下效果：

```tsx
<div className="color-colorPrimary p-paddingSM" />
```

阅读 Antd 源码后，我发现这个需求必须使用内部源码。基于非公开 API 的方案是有风险的，如果你不介意这一点，那么我确实有一个可行的方案，而且工作的很棒。[这个 CodeSandbox](https://codesandbox.io/p/github/jynxio/how-to-integrate-antd-with-tw/main) 是方案的在线演示，相关代码则托管在 [这个仓库](https://github.com/jynxio/how-to-integrate-antd-with-tw)。

## 为什么？

为了「设计风格的一致性」和「设计方案的自适应」。

关于设计风格的一致性，如果网页使用 Token 来设计布局和自定义组件，那么网页的设计风格就会和 Antd 的一致。

关于设计方案的自适应，我从一开始就将 Token 注册进了 Figma（作为 Figma Variable）和 tw（作为 Theme Variable），如果我更新了 Token 的配方，那么只要更新相应的 Figma Variable 和 Theme Variable，设计稿和网页就会自动更新，无需重构设计稿或样式代码。这是它的示意图：

```
                            +----------------+
                            |   Antd Token   |
                            +--------+-------+
                                     |
                                     | Register
          +--------------+           |           +--------------+
          |     Figma    | <---------+---------> |   Tailwind   |
          +------+-------+                       +-------+------+
                 |                                       |
                 | CSS Code                              | TW Code
                 v                                       v
+---------------------------------+     +---------------------------------+
| padding: var(--paddingSM, 12px) | --> | <div className="p-paddingSM" /> |
+---------------------------------+     +---------------------------------+
```

## 怎么做？

Antd 使用一套 Token 系统来控制自身的样式，你可以在 [这里](https://ant.design/docs/react/customize-theme) 找到 Token 系统的指南。

Antd 提供了一种可选的 [CSS 变量模式](https://ant.design/docs/react/css-variables)，一旦激活，Antd 就会使用 Token 来派生 CSS 变量，然后使用 CSS 变量来控制自身的样式。方案的实现原理就是「获取 Antd 的 CSS 变量，然后将 CSS 变量注册进 tw」，下面是粗略的流程。

1. 获取 Token；
2. 获取 CSS 变量；
3. 分类 CSS 变量；
4. 注册 CSS 变量；

接下来，我会阐述方案的每个步骤。

## 1）获取 Token

Antd 的公开 API `theme.getDesignToken` 可以获取所有的 Token，目前一共有 501 个。这些 Token 其实就是 [官网的 AliasToken](https://ant.design/docs/react/customize-theme#aliastoken)。

```ts
import { theme } from 'antd';

theme.getDesignToken();

// Token:
//   - paddingSM: 12
//   - paddingMD: 20
//   - colorPrimary: #1677ff
//   - colorSuccess: #52c41a
//   - ...
```

🤔️：为什么官网的 AliasToken 不足 501 个？<br />🙋：因为 AliasToken 包含了 SeedToken 和 MapToken，以及一些没有展示在官网上的 Token（比如 `blue`、`green` 等）。你可以在 [源码的类型声明 `AliasToken`](https://github.com/ant-design/ant-design/blob/dd204608865673cc728d671d25215824059e0bf6/components/theme/interface/alias.ts#L10) 中找到所有的 Token 及其具体描述。

> 在生产环境中，AliasToken 和它的类型声明是不吻合的。这是因为 Antd 会在打包阶段就移除掉那些用 JSDoc 标记为 `@internal` 的 Token 的类型声明，但是 `getDesignToken` 函数却没有做相应的移除，这样的 Token 一共有 13 个，我创建了 [这个 issue](https://github.com/ant-design/ant-design/issues/52838) 来汇报缺陷与线索，然后 Closed as not planned。
>
> ```tsx
> import { theme } from 'antd';
> 
> const aliasToken = theme.getDesignToken();
> const hasFontHeight = aliasToken['fontHeight'] === undefined;              // false
> 
> type AliasToken = typeof aliasToken;
> type HasFontHeight = 'fontHeight' extends keyof AliasToken ? true : false; // false;
> ```

## 2）获取 CSS 变量

Antd 的 CSS 变量是由 Token 加工得到的，第一个加工环节是过滤，第二个加工环节是重命名。501 个 Token 经过加工之后会产生 339 个 CSS 变量，下面是示意代码。

```ts
import { theme } from 'antd';

const token = theme.getDesignToken();

[filter, rename].reduce((acc, f) => f(result), token);

function filter() {/* ... */}
function rename() {/* ... */}

// Process:
//   - paddingSM    -> --ant-padding-sm
//   - colorPrimary -> --ant-color-primary
//   - blue1        -> --ant-blue1
//   - blue-1       -> --ant-blue1
//   - motion       -> ...
//   - motionBase   -> ...
//   - ...
```

`filter` 函数是第一个加工环节，它用于过滤 Token。其原理是：Antd 源码中硬编码了 2 份名单，分别是 [ignoreList](https://github.com/ant-design/ant-design/blob/938a8cf64d5c5f6315846ca634554ce219d79fb6/components/theme/useToken.ts#L30) 和 [preservedList](https://github.com/ant-design/ant-design/blob/938a8cf64d5c5f6315846ca634554ce219d79fb6/components/theme/useToken.ts#L48)，那些出现在这 2 份名单上的 Token 会被删除掉，并且那些值既不是 number 也不是 string 的 Token 也会被删除掉。比如 `motionBase` 和 `motion` 就会被删除掉，前者是因为它出现在了 ignoreList 上，后者是因为它是布尔类型。

实现如下。

```ts
import type { AliasToken } from 'antd/es/theme/internal';

/**
 * @see https://github.com/ant-design/ant-design/blob/938a8cf64d5c5f6315846ca634554ce219d79fb6/components/theme/useToken.ts#L30
 */
const ignoreList = [
  'size',
  'sizeSM',
  'sizeLG',
  'sizeMD',
  'sizeXS',
  'sizeXXS',
  'sizeMS',
  'sizeXL',
  'sizeXXL',
  'sizeUnit',
  'sizeStep',
  'motionBase',
  'motionUnit',
];

/**
 * @see https://github.com/ant-design/ant-design/blob/938a8cf64d5c5f6315846ca634554ce219d79fb6/components/theme/useToken.ts#L48
 */
const preservedList = [
  'screenXS',
  'screenXSMin',
  'screenXSMax',
  'screenSM',
  'screenSMMin',
  'screenSMMax',
  'screenMD',
  'screenMDMin',
  'screenMDMax',
  'screenLG',
  'screenLGMin',
  'screenLGMax',
  'screenXL',
  'screenXLMin',
  'screenXLMax',
  'screenXXL',
  'screenXXLMin',
];

/**
 * Filter out tokens in the ignoreList or preservedList.
 * @See https://github.com/ant-design/cssinjs/blob/35f041c7188ab532d9484e0e364df5c0aea37ce1/src/util/css-variables.ts#L55
 */
function filter(i: AliasToken) {
  const blacklist = new Set([...ignoreList, ...preservedList]);
  const o: string[] = [];

  for (const [name, value] of Object.entries(i)) {
    if (blacklist.has(name)) continue;
    if (!checkIsNumOrStr(value)) continue;

    o.push(name);
  }

  return o;
}

function checkIsNumOrStr(i: unknown): i is number | string {
  if (typeof i === 'number') return true;
  if (typeof i === 'string') return true;

  return false;
}
```

`rename` 函数是第二个加工环节，它用于生成 CSS 变量的名称。其原理是：Antd 会拿到过滤后的 Token，然后将小驼峰格式的名称改成连字符格式，最后再追加 `--ant-` 前缀。比如 Token `colorPrimary` 所对应的 CSS 变量的名称就是 `--ant-color-primary`。

> 为什么 CSS 变量的数量显著少于过滤后的 Token 的数量？因为 Token `blue1` 和 `blue-1` 都被转换为了 `--ant-blue-1`，诸如此类的情况还有很多。另外，这些连字符格式的颜色 Token 被标记为了 [Legacy](https://github.com/ant-design/ant-design/blob/dd204608865673cc728d671d25215824059e0bf6/components/theme/interface/presetColors.ts#L23)。

实现如下。

```ts
/**
 * @see https://github.com/ant-design/cssinjs/blob/35f041c7188ab532d9484e0e364df5c0aea37ce1/src/util/css-variables.ts#L1
 */
function rename(token: string) {
  return `--ant-${token}`
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z0-9]+)/g, '$1-$2')
    .replace(/([a-z])([A-Z0-9])/g, '$1-$2')
    .toLowerCase();
}
```

## 3）分类 CSS 变量

在将 CSS 变量注册进 tw 之前，需要按照 tw 的 [Theme Variable Reference](https://tailwindcss.com/docs/theme#default-theme-variable-reference) 来人工分类 CSS 变量，没有捷径。分类时，可以参考 Token 的名称与其类型声明。

最后，我将 11 个 CSS 变量定义成了 Utility（因为它们没有对应 Theme Variable），其余的 CSS 变量都定义成了 Theme Variable，下面是部份的分类结果。

```yaml
# Theme Variable
spacing:
  - --ant-padding-sm
  - --ant-padding-md
color:
  - --ant-color-primary
  - --ant-color-success

# Utility
z:
  - --ant-z-index-base
  - --ant-z-index-popup-base
border:
  - --ant-line-type
opacity:
  - --ant-opacity-image
  - --ant-opacity-loading
duration:
  - --ant-motion-duration-fast
  - --ant-motion-duration-mid
  - --ant-duration-slow
decoration:
  - --ant-link-decoration
  - --ant-link-hover-decoration
  - --ant-link-focus-decoration
```

## 4）注册 CSS 变量

使用 tw 专有的 At-rules（`@theme` 和 `@utility`），将 Step 3 的分类结果写成 .css 文件，就可以将 CSS 变量注册进 tw 了，下面是  .css 文件的部份内容。

```css
@theme {
  --spacing-paddingSM: '';
  --spacing-paddingMD: '';

  --color-colorPrimary: '';
  --color-colorSuccess: '';

  /* ... */
}

@utility border-lineType {
  border-style: var(--ant-line-type);
}

@utility opacity-opacityImage {
  opacity: var(--ant-opacity-image);
}

@utility opacity-opacityLoading {
  opacity: var(--ant-opacity-loading);
}

@utility z-zIndexBase {
  z-index: var(--ant-z-index-base);
}

@utility z-zIndexPopupBase {
  z-index: var(--ant-z-index-popup-base);
}

@utility duration-motionDurationFast {
  transition-duration: var(--ant-motion-duration-fast);
}

@utility duration-motionDurationMid {
  transition-duration: var(--ant-motion-duration-mid);
}

@utility duration-motionDurationSlow {
  transition-duration: var(--ant-duration-slow);
}

@utility decoration-linkDecoration {
  text-decoration-style: var(--ant-link-decoration);
}

@utility decoration-linkHoverDecoration {
  text-decoration-style: var(--ant-link-hover-decoration);
}

@utility decoration-linkFocusDecoration {
  text-decoration-style: var(--ant-link-focus-decoration);
}
```

你注意到了吗？1）在命名 Theme Variable 和 Utility 时，我使用了 Token 的名字，而不是 CSS 变量的名字；2）Theme Variable 的值时空字符串 `''` 而不是 CSS 变量，Utility 的值则是 CSS 变量。

做第一件事的动机很简单，就是为了方便翻阅文档，因为 Antd 只有 Token 文档而没有 CSS 变量文档。

做第二件事的动机有些复杂，具体来说：

“Theme Variable 的工作原理大致是：tw 的类名会映射对应的样式规则，比如类名 `text-colorPrimary` 对应的样式规则就是 `.text-colorPrimary { color: var(--color-colorPrimary) }`”，其中的 `--color-colorPrimary` 就是我们上文注册的 Theme Variable，它们其实就是 CSS 变量。

tw 会把所有 Theme Variable 都注册在 HTML 的根元素上，但是 Antd 的 CSS 变量却是注册在 React 的根元素内部的，所以 Theme Variable 是无法访问到 Antd 的 CSS 变量的，给 Theme Variable 赋予 Antd 的 CSS 变量也就自然没有意义了。

我会在随后给出解决方案，但在那之前，我要先给 Theme Variable 一个值，我决定选用空字符串 `""`，它没有特殊的意义，它就是一个随便写的用作于占位的符号，如果你喜欢，也可以用下划线 `_`。

Utility 的工作原理大致是：`@utility border-lineType { border-style: var(--ant-line-type) }` 会被转译成 `.border-lineType { border-style: var(--ant-line-type) }`。可见，Utility 是可以访问到 Antd 的 CSS 变量的，所以我直接为它赋予了 Antd 的 CSS 变量。”

```css
@theme {
  /* Error: --ant-color-primary is not defined */
  --color-colorPrimayr: var(--ant-color-primary);
}
```

如何解决 Theme Variable 的遗留问题？方案如下：

```css
* {
  --spacing-paddingSM: var(--ant-padding-sm);
  --spacing-paddingMD: var(--ant-padding-md);

  --color-colorPrimary: var(--ant-color-primary);
  --color-colorSuccess: var(--ant-color-success);

  /* ... */
}
```

其原理是：在元素身上注册与 Theme Variable 同名的 CSS 变量，那么 tw 的样式规则就会使用我们注册的同名变量，然后再将同名变量指向 Antd 的 CSS 变量，那么 tw 的样式规则就会使用 Antd 的 CSS 变量了。下面是示意图。

```
+------------------------------------------------ JSX --+
|  <App>                                                |
|    <i class="text-colorPrimary" />                    |
|  </App>        |                                      |
+----------------+--------------------------------------+
                 |
                 | Apply class style
                 v
+------------------------------------------------ CSS --+
|  .text-colorPrimary {                                 |
|    color: var(--color-colorPrimary);                  |
|  }                    |                               |
+-----------------------+-------------------------------+
                        |
                        | Look up --color-colorPrimary
                        v
+------------------------------------------------ CSS --+
|  * {                                                  |
|    --color-colorPrimary: var(--ant-color-primary);    |
|  }                        |                           |
+---------------------------+---------------------------+
                            |
                            | Look up --ant-color-primary
                            v
+------------------------------------------------ CSS --+
|  .css-var-R2a { /* Used by App element */             |
|    --ant-color-primary: '#1677ff';                    |
|  }                                                    |
+-------------------------------------------------------+
```

## 为什么不直接用 Token？

🤔️：为什么不直接把分类后的 Token 注册进 tw？这不是更简单吗？<br />🙋：因为 Token 方案只比 CSS 变量方案简单一些，但却有显著多的限制。

🤔️：为什么 Token 方案只简单一些？<br />🙋：因为 Token 方案只能节省掉「注册 CSS 变量」步骤的部份工作（关于如何解决 Theme Variable 的遗留问题的那部份），而且 Token 方案还需要做一些额外的工作。

🤔️：为什么 Token 方案没有节省掉「获取 CSS 变量」步骤？<br />🙋：因为需要使用其中的 `filter` 和 `rename` 来过滤无效的 Token。

🤔️：为什么 Token 方案还需要做一些额外的工作。
🙋：因为 Token 的值都是无单位的，你需要为它们补充 CSS 单位，方案见文末。

🤔️：为什么 Token 方案会有显著多的限制？<br />🙋：因为1）Token 方案不支持动态主题，如用户自定义主题色；2）Token 方案不支持嵌套主题，如嵌套的 `ConfigProvider`，这常见于组件库；3）Token 方案不支持主题热更新。

显然，CSS 变量方案是更划算的。

🤔️：如何为 Token 补充 CSS 单位？<br />🙋：Antd 源码中硬编码了一份 [unitlessList](https://github.com/ant-design/ant-design/blob/2af20aaa34bb195b9d2a9132f519328cf78184bd/components/theme/useToken.ts#L12) 名单，那些处于名单之外且值为 number 类型的 Token 都会被追加 CSS 单位 `px`，具体实现如下 `appendUnit` 所示。

```ts
/**
 * @see https://github.com/ant-design/ant-design/blob/2af20aaa34bb195b9d2a9132f519328cf78184bd/components/theme/useToken.ts#L12
 */
const unitlessList = [
  'lineHeight',
  'lineHeightSM',
  'lineHeightLG',
  'lineHeightHeading1',
  'lineHeightHeading2',
  'lineHeightHeading3',
  'lineHeightHeading4',
  'lineHeightHeading5',
  'opacityLoading',
  'fontWeightStrong',
  'zIndexPopupBase',
  'zIndexBase',
  'opacityImage',
];

/**
 * @see https://github.com/ant-design/cssinjs/blob/35f041c7188ab532d9484e0e364df5c0aea37ce1/src/util/css-variables.ts#L64
 */
function appendUnit(name: string, value: string | number) {
    if (typeof value === 'string') return value;
    if (unitlessList.includes(name)) return String(value);

    return value + 'px';
}
```
