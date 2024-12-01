import type { Metadata } from "next";

import css from "./page.module.css";
import path from "node:path";
import components from "@/layout/mdx";
import CodeSnippet from "@/component/code-snippet";
import NativeJsx from "$/post/build-an-interactive-blog-with-mdx/component/native-jsx";
import CustomJsx from "$/post/build-an-interactive-blog-with-mdx/component/custom-jsx";
import remarkGfm from "remark-gfm";
import { reqPost, reqList } from "@/helper/post";
import { APP_URL } from "@/constant";
import { MDXRemote } from "next-mdx-remote/rsc";

type Props = Readonly<{
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}>;

async function Page({ params }: Props) {
    const { slug } = await params;
    const { content, title } = await reqPost(slug);
    const comps = { ...components, NativeJsx, CustomJsx, img: Img, pre: CodeSnippet };

    return (
        <article className={css.container}>
            <components.h1>{title}</components.h1>
            <MDXRemote
                source={content}
                components={comps}
                options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
            />
        </article>
    );

    function Img(props: React.ComponentProps<(typeof components)["img"]>) {
        if (!props.src) return;

        const imgName = props.src.split("/").at(-1);

        if (!imgName) return;

        type ImgCtx = {
            src: string;
            width: number;
            height: number;
            blurDataURL: string;
            blueHeight: number;
            blurWidth: number;
        };

        const { src } = require(`$/post/${slug}/img/${imgName}`).default as ImgCtx;

        return <components.img {...props} src={src} />;
    }
}

export async function generateStaticParams() {
    const posts = await reqList();

    return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const { title, hero, abstract } = await reqPost(slug);
    const ogRelativeUrl = path.join("image-hosting", slug, hero);
    const ogSecureUrl = new URL(ogRelativeUrl, APP_URL);
    const ogImgUrl = process.env.NODE_ENV === "production" ? ogSecureUrl : ogRelativeUrl;
    const ogTitle = `${title} | Jynxio`;
    const ogDes = abstract;
    const ogImages = {
        url: ogImgUrl,
        secureUrl: ogSecureUrl,

        width: 1200,
        height: 675,

        alt: `open graph for the post "${title}"`,
        type: "image/png",
    };

    return {
        title,
        description: ogTitle,
        openGraph: {
            determiner: "",
            title: ogTitle,
            description: ogDes,
            emails: "jinxiaomatrix@gmail.com",
            url: ogImgUrl,
            siteName: " ",
            locale: "zh_CN", // 默认区域设置为美国英语en_US
            alternateLocale: ["en_US"], // 备用区域设置为简体中文（中国大陆）
            type: "website",
            images: ogImages,
        },
        twitter: {
            title: ogTitle,
            description: ogDes,
            images: ogImages,
            site: "Jynxio",
            siteId: "@jyn_xio",
            creator: "Jynxio",
            creatorId: "@jyn_xio",
        },
    };
}

export default Page;
