import { z } from "zod";

/**
 * Server environment contract.
 * Development and production must set JUDGE0_URL (copy `.env.example` to `.env.local`).
 * `NODE_ENV=test` and `next build` skip the required-var check so the suite and
 * the production compile can run before runtime env is injected.
 */

const DEV_JUDGE0_URL = "https://ce.judge0.com";

export const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),
  JUDGE0_URL: z.url(),
  JUDGE0_AUTH_TOKEN: z.string().min(1).optional(),
  LITCODE_EXECUTE_URL: z.url().optional(),
  NEXT_PUBLIC_ANALYTICS_ENDPOINT: z.url().optional(),
  NEXT_PUBLIC_SITE_URL: z.url().optional(),
  SENTRY_DSN: z.string().min(1).optional(),
  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"])
    .optional(),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

function blankToUndefined(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export function assertServerEnv(source: NodeJS.ProcessEnv = process.env): ServerEnv {
  const nodeEnv =
    source.NODE_ENV === "production" ||
    source.NODE_ENV === "test" ||
    source.NODE_ENV === "development"
      ? source.NODE_ENV
      : "development";
  const building =
    source.NEXT_PHASE === "phase-production-build" || source.npm_lifecycle_event === "build";
  const strict = !building && nodeEnv !== "test";

  const judge0Url = blankToUndefined(source.JUDGE0_URL);
  if (strict && !judge0Url) {
    throw new Error(
      "Missing required environment variable JUDGE0_URL. Copy .env.example to .env.local and set JUDGE0_URL before starting the server."
    );
  }

  const siteUrl = blankToUndefined(source.NEXT_PUBLIC_SITE_URL);
  if (strict && nodeEnv === "production" && !siteUrl) {
    throw new Error(
      "Missing required environment variable NEXT_PUBLIC_SITE_URL. Set it to the public origin (no trailing slash)."
    );
  }

  const parsed = serverEnvSchema.safeParse({
    NODE_ENV: nodeEnv,
    JUDGE0_URL: judge0Url ?? DEV_JUDGE0_URL,
    JUDGE0_AUTH_TOKEN: blankToUndefined(source.JUDGE0_AUTH_TOKEN),
    LITCODE_EXECUTE_URL: blankToUndefined(source.LITCODE_EXECUTE_URL),
    NEXT_PUBLIC_ANALYTICS_ENDPOINT: blankToUndefined(source.NEXT_PUBLIC_ANALYTICS_ENDPOINT),
    NEXT_PUBLIC_SITE_URL: siteUrl,
    SENTRY_DSN: blankToUndefined(source.SENTRY_DSN),
    LOG_LEVEL: blankToUndefined(source.LOG_LEVEL),
  });

  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `${issue.path.join(".") || "env"}: ${issue.message}`)
      .join("; ");
    throw new Error(`Invalid environment: ${details}`);
  }

  return parsed.data;
}
