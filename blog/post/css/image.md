# 图像

## 图像的类型

网页中的图像可以被分为 2 种类型，分别是「装饰性图像」和「内容性图像」，前者是指仅用作装饰的图像，比如背景和纹理，后者是指被当作内容的图像，比如文章配图和商品图。

## 加载的方式

图像有 2 种加载方式，分别是「CSS 方案」和「HTML 方案」。

CSS 方案是指使用 `background-image` 等 CSS 属性来加载图像的方案，它适用于加载装饰性的图像，这是因为它提供了开箱即用的装饰能力，比如 `background-repeat` 可用于制造重复的纹理背景，`background-attachment` 可用于控制背景图像的滚动行为。

HTML 方案是指使用 `<img>` 和 `picture>` 等 HTML 元素来加载图像的方案，它适用于加载内容性的图像，这是因为它提供了开箱即用的无障碍访问能力，比如 `alt` 属性可以为加载失败或阅读障碍提供降级的处理方案。

> 屏幕阅读器会阅读 `alt` 属性的内容，如果 `alt=""`，那么屏幕阅读器就会忽略它。

在加载速度方面，HTML 方案比 CSS 方案更快，这是因为浏览器只有在解析到相关的元素标签或 CSS 属性时才会开始下载图像，而对 CSS 属性的解析环节（样式计算）是发生在对 HTML 字符串的解析环节（DOM 构建）之后的。

对于由 React 等工具来构建的网页而言，由于 HTML 元素都是由 JavaScript 动态创建的，所以图像的下载时机都会被推迟到 JavaScript 执行完之后，如果你想提升图像的加载速度，那么不妨：

- 使用 SSG 类型的网页构建工具，比如 Astro 和 VitePress；
- 使用 `fetchpriority="high"` 来提高下载优先级；
- 使用 `<link preload />` 来预下载图像；

如果你想提升首屏的渲染速度，那么可以采用 `<img loading="lazy" />` 来懒加载图像，它可以减少首屏的下载负荷。

## 响应式设计

图像的响应式设计体现在 2 个方面，分别是分辨率和美术设计。

### 分辨率

网页会被显示在各种尺寸的屏幕上，比如台式电脑、笔记本电脑、平板电脑、智能手机，这意味着图像的尺寸也往往是动态的，如果采用了固定分辨率的图像，那么就无法兼顾清晰度和加载速度，比如：1）虽然高分辨率图像很清晰，但是加载速度慢；2）虽然低分辨率图像加载速度快，但是放大时会显得模糊。

解决这个问题的解决方案是：

1. 尽可能使用 SVG；
2. 如果使用位图，那么：
	1. 图像的软件比例尺和物理比例尺要一致；
	2. 根据图像的软件分辨率来加载不同物理分辨率版本的图像；

> 软件比例尺是指图像渲染在网页上时的比例尺，物理比例尺是指图像本身的比例尺，软件分辨率和物理分辨率同理，它们是我根据「软件像素」和「物理像素」来创造的新概念。

关于 2.2，假设图像的软件分辨率是 100 × 200，如果浏览器的像素分辨率是 1，那么图像的物理分辨率就必须达到 100 × 200，如果像素分辨率为 2，则是 200 × 400，如果像素分辨率为 3，则是 300 × 600。

其实，我认为没有必要考虑像素分辨率大于 2 的情况，因为对于人眼而言，像素分辨率大于 2 之后所带来的提升效果已经不明显了，但是它却会显著增大图像的体积，这是一种浪费。

### 美术设计

有时候，我们不能把大屏设备上的图像直接照搬到小屏设备上去，比如对于一幅 16:9 的图像，它在电脑屏幕上的展示效果很棒，但是在手机屏幕上的展示效果却不好，因为手机屏幕太窄了，图像的细节都看不太清了。

这个问题得解决方案是：为不同尺寸的设备加载不同版本的图像。比如对于上面这个问题，我们应该为手机屏幕提供一份不那么宽的图像。

## 装饰性图像方案

```css
element {
    &.static {  /* 假设图像的宽度是确定的，比如波浪纹理背景 */
		background-size: 5px auto;
    	background-repeat: repeat;
    }

    &.dynamic { /* 假设图像的宽度是不确定的，比如寻常的风景画背景 */
		background-size: 100% auto;
    	background-repeat: no-repeat;
    }

	background-image: url("desktop-1x.png");
    @media (width <= 1500px) { background-image: url("laptop-1x.png") }
    @media (width <= 1100px) { background-image: url("tablet-1x.png") }
    @media (width <= 550px)  { background-image: url("mobile-1x.png") }


	@media (resolution >= 2) {
		background-image: url("desktop-2x.png");
		@media (width <= 1500px) { background-image: url("laptop-2x.png") }
		@media (width <= 1100px) { background-image: url("tablet-2x.png") }
		@media (width <= 550px)  { background-image: url("mobile-2x.png") }
    }
}
```

> 只有满足媒体查询的图像才会被下载。

## 内容性图像方案

如果图像的尺寸是不确定的，那么一个兼顾分辨率和美术设计的方案如下：

```html
<style>
    img, picture {
        display: block;
        aspect-ratio: 16/9;
        inline-size: clamp(desktop-min, desktop-formula, desktop-max);

        @media (width <= 1500px) {
            aspect-ratio: 5/3;
            inline-size: clamp(laptop-min, laptop-formula, laptop-max);
        }
        @media (width <= 1100px) {
            aspect-ratio: 3/2;
        	inline-size: clamp(tablet-min, tablet-formula, tablet-max);
        }
        @media (width <=  550px) {
            aspect-ratio: 2/1;
        	inline-size: clamp(mobile-min, mobile-formula, mobile-max);
        }
    }
</style>

<picture>
    /* pixel ratio: 1 */
	<source media="(resolution >= 1) and (width <= 550px)"  srcset="mobile-1x.png"  />
    <source media="(resolution >= 1) and (width <= 1100px)" srcset="tablat-1x.png"  />
    <source media="(resolution >= 1) and (width <= 1500px)" srcset="laptop-1x.png"  />
    <source media="(resolution >= 1) and (width >  1500px)" srcset="desktop-1x.png" />
    
    /* pixel ratio: 2 */
    <source media="(resolution >= 2) and (width <= 550px)"  srcset="mobile-2x.png"  />
    <source media="(resolution >= 2) and (width <= 1100px)" srcset="tablat-2x.png"  />
    <source media="(resolution >= 2) and (width <= 1500px)" srcset="laptop-2x.png"  />
    <source media="(resolution >= 2) and (width >  1500px)" srcset="desktop-2x.png" />
    
    /* fallback: 降级方案应当使用最清晰的图像 */
    <img alt="" src="desktop-2x.png" />
</picture>
```

如果我们只关注分辨率的话，那么这还有一个更加简洁的实现方案：

```html
<style>
    img {
        aspect-ratio: 16/9;
        inline-size: clamp(desktop-min, desktop-formula, desktop-max);
        @media (width <= 1500px) { inline-size: clamp(laptop-min, laptop-formula, laptop-max) }
        @media (width <= 1100px) { inline-size: clamp(tablet-min, tablet-formula, tablet-max) }
        @media (width <=  550px) { inline-size: clamp(mobile-min, mobile-formula, mobile-max) }
    }
</style>

<img
	srcset="1x.png 1x, 2x.png 2x"
	loading="lazy"
	src="2x.png"
	alt=""
/>
/* 仅当srcset属性失效时，才会使用src的降级方案 */
```

如果图像的尺寸是确定的，那么一个兼顾分辨率和美术设计的方案如下：

```html
<picture>
	<source media="(width <= 550px)"  sizes="300px" srcset="mobile-1x.png 300w, mobile-2x.png 600w" />
    <source media="(width <= 1100px)" sizes="500px" srcset="tablet-1x.png 500w, tablet-2x.png 1000w" />
    <source media="(width <= 1500px)" sizes="700px" srcset="laptop-1x.png 700w, laptop-2x.png 1400w" />
    <source media="(width > 1500px)"  sizes="900px" srcset="desktop-1x.png 900w, desktop-2x.png 1800w" />
    /* 仅当source标签无效或不满足时，才会使用img的降级方案 */
    <img alt="" src="desktop-2x.png" />
</picture>
```

如果我们只关注分辨率的话，那么这还有一个更加简洁的实现方案：

```html
<img
	sizes="(width <= 550px) 300px, (width <= 1100px) 500px, (width <= 1500px) 700px, 900px"
	srcset="1x.png 300w, 2x.png 600w， 3x.png 900w, 4x.png 1200w, 5x.png 1500w, 6x.png 1800w"
	loading="lazy"
	src="2x.png"
	alt=""
/>
/* 仅当srcset属性失效时，才会使用src的降级方案 */
```

> 为什么需要提供 1x 至 6x 的图像？因为网页对图像的期望的物理宽度的最小值就是 `300w`，最大值就是 `1800w`，前者发生在 `width <= 500px` 且 `resolution = 1` 的情况，后者发生在 `width > 1500px` 且`resolution = 2` 的情况。

对于指定了 `sizes` 属性的方案而言，浏览器会根据其中的媒体查询来为图像应用你所预定义的宽度（高度是自动的），然后再根据图像的软件分辨率和设备的像素分辨率来计算出图像所需的物理分辨率，然后再去 `srcset` 中选择合适的图像。比如，假设视口宽度小于 550px 且设备的像素分辨率为 2，浏览器就会选用 2x.png。