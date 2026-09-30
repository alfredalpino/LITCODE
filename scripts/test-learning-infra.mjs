import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

/**
 * Lightweight in-process copies of persistence helpers for node:test
 * (avoids Next path aliases / DOM localStorage).
 */

const EVENTS_KEY = "sde-lab-events-v1";
const PROGRESS_KEY = "sde-lab-studio-progress-v1";
const MAX_EVENTS = 800;

/** @type {Map<string, string>} */
const store = new Map();

const memoryStorage = {
  getItem(k) {
    return store.has(k) ? store.get(k) : null;
  },
  setItem(k, v) {
    store.set(k, String(v));
  },
  clear() {
    store.clear();
  },
};

function loadEvents() {
  try {
    const raw = memoryStorage.getItem(EVENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function appendEvent(partial) {
  const event = {
    id: partial.id ?? `evt-${Date.now()}`,
    ts: partial.ts ?? Date.now(),
    type: partial.type,
    labId: partial.labId,
    moduleId: partial.moduleId,
    challengeId: partial.challengeId,
    meta: partial.meta,
  };
  const next = [...loadEvents(), event].slice(-MAX_EVENTS);
  memoryStorage.setItem(EVENTS_KEY, JSON.stringify(next));
  return event;
}

function loadProgress() {
  try {
    const raw = memoryStorage.getItem(PROGRESS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveProgress(map) {
  memoryStorage.setItem(PROGRESS_KEY, JSON.stringify(map));
}

function moduleKey(labId, moduleId) {
  return `${labId}:${moduleId}`;
}

describe("event logging", () => {
  it("appends progress events in order and caps size", () => {
    memoryStorage.clear();
    appendEvent({ type: "module_opened", labId: "javascript", moduleId: "01-runtime" });
    appendEvent({ type: "prediction_skipped", labId: "javascript", moduleId: "01-runtime" });
    appendEvent({ type: "run", labId: "javascript", moduleId: "01-runtime" });
    const events = loadEvents();
    assert.equal(events.length, 3);
    assert.equal(events[0].type, "module_opened");
    assert.equal(events[2].type, "run");
  });

  it("persists under sde-lab-events-v1 key", () => {
    memoryStorage.clear();
    appendEvent({ type: "challenge_passed", challengeId: "seed-0001" });
    assert.ok(memoryStorage.getItem(EVENTS_KEY));
    assert.match(EVENTS_KEY, /^sde-lab-/);
  });
});

describe("progress persistence", () => {
  it("saves and loads module completion map", () => {
    memoryStorage.clear();
    const key = moduleKey("javascript", "01-runtime");
    const map = { [key]: true };
    saveProgress(map);
    assert.deepEqual(loadProgress(), map);
    assert.equal(PROGRESS_KEY, "sde-lab-studio-progress-v1");
  });
});

describe("skill-graph loader shape", () => {
  it("validates authored skill-graph.json", () => {
    const raw = readFileSync(
      path.join(ROOT, "public/data/skill-graph.json"),
      "utf8"
    );
    const graph = JSON.parse(raw);
    assert.equal(graph.version, 1);
    assert.ok(Array.isArray(graph.nodes));
    assert.ok(graph.nodes.length >= 10);
    const ids = new Set(graph.nodes.map((n) => n.id));
    for (const n of graph.nodes) {
      assert.ok(n.id && n.kind && n.title);
      assert.ok(Array.isArray(n.prereqs));
      for (const p of n.prereqs) {
        assert.ok(ids.has(p), `${n.id} missing prereq ${p}`);
      }
    }
    const twoSum = graph.nodes.find((n) => n.id === "challenge.two-sum");
    assert.equal(twoSum?.challengeRef?.challengeId, "seed-0001");
  });

  it("recommendNext returns bound nodes when language prereqs are free", async () => {
    // Inline minimal recommend mirroring src/lib/skill-graph.ts language rule
    const graph = JSON.parse(
      readFileSync(path.join(ROOT, "public/data/skill-graph.json"), "utf8")
    );
    const byId = new Map(graph.nodes.map((n) => [n.id, n]));
    const evidence = {};
    const STAGE = { unseen: 0, exposed: 1, practicing: 2, passing: 3, mastered: 4 };
    function prereqsMet(node) {
      return node.prereqs.every((id) => {
        const prereq = byId.get(id);
        if (prereq?.kind === "language") return true;
        const ev = evidence[id];
        return ev && STAGE[ev.stage] >= STAGE.passing;
      });
    }
    const next = graph.nodes.filter(
      (n) =>
        n.kind !== "language" &&
        (n.moduleRef || n.challengeRef) &&
        prereqsMet(n) &&
        !(evidence[n.id]?.stage === "mastered")
    );
    assert.ok(next.length >= 1);
    assert.ok(next.some((n) => n.id === "js.orientation" || n.id === "py.runtime" || n.id === "ts.runtime-boundary"));
  });
});
