import assert from "node:assert/strict";
import { describe, it } from "vitest";
import { buildGeneratedProblem, buildLeetCodeProblem } from "../src/lib/dsa/hydrate.ts";
import type { DsaIndexItem } from "../src/lib/dsa/types.ts";

const leetcode: DsaIndexItem = {
  id: "lc-two-sum",
  num: 1,
  title: "Two Sum",
  difficulty: "Easy",
  topics: ["Array"],
  companies: ["Amazon"],
  kind: "leetcode",
  hasJudge: false,
  slug: "two-sum",
};

describe("DSA problem hydration", () => {
  it("builds a leetcode practice problem from index metadata", () => {
    const problem = buildLeetCodeProblem(leetcode);
    assert.equal(problem.kind, "leetcode");
    assert.equal(problem.slug, "two-sum");
    assert.equal(problem.hasJudge, false);
    assert.match(problem.description, /two-sum/);
    assert.equal(problem.functionName, "solve");
  });

  it("fills a generated problem from its pattern template", () => {
    const problem = buildGeneratedProblem(
      {
        id: "gen-1",
        num: 10,
        title: "Window",
        difficulty: "Medium",
        topics: ["Sliding Window"],
        companies: ["Google"],
        kind: "generated",
        pattern: "window",
        hasJudge: true,
        n: 20,
        twistIndex: 0,
        seed: 65,
      },
      {
        twists: ["sorted input"],
        patterns: [
          {
            key: "window",
            titles: ["Window"],
            topics: ["Sliding Window"],
            fn: "window",
            descTemplate: "n={{n}} twist={{twist}}",
            starter: { javascript: "function window() {}", typescript: "", python: "" },
          },
        ],
      },
      { window: { "1": [{ id: "Hidden 1", input: [[1], 1], expected: 1 }] } }
    );
    assert.equal(problem.functionName, "window");
    assert.equal(problem.description, "n=20 twist=sorted input");
    assert.equal(problem.tests[0]?.id, "Hidden 1");
    assert.equal(problem.hasJudge, true);
  });

  it("throws when the pattern key is unknown", () => {
    assert.throws(
      () =>
        buildGeneratedProblem(
          { ...leetcode, id: "gen-x", kind: "generated", pattern: "missing", hasJudge: false },
          { twists: [], patterns: [] },
          {}
        ),
      /Pattern missing/
    );
  });
});
