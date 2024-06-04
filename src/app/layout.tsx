import './reset.css';
import './variable.css';
import './index.css';
import css from './layout.module.css';

import React from 'react';
import Header from '@/component/header';
import { baseUrl } from './sitemap';
import type { Metadata } from 'next';

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
            <body>
                <div id="root" className={css.container}>
                    <header className={css.header}>
                        <Header />
                    </header>

                    <main className={css.main}>{children}</main>
                </div>
            </body>
        </html>
    );
}

export default RootLayout;
