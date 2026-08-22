import { z } from "zod";

// =================================================================
// 1. コアエンティティスキーマ
// =================================================================
export const postSchema = z.object({
  id: z.number().int().positive(),
  userId: z.number().int().positive(),
  title: z.string(),
  body: z.string(),
});

export const postsSchema = z.array(postSchema);

export type Post = z.infer<typeof postSchema>;

// =================================================================
// 2. ユースケース 1 & 2: 投稿一覧取得 / 指定ユーザーの投稿一覧取得
// =================================================================
export const getPostsQuerySchema = z.object({
  userId: z.coerce
    .number()
    .int()
    .positive()
    .optional()
    .describe("指定したユーザーIDの投稿のみを取得する"),
  _limit: z.coerce
    .number()
    .int()
    .positive()
    .max(100)
    .optional()
    .describe("取得する最大件数 (JSONPlaceholder仕様)"),
});

export const getPostsResponseSchema = postsSchema;

export type GetPostsQuery = z.infer<typeof getPostsQuerySchema>;
export type GetPostsResponse = z.infer<typeof getPostsResponseSchema>;

// =================================================================
// 3. ユースケース 3: 指定の投稿取得
// =================================================================
export const getPostByIdParamsSchema = z.object({
  id: z.coerce.number().int().positive().describe("取得対象の投稿ID"),
});

export const getPostByIdResponseSchema = postSchema;

export type GetPostByIdParams = z.infer<typeof getPostByIdParamsSchema>;
export type GetPostByIdResponse = z.infer<typeof getPostByIdResponseSchema>;

// =================================================================
// 4. ユースケース 4: 投稿作成
// =================================================================
export const createPostBodySchema = postSchema.omit({
  id: true,
});

export const createPostResponseSchema = postSchema;

export type CreatePostBody = z.infer<typeof createPostBodySchema>;
export type CreatePostResponse = z.infer<typeof createPostResponseSchema>;
