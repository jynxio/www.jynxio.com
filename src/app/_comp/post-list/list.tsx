'use client';

import { reqList } from '@/helper/post';
import { useRouter } from 'next/navigation';
import React from 'react';
import Item from './item';
import css from './list.module.css';

type Props = Readonly<{ list: Awaited<ReturnType<typeof reqList>> }>;

function List({ list }: Props) {
    const router = useRouter();
    const [, transition] = React.useTransition();
    const [nextSlug, setNextSlug] = React.useState<string>();

    type T = { uuid: string; elem: React.ReactNode }[];
    const items = list.reduce<T>((acc, { slug, title, abstract }, idx) => {
        const href = `/post/${slug}`;
        const isLoading = slug === nextSlug;
        const navigate = () => (setNextSlug(slug), transition(() => router.push(href)));
        const props = { title, abstract, isLoading, navigate };

        idx === 0 || acc.push({ uuid: `${slug}-divider`, elem: <Divider /> });
        acc.push({ uuid: slug, elem: <Item {...props} /> });

        return acc;
    }, []);

    return (
        <ul className={css.list}>
            {items.map(({ uuid, elem }) => (
                <li key={uuid} className={css.item}>
                    {elem}
                </li>
            ))}
        </ul>
    );
}

function Divider() {
    return <div className={css.divider}>/ / /</div>;
}

export default List;
