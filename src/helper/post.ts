import { POST_PATH } from '@/constant';
import matter from 'gray-matter';
import fs from 'node:fs/promises';
import path from 'node:path';

type Post = {
    slug: string;
    updatedDate: string;
    publishedDate: string;
    hero: string;
    title: string;
    content: string;
    abstract: string;
    tags: string[];
};
type Item = Omit<Post, 'content'>;
type List = Item[];

async function reqList(): Promise<List> {
    const dir = await readDir(POST_PATH);
    const filteredDir = dir.filter(item => item.isDirectory());
    const promises = filteredDir.map(async item => {
        const slug = item.name;
        const mdPath = path.join(POST_PATH, slug, 'index.md');
        const rawMdContent = await readFile(mdPath);
        const { data: metadata } = matter(rawMdContent);
        const listItem: Item = {
            slug,
            tags: metadata.tags,
            hero: metadata.hero,
            updatedDate: metadata.updatedDate,
            publishedDate: metadata.publishedDate,
            title: metadata.title,
            abstract: metadata.abstract,
        };

        return listItem;
    });

    return await Promise.all(promises);
}

async function reqPost(slug: string): Promise<Post> {
    const rawMdContent = await readFile(path.join(POST_PATH, slug, 'index.md'));
    const { data: metadata, content } = matter(rawMdContent);
    const post: Post = {
        slug,
        content,
        tags: metadata.tags,
        hero: metadata.hero,
        updatedDate: metadata.updatedDate,
        publishedDate: metadata.publishedDate,
        title: metadata.title,
        abstract: metadata.abstract,
    };

    return post;
}

function readDir(targetPath: string) {
    return fs.readdir(path.join(process.cwd(), targetPath), { withFileTypes: true });
}

function readFile(targetPath: string) {
    return fs.readFile(path.join(process.cwd(), targetPath), 'utf8');
}

export { readDir, readFile, reqList, reqPost };
export default { reqList, reqPost, readFile, readDir };
