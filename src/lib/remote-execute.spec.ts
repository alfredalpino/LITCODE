import assert from "node:assert/strict";
import { describe, it } from "vitest";
import { remoteExecutable } from "./remote-execute";

describe("remoteExecutable", () => {
  it("keeps browser languages local", () => {
    assert.equal(remoteExecutable("javascript"), false);
    assert.equal(remoteExecutable("typescript"), false);
    assert.equal(remoteExecutable("python"), false);
  });

  it("routes compiled languages to Judge0", () => {
    assert.equal(remoteExecutable("cpp"), true);
    assert.equal(remoteExecutable("java"), true);
    assert.equal(remoteExecutable("golang"), true);
  });
});
