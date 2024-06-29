import type { Metadata } from "next";

import css from "./page.module.css";
import path from "node:path";
import components from "@/layout/mdx";
import CodeSnippet from "@/component/code-snippet";
import NativeJsx from "$/post/build-an-interactive-blog-with-mdx/component/native-jsx";
import CustomJsx from "$/post/build-an-interactive-blog-with-mdx/component/custom-jsx";
import { reqPost, reqList } from "@/helper/post";
import { APP_URL } from "@/constant";
import { MDXRemote } from "next-mdx-remote/rsc";

type Props = {
    params: { slug: string };
    searchParams: { [key: string]: string | string[] | undefined };
};

async function Page(props: Props) {
    const { content, title } = await reqPost(props.params.slug);

    return (
        <article className={css.container}>
            <components.h1>{title}</components.h1>
            <MDXRemote
                source={content}
                components={{
                    ...components,
                    pre: CodeSnippet,
                    NativeJsx,
                    CustomJsx,
                    img: (args) => {
                        if (!args.src) return <></>;

                        const imgName = args.src.split("/").at(-1);

                        if (!imgName) return <></>;

                        const url = path.join("/image-hosting", props.params.slug, imgName);

                        return <components.img {...args} src={url} />;
                    },
                }}
            />
        </article>
    );
}

export async function generateStaticParams() {
    const posts = await reqList();

    return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { title, hero, abstract } = await reqPost(params.slug);
    const ogRelativeUrl = path.join("image-hosting", params.slug, hero);
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
