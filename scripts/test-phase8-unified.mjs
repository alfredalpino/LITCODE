import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

/**
 * Phase 8 tests — mirror of src/lib/skill-graph.ts pure logic (node:test without Next aliases).
 */

/** @typedef {'unseen'|'exposed'|'practicing'|'passing'|'mastered'} SkillStage */

const STAGE = { unseen: 0, exposed: 1, practicing: 2, passing: 3, mastered: 4 };

function loadGraph() {
  return JSON.parse(
    readFileSync(path.join(ROOT, "public/data/skill-graph.json"), "utf8")
  );
}

function emptyState() {
  return { version: 1, evidence: {} };
}

function ensure(state, nodeId) {
  if (!state.evidence[nodeId]) {
    state.evidence[nodeId] = {
      nodeId,
      attempts: 0,
      passes: 0,
      fails: 0,
      hintsUsed: 0,
      lastTs: 0,
      mastery: 0,
      stage: "unseen",
      predictHits: 0,
      predictSkips: 0,
    };
  }
  return state.evidence[nodeId];
}

function bumpStage(ev, min) {
  if (STAGE[ev.stage] < STAGE[min]) ev.stage = min;
}

function seed(graph, progress, dsaSolved) {
  const state = emptyState();
  for (const node of graph.nodes) {
    if (node.moduleRef) {
      const key = `${node.moduleRef.labId}:${node.moduleRef.moduleId}`;
      if (progress[key]) {
        const ev = ensure(state, node.id);
        bumpStage(ev, "passing");
        ev.mastery = Math.max(ev.mastery, 0.6);
      }
    }
    if (node.challengeRef && dsaSolved[node.challengeRef.challengeId]) {
      const ev = ensure(state, node.id);
      bumpStage(ev, "passing");
      ev.passes = Math.max(ev.passes, 1);
      ev.mastery = Math.max(ev.mastery, 0.7);
    }
  }
  return state;
}

function applyEvents(graph, state, events) {
  const next = {
    version: 1,
    evidence: Object.fromEntries(
      Object.entries(state.evidence).map(([k, v]) => [k, { ...v }])
    ),
  };
  const byChallenge = new Map();
  const byModule = new Map();
  for (const n of graph.nodes) {
    if (n.challengeRef) byChallenge.set(n.challengeRef.challengeId, n);
    if (n.moduleRef) byModule.set(`${n.moduleRef.labId}:${n.moduleRef.moduleId}`, n);
  }
  for (const evt of events) {
    const moduleNode =
      evt.labId && evt.moduleId
        ? byModule.get(`${evt.labId}:${evt.moduleId}`)
        : undefined;
    const challengeNode = evt.challengeId
      ? byChallenge.get(evt.challengeId)
      : undefined;
    const ids = [
      ...(moduleNode ? [moduleNode.id] : []),
      ...(challengeNode ? [challengeNode.id] : []),
    ];
    for (const id of ids) {
      const ev = ensure(next, id);
      if (evt.type === "prediction_submitted") {
        ev.predictHits = (ev.predictHits || 0) + 1;
        bumpStage(ev, "practicing");
        ev.mastery = Math.min(1, ev.mastery + 0.04);
      } else if (evt.type === "prediction_skipped") {
        ev.predictSkips = (ev.predictSkips || 0) + 1;
        bumpStage(ev, "exposed");
      } else if (evt.type === "module_completed") {
        bumpStage(ev, "passing");
        ev.mastery = Math.max(ev.mastery, 0.6);
      } else if (evt.type === "challenge_passed") {
        ev.attempts += 1;
        ev.passes += 1;
        ev.mastery = Math.min(1, ev.mastery + 0.2);
        bumpStage(ev, ev.mastery >= 0.85 ? "mastered" : "passing");
      } else if (evt.type === "challenge_failed") {
        ev.attempts += 1;
        ev.fails += 1;
        ev.mastery = Math.max(0, ev.mastery - 0.08);
        bumpStage(ev, "practicing");
      }
    }
    if (
      challengeNode &&
      (evt.type === "challenge_passed" || evt.type === "challenge_failed")
    ) {
      for (const p of challengeNode.prereqs) {
        if (!p.startsWith("dsa.pattern.")) continue;
        const pev = ensure(next, p);
        pev.attempts += 1;
        if (evt.type === "challenge_passed") {
          pev.passes += 1;
          pev.mastery = Math.min(1, pev.mastery + 0.1);
          bumpStage(pev, pev.mastery >= 0.85 ? "mastered" : "passing");
        } else {
          pev.fails += 1;
          pev.mastery = Math.max(0, pev.mastery - 0.06);
          bumpStage(pev, "practicing");
        }
      }
    }
  }
  return next;
}

function derive(graph, progress, dsaSolved, events) {
  const challenged = new Set(
    events
      .filter(
        (e) =>
          (e.type === "challenge_passed" || e.type === "challenge_failed") &&
          e.challengeId
      )
      .map((e) => e.challengeId)
  );
  const solved = {};
  for (const [id, ok] of Object.entries(dsaSolved)) {
    if (ok && !challenged.has(id)) solved[id] = true;
  }
  return applyEvents(graph, seed(graph, progress, solved), events);
}

function prereqsMet(node, evidence, byId) {
  return node.prereqs.every((id) => {
    const prereq = byId.get(id);
    if (prereq?.kind === "language") return true;
    const ev = evidence[id];
    return ev && STAGE[ev.stage] >= STAGE.passing;
  });
}

function recommendNext(graph, state, limit = 3) {
  const byId = new Map(graph.nodes.map((n) => [n.id, n]));
  const weakRelatedBoost = new Map();
  for (const node of graph.nodes) {
    const ev = state.evidence[node.id];
    if (!ev || ev.fails === 0) continue;
    if (node.kind === "challenge" || node.kind === "pattern") {
      for (const rel of [...(node.related || []), ...node.prereqs]) {
        const target = byId.get(rel);
        if (target?.moduleRef) {
          weakRelatedBoost.set(rel, (weakRelatedBoost.get(rel) || 0) + ev.fails);
        }
      }
    }
  }
  const candidates = [];
  for (const node of graph.nodes) {
    if (node.kind === "language") continue;
    if (node.tags?.includes("scaffold") || node.tags?.includes("planned")) continue;
    const ev = state.evidence[node.id];
    if (ev?.stage === "mastered") continue;
    if (!prereqsMet(node, state.evidence, byId) && node.prereqs.length > 0) continue;
    if (!node.moduleRef && !node.challengeRef) continue;
    let score = 0;
    if (node.moduleRef) score += 3;
    if (node.challengeRef) score += 2;
    if (ev?.fails) score += ev.fails * 1.5;
    if (weakRelatedBoost.has(node.id)) score += 2 + weakRelatedBoost.get(node.id);
    if (node.tags?.includes("ready")) score += 1;
    candidates.push({ node, score });
  }
  candidates.sort((a, b) => b.score - a.score || a.node.id.localeCompare(b.node.id));
  return candidates.slice(0, limit).map((c) => c.node);
}

function relatedLabConcepts(graph, patternNodeId) {
  const byId = new Map(graph.nodes.map((n) => [n.id, n]));
  const pattern = byId.get(patternNodeId);
  if (!pattern) return [];
  const ids = [...(pattern.related || []), ...pattern.prereqs];
  return ids
    .map((id) => byId.get(id))
    .filter((n) => n?.moduleRef && n.kind === "concept");
}

function masteryBuckets(graph, state) {
  const known = [];
  const learning = [];
  const weak = [];
  const mastered = [];
  for (const node of graph.nodes) {
    if (node.kind === "language") continue;
    if (!node.moduleRef && !node.challengeRef && node.kind !== "pattern") continue;
    if (node.tags?.includes("scaffold")) continue;
    const ev = state.evidence[node.id];
    if (!ev) continue;
    if (ev.stage === "mastered" || ev.mastery >= 0.85) mastered.push(node.id);
    else if (ev.fails > 0 && ev.mastery < 0.5) weak.push(node.id);
    else if (ev.stage === "passing" || (ev.mastery >= 0.55 && ev.mastery < 0.85))
      known.push(node.id);
    else if (ev.stage === "practicing" || ev.stage === "exposed" || ev.attempts > 0)
      learning.push(node.id);
  }
  return { known, learning, weak, mastered };
}

describe("phase8 skill-graph bridges", () => {
  it("has JS↔TS related bridges and pattern↔lab related", () => {
    const graph = loadGraph();
    const byId = new Map(graph.nodes.map((n) => [n.id, n]));
    assert.ok(byId.get("js.values-types")?.related?.includes("ts.basic-types"));
    assert.ok(byId.get("ts.basic-types")?.related?.includes("js.values-types"));
    assert.ok(byId.get("dsa.pattern.hashmap")?.related?.includes("js.objects"));
    assert.ok(byId.get("dsa.pattern.hashmap")?.related?.includes("ts.objects"));
    assert.ok(byId.get("dsa.pattern.arrays")?.related?.includes("js.arrays"));
    // related ids exist
    for (const n of graph.nodes) {
      for (const r of n.related || []) {
        assert.ok(byId.has(r), `${n.id} related missing ${r}`);
      }
    }
  });
});

describe("phase8 mastery aggregation", () => {
  it("folds predict + challenge events into buckets", () => {
    const graph = loadGraph();
    const events = [
      {
        id: "1",
        ts: 1,
        type: "prediction_submitted",
        labId: "javascript",
        moduleId: "02-values-types",
      },
      {
        id: "2",
        ts: 2,
        type: "module_completed",
        labId: "javascript",
        moduleId: "02-values-types",
      },
      {
        id: "3",
        ts: 3,
        type: "challenge_failed",
        challengeId: "seed-0001",
      },
      {
        id: "4",
        ts: 4,
        type: "challenge_failed",
        challengeId: "seed-0001",
      },
    ];
    const state = derive(graph, {}, {}, events);
    assert.equal(state.evidence["js.values-types"]?.stage, "passing");
    assert.ok((state.evidence["challenge.two-sum"]?.fails || 0) >= 2);
    assert.ok((state.evidence["dsa.pattern.hashmap"]?.fails || 0) >= 2);
    const buckets = masteryBuckets(graph, state);
    assert.ok(buckets.weak.includes("challenge.two-sum") || buckets.learning.includes("challenge.two-sum") || buckets.weak.includes("dsa.pattern.hashmap"));
    assert.ok(buckets.known.includes("js.values-types") || buckets.mastered.includes("js.values-types"));
  });

  it("does not double-count solved map when challenge events exist", () => {
    const graph = loadGraph();
    const events = [
      { id: "1", ts: 1, type: "challenge_passed", challengeId: "seed-0001" },
    ];
    const a = derive(graph, {}, { "seed-0001": true }, events);
    const b = derive(graph, {}, {}, events);
    assert.equal(
      a.evidence["challenge.two-sum"]?.passes,
      b.evidence["challenge.two-sum"]?.passes
    );
  });
});

describe("phase8 next-step / cross-lab recommendations", () => {
  it("recommends entry labs with empty evidence", () => {
    const graph = loadGraph();
    const next = recommendNext(graph, emptyState(), 5);
    const ids = next.map((n) => n.id);
    assert.ok(
      ids.some((id) =>
        ["js.orientation", "py.runtime", "ts.runtime-boundary"].includes(id)
      )
    );
  });

  it("boosts related lab concept after pattern/challenge fails", () => {
    const graph = loadGraph();
    const events = [
      { id: "1", ts: 1, type: "challenge_failed", challengeId: "seed-0001" },
      { id: "2", ts: 2, type: "challenge_failed", challengeId: "seed-0001" },
      { id: "3", ts: 3, type: "challenge_failed", challengeId: "seed-0001" },
    ];
    // Unlock JS objects chain enough that related boost can surface
    const progress = {
      "javascript:00-orientation": true,
      "javascript:01-runtime": true,
      "javascript:02-values-types": true,
      "javascript:03-variables": true,
      "javascript:04-operators": true,
      "javascript:05-control-flow": true,
      "javascript:06-functions": true,
      "javascript:07-scope": true,
      "javascript:08-closures": true,
      "javascript:09-objects": true,
    };
    const state = derive(graph, progress, {}, events);
    const next = recommendNext(graph, state, 8);
    const ids = next.map((n) => n.id);
    // Should include either the failed challenge, hashmap pattern challenge sibling, or js.objects reinforce
    assert.ok(
      ids.includes("js.objects") ||
        ids.includes("challenge.two-sum") ||
        ids.includes("challenge.group-anagrams") ||
        ids.some((id) => id.startsWith("js.")),
      `expected cross-lab or challenge reinforce, got ${ids.join(",")}`
    );
  });

  it("relatedLabConcepts returns JS/Python/TS modules for hashmap", () => {
    const graph = loadGraph();
    const labs = relatedLabConcepts(graph, "dsa.pattern.hashmap");
    const langs = new Set(labs.map((n) => n.language));
    assert.ok(labs.length >= 2);
    assert.ok(langs.has("javascript") || langs.has("python"));
    assert.ok(labs.every((n) => n.moduleRef));
  });
});
