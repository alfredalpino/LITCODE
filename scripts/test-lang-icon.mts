import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { langIconToKey } from "../src/components/LangIcon.tsx";

describe("LangIcon key mapping", () => {
  it("normalizes catalog language strings", () => {
    assert.equal(langIconToKey("JavaScript"), "javascript");
    assert.equal(langIconToKey("js"), "javascript");
    assert.equal(langIconToKey("TypeScript"), "typescript");
    assert.equal(langIconToKey("python3"), "python");
    assert.equal(langIconToKey("py"), "python");
    assert.equal(langIconToKey("golang"), "go");
    assert.equal(langIconToKey("C++"), "cpp");
    assert.equal(langIconToKey("c#"), "csharp");
  });

  it("returns null for unknown languages (fallback glyph in UI)", () => {
    assert.equal(langIconToKey("racket"), null);
    assert.equal(langIconToKey(""), null);
  });
});
