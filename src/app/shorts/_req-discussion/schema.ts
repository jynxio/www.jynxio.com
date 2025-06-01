import { z } from 'zod/v4';

const Schema = z.object({
    data: z.object({
        repository: z.object({
            discussion: z.object({
                comments: z.object({
                    totalCount: z.number().int(),
                    pageInfo: z.object({
                        hasNextPage: z.boolean(),
                        endCursor: z.string().nullable(),
                    }),
                    nodes: z.array(
                        z.object({
                            body: z.string(),
                            createdAt: z.iso.datetime(),
                            updatedAt: z.iso.datetime(),
                            replies: z.object({
                                totalCount: z.number().int(),
                                pageInfo: z.object({
                                    hasNextPage: z.boolean(),
                                    endCursor: z.string().nullable(),
                                }),
                                nodes: z.array(
                                    z.object({
                                        body: z.string(),
                                        createdAt: z.iso.datetime(),
                                        updatedAt: z.iso.datetime(),
                                    }),
                                ),
                            }),
                        }),
                    ),
                }),
            }),
        }),
    }),
});

export { Schema };
