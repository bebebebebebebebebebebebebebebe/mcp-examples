import {
  getUsersResponseSchema,
  getUserByIdResponseSchema,
  type GetUsersQuery,
  type GetUsersResponse,
  type GetUserByIdResponse,
} from "./schemas";

const BASE_URL = "https://jsonplaceholder.typicode.com/users";

/**
 * サービス層独自のエラークラス
 * （404 Not Found など、特定のエラーを識別しやすくするために使用）
 */
export class UserNotFoundError extends Error {
  constructor(id: number) {
    super(`ID: ${id} のユーザーは見つかりませんでした`);
    this.name = "UserNotFoundError";
  }
}

export class ExternalApiError extends Error {
  constructor(status: number) {
    super(`外部APIとの通信でエラーが発生しました: HTTP ${status}`);
    this.name = "ExternalApiError";
  }
}

/**
 * ユーザー一覧を取得（クエリによる絞り込み対応）するユースケース
 */
export async function getUsers(
  query?: GetUsersQuery,
): Promise<GetUsersResponse> {
  const targetUrl = new URL(BASE_URL);

  // 指定されたクエリパラメータをセット
  if (query?.username) targetUrl.searchParams.set("username", query.username);
  if (query?.email) targetUrl.searchParams.set("email", query.email);
  if (query?.name) targetUrl.searchParams.set("name", query.name);
  if (query?.id) targetUrl.searchParams.set("id", query.id.toString());

  const response = await fetch(targetUrl.toString());

  if (!response.ok) {
    throw new ExternalApiError(response.status);
  }

  const rawData = await response.json();

  // 取得したデータ構造をZodスキーマで検証して返却
  return getUsersResponseSchema.parse(rawData);
}

/**
 * IDを指定して単一のユーザーを取得するユースケース
 */
export async function getUserById(id: number): Promise<GetUserByIdResponse> {
  const response = await fetch(`${BASE_URL}/${id}`);

  // ユーザーが存在しない場合
  if (response.status === 404) {
    throw new UserNotFoundError(id);
  }

  if (!response.ok) {
    throw new ExternalApiError(response.status);
  }

  const rawData = await response.json();

  // 単一ユーザースキーマで検証して返却
  return getUserByIdResponseSchema.parse(rawData);
}
