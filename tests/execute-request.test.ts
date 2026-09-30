import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseExecuteRequest } from "../src/lib/execute-request.ts";

describe("execute request schema", () => {
  it("accepts a language, code, and stdin", () => {
    const parsed = parseExecuteRequest({
      language: " php ",
      code: "<?php echo 1;",
      stdin: "1\n",
    });
    assert.equal(parsed.ok, true);
    if (!parsed.ok) return;
    assert.equal(parsed.value.language, "php");
    assert.equal(parsed.value.stdin, "1\n");
  });

  it("rejects a missing language and blank code", () => {
    const missing = parseExecuteRequest({ language: "  ", code: "print(1)" });
    assert.equal(missing.ok, false);
    if (missing.ok) return;
    assert.equal(missing.status, 400);
    assert.match(missing.error, /language/i);

    const blank = parseExecuteRequest({ language: "python", code: "   " });
    assert.equal(blank.ok, false);
    if (blank.ok) return;
    assert.match(blank.error, /code/i);
  });

  it("rejects oversized source", () => {
    const parsed = parseExecuteRequest({
      language: "python",
      code: "a".repeat(70_000),
    });
    assert.equal(parsed.ok, false);
    if (parsed.ok) return;
    assert.equal(parsed.status, 413);
  });
});
