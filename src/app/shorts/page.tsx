import css from './page.module.css';

import type { Metadata } from 'next';

import { CodeSnippet } from '@/comps/code-snippet';
import { mdx } from '@/comps/mdx';
import { APP_URL } from '@/consts';
import { formatDate } from '@/utils/format-date';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { Comment } from './comment';
import { getDiscussion } from './fetch';

async function Page() {
    return (
        <div className={css.container}>
            <header className={css.header}>{'/* 我把简短的想法写在这里 */'}</header>
            <List />
        </div>
    );
}

async function List() {
    const data = await getDiscussion();
    const comps = { ...mdx, pre: CodeSnippet };

    return (
        <ul className={css.list}>
            {data.map((item, idx) => {
                const { content, createdAt } = item;
                const mode = idx % 2 === 0 ? 'left' : 'right';
                const alignSelf = mode === 'left' ? 'start' : 'end';

                return (
                    <li key={createdAt} style={{ alignSelf }}>
                        <Comment mode={mode} date={formatDate(createdAt)}>
                            <MDXRemote source={content} components={comps} />
                        </Comment>
                    </li>
                );
            })}
        </ul>
    );
}

export function generateMetadata(): Metadata {
    return {
        title: 'Shorts',
        alternates: { canonical: new URL(`/shorts`, APP_URL).toString() },
    };
}

export default Page;
