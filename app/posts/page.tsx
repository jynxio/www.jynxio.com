import { Scroll } from '@/_comps/scroll';
import layoutScrollCss from '@/_helpers/layout-scroll.module.css';
import { reqList } from '@/_helpers/posts';
import { List } from '@/posts/_list';

async function Post() {
    const list = await reqList();
    const orderedList = list.toSorted((a, b) => {
        const timestampA = Number(new Date(a.publishedDate));
        const timestampB = Number(new Date(b.publishedDate));

        return timestampB - timestampA;
    });

    return (
        <Scroll className={layoutScrollCss.style}>
            <List list={orderedList} />
        </Scroll>
    );
}

export default Post;
