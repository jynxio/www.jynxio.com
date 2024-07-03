import "./reset.css";
import "./variable.css";
import "./index.css";
import "@/asset/temporary/LXGWWenKai-Bold/index.css";
import "@/asset/temporary/LXGWWenKai-Light/index.css";
import "@/asset/temporary/LXGWWenKai-Regular/index.css";
import "@/asset/temporary/LXGWWenKaiMono-Bold/index.css";
import "@/asset/temporary/LXGWWenKaiMono-Light/index.css";
import "@/asset/temporary/LXGWWenKaiMono-Regular/index.css";

import type React from "react";

import css from "./layout.module.css";
import createMetadata from "./createMetadata";
import Nav from "@/layout/nav";
import Copyright from "@/layout/copyright";
import { GoogleAnalytics } from "./GoogleAnalytics";

const metadata = createMetadata();

function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={css.font}>
            <body>
                <div className={css.container}>
                    <Nav />
                    <Copyright />
                    {children}
                </div>

                {process.env.NODE_ENV === "production" && <GoogleAnalytics />}
            </body>
        </html>
    );
}

export { metadata };
export default RootLayout;
