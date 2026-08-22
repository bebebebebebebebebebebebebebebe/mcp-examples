import { afterEach, beforeEach, describe, expect, it } from "bun:test";

import { setupMcp, type McpTestContext } from "./setup";

describe("User MCP tools integration", () => {
  let context: McpTestContext | undefined;

  beforeEach(async () => {
    context = await setupMcp();
  });

  afterEach(async () => {
    await context?.close();
    context = undefined;
  });

  const getClient = () => {
    if (!context) {
      throw new Error("MCP test context is not initialized");
    }

    return context.client;
  };

  describe("get-users", () => {
    it("returns users filtered by username", async () => {
      const client = getClient();

      const result = await client.callTool({
        name: "get-users",
        arguments: {
          username: "Bret",
        },
      });

      expect(result.isError).not.toBe(true);

      expect(result.structuredContent).toEqual({
        users: [
          expect.objectContaining({
            id: 1,
            name: "Leanne Graham",
            username: "Bret",
            email: "Sincere@april.biz",
          }),
        ],
        count: 1,
      });
    });
  });

  describe("get-user-by-id", () => {
    it("returns a user by id", async () => {
      const client = getClient();

      const result = await client.callTool({
        name: "get-user-by-id",
        arguments: {
          id: 1,
        },
      });

      expect(result.isError).not.toBe(true);

      expect(result.structuredContent).toEqual({
        user: expect.objectContaining({
          id: 1,
          name: "Leanne Graham",
          username: "Bret",
          email: "Sincere@april.biz",
          website: "hildegard.org",
        }),
      });
    });

    it("returns USER_NOT_FOUND when user does not exist", async () => {
      const client = getClient();

      const result = await client.callTool({
        name: "get-user-by-id",
        arguments: {
          id: 999,
        },
      });

      expect(result.isError).toBe(true);

      const textContent = result.content.find(
        (content) => content.type === "text",
      );

      expect(textContent).toBeDefined();

      if (!textContent || textContent.type !== "text") {
        throw new Error("Text content was not returned");
      }

      expect(JSON.parse(textContent.text)).toEqual({
        error: {
          code: "USER_NOT_FOUND",
          message: "ID: 999 のユーザーは見つかりませんでした",
        },
      });
    });

    it("rejects an invalid id through the MCP input schema", async () => {
      const client = getClient();

      const result = await client.callTool({
        name: "get-user-by-id",
        arguments: {
          id: 0,
        },
      });

      expect(result.isError).toBe(true);
    });
  });
});
