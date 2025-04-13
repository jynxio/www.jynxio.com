import { APP_URL } from '@/consts';
import type { MetadataRoute } from 'next';

const dynamic = 'force-static';
function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
            },
        ],
        sitemap: new URL('sitemap.xml', APP_URL).toString(),
    };
}

export { dynamic };
export default robots;
