import type { BaseLogger } from "@hono/structured-logger";

export type AppContext = {
  Variables: {
    logger: BaseLogger;
    requestId: string;
  };
};
