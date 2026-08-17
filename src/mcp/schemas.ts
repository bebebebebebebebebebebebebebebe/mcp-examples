import * as z from "zod/v4";
import type { AnyToolHandler } from "@modelcontextprotocol/server";

export type ToolSchema = {
  name: string;
  description: string;
  inputSchema: z.ZodObject;
  handler: AnyToolHandler<z.ZodObject>;
};
