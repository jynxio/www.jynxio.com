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
import ScrollbarWrapper from "@/layout/scrollbar-wrapper";
import { GoogleAnalytics } from "./GoogleAnalytics";

const metadata = createMetadata();

// TODO: Need compile
const syncThemeScriptHtml = `
(function iife() {
    const LOCALSTORAGE_KEY = "theme";
    const theme = getTheme();
    const root = document.documentElement;

    root.dataset.theme = theme;

    function getTheme() {
        // Storage
        const themeFromLocalStorage = globalThis.localStorage.getItem(LOCALSTORAGE_KEY);

        if (themeFromLocalStorage) return themeFromLocalStorage;
        if (checkPrefersColorSchemeSupport()) {
            globalThis.localStorage.setItem(LOCALSTORAGE_KEY, "auto");
            return "auto";
        }

        globalThis.localStorage.setItem(LOCALSTORAGE_KEY, "dark");
        return "dark";
    }

    function checkPrefersColorSchemeSupport() {
        return (
            globalThis.matchMedia("(prefers-color-scheme: light)").matches ||
            globalThis.matchMedia("(prefers-color-scheme: dark)").matches
        );
    }
})();
`.trim();

function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={css.font} suppressHydrationWarning>
            <head>
                {/* biome-ignore lint/security/noDangerouslySetInnerHtml: This happens on the server side, so it is secure. */}
                <script dangerouslySetInnerHTML={{ __html: syncThemeScriptHtml }} />
            </head>
            <body className={css.container}>
                <ScrollbarWrapper className={css.wrapper}>
                    <div className={css.content}>
                        <section className={css.nav}>
                            <Nav />
                        </section>
                        <section className={css.main}>{children}</section>
                    </div>
                </ScrollbarWrapper>

                {process.env.NODE_ENV === "production" && <GoogleAnalytics />}
            </body>
        </html>
    );
}

export { metadata };
export default RootLayout;
