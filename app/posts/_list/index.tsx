import { reqList } from '@/_helpers/posts';
import { Fade } from './_fade';
import { Item } from './_item';

import css from './_index.module.css';

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
