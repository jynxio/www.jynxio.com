import './reset.css';
import './index.css';
import React from 'react';

export const metadata = {
    title: "Jynxio's Blog",
    description: '',
};

function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="zh-cmn-Hans">
            <body>{children}</body>
        </html>
    );
}

export default RootLayout;
