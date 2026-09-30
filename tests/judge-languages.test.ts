import assert from "node:assert/strict";
import { describe, it } from "vitest";
import { getJudgeLanguage } from "../src/lib/judge-languages.ts";
import { remoteExecutable, JUDGE0_LANGUAGE_IDS } from "../src/lib/remote-execute.ts";

describe("judge languages", () => {
  it("resolves a known language and a Judge0 id", () => {
    const cpp = getJudgeLanguage("cpp");
    assert.ok(cpp);
    assert.equal(cpp.id, "cpp");
    assert.equal(JUDGE0_LANGUAGE_IDS.cpp, 54);
    assert.equal(remoteExecutable("cpp"), true);
    assert.equal(remoteExecutable("javascript"), false);
  });
});
