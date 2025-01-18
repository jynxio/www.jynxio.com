import { reqList } from '@/helper/post';

import List from './_comp/post-list';

async function Blog() {
    return <List list={await reqList()} />;
}

export default Blog;
