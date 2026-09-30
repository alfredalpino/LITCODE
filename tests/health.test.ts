import assert from "node:assert/strict";
import { describe, it } from "vitest";
import { GET as health } from "../app/api/health/route.ts";
import { GET as metrics } from "../app/api/metrics/route.ts";

describe("health and metrics", () => {
  it("reports ok when Judge0 is configured", async () => {
    process.env.NODE_ENV = "test";
    process.env.JUDGE0_URL = "https://ce.judge0.com";
    const res = health();
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.status, "ok");
    assert.equal(body.checks.env, "ok");
  });

  it("exposes a prometheus gauge", async () => {
    const res = metrics();
    assert.equal(res.status, 200);
    const text = await res.text();
    assert.match(text, /litcode_up 1/);
    assert.match(res.headers.get("content-type") ?? "", /text\/plain/);
  });
});
