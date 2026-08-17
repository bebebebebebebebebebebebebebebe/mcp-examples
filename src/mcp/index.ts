import { createMcpHandler, McpServer } from "@modelcontextprotocol/server";
import { ToolSchema } from "./schemas";
import { userTools } from "@/features/users/tools";

export const createMcpServer = (
  name: string,
  tools: Array<ToolSchema>,
  version: string = "1.0.0",
): McpServer => {
  const server = new McpServer({ name, version });
  for (const tool of tools) {
    server.registerTool(
      tool.name,
      {
        description: tool.description,
        inputSchema: tool.inputSchema,
      },
      tool.handler,
    );
  }

  return server;
};

const handler = createMcpHandler(() =>
  createMcpServer("users-mcp-server", [...userTools], "1.0.0"),
);

export default handler;
