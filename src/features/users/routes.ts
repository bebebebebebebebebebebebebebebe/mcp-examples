import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { getUsersQuerySchema, getUserByIdParamsSchema } from "./schemas";
import {
  getUsers,
  getUserById,
  UserNotFoundError,
  ExternalApiError,
} from "./service";

const userRoutes = new Hono();

// =================================================================
// ユースケース 1: ユーザー一覧取得 / 絞り込み検索 (GET /)
// =================================================================
userRoutes.get(
  "/",
  zValidator("query", getUsersQuerySchema, (result, c) => {
    if (!result.success) {
      return c.json(
        {
          success: false,
          message: "クエリパラメータの形式が正しくありません",
          errors: result.error.issues,
        },
        400,
      );
    }
  }),
  async (c) => {
    const query = c.req.valid("query");

    try {
      // サービス層の関数を呼び出すだけ
      const users = await getUsers(query);

      return c.json(
        {
          success: true,
          data: users,
        },
        200,
      );
    } catch (error) {
      console.error("[GET /users Error]:", error);

      if (error instanceof ExternalApiError) {
        return c.json({ success: false, message: error.message }, 502); // 502 Bad Gateway
      }

      return c.json(
        { success: false, message: "ユーザー一覧の取得に失敗しました" },
        500,
      );
    }
  },
);

// =================================================================
// ユースケース 2: 特定ユーザーの個別取得 (GET /:id)
// =================================================================
userRoutes.get(
  "/:id",
  zValidator("param", getUserByIdParamsSchema, (result, c) => {
    if (!result.success) {
      return c.json(
        {
          success: false,
          message:
            "ユーザーIDの指定が正しくありません（1以上の整数を指定してください）",
          errors: result.error.issues,
        },
        400,
      );
    }
  }),
  async (c) => {
    const { id } = c.req.valid("param");

    try {
      // サービス層の関数を呼び出すだけ
      const user = await getUserById(id);

      return c.json(
        {
          success: true,
          data: user,
        },
        200,
      );
    } catch (error) {
      console.error(`[GET /users/${id} Error]:`, error);

      // ユーザーが見つからなかった場合
      if (error instanceof UserNotFoundError) {
        return c.json({ success: false, message: error.message }, 404);
      }

      // 外部API起因のエラーの場合
      if (error instanceof ExternalApiError) {
        return c.json({ success: false, message: error.message }, 502);
      }

      return c.json(
        { success: false, message: "ユーザー情報の取得に失敗しました" },
        500,
      );
    }
  },
);

export default userRoutes;