import { payload } from './payload';
import { Schema } from './schema';

async function reqDiscussion() {
    const token = process.env.GITHUB_DISCUSSIONS!;
    const res = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        body: JSON.stringify({ query: payload }),
        headers: {
            'Authorization': `bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    const { data } = Schema.parse(await res.json());

    return data.repository.discussion.comments.nodes.map(item => ({
        content: item.body,
        reply: item.replies,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
    }));
}

export { reqDiscussion };
