import type { CallToolResult } from "@modelcontextprotocol/server";
import type { ToolSchema } from "@/mcp/schemas";
import {
  createPostBodySchema,
  getPostByIdParamsSchema,
  getPostsQuerySchema,
} from "./schemas";

import {
  createPost,
  ExternalApiError,
  PostNotFoundError,
  getPostById,
  getPosts,
} from "./service";

/**
 * MCPクライアントが扱いやすいように、
 * textとstructuredContentの両方を返す。
 */
const createSuccessResult = (
  data: Record<string, unknown>,
): CallToolResult => ({
  content: [
    {
      type: "text",
      text: JSON.stringify(data, null, 2),
    },
  ],
  structuredContent: data,
});

/**
 * ツール実行時のエラーを安定したコードへ変換する。
 */
const createErrorResult = (code: string, message: string): CallToolResult => ({
  isError: true,
  content: [
    {
      type: "text",
      text: JSON.stringify({
        error: {
          code,
          message,
        },
      }),
    },
  ],
});

const handleToolError = (
  error: unknown,
  fallbackMessage: string,
): CallToolResult => {
  if (error instanceof PostNotFoundError) {
    return createErrorResult("POST_NOT_FOUND", error.message);
  }

  if (error instanceof ExternalApiError) {
    return createErrorResult("UPSTREAM_API_ERROR", error.message);
  }

  console.error("[Post MCP Tool Error]", error);

  return createErrorResult("INTERNAL_ERROR", fallbackMessage);
};

/**
 * 投稿一覧取得 / ユーザー別投稿絞り込みツール
 */
const getPostsTool: ToolSchema = {
  name: "get-posts",
  description:
    "投稿一覧を取得します。userIdを指定した場合はそのユーザーの投稿のみに絞り込みます。未指定時は全投稿を取得します。",
  inputSchema: getPostsQuerySchema,

  async handler(rawArguments) {
    const query = getPostsQuerySchema.parse(rawArguments);

    try {
      const posts = await getPosts(query);

      return createSuccessResult({
        posts,
        count: posts.length,
      });
    } catch (error) {
      return handleToolError(error, "投稿一覧の取得に失敗しました");
    }
  },
};

/**
 * IDによる投稿個別取得ツール
 */
const getPostByIdTool: ToolSchema = {
  name: "get-post-by-id",
  description:
    "1以上の整数の投稿IDを指定して、該当する投稿詳細情報を1件取得します。",
  inputSchema: getPostByIdParamsSchema,

  async handler(rawArguments) {
    const { id } = getPostByIdParamsSchema.parse(rawArguments);

    try {
      const post = await getPostById(id);

      return createSuccessResult({
        post,
      });
    } catch (error) {
      return handleToolError(error, "投稿情報の取得に失敗しました");
    }
  },
};

/**
 * 投稿作成ツール
 */
const createPostTool: ToolSchema = {
  name: "create-post",
  description: "ユーザーID、タイトル、本文を指定して新しい投稿を作成します。",
  inputSchema: createPostBodySchema,

  async handler(rawArguments) {
    const input = createPostBodySchema.parse(rawArguments);

    try {
      const post = await createPost(input);

      return createSuccessResult({
        post,
      });
    } catch (error) {
      return handleToolError(error, "投稿の作成に失敗しました");
    }
  },
};

export const postTools: ToolSchema[] = [
  getPostsTool,
  getPostByIdTool,
  createPostTool,
];
