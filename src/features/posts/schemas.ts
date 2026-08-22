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

// 型抽出
export type Post = z.infer<typeof postSchema>;

// =================================================================
// 2. ユースケース 1 & 2: 投稿一覧取得 / 指定ユーザーの投稿一覧取得 (GET /posts)
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
// 3. ユースケース 3: 指定の投稿取得 (GET /posts/:id)
// =================================================================
export const getPostByIdParamsSchema = z.object({
  id: z.coerce.number().int().positive().describe("取得対象の投稿ID"),
});

export const getPostByIdResponseSchema = postSchema;

export type GetPostByIdParams = z.infer<typeof getPostByIdParamsSchema>;
export type GetPostByIdResponse = z.infer<typeof getPostByIdResponseSchema>;
