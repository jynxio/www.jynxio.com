import { reqList } from "@/helper/post";
import { BASE_URL } from "@/constant/sitemap";

export default async function sitemap() {
    const list = await reqList();
    const blogs = list.map((item) => ({
        url: `${BASE_URL}/blog/${item.slug}`,
        lastModified: new Date(item.date).toISOString().split("T")[0],
    }));

    const routes = ["", "/blog"].map((route) => ({
        url: `${BASE_URL}${route}`,
        lastModified: new Date().toISOString().split("T")[0],
    }));

    return [...routes, ...blogs];
}
