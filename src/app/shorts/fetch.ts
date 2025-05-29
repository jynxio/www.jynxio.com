import { z } from 'zod/v4';

const DiscussionSchema = z.object({
    data: z.object({
        repository: z.object({
            discussion: z.object({
                comments: z.object({
                    totalCount: z.number().int(),
                    nodes: z.array(
                        z.object({
                            body: z.string(),
                            createdAt: z.string().datetime(),
                        }),
                    ),
                    pageInfo: z.object({
                        hasNextPage: z.boolean(),
                        endCursor: z.string().nullable(),
                    }),
                }),
            }),
        }),
    }),
});

function validateDiscussion(i: unknown) {
    return DiscussionSchema.safeParse(i);
}

async function getRawDiscussion() {
    const token = process.env.GITHUB_DISCUSSIONS!;
    const query = `
    query {
      repository(owner: "jynxio", name: "www.jynxio.com") {
        discussion(number: 5) {
          comments(first: 100) {
            totalCount
            nodes {
              body
              createdAt
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      }
    }`.trim();
    const response = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        body: JSON.stringify({ query }),
        headers: {
            'Authorization': `bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    const data = await response.json();

    return validateDiscussion(data);
}

async function getDiscussion() {
    const rawData = await getRawDiscussion();

    if (!rawData.success) return [];

    return rawData.data.data.repository.discussion.comments.nodes.map(item => ({
        content: item.body,
        createdAt: item.createdAt,
    }));
}

export { getDiscussion };
