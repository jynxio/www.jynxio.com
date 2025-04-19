import type { Metadata } from 'next';

import { Comp as buildBlogWithNextJs } from '$/post/build-an-interactive-blog-with-mdx/component';
import { Comp as eliminatingTextVerticalOffset } from '$/post/eliminating-text-vertical-offset/component';
import { CodeSnippet } from '@/comps/code-snippet';
import { mdx } from '@/comps/mdx';
import { APP_URL } from '@/consts';
import { reqList, reqPost } from '@/helpers/posts';
import { formatDate } from '@/utils/format-date';
import { MDXRemote } from 'next-mdx-remote/rsc';
import path from 'node:path';
import remarkGfm from 'remark-gfm';
import css from './page.module.css';

type Props = Readonly<{
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}>;

async function Page({ params }: Props) {
    const { slug } = await params;
    const { content, title, updatedDate } = await reqPost(slug);
    const date = formatDate(updatedDate);
    const newComp = {
        ...mdx,
        buildBlogWithNextJs,
        eliminatingTextVerticalOffset,
        img: createImg,
        pre: CodeSnippet,
    };

    return (
        <article className={css.container}>
            <mdx.h1 className={css.title}>{title}</mdx.h1>
            <blockquote className={css.date}>
                Last updated: <time dateTime={updatedDate}>{date}</time>
            </blockquote>

            <MDXRemote
                source={content}
                components={newComp}
                options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
            />
        </article>
    );

    function createImg(props: React.ImgHTMLAttributes<HTMLImageElement>) {
        return <mdx.img {...props} postSlug={slug} />;
    }
}

export async function generateStaticParams() {
    return (await reqList()).map(post => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const { title, hero, abstract } = await reqPost(slug);
    const ogRelativeUrl = path.join('image-hosting', slug, hero);
    const ogSecureUrl = new URL(ogRelativeUrl, APP_URL);
    const ogImgUrl = process.env.NODE_ENV === 'production' ? ogSecureUrl : ogRelativeUrl;
    const ogTitle = `${title} | Jynxio`;
    const ogDes = abstract;
    const ogImages = {
        url: ogImgUrl,
        secureUrl: ogSecureUrl,

        width: 1200,
        height: 675,

        alt: `open graph for the post "${title}"`,
        type: 'image/png',
    };

    return {
        title,
        description: ogTitle,
        openGraph: {
            determiner: '',
            title: ogTitle,
            description: ogDes,
            emails: 'jinxiaomatrix@gmail.com',
            url: ogImgUrl,
            siteName: ' ',
            locale: 'zh_CN',
            alternateLocale: ['en_US'],
            type: 'website',
            images: ogImages,
        },
        twitter: {
            title: ogTitle,
            description: ogDes,
            images: ogImages,
            site: 'Jynxio',
            siteId: '@jyn_xio',
            creator: 'Jynxio',
            creatorId: '@jyn_xio',
        },
    };
}

export default Page;
