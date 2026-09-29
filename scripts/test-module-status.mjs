import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  deriveModuleMeta,
  looksLikeScaffoldReadme,
  parseStatusOverride,
} from "../scripts/lib/module-status.mjs";

describe("module status model", () => {
  it("parses STATUS override", () => {
    assert.equal(parseStatusOverride("status: ready\n"), "ready");
    assert.equal(parseStatusOverride("module_status = deprecated"), "deprecated");
    assert.equal(parseStatusOverride("no status here"), null);
  });

  it("detects scaffold README markers", () => {
    assert.equal(
      looksLikeScaffoldReadme("**Status:** 🧱 Scaffolded — expands next."),
      true
    );
    assert.equal(
      looksLikeScaffoldReadme("# Runtime\n\nAfter this lab you can trace programs."),
      false
    );
  });

  it("marks ready when primary + runnable experiments exist", () => {
    const meta = deriveModuleMeta(
      {
        docs: [{ name: "README.md", category: "docs", isPrimary: true }],
        codeFiles: [{ category: "experiments" }, { category: "experiments" }],
      },
      { readmeText: "# Real lesson\n\nLearning outcomes…" }
    );
    assert.equal(meta.status, "ready");
    assert.equal(meta.loop.includes("experiment"), true);
  });

  it("marks scaffold when README says scaffolded even with code", () => {
    const meta = deriveModuleMeta(
      {
        docs: [{ name: "README.md", category: "docs", isPrimary: true }],
        codeFiles: [{ category: "experiments" }],
      },
      { readmeText: "**Status:** 🧱 Scaffolded\n\nPlanned contents" }
    );
    assert.equal(meta.status, "scaffold");
  });

  it("respects override over heuristics", () => {
    const meta = deriveModuleMeta(
      {
        docs: [{ name: "README.md", category: "docs", isPrimary: true }],
        codeFiles: [],
      },
      {
        readmeText: "Scaffolded",
        overrideText: "status: ready",
      }
    );
    assert.equal(meta.status, "ready");
  });

  it("sets hasPredictions / hasChallenges flags", () => {
    const meta = deriveModuleMeta(
      {
        docs: [
          { name: "README.md", category: "docs", isPrimary: true },
          { name: "P01.md", category: "predictions" },
          { name: "C01.md", category: "challenges" },
        ],
        codeFiles: [{ category: "experiments" }],
      },
      { readmeText: "Full lesson" }
    );
    assert.equal(meta.hasPredictions, true);
    assert.equal(meta.hasChallenges, true);
    assert.ok(meta.loop.includes("predict"));
    assert.ok(meta.loop.includes("break"));
  });
});
