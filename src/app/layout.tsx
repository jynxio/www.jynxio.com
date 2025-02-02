import './_css/index.css';

import Scroll from '@/layout/scroll';
import type React from 'react';
import { GoogleAnalytics } from './_comp/google-analytics';
import createMetadata from './_helper/create-metadata';
import css from './layout.module.css';

const metadata = createMetadata();

function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <body className={css.container}>
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
