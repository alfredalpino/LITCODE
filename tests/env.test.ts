import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { assertServerEnv } from "../src/lib/env.ts";

describe("server env", () => {
  it("rejects a development boot that omits JUDGE0_URL", () => {
    assert.throws(
      () => assertServerEnv({ NODE_ENV: "development" }),
      /JUDGE0_URL/
    );
  });

  it("accepts the public Judge0 URL and optional analytics endpoint", () => {
    const env = assertServerEnv({
      NODE_ENV: "development",
      JUDGE0_URL: "https://ce.judge0.com",
      NEXT_PUBLIC_ANALYTICS_ENDPOINT: "https://analytics.example.com/collect",
      LITCODE_EXECUTE_URL: "http://127.0.0.1:3000",
      NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
      JUDGE0_AUTH_TOKEN: "token",
    });
    assert.equal(env.JUDGE0_URL, "https://ce.judge0.com");
    assert.equal(env.JUDGE0_AUTH_TOKEN, "token");
    assert.equal(env.LITCODE_EXECUTE_URL, "http://127.0.0.1:3000");
  });

  it("rejects a malformed JUDGE0_URL", () => {
    assert.throws(
      () =>
        assertServerEnv({
          NODE_ENV: "test",
          JUDGE0_URL: "not-a-url",
        }),
      /Invalid environment/
    );
  });

  it("requires NEXT_PUBLIC_SITE_URL in production", () => {
    assert.throws(
      () =>
        assertServerEnv({
          NODE_ENV: "production",
          JUDGE0_URL: "https://ce.judge0.com",
        }),
      /NEXT_PUBLIC_SITE_URL/
    );
  });
});
