import { reqList } from '@/helper/post';
import { Banner } from './_comp/banner';
import List from './_comp/post-list';

async function Blog() {
    const list = await reqList();
    const orderedList = list.toSorted((a, b) => {
        const timestampA = Number(new Date(a.publishedDate));
        const timestampB = Number(new Date(b.publishedDate));

        return timestampB - timestampA;
    });

    return (
        <>
            <Banner />
            <List list={orderedList} />
        </>
    );
}

export default Blog;
