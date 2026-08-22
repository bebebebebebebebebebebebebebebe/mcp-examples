import { afterEach, beforeEach, describe, expect, it } from "bun:test";

import { setupMcp, type McpTestContext } from "./setup";

describe("Post MCP tools integration", () => {
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

  describe("get-posts", () => {
    it("returns posts filtered by userId", async () => {
      const client = getClient();

      const result = await client.callTool({
        name: "get-posts",
        arguments: {
          userId: 1,
          _limit: 2,
        },
      });

      expect(result.isError).not.toBe(true);

      const structuredContent = result.structuredContent as {
        posts: Array<{
          id: number;
          userId: number;
          title: string;
          body: string;
        }>;
        count: number;
      };

      expect(structuredContent.count).toBe(2);
      expect(structuredContent.posts).toHaveLength(2);

      expect(structuredContent.posts.every((post) => post.userId === 1)).toBe(
        true,
      );

      expect(structuredContent.posts[0]).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          userId: 1,
          title: expect.any(String),
          body: expect.any(String),
        }),
      );
    });

    it("returns posts without filters", async () => {
      const client = getClient();

      const result = await client.callTool({
        name: "get-posts",
        arguments: {
          _limit: 3,
        },
      });

      expect(result.isError).not.toBe(true);

      const structuredContent = result.structuredContent as {
        posts: unknown[];
        count: number;
      };

      expect(structuredContent.posts).toHaveLength(3);
      expect(structuredContent.count).toBe(3);
    });

    it("rejects an invalid userId through the MCP input schema", async () => {
      const client = getClient();

      const result = await client.callTool({
        name: "get-posts",
        arguments: {
          userId: 0,
        },
      });

      expect(result.isError).toBe(true);
    });

    it("rejects _limit greater than 100", async () => {
      const client = getClient();

      const result = await client.callTool({
        name: "get-posts",
        arguments: {
          _limit: 101,
        },
      });

      expect(result.isError).toBe(true);
    });
  });

  describe("get-post-by-id", () => {
    it("returns a post by id", async () => {
      const client = getClient();

      const result = await client.callTool({
        name: "get-post-by-id",
        arguments: {
          id: 1,
        },
      });

      expect(result.isError).not.toBe(true);

      expect(result.structuredContent).toEqual({
        post: expect.objectContaining({
          id: 1,
          userId: 1,
          title: expect.any(String),
          body: expect.any(String),
        }),
      });
    });

    it("returns POST_NOT_FOUND when post does not exist", async () => {
      const client = getClient();

      const result = await client.callTool({
        name: "get-post-by-id",
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
          code: "POST_NOT_FOUND",
          message: "ID: 999 の投稿は見つかりませんでした",
        },
      });
    });

    it("rejects an invalid id through the MCP input schema", async () => {
      const client = getClient();

      const result = await client.callTool({
        name: "get-post-by-id",
        arguments: {
          id: 0,
        },
      });

      expect(result.isError).toBe(true);
    });
  });

  describe("create-post", () => {
    it("creates a post", async () => {
      const client = getClient();

      const input = {
        userId: 1,
        title: "MCP integration test",
        body: "Create post integration test",
      };

      const result = await client.callTool({
        name: "create-post",
        arguments: input,
      });

      expect(result.isError).not.toBe(true);

      const structuredContent = result.structuredContent as {
        post: {
          id: number;
          userId: number;
          title: string;
          body: string;
        };
      };

      expect(structuredContent.post).toEqual({
        id: expect.any(Number),
        userId: input.userId,
        title: input.title,
        body: input.body,
      });

      expect(structuredContent.post.id).toBeGreaterThan(0);
    });

    it("rejects an invalid userId through the MCP input schema", async () => {
      const client = getClient();

      const result = await client.callTool({
        name: "create-post",
        arguments: {
          userId: 0,
          title: "invalid post",
          body: "invalid userId",
        },
      });

      expect(result.isError).toBe(true);
    });

    it("rejects missing title through the MCP input schema", async () => {
      const client = getClient();

      const result = await client.callTool({
        name: "create-post",
        arguments: {
          userId: 1,
          body: "title is missing",
        },
      });

      expect(result.isError).toBe(true);
    });
  });
});
