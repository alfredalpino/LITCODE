import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";

const originalFetch = globalThis.fetch;

describe("POST /api/execute", () => {
  beforeEach(() => {
    process.env.JUDGE0_URL = "https://judge0.test";
    delete process.env.JUDGE0_AUTH_TOKEN;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    delete process.env.JUDGE0_URL;
    delete process.env.JUDGE0_AUTH_TOKEN;
  });

  it("rejects invalid JSON", async () => {
    const { POST } = await import("../app/api/execute/route.ts");
    const res = await POST(
      new Request("http://localhost/api/execute", {
        method: "POST",
        body: "not-json",
        headers: { "Content-Type": "application/json" },
      }) as import("next/server").NextRequest
    );
    assert.equal(res.status, 400);
  });

  it("rejects unsupported language", async () => {
    const { POST } = await import("../app/api/execute/route.ts");
    const res = await POST(
      new Request("http://localhost/api/execute", {
        method: "POST",
        body: JSON.stringify({ language: "racket", code: "print(1)" }),
        headers: { "Content-Type": "application/json" },
      }) as import("next/server").NextRequest
    );
    assert.equal(res.status, 400);
    const body = await res.json();
    assert.match(String(body.error), /unsupported/i);
  });

  it("proxies to Judge0 and maps stdout/status", async () => {
    globalThis.fetch = async (input, init) => {
      assert.equal(
        String(input),
        "https://judge0.test/submissions?base64_encoded=false&wait=true"
      );
      assert.equal(init?.method, "POST");
      const payload = JSON.parse(String(init?.body));
      assert.equal(payload.language_id, 68);
      assert.match(payload.source_code, /echo/);
      return new Response(
        JSON.stringify({
          stdout: "ok\n",
          stderr: null,
          compile_output: null,
          message: null,
          status: { id: 3, description: "Accepted" },
          time: "0.01",
          memory: 1234,
        }),
        { status: 200 }
      );
    };

    const { POST } = await import("../app/api/execute/route.ts");
    const res = await POST(
      new Request("http://localhost/api/execute", {
        method: "POST",
        body: JSON.stringify({
          language: "php",
          code: "<?php echo 'ok';",
        }),
        headers: { "Content-Type": "application/json" },
      }) as import("next/server").NextRequest
    );
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.ok, true);
    assert.equal(body.stdout, "ok\n");
    assert.equal(body.status, "Accepted");
    assert.equal(body.engine, "judge0");
  });

  it("sends X-Auth-Token when configured", async () => {
    process.env.JUDGE0_AUTH_TOKEN = "secret-token";
    let sawAuth = false;
    globalThis.fetch = async (_input, init) => {
      const headers = init?.headers as Record<string, string>;
      sawAuth = headers["X-Auth-Token"] === "secret-token";
      return new Response(
        JSON.stringify({
          stdout: "",
          status: { id: 3, description: "Accepted" },
        }),
        { status: 200 }
      );
    };

    const { POST } = await import("../app/api/execute/route.ts");
    await POST(
      new Request("http://localhost/api/execute", {
        method: "POST",
        body: JSON.stringify({ language: "cpp", code: "int main(){}" }),
        headers: { "Content-Type": "application/json" },
      }) as import("next/server").NextRequest
    );
    assert.equal(sawAuth, true);
  });
});
