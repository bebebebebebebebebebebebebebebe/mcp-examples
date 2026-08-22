import {
  Client,
  StreamableHTTPClientTransport,
} from "@modelcontextprotocol/client";
import { createMcpHandler } from "@modelcontextprotocol/server";

import { allTools, createMcpServer } from "@/mcp";

export type McpTestContext = {
  client: Client;
  close: () => Promise<void>;
};

/**
 * アプリケーションが公開する全MCPツールの結合テスト環境を生成する。
 *
 * - MCP Server は既存の createMcpServer factory を利用
 * - users / posts は本番と同じ allTools を利用
 * - Client / Transport は @modelcontextprotocol/client を利用
 * - HTTPサーバーやポートは起動しない
 * - handler.fetch を通した in-process 接続
 * - 外部API(JSONPlaceholder)はモックしない
 */
export const setupMcp = async (): Promise<McpTestContext> => {
  const handler = createMcpHandler(() =>
    createMcpServer("mcp-integration-test-server", allTools, "1.0.0"),
  );

  const transport = new StreamableHTTPClientTransport(
    new URL("http://test.local/mcp"),
    {
      fetch: (url, init) => handler.fetch(new Request(url, init)),
    },
  );

  const client = new Client(
    {
      name: "mcp-integration-test-client",
      version: "1.0.0",
    },
    {
      versionNegotiation: {
        mode: "auto",
      },
    },
  );

  try {
    await client.connect(transport);
  } catch (error) {
    await handler.close();
    throw error;
  }

  let closed = false;

  return {
    client,

    async close() {
      if (closed) {
        return;
      }

      closed = true;

      try {
        await client.close();
      } finally {
        await handler.close();
      }
    },
  };
};
