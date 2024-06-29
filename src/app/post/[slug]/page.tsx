import type { Metadata } from "next";

import css from "./page.module.css";
import path from "node:path";
import components from "@/layout/mdx";
import CodeSnippet from "@/component/code-snippet";
import NativeJsx from "$/post/build-blod-with-mdx/component/native-jsx";
import CustomJsx from "$/post/build-blod-with-mdx/component/custom-jsx";
import { reqPost, reqList } from "@/helper/post";
import { BASE_URL } from "@/constant/sitemap";
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
    const { title, hero } = await reqPost(params.slug);
    const url = path.join("/image-hosting", params.slug, hero);
    const secureUrl = path.join(BASE_URL, "/image-hosting", params.slug, hero);

    return {
        title,
        description: "",
        openGraph: {
            determiner: "",
            title,
            description: "",
            emails: "jinxiaomatrix@gmail.com",
            url: path.join(BASE_URL, "post", params.slug),
            siteName: `Jynxio's Website`,
            locale: "zh_CN", // 默认区域设置为美国英语en_US
            alternateLocale: ["en_US"], // 备用区域设置为简体中文（中国大陆）
            type: "website",
            images: {
                url,
                secureUrl,
                alt: title,
                type: "image/png",
                width: 1200,
                height: 675,
            },
        },
        twitter: {
            site: "Jynxio",
            siteId: "@jyn_xio",
            creator: "Jynxio",
            creatorId: "@jyn_xio",
            description: "",
            title,
            images: {
                url,
                secureUrl,
                alt: title,
                type: "image/png",
                width: 1200,
                height: 675,
            },
        },
    };
}

export default Page;
