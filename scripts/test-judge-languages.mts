import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  JUDGE_LANGUAGES,
  getJudgeLanguage,
  starterForLanguage,
  toRunnerLanguage,
} from "../src/lib/judge-languages.ts";
import { isBrowserRunnable } from "../src/lib/browser-runners.ts";

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

  it("keeps runnable flag aligned with browser-runners", () => {
    for (const lang of JUDGE_LANGUAGES) {
      assert.equal(lang.runnable, isBrowserRunnable(lang.id), lang.id);
      if (lang.runnable) {
        assert.equal(lang.availability, "ready", lang.id);
        assert.ok(toRunnerLanguage(lang.id), lang.id);
      }
    }
  });

  it("marks compiled langs as planned or unsupported, not ready runners", () => {
    const cpp = getJudgeLanguage("cpp");
    assert.ok(cpp);
    assert.equal(cpp.runnable, false);
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
