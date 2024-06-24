import type { Metadata } from "next";

import path from "node:path";
import { BASE_URL } from "@/constant/sitemap";

function createMetadata(): Metadata {
    return {
        // Static info
        publisher: "Jynxio",
        generator: "Next.js",
        authors: [{ name: "Jynxio", url: "https://github.com/jynxio" }],
        applicationName: "Jynxio's Website",
        metadataBase: new URL(BASE_URL),
        keywords: "personal website, portfolio, technology",
        alternates: { canonical: new URL(BASE_URL).toString() },

        // Dynamic info
        title: { default: "Jynxio", template: "%s | Jynxio" },
        description: "Jynxio's Website",
        openGraph: {
            determiner: "",
            title: "Jynxio",
            description: "Jynxio's Website",
            emails: "jinxiaomatrix@gmail.com",
            url: BASE_URL,
            siteName: "Jynxio's Website",
            locale: "en_US",
            alternateLocale: ["zh_CN"],
            type: "website",
            images: {
                url: "./opengraph-image.png",
                alt: "Jynxio's Website",
                secureUrl: path.join(BASE_URL, "/opengraph-image.png"),
                type: "image/png",
                width: 1200,
                height: 675,
            },
        },
        twitter: {
            site: "Jynxio",
            siteId: "@jyn_xio",
            creator: "Jynxio",
            creatorId: "@jyn_xio",
            description: "Jynxio's Website",
            title: "Jynxio's Website",
            images: {
                url: "./opengraph-image.png",
                alt: "Jynxio's Website",
                secureUrl: path.join(BASE_URL, "/opengraph-image.png"),
                type: "image/png",
                width: 1200,
                height: 675,
            },
        },
    };
}

export { createMetadata };
export default createMetadata;
