import { reqList } from '@/helpers/posts';
import { Fade } from './fade';
import { Item } from './item';

import css from './list.module.css';

type Props = { list: Awaited<ReturnType<typeof reqList>> };

function List({ list }: Readonly<Props>) {
    return (
        <ul className={css.list}>
            {list.map(({ slug, title, abstract }) => {
                const href = `/posts/${slug}`;
                const props = { title, abstract, href };

                return (
                    <li key={slug} className={css.item}>
                        <Fade>
                            <Item {...props} />
                        </Fade>
                    </li>
                );
            })}
        </ul>
    );
}

export { List };
