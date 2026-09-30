import assert from "node:assert/strict";
import { describe, it } from "vitest";
import { getJudgeLanguage, toRunnerLanguage } from "./judge-languages";

describe("judge-languages", () => {
  it("maps python3 to the browser runner id", () => {
    assert.equal(toRunnerLanguage("python3"), "python");
    assert.equal(toRunnerLanguage("cpp"), null);
  });

  it("looks up language metadata", () => {
    const js = getJudgeLanguage("javascript");
    assert.ok(js);
    assert.equal(js.runnable, true);
  });
});
