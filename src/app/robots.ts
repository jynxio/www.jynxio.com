import { APP_URL } from "@/constant";
import type { MetadataRoute } from "next";

export const dynamic = "force-static";
export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
            },
        ],
        sitemap: new URL("sitemap.xml", APP_URL).toString(),
    };
}
