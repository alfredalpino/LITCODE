import pino from "pino";

const level =
  process.env.LOG_LEVEL ??
  (process.env.NODE_ENV === "test" ? "silent" : "info");

/** Process-wide structured logger (pino). Server-only. */
export const logger = pino({
  name: "litcode",
  level,
  base: { service: "litcode" },
});

export function childLogger(scope: string) {
  return logger.child({ scope });
}
