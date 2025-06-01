/**
 * @see https://docs.github.com/en/graphql/guides/using-the-graphql-api-for-discussions
 */
const payload = `
query {
    repository(owner: "jynxio", name: "www.jynxio.com") {
        discussion(number: 5) {
            comments(first: 100) {
                totalCount
                pageInfo {
                    endCursor
                    hasNextPage
                }
                nodes {
                    body
                    createdAt
                    updatedAt
                    replies(first: 100) {
                        totalCount
                        pageInfo {
                            endCursor
                            hasNextPage
                        }
                        nodes {
                            body
                            createdAt
                            updatedAt
                        }
                    }
                }
            }
        }
    }
}`.trim();

export { payload };
