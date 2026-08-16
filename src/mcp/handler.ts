import {
  createMcpHandler,
  McpServerFactory,
  McpServer,
  AnyToolHandler,
} from "@modelcontextprotocol/server";
import { ToolSchema, getNoteToolHandler, getNoteInputSchema } from "./tools";

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
  createMcpServer("note-tools", [
    {
      name: "get-note",
      description: "get note data",
      handler: getNoteToolHandler,
      inputSchema: getNoteInputSchema,
    },
  ]),
);

export default handler;
