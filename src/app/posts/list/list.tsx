import type { ReactNode } from 'react';

import { reqList } from '@/helpers/posts';
import { Item } from './item';
import css from './list.module.css';

type Props = Readonly<{ list: Awaited<ReturnType<typeof reqList>> }>;

function List({ list }: Props) {
    type T = { uuid: string; elem: ReactNode }[];

    const items = list.reduce<T>((acc, { slug, title, abstract }, idx) => {
        const href = `/posts/${slug}`;
        const props = { title, abstract, href };

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
