import * as z from "zod/v4";
import type { AnyToolHandler } from "@modelcontextprotocol/server";
export type ToolSchema = {
  name: string;
  description: string;
  inputSchema: z.ZodObject;
  handler: AnyToolHandler<z.ZodObject>;
};

export const NoteSchema = z.object({
  data: z.object({
    title: z.string().min(1),
    body: z.string(),
  }),
});

export const getNoteInputSchema = z.object({});

export type GetNoteOutputSchema = z.infer<typeof NoteSchema>;

export const getNoteToolHandler = async () => {
  const result = NoteSchema.safeParse({
    data: {
      title: "hoge",
      body: "aaaaa",
    },
  });

  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(result),
      },
    ],
  };
};
