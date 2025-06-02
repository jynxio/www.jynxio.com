import './_css/index.scss';

import type { ReactNode } from 'react';
import { Banner } from './_comps/banner';
import { createMetadata } from './_helpers/create-metadata';
import css from './layout.module.css';

const metadata = createMetadata();

function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            </head>

            <body className={css.container}>
                <Banner />
                {children}
            </body>
        </html>
    );
}

export { metadata };
export default RootLayout;
