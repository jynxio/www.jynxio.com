import './_css/index.scss';

import type { ReactNode } from 'react';

import { Scroll } from '@/comps/scroll';
import { Banner } from './_comps/banner';
import { GoogleAnalytics } from './_comps/google-analytics';
import { Nav } from './_comps/nav';
import { createMetadata } from './_helpers/create-metadata';
import css from './layout.module.css';

const metadata = createMetadata();

function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css2?family=LXGW+WenKai+Mono+TC&family=LXGW+WenKai+TC&family=Noto+Color+Emoji&display=swap"
                />
            </head>

            <body className={css.container}>
                <Nav />
                <Banner />

                <Scroll className={css.wrapper}>
                    <div className={css.gap}>{children}</div>
                </Scroll>

                {process.env.NODE_ENV === 'production' && <GoogleAnalytics />}
            </body>
        </html>
    );
}

export { metadata };
export default RootLayout;
