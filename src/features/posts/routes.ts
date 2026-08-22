import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { getPostsQuerySchema, getPostByIdParamsSchema } from "./schemas";
import {
  getPosts,
  getPostById,
  PostNotFoundError,
  ExternalApiError,
} from "./service";

const postRoutes = new Hono();

// =================================================================
// 投稿一覧取得 / 指定ユーザーの投稿一覧取得
// =================================================================
postRoutes.get(
  "/",
  zValidator("query", getPostsQuerySchema, (result, c) => {
    if (!result.success) {
      return c.json(
        {
          success: false,
          message: "検索パラメータが不正です",
          errors: result.error.issues,
        },
        400,
      );
    }
  }),
  async (c) => {
    const query = c.req.valid("query");

    try {
      const posts = await getPosts(query);
      return c.json({ success: true, data: posts }, 200);
    } catch (error) {
      console.error("[GET /posts Error]:", error);

      if (error instanceof ExternalApiError) {
        return c.json({ success: false, message: error.message }, 502);
      }
      return c.json(
        { success: false, message: "予期せぬエラーが発生しました" },
        500,
      );
    }
  },
);

// =================================================================
// 指定の投稿取得
// =================================================================
postRoutes.get(
  "/:id",
  zValidator("param", getPostByIdParamsSchema, (result, c) => {
    if (!result.success) {
      return c.json(
        {
          success: false,
          message: "投稿IDが不正です",
          errors: result.error.issues,
        },
        400,
      );
    }
  }),
  async (c) => {
    const { id } = c.req.valid("param");

    try {
      const post = await getPostById(id);
      return c.json({ success: true, data: post }, 200);
    } catch (error) {
      console.error(`[GET /posts/${id} Error]:`, error);

      if (error instanceof PostNotFoundError) {
        return c.json({ success: false, message: error.message }, 404);
      }
      if (error instanceof ExternalApiError) {
        return c.json({ success: false, message: error.message }, 502);
      }
      return c.json(
        { success: false, message: "予期せぬエラーが発生しました" },
        500,
      );
    }
  },
);

export default postRoutes;