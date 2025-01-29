---
title: "使用 text-box 裁剪字符的行高"

abstract: "有些字符天生就不垂直居中，哪怕有合理的行高。text-box 是解决方案，这里讲它，和它背后的「行高」。"

publishedDate: "2025-01-30T00:00:00+08:00"

updatedDate: "2025-01-30T00:00:00+08:00"

tags: ["CSS", "Font"]

hero: "hero.png"
---

上周，我偶然发现组件的内容“ace”没有垂直居中。调查发现，这是由字符 a、c、e 的设计（偏低）导致的，文本节点本身是垂直居中的。如果将字符 a、c、e 和高个的字符组合在一起，那么就正常了。

![Offset character](./img/offset-character.png)

如果想让“ace”也垂直居中，那该怎么办？用 CSS 属性 `text-box`，它可以裁剪字符的行高，只要剪掉“ace”顶部的多余空间，那么就垂直居中了。

## text-box 的用法

这是 Demo。

<eliminatingTextVerticalOffset.Syntax />

`text-box` 会沿着字体的参考线来裁剪。参考线是什么？比如 Baseline 就是，而 Demo 中出现的 ex、cap、alphabetic 等值都会对应一根参考线，这有一份示意图。

![Font metrics](./img/font-metrics.png)

`text-box` 是 `text-box-trim` 和 `text-box-edge` 的简写语法。撰写时，MDN 还没有收录它们，所以只能通过 CSS 草案来查它的语法，我帮你总结好了。

> 该属性发布于 Chrome 133，彼时，用于 CJK 的 `ideographic` 和 `ideographic-ink` 都还没做好。

```ts
// text-box-trim
type TextBoxTrim = {
  initial: 'none';
  value: 'none' | 'trim-start' | 'trim-ed' | 'trim-both';
  apply: 'block' | 'inline-block';
  inherited: false;
};

// text-box-edge
type TextBoxEdge = {
  initial: 'auto (same as text)';
  oneValue: 'auto' | 'text' | 'ideographic' | 'ideographic-ink';
  twoValue: ['ex' | 'cap' | 'text' | 'ideographic' | 'ideographic-ink', 'text' | 'alphabetic' | 'ideographic' | 'ideographic-ink'];
  apply: 'block' | 'inline-block';
};
```

## 字符是如何绘制的

`text-box` 让我联想到一个问题——浏览器是怎么绘制字符的。

解答之前，先看下面的例子。这是用 Zapfino 字体写的 Sphinx，为什么它会超出一倍行高的范围？为什么 `line-height: normal` 会比一倍行高大那么多？`normal` 又代表什么？

![Default leading](./img/default-leading.png)

其实 `line-height: normal` 代表字体本身的默认行高。

默认行高有计算公式，但是不同平台的公式是不一样的。为此，Figma 专门写了一篇文章 [Getting to the bottom of line height in Figma](https://www.figma.com/blog/line-height-changes/) 来讲这件事情，因为 Figma 需要面对行高的跨平台问题，而这真的很棘手。然后 Figma 在另一份设计稿 [How Figma uses font metrics](https://www.figma.com/community/file/838187493478834415) 中展示了他们用的计算公式（默认行高）：

```
(hheaAscender - hheaeDescender + hheaLineGap) / unitsPerEm * fontSize
```

> hhea（horizontal header table）是字体的参数表，它存储了 ascender、descender、lineGap。unitsPerEm 来自另一个表——head 表。

让我来解释一下这行公式：

“ascender 代表 ascent line 的高度，descender 代表 descent line 的高度。lineGap 代表当前行的 descent line 到下一行的 ascent line 之间的距离，它被用作为额外的高度，大多数字体文件的 lineGap 都是 0。

unitsPerEm 代表设计空间中的字符画布的高度，这个画布就类似于 PPT 中的画布，字符本身是可以超出画布边界的。unitsPerEm 在屏幕空间中的高度就是 font-size。

Figma 用 `ascender - descender + lineGap` 来作为字符在设计空间中的高度，再结合 unitsPerEm 和 font-size，就可以计算出字符在屏幕空间中的高度了，这个高度就是字符的默认行高。”

让我来举个例子，下表是 Inter、NewYork、Zapfino 三种字体的参数，以及它们在 `font-size: 100px` 下的默认行高。

|                 | Inter   | NewYork        | Zapfino  |
| --------------- | ------- | -------------- | -------- |
| unitsPerEm      | 2048    | 1000           | 400      |
| hheaAscender    | 1984    | 949            | 750      |
| hheaDescender   | -494    | -243           | -601     |
| hheaLineGap     | 0       | 27             | 0        |
| Default leading | 121.9px | 120.99609375px | 337.75px |

你可以认为浏览器中的默认行高也遵循这个公式，这个结论不准确，但普适。

## 实际行高是怎么计算的

如果实际行高（比如 1.25 倍行高）比默认行高大，那么多出来的行高就要平均分给默认行高的上下两端，反之亦然。这两个会伸缩的部份就叫做 half-leading。

leading 是铅条，传统印刷业通过在行与行之间塞铅条来调整行间距，进而控制行高。传统印刷业中的 leading 都是 bottom-leading，而 half-leading 是 CSS 创造的。

Ethan Wang 的文章 [Leading-Trim: The Future of Digital Typesetting](https://medium.com/microsoft-design/leading-trim-the-future-of-digital-typesetting-d082d84b202) 讲了 half-leading 的由来（Figma 的那篇文章也有讲），以及它带来的问题，这篇文章开头提到的「“ace”看起来没有垂直居中」就是其中一种问题，Ethan Wang 讲了更多。

> Ethan Wang 文章里的 leading-trim 是什么？是 text-box 的旧名字。

## 为什么字符会超出一倍行高的范围

字符在屏幕空间中的高度锚定了它在屏幕空间中的默认行高，和实际行高无关。实际行高是在默认行高的基础上增增减减（通过 half-leading）得来的，它只会改变字符实际消耗的垂直空间，但不会改变字符在视觉上的效果。

Zapfino 中的常用字符的高度都很接近默认行高（甚至超出，比如字符 f），而且默认行高又比一倍行高显著的大，所以 Zapfino 的 Sphinx 会大幅超出一倍行高的范围。作为对比，Inter 中的常用字符的高度都比默认行高小很多，而且默认行高又只比一倍行高大一点，所以 Inter 没有发生同样的现象。

但实际上，Inter 的某些字符会超出一倍行高的范围，比如 Unicode 为 1EAC 的字符，这是因为该字符在设计空间中就超出了 ascent line，而且设计空间中的 ascent line 到 descent line（加上 lineGap）之间的范围和屏幕空间中的实际行高的范围是中线对齐的。

![Inter overflow](./img/inter-overflow.png)
