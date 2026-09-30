export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  const { assertServerEnv } = await import("./src/lib/env");
  const { initErrorTracking } = await import("./src/lib/error-tracking");
  const { logger } = await import("./src/lib/logger");
  try {
    const env = assertServerEnv();
    initErrorTracking();
    logger.info({ nodeEnv: env.NODE_ENV }, "server environment validated");
  } catch (err) {
    logger.error({ err }, "refusing to start with invalid environment");
    throw err;
  }
}
