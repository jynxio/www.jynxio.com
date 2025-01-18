import { reqList } from '@/helper/post';
import RSS from 'rss';

export const dynamic = 'force-static';
export async function GET() {
    const list = await reqList();
    const feed = new RSS({
        title: `Jynxio's Blog`,
        description: 'I am idle and aimless here',
        feed_url: 'https://www.jynxio.com/rss.xml',
        site_url: 'https://www.jynxio.com',
        copyright: 'CC BY-NC-ND 4.0',
        language: 'en, zh-CN',
        categories: ['Web Technology'],
    });

    for (const item of list) {
        feed.item({
            title: item.title,
            date: item.publishedDate,
            description: item.abstract,
            url: `http://some-website.com/${item.slug}`,
        });
    }

    return new Response(feed.xml({ indent: true }), {
        headers: { 'Content-Type': 'application/xml' },
    });
}
