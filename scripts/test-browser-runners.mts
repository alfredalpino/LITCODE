import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  BROWSER_RUNNABLE_LANGUAGES,
  getRunnerAvailability,
  isBrowserRunnable,
  runnableLanguageLabels,
} from "../src/lib/browser-runners.ts";

describe("browser-runners catalog", () => {
  it("lists the five in-browser runner families", () => {
    assert.deepEqual([...BROWSER_RUNNABLE_LANGUAGES], [
      "javascript",
      "typescript",
      "python",
      "python3",
      "ruby",
      "php",
    ]);
  });

  it("classifies planned vs unsupported engines", () => {
    assert.equal(getRunnerAvailability("golang").status, "planned");
    assert.equal(getRunnerAvailability("cpp").status, "planned");
    assert.equal(getRunnerAvailability("rust").status, "unsupported");
    assert.equal(getRunnerAvailability("javascript").status, "ready");
  });

  it("isBrowserRunnable matches ready set only", () => {
    for (const id of BROWSER_RUNNABLE_LANGUAGES) {
      assert.equal(isBrowserRunnable(id), true);
    }
    assert.equal(isBrowserRunnable("rust"), false);
  });

  it("runnableLanguageLabels mentions active runners", () => {
    const labels = runnableLanguageLabels();
    assert.match(labels, /JavaScript/);
    assert.match(labels, /Python/);
    assert.match(labels, /Ruby/);
  });
});
