import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  JUDGE_LANGUAGES,
  getJudgeLanguage,
  starterForLanguage,
  toRunnerLanguage,
} from "../src/lib/judge-languages.ts";
import { isBrowserRunnable } from "../src/lib/browser-runners.ts";
import { remoteExecutable } from "../src/lib/remote-execute.ts";

describe("judge language catalog", () => {
  it("maps runnable UI langs to browser runner ids", () => {
    assert.equal(toRunnerLanguage("javascript"), "javascript");
    assert.equal(toRunnerLanguage("typescript"), "typescript");
    assert.equal(toRunnerLanguage("python"), "python");
    assert.equal(toRunnerLanguage("python3"), "python");
    assert.equal(toRunnerLanguage("ruby"), "ruby");
    assert.equal(toRunnerLanguage("php"), "php");
    assert.equal(toRunnerLanguage("cpp"), null);
    assert.equal(toRunnerLanguage("java"), null);
  });

  it("keeps runnable flag aligned with browser or Judge0 runners", () => {
    for (const lang of JUDGE_LANGUAGES) {
      const expected = isBrowserRunnable(lang.id) || remoteExecutable(lang.id);
      assert.equal(lang.runnable, expected, lang.id);
      if (isBrowserRunnable(lang.id)) {
        assert.equal(lang.availability, "ready", lang.id);
        assert.ok(toRunnerLanguage(lang.id), lang.id);
      }
    }
  });

  it("marks compiled langs as Judge0-runnable while availability stays planned", () => {
    const cpp = getJudgeLanguage("cpp");
    assert.ok(cpp);
    assert.equal(cpp.runnable, true);
    assert.equal(remoteExecutable("cpp"), true);
    assert.notEqual(cpp.availability, "ready");
    const rust = getJudgeLanguage("rust");
    assert.ok(rust);
    assert.equal(rust.availability, "unsupported");
  });

  it("starterForLanguage respects existing snippets and function name", () => {
    const custom = starterForLanguage("javascript", "twoSum", {
      javascript: "function twoSum() {}",
    });
    assert.equal(custom, "function twoSum() {}");
    const py = starterForLanguage("python3", "solve");
    assert.match(py, /def solve/);
  });
});
