import { structuredLogger } from "@hono/structured-logger";

/**
 * ログエントリーに付与する任意の追加データ型
 */
export type LogPayload = Record<string, unknown>;

/**
 * ログの重要度を表すログレベル
 */
export type LogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR";

/**
 * ロガーの共通インターフェース
 */
export interface AppLogger {
  debug: (payload: LogPayload | string, message?: string) => void;
  info: (payload: LogPayload | string, message?: string) => void;
  warn: (payload: LogPayload | string, message?: string) => void;
  error: (payload: LogPayload | string, message?: string) => void;
}

/**
 * 基本となる構造化ロガーインスタンスを生成します。
 *
 * @param defaultMeta - 全てのログに共通で付与したいデータ（例: requestId）
 */
export const createStructuredLogger = (
  defaultMeta: LogPayload = {},
): AppLogger => {
  const writeLog = (
    level: LogLevel,
    payload: LogPayload | string,
    message?: string,
  ) => {
    // 第1引数が文字列の場合は message として扱う
    const normPayload = typeof payload === "string" ? {} : payload;
    const normMessage = typeof payload === "string" ? payload : message;

    const { message: payloadMessage, ...extraPayload } = normPayload;

    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      ...defaultMeta,
      message: normMessage ?? payloadMessage ?? undefined,
      ...extraPayload,
    };

    const jsonOutput = JSON.stringify(logEntry);

    if (level === "ERROR") {
      console.error(jsonOutput);
    } else {
      console.log(jsonOutput);
    }
  };

  return {
    debug: (payload, message) => writeLog("DEBUG", payload, message),
    info: (payload, message) => writeLog("INFO", payload, message),
    warn: (payload, message) => writeLog("WARN", payload, message),
    error: (payload, message) => writeLog("ERROR", payload, message),
  };
};

/**
 * Hono用の構造化ロガーミドルウェアを作成します。
 * リクエストごとの `requestId` を自動的に付与したロガーを生成します。
 *
 * @example
 * ```ts
 * import { Hono } from "hono";
 * import { createStructuredLoggerMiddleware } from "./logger";
 *
 * const app = new Hono();
 * app.use("*", createStructuredLoggerMiddleware());
 *
 * app.get("/", (c) => {
 *   return c.text("Hello");
 * });
 * ```
 *
 * @returns Hono用の構造化ロガーミドルウェア
 */
export const createStructuredLoggerMiddleware = () => {
  return structuredLogger({
    createLogger: (c) => {
      const requestId = c.var.requestId;
      return createStructuredLogger({ requestId });
    },
  });
};
