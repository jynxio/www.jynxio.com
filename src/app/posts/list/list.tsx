'use client';

import { reqList } from '@/helpers/posts';
import { useRouter } from 'next/navigation';
import { useState, useTransition, type ReactNode } from 'react';
import { Item } from './item';
import css from './list.module.css';

type Props = Readonly<{ list: Awaited<ReturnType<typeof reqList>> }>;

function List({ list }: Props) {
    const router = useRouter();
    const [, transition] = useTransition();
    const [nextSlug, setNextSlug] = useState<string>();

    type T = { uuid: string; elem: ReactNode }[];
    const items = list.reduce<T>((acc, { slug, title, abstract }, idx) => {
        const href = `/posts/${slug}`;
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

export { List };
