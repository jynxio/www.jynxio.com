import './reset.css';
import './color.css';
import './index.css';

import type { Metadata } from 'next';

import React from 'react';
import { baseUrl } from './sitemap';

export const metadata: Metadata = {
    metadataBase: new URL(baseUrl),
    title: {
        default: 'Jynxio',
        template: '%s | Jynxio',
    },
    description: "Jynxio's personal website.",
    keywords: 'Jynxio, personal website, portfolio, technology',
    alternates: {
        canonical: new URL(baseUrl).toString(),
    },
    openGraph: {
        title: 'Jynxio',
        description: "Jynxio's personal website.",
        url: baseUrl,
        siteName: 'Jynxio',
        locale: 'zh-cmn-Hans',
        type: 'website',
        images: [
            {
                url: 'https://example.com/image.jpg', // FIXME: 替换为实际的图片 URL
                width: 1200,
                height: 630,
                alt: 'Jynxio',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        site: '@Jynxio',
        title: 'Jynxio',
        description: "Jynxio's personal website.",
        images: 'https://example.com/image.jpg', // FIXME: 替换为实际的图片 URL
    },
    robots: {
        index: true,
        follow: true,
        noarchive: true,
        googleBot: {
            'index': true,
            'follow': true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'noarchive': true,
        },
    },
};

function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="zh-cmn-Hans">
            <body id="root">{children}</body>
        </html>
    );
}

export default RootLayout;
