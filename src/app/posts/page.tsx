import { List } from '@/app/posts/list';
import { reqList } from '@/helpers/posts';

async function Post() {
    const list = await reqList();
    const orderedList = list.toSorted((a, b) => {
        const timestampA = Number(new Date(a.publishedDate));
        const timestampB = Number(new Date(b.publishedDate));

        return timestampB - timestampA;
    });

    return <List list={orderedList} />;
}

export default Post;
