import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";
import {
  JUDGE0_LANGUAGE_IDS,
  ensureRunnable,
  executeRemote,
  remoteExecutable,
} from "../src/lib/remote-execute.ts";

const originalFetch = globalThis.fetch;

describe("remote-execute (Judge0 client)", () => {
  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("remoteExecutable is false for local browser langs", () => {
    assert.equal(remoteExecutable("python3"), false);
    assert.equal(remoteExecutable("javascript"), false);
    assert.equal(remoteExecutable("typescript"), false);
    assert.equal(remoteExecutable("ruby"), false);
    assert.equal(remoteExecutable("php"), false);
  });

  it("remoteExecutable is true for compiled Judge0 langs", () => {
    assert.equal(remoteExecutable("cpp"), true);
    assert.equal(remoteExecutable("rust"), true);
    assert.equal(remoteExecutable("anything"), false);
  });

  it("maps Judge0 language ids for common langs", () => {
    assert.equal(JUDGE0_LANGUAGE_IDS.cpp, 54);
    assert.equal(JUDGE0_LANGUAGE_IDS.rust, 73);
  });

  it("ensureRunnable returns code unchanged", () => {
    const code = "console.log(1)";
    assert.equal(ensureRunnable("typescript", code), code);
    assert.equal(ensureRunnable("cpp", code), code);
  });

  it("executeRemote calls /api/execute and maps response", async () => {
    globalThis.fetch = async (input, init) => {
      assert.match(String(input), /\/api\/execute$/);
      assert.equal(init?.method, "POST");
      const body = JSON.parse(String(init?.body));
      assert.equal(body.language, "cpp");
      return new Response(
        JSON.stringify({
          ok: true,
          stdout: "1\n",
          stderr: "",
          compileOutput: "",
          message: "Accepted",
          status: "Accepted",
          language: "cpp",
          engine: "judge0",
        }),
        { status: 200 }
      );
    };

    const res = await executeRemote({ language: "cpp", code: "int main(){}" });
    assert.equal(res.ok, true);
    assert.equal(res.engine, "judge0");
    assert.equal(res.stdout, "1\n");
  });

  it("executeRemote fails closed for unsupported language", async () => {
    const res = await executeRemote({ language: "python3", code: "print(1)" });
    assert.equal(res.ok, false);
    assert.match(res.stderr, /not configured/i);
  });
});
