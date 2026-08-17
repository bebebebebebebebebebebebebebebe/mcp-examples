import type { CallToolResult } from "@modelcontextprotocol/server";
import type { ToolSchema } from "@/mcp/schemas";
import { getUserByIdParamsSchema, getUsersQuerySchema } from "./schemas";
import {
  ExternalApiError,
  UserNotFoundError,
  getUserById,
  getUsers,
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
 * stack traceなどの内部情報はクライアントへ返さない。
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
  if (error instanceof UserNotFoundError) {
    return createErrorResult("USER_NOT_FOUND", error.message);
  }

  if (error instanceof ExternalApiError) {
    return createErrorResult("UPSTREAM_API_ERROR", error.message);
  }

  console.error("[User MCP Tool Error]", error);

  return createErrorResult("INTERNAL_ERROR", fallbackMessage);
};

/**
 * ユーザー一覧取得ツール
 */
const getUsersTool: ToolSchema = {
  name: "get-users",
  description:
    "ユーザー一覧を取得します。username、email、name、idによる絞り込みが可能です。条件を指定しない場合は全ユーザーを返します。",
  inputSchema: getUsersQuerySchema,

  async handler(rawArguments) {
    /*
     * ToolSchemaの現在の型定義では具体的なスキーマ型が失われるため、
     * parseによって引数型を復元する。
     *
     * MCP SDKでも入力検証されるため、実質的には防御的な処理。
     */
    const query = getUsersQuerySchema.parse(rawArguments);

    try {
      const users = await getUsers(query);

      return createSuccessResult({
        users,
        count: users.length,
      });
    } catch (error) {
      return handleToolError(error, "ユーザー一覧の取得に失敗しました");
    }
  },
};

/**
 * IDによるユーザー個別取得ツール
 */
const getUserByIdTool: ToolSchema = {
  name: "get-user-by-id",
  description:
    "1以上の整数のユーザーIDを指定して、該当するユーザー情報を1件取得します。",
  inputSchema: getUserByIdParamsSchema,

  async handler(rawArguments) {
    const { id } = getUserByIdParamsSchema.parse(rawArguments);

    try {
      const user = await getUserById(id);

      return createSuccessResult({
        user,
      });
    } catch (error) {
      return handleToolError(error, "ユーザー情報の取得に失敗しました");
    }
  },
};

export const userTools: ToolSchema[] = [getUsersTool, getUserByIdTool];
