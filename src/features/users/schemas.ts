import { z } from "zod";

export const geoLocationSchema = z.object({
  lat: z.string(),
  lng: z.string(),
});

export const addressSchema = z.object({
  street: z.string(),
  suite: z.string(),
  city: z.string(),
  zipcode: z.string(),
  geo: geoLocationSchema,
});

export const companySchema = z.object({
  name: z.string(),
  catchPhrase: z.string(),
  bs: z.string(),
});

export const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  username: z.string(),
  email: z.email(), // メールアドレス形式の検証
  address: addressSchema,
  phone: z.string(),
  website: z.string(),
  company: companySchema,
});

export const usersSchema = z.array(userSchema);

// スキーマからTypeScriptの型を自動抽出
export type User = z.infer<typeof userSchema>;
export type Address = z.infer<typeof addressSchema>;
export type Company = z.infer<typeof companySchema>;
export type GeoLocation = z.infer<typeof geoLocationSchema>;


// =================================================================
// ユースケース 1: ユーザー一覧取得 / 絞り込み検索 (GET /users)
// =================================================================

/**
 * ユーザー一覧取得時の検索クエリパラメータ用スキーマ
 * すべて任意項目（未指定の場合は全件取得）
 */
export const getUsersQuerySchema = z.object({
  username: z
    .string()
    .optional()
    .describe('ユーザー名による完全一致検索（例: "Bret"）'),
  email: z.email().optional().describe("メールアドレスによる検索"),
  name: z.string().optional().describe("氏名による検索"),
  id: z.coerce
    .number()
    .int()
    .positive()
    .optional()
    .describe("ユーザーIDによる検索"),
});

/** 一覧取得のレスポンススキーマ（配列） */
export const getUsersResponseSchema = usersSchema;

// =================================================================
// ユースケース 2: 特定ユーザーの個別取得 (GET /users/:id)
// =================================================================

/**
 * URLパスパラメータ（:id）用スキーマ
 * URL経由の文字列 "1" を数値 1 に安全に変換（coerce）する
 */
export const getUserByIdParamsSchema = z.object({
  id: z.coerce
    .number()
    .int()
    .positive()
    .describe("取得対象のユーザーID（1以上の整数）"),
});

/** 単一ユーザー取得のレスポンススキーマ */
export const getUserByIdResponseSchema = userSchema;

// =================================================================
// 型の抽出 (z.infer)
// =================================================================
export type GetUsersQuery = z.infer<typeof getUsersQuerySchema>;
export type GetUsersResponse = z.infer<typeof getUsersResponseSchema>;

export type GetUserByIdParams = z.infer<typeof getUserByIdParamsSchema>;
export type GetUserByIdResponse = z.infer<typeof getUserByIdResponseSchema>;