import { logger } from "./logger";

/**
 * Optional error tracking. When `SENTRY_DSN` is unset, exceptions are only
 * written to the pino logger. When set, a JSON payload is POSTed to that DSN.
 */
export function initErrorTracking(): void {
  if (process.env.SENTRY_DSN?.trim()) {
    logger.info({ error_tracking: "sentry" }, "error tracking enabled");
    return;
  }
  logger.debug({ error_tracking: "sentry" }, "SENTRY_DSN unset; logging exceptions only");
}

export function captureException(
  error: unknown,
  context?: Record<string, unknown>
): void {
  const err = error instanceof Error ? error : new Error(String(error));
  logger.error({ err, ...context, error_tracking: "sentry" }, "captureException");

  const dsn = process.env.SENTRY_DSN?.trim();
  if (!dsn) return;

  void fetch(dsn, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: err.message,
      stack: err.stack,
      context: context ?? {},
    }),
  }).catch(() => undefined);
}
