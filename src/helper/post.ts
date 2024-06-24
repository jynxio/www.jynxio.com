import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { POST_DIR_PATH } from "@/constant/post";

type Post = {
    slug: string;
    date: string;
    hero: string;
    title: string;
    content: string;
    abstract: string;
    tags: string[];
};
type Item = Omit<Post, "content">;
type List = Item[];

async function reqList(): Promise<List> {
    const dir = await readDir(POST_DIR_PATH);
    const filteredDir = dir.filter((item) => item.isDirectory());
    const promises = filteredDir.map(async (item) => {
        const slug = item.name;
        const mdPath = path.join(POST_DIR_PATH, slug, "index.md");
        const rawMdContent = await readFile(mdPath);
        const { data: metadata } = matter(rawMdContent);
        const listItem: Item = {
            slug,
            hero: metadata.hero,
            date: metadata.date,
            title: metadata.title,
            abstract: metadata.abstract,
            tags: metadata.tags.split(",").map((item: string) => item.trim()),
        };

        return listItem;
    });

    return await Promise.all(promises);
}

async function reqPost(slug: string): Promise<Post> {
    const rawMdContent = await readFile(path.join(POST_DIR_PATH, slug, "index.md"));
    const { data: metadata, content } = matter(rawMdContent);
    const post: Post = {
        slug,
        content,
        hero: metadata.hero,
        date: metadata.date,
        title: metadata.title,
        abstract: metadata.abstract,
        tags: metadata.tags.split(",").map((item: string) => item.trim()),
    };

    return post;
}

function readDir(targetPath: string) {
    return fs.readdir(path.join(process.cwd(), targetPath), { withFileTypes: true });
}

function readFile(targetPath: string) {
    return fs.readFile(path.join(process.cwd(), targetPath), "utf8");
}

export { reqList, reqPost };
export default { reqList, reqPost };
