import {
  Client,
  StreamableHTTPClientTransport,
} from "@modelcontextprotocol/client";

export interface CreateMcpClientOptions {
  baseUrl: string;
  name: string;
  version?: string;
  capabilities?: {
    roots?: Record<string, unknown>;
    sampling?: Record<string, unknown>;
  };
}

/**
 * Streamable HTTP 経由で MCP クライアントを初期化・接続します。
 */
export const initMcpClient = async ({
  baseUrl,
  name,
  version = "1.0.0",
  capabilities = {},
}: CreateMcpClientOptions): Promise<Client> => {
  // 1. Streamable HTTP トランスポートのインスタンス化
  const transport = new StreamableHTTPClientTransport(new URL(baseUrl));

  // 2. Client の生成（capabilities を明示）
  const client = new Client({ name, version }, { capabilities });

  // 3. 接続開始
  await client.connect(transport);
  return client;
};

const main = async () => {
  console.log("MCP client module loaded.");
  const baseUrl = process.env.MCP_SERVER_URL || "http://localhost:4173";
  const name = process.env.MCP_CLIENT_NAME || "users-mcp-client";
  const version = process.env.MCP_CLIENT_VERSION || "1.0.0";
  const client = await initMcpClient({ baseUrl: `${baseUrl}/mcp`, name, version });
  const response = await client.callTool({
    name: "get-user-by-id",
    arguments: {
      id: 1,
    },
  });
  console.log("Tool response:", JSON.stringify(response, null, 2));
  const toolResults = response.structuredContent;
  console.log("Structured content:", JSON.stringify(toolResults, null, 2));
}

main().catch((err) => {
  console.error("Error initializing MCP client:", err);
  process.exit(1);
});
