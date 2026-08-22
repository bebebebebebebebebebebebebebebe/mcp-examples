import {
  getPostsResponseSchema,
  getPostByIdResponseSchema,
  type GetPostsQuery,
  type GetPostsResponse,
  type GetPostByIdResponse,
} from "./schemas";

const BASE_URL = "https://jsonplaceholder.typicode.com/posts";

// エラークラスの定義
export class PostNotFoundError extends Error {
  constructor(id: number) {
    super(`ID: ${id} の投稿は見つかりませんでした`);
    this.name = "PostNotFoundError";
  }
}

export class ExternalApiError extends Error {
  constructor(status: number, message = "外部API通信エラー") {
    super(`${message}: HTTP ${status}`);
    this.name = "ExternalApiError";
  }
}

/**
 * 投稿一覧取得 (全件または userId による絞り込み)
 */
export async function getPosts(
  query?: GetPostsQuery,
): Promise<GetPostsResponse> {
  const targetUrl = new URL(BASE_URL);

  if (query?.userId)
    targetUrl.searchParams.set("userId", query.userId.toString());
  if (query?._limit)
    targetUrl.searchParams.set("_limit", query._limit.toString());

  const response = await fetch(targetUrl.toString());

  if (!response.ok) {
    throw new ExternalApiError(response.status, "投稿一覧の取得に失敗しました");
  }

  const rawData = await response.json();
  return getPostsResponseSchema.parse(rawData);
}

/**
 * 指定の投稿取得
 */
export async function getPostById(id: number): Promise<GetPostByIdResponse> {
  const response = await fetch(`${BASE_URL}/${id}`);

  if (response.status === 404) {
    throw new PostNotFoundError(id);
  }
  if (!response.ok) {
    throw new ExternalApiError(response.status, "投稿詳細の取得に失敗しました");
  }

  const rawData = await response.json();
  return getPostByIdResponseSchema.parse(rawData);
}
