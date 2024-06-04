import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

const POST_DIR_PATH = '/post';
const CATEGORY_DIR_STRUCTOR = `
|- intro.md(x)
|- sub
|- ...
`;
const POST_DIR_STRUCTOR = `
|- main.md(x)
|- ...
`;
const structor = `
----------------------------------------------------------
|- blog                             | dir  (as a category)
   |- intro.md(x)                   | file 
   |- sub                           | dir  (as a category)
      |- what-is-the-closure        | dir  (as a post)
         |- main.md(x)              | file 
      |- css                        | dir  (as a category)
         |- intro.md(x)             | file 
         |- sub                     | dir  (as a category)
            |- what-is-the-cascade  | dir  (as a post)
               |- main.md(x)        | file
----------------------------------------------------------
`;

type Post = {
    metadata: { title: string; abstract: string; publishedDate: string; [key: string]: string };
    path: string;
};
type Category = {
    metadata: { title: string; intro: ''; [key: string]: string };
    children: (Post | Category)[];
};

// TODO: React.cache is not a function.

const reqIntro = async (introPath: string) => {
    let content: string;
    let metadata: Category['metadata'];
    const rawContent = await readFile(introPath);

    try {
        const r = matter(rawContent);

        content = r.content;
        metadata = { title: '', intro: '', ...r.data };
    } catch (error) {
        throw (
            error + '\n' + `The address of the folder where the issue occurred is "${introPath}".`
        );
    }

    return { metadata, content };
};

const reqPost = async (postPath: string) => {
    let content: string;
    let metadata: Post['metadata'];
    const rawContent = await readFile(postPath);

    try {
        const r = matter(rawContent);

        content = r.content;
        metadata = { title: '', abstract: '', publishedDate: '', ...r.data };
    } catch (error) {
        throw error + '\n' + `The address of the folder where the issue occurred is "${postPath}".`;
    }

    return { metadata, content };
};

async function reqCategory() {
    const rootPath = POST_DIR_PATH;

    return await (async function recursivelyCall(dirPath: string) {
        const raw = await readDir(dirPath);
        let type: Awaited<ReturnType<typeof checkDirType>>;

        try {
            type = await checkDirType(raw);
        } catch (error) {
            throw (
                error + '\n' + `The address of the folder where the issue occurred is "${dirPath}".`
            );
        }

        // For main.md(x)
        if (type === 'post') {
            const mdFullname = raw.find(
                item => item.isFile() && item.name.includes('main.md'),
            )?.name!;
            const mainMdPath = dirPath + '/' + mdFullname;
            const { metadata } = await reqPost(mainMdPath);
            const post: Post = { path: mainMdPath, metadata };

            return post;
        }

        // For intro.md(x)
        const mdFullname = raw.find(item => item.isFile() && item.name.includes('intro.md'))?.name!;
        const introMdPath = dirPath + '/' + mdFullname;
        const { metadata } = await reqIntro(introMdPath);
        const category: Category = {
            metadata,
            children: await Promise.all(
                (await readDir(dirPath + '/sub'))
                    .filter(item => item.isDirectory())
                    .map(item => recursivelyCall(dirPath + '/sub/' + item.name)),
            ),
        };

        return category;
    })(rootPath);
}

function readDir(targetPath: string) {
    return fs.readdir(path.join(process.cwd(), targetPath), { withFileTypes: true });
}

function readFile(targetPath: string) {
    return fs.readFile(path.join(process.cwd(), targetPath), 'utf8');
}

async function checkDirType(v: string | Awaited<ReturnType<typeof readDir>>) {
    const rawDir = typeof v === 'string' ? await readDir(v) : v;

    //
    const hasSubDir = !!rawDir.find(item => {
        if (!item.isDirectory()) return;
        if (item.name !== 'sub') return;

        return true;
    });
    const hasIntroFile = !!rawDir.find(item => {
        if (!isMdFile(item.name)) return;
        if (path.basename(item.name, path.extname(item.name)) !== 'intro') return;

        return true;
    });
    const hasMainFile = !!rawDir.find(item => {
        if (!isMdFile(item.name)) return;
        if (path.basename(item.name, path.extname(item.name)) !== 'main') return;

        return true;
    });

    //
    if (hasSubDir !== hasIntroFile || hasMainFile === hasSubDir || hasMainFile === hasIntroFile) {
        throw `
The folder structure does not meet the requirements.

If this folder is intended to be used as a category for a post, it must follow the following format:
${CATEGORY_DIR_STRUCTOR}

If this folder is intended to be used as a container for a post, it must follow the following format:
${POST_DIR_STRUCTOR}
`;
    }

    return hasMainFile ? 'post' : 'category';

    function isMdFile(fullname: string) {
        const extname = path.extname(fullname);

        return ['.md', '.mdx'].includes(extname);
    }
}

export { reqCategory, reqPost };
export default { reqCategory, reqPost };
