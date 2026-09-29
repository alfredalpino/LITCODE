import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ensureRunnable,
  executeRemote,
  remoteExecutable,
} from "../src/lib/remote-execute.ts";

describe("remote-execute (browser-only legacy shim)", () => {
  it("remoteExecutable is always false", () => {
    assert.equal(remoteExecutable("python3"), false);
    assert.equal(remoteExecutable("javascript"), false);
    assert.equal(remoteExecutable("anything"), false);
  });

  it("ensureRunnable returns code unchanged", () => {
    const code = "console.log(1)";
    assert.equal(ensureRunnable("typescript", code), code);
    assert.equal(ensureRunnable("cpp", code), code);
  });

  it("executeRemote fails closed with browser-only message", async () => {
    const res = await executeRemote({ language: "python3", code: "print(1)" });
    assert.equal(res.ok, false);
    assert.equal(res.engine, "browser-only");
    assert.match(res.stderr, /browser/i);
    assert.equal(res.language, "python3");
  });
});
