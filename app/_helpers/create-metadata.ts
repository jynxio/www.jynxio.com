import type { Metadata } from 'next';

import { APP_URL } from '@/_consts';

function createMetadata(): Metadata {
    const ogImgUrl =
        process.env.NODE_ENV === 'production' ? new URL('og-img.png', APP_URL) : '/og-img.png';
    const obTitle = "Hi, I'm Jynxio/金秀";
    const ogDes = 'This is a personal website that stores my posts and ideas.';
    const ogImages = {
        url: ogImgUrl,
        secureUrl: new URL('og-img.png', APP_URL),

        width: 1200,
        height: 675,

        type: 'image/png',
        alt: 'open graph for the homepage',
    };

    return {
        // Static info
        publisher: 'Jynxio',
        generator: 'Next.js',
        authors: [{ name: 'Jynxio', url: 'https://github.com/jynxio' }],
        applicationName: "Jynxio's Website",
        metadataBase: new URL(APP_URL),
        keywords: 'webdev, blog, profile',
        alternates: { canonical: APP_URL },

        // Dynamic info
        title: { default: 'Jynxio', template: '%s | Jynxio' },
        description: "Jynxio's Website",
        openGraph: {
            title: obTitle,
            determiner: '',
            description: ogDes,
            emails: 'jinxiaomatrix@gmail.com',
            url: ogImgUrl,
            siteName: ' ',
            locale: 'en_US',
            alternateLocale: ['zh_CN'],
            type: 'website',
            images: ogImages,
        },
        twitter: {
            title: obTitle,
            description: ogDes,
            images: ogImages,
            site: 'Jynxio',
            siteId: '@jyn_xio',
            creator: 'Jynxio',
            creatorId: '@jyn_xio',
        },
    };
}

export { createMetadata };
