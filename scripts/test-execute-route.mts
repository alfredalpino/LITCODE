import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { POST } from "../app/api/execute/route.ts";

describe("POST /api/execute", () => {
  it("returns 410 Gone with browser-only payload", async () => {
    const res = await POST();
    assert.equal(res.status, 410);
    const body = await res.json();
    assert.equal(body.ok, false);
    assert.equal(body.engine, "browser-only");
    assert.match(String(body.error), /browser/i);
    assert.equal(body.status, "Unavailable");
  });
});
