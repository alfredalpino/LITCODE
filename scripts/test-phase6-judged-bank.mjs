#!/usr/bin/env node
/**
 * Phase 6 — judged bank integrity (count, tests, hints, patterns).
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

describe("phase6 judged bank", () => {
  it("ships ≥50 curated seeds with pedagogy fields", () => {
    const seeds = JSON.parse(
      readFileSync(path.join(ROOT, "scripts/dsa-seeds.json"), "utf8")
    );
    assert.ok(seeds.length >= 50, `got ${seeds.length}`);
    for (const s of seeds) {
      assert.ok(s.id && s.title && s.functionName);
      assert.equal(s.hasJudge ?? true, true);
      assert.ok(Array.isArray(s.tests) && s.tests.length >= 4, s.id);
      assert.ok(Array.isArray(s.hints) && s.hints.length >= 3, s.id);
      assert.ok(s.pattern && s.patternDiscussion, s.id);
      assert.ok(s.starter?.javascript && s.starter?.python && s.starter?.typescript);
      for (const t of s.tests) {
        assert.ok(t.id && Array.isArray(t.input));
        assert.notEqual(t.expected, undefined, `${s.id} ${t.id}`);
      }
    }
  });

  it("public seeds.json mirrors after dsa:gen (if present)", () => {
    const pubPath = path.join(ROOT, "public/data/dsa/seeds.json");
    let raw;
    try {
      raw = readFileSync(pubPath, "utf8");
    } catch {
      return; // pre-gen
    }
    const map = JSON.parse(raw);
    const judged = Object.values(map).filter((p) => p.hasJudge);
    assert.ok(judged.length >= 50, `public judged ${judged.length}`);
  });

  it("skill-graph bridges reference seed ids that exist", () => {
    const seeds = JSON.parse(
      readFileSync(path.join(ROOT, "scripts/dsa-seeds.json"), "utf8")
    );
    const ids = new Set(seeds.map((s) => s.id));
    const graph = JSON.parse(
      readFileSync(path.join(ROOT, "public/data/skill-graph.json"), "utf8")
    );
    const bridges = graph.nodes.filter((n) => n.challengeRef?.challengeId);
    assert.ok(bridges.length >= 10);
    for (const n of bridges) {
      assert.ok(
        ids.has(n.challengeRef.challengeId),
        `${n.id} → ${n.challengeRef.challengeId}`
      );
    }
  });
});
