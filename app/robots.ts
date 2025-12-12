import { APP_URL } from '@/_consts';
import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

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

export default robots;
