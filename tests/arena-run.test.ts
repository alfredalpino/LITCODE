import assert from "node:assert/strict";
import { describe, it } from "vitest";
import { runArenaAttempt } from "../src/lib/dsa/arena-run.ts";
import type { DsaProblem } from "../src/lib/dsa/types.ts";

const practiceProblem: DsaProblem = {
  id: "seed-demo",
  title: "Demo",
  difficulty: "Easy",
  topics: ["Array"],
  companies: ["Interview"],
  functionName: "solve",
  description: "demo",
  examples: [],
  constraints: [],
  starter: { javascript: "function solve() {}", typescript: "", python: "" },
  tests: [{ id: "Explore", input: [] }],
  kind: "seed",
  hasJudge: false,
};

describe("arena run helper", () => {
  it("explains unavailable languages without throwing", async () => {
    const result = await runArenaAttempt({
      problem: practiceProblem,
      language: "dart",
      langMeta: undefined,
      code: "void main() {}",
      submit: false,
      interviewMode: false,
      hintLevel: 0,
    });
    assert.ok(result.lines.length >= 1);
    assert.equal(result.caseResults, null);
  });
});
