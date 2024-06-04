import { reqPost } from '@/util/post';
import { MDXRemote } from 'next-mdx-remote/rsc';

export default async function ({ params }) {
    // TODO:
    const { metadata, content } = await reqPost('/post/sub/javascript/sub/react-handbook/main.md');

    return (
        <article>
            <MDXRemote source={content} />
        </article>
    );
}
