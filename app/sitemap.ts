import { APP_URL } from '@/_consts';
import { reqList } from '@/_helpers/posts';
import path from 'node:path';

export const dynamic = 'force-static';

async function sitemap() {
    const list = await reqList();
    const blogs = list.map(item => ({
        url: new URL(path.join('blog', item.slug), APP_URL),
        lastModified: new Date(item.updatedDate).toISOString().split('T')[0],
    }));

    const routes = ['', '/blog'].map(route => ({
        url: new URL(route, APP_URL),
        lastModified: new Date().toISOString().split('T')[0],
    }));

    return [...routes, ...blogs];
}

export default sitemap;
