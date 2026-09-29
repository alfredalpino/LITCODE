/**
 * Skill graph v0 — authored JSON DAG + local evidence (SKILL_GRAPH.md / DEC-015).
 * Phase 8: cross-lab related bridges, event-driven mastery, explainable next-step.
 */

import type { ProgressEvent } from "@/lib/events";

export type SkillNodeKind =
  | "language"
  | "concept"
  | "pattern"
  | "challenge"
  | "project"
  | "assessment";

export type SkillStage = "unseen" | "exposed" | "practicing" | "passing" | "mastered";

export interface SkillNode {
  id: string;
  kind: SkillNodeKind;
  title: string;
  language?: "javascript" | "typescript" | "python" | "cross";
  summary?: string;
  prereqs: string[];
  /** Soft transfer links (not AND-gating). Used for lab↔DSA and JS↔TS bridges. */
  related?: string[];
  moduleRef?: { labId: string; moduleId: string };
  challengeRef?: { challengeId: string };
  tags?: string[];
}

export interface SkillGraphFile {
  version: 1;
  updatedAt: string;
  nodes: SkillNode[];
}

export interface SkillEvidence {
  nodeId: string;
  attempts: number;
  passes: number;
  fails: number;
  hintsUsed: number;
  lastTs: number;
  mastery: number;
  stage: SkillStage;
  predictHits?: number;
  predictSkips?: number;
}

export interface SkillStateFile {
  version: 1;
  evidence: Record<string, SkillEvidence>;
}

export const SKILL_STATE_KEY = "sde-skill-state-v1";

export type NextStepRecommendation = {
  node: SkillNode;
  reason: string;
};

export type MasteryBucket = "known" | "learning" | "weak" | "next" | "mastered";

export type MasterySummaryItem = {
  node: SkillNode;
  evidence: SkillEvidence;
  bucket: MasteryBucket;
};

export type MasterySummary = {
  known: MasterySummaryItem[];
  learning: MasterySummaryItem[];
  weak: MasterySummaryItem[];
  next: MasterySummaryItem[];
  mastered: MasterySummaryItem[];
};

const STAGE_RANK: Record<SkillStage, number> = {
  unseen: 0,
  exposed: 1,
  practicing: 2,
  passing: 3,
  mastered: 4,
};

/** Map curated DSA pattern keys → skill-graph pattern node ids. */
const PATTERN_KEY_TO_NODE: Record<string, string> = {
  hashmap: "dsa.pattern.hashmap",
  stack: "dsa.pattern.stack",
  "monotonic-stack": "dsa.pattern.stack",
  arrays: "dsa.pattern.arrays",
  matrix: "dsa.pattern.arrays",
  intervals: "dsa.pattern.arrays",
  "prefix-suffix": "dsa.pattern.arrays",
  "linked-list": "dsa.pattern.arrays",
  heap: "dsa.pattern.arrays",
  "bit-math": "dsa.pattern.arrays",
  "two-pointers": "dsa.pattern.two-pointers",
  "sliding-window": "dsa.pattern.sliding-window",
  "binary-search": "dsa.pattern.binary-search",
  "binary-search-answer": "dsa.pattern.binary-search",
  bfs: "dsa.pattern.bfs-dfs",
  "graph-dfs": "dsa.pattern.bfs-dfs",
  "grid-dfs": "dsa.pattern.bfs-dfs",
  "topo-sort": "dsa.pattern.bfs-dfs",
  "union-find": "dsa.pattern.bfs-dfs",
  "tree-dfs": "dsa.pattern.tree",
  "1d-dp": "dsa.pattern.dp",
  "2d-dp": "dsa.pattern.dp",
  kadane: "dsa.pattern.dp",
  backtracking: "dsa.pattern.backtracking",
  greedy: "dsa.pattern.greedy",
};

export async function loadSkillGraph(): Promise<SkillGraphFile> {
  const res = await fetch("/content/skill-graph.json");
  if (!res.ok) throw new Error("Failed to load skill graph");
  return res.json() as Promise<SkillGraphFile>;
}

export function emptySkillState(): SkillStateFile {
  return { version: 1, evidence: {} };
}

export function loadSkillState(): SkillStateFile {
  if (typeof localStorage === "undefined") return emptySkillState();
  try {
    const raw = localStorage.getItem(SKILL_STATE_KEY);
    if (!raw) return emptySkillState();
    const parsed = JSON.parse(raw) as SkillStateFile;
    if (!parsed || parsed.version !== 1 || typeof parsed.evidence !== "object") {
      return emptySkillState();
    }
    return parsed;
  } catch {
    return emptySkillState();
  }
}

export function saveSkillState(state: SkillStateFile): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(SKILL_STATE_KEY, JSON.stringify(state));
}

function ensureEvidence(state: SkillStateFile, nodeId: string): SkillEvidence {
  const existing = state.evidence[nodeId];
  if (existing) return existing;
  const created: SkillEvidence = {
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
  state.evidence[nodeId] = created;
  return created;
}

function bumpStage(ev: SkillEvidence, min: SkillStage): void {
  if (STAGE_RANK[ev.stage] < STAGE_RANK[min]) ev.stage = min;
}

function cloneState(state: SkillStateFile): SkillStateFile {
  return {
    version: 1,
    evidence: Object.fromEntries(
      Object.entries(state.evidence).map(([k, v]) => [k, { ...v }])
    ),
  };
}

/**
 * Seed evidence from boolean module progress + DSA solved maps (pure).
 */
export function seedSkillStateFromProgress(
  graph: SkillGraphFile,
  progress: Record<string, boolean>,
  dsaSolved: Record<string, boolean>,
  base: SkillStateFile = emptySkillState()
): SkillStateFile {
  const state = cloneState(base);
  for (const node of graph.nodes) {
    if (node.moduleRef) {
      const key = `${node.moduleRef.labId}:${node.moduleRef.moduleId}`;
      if (progress[key]) {
        const ev = ensureEvidence(state, node.id);
        bumpStage(ev, "passing");
        ev.mastery = Math.max(ev.mastery, 0.6);
        ev.lastTs = Math.max(ev.lastTs, Date.now());
      }
    }
    if (node.challengeRef && dsaSolved[node.challengeRef.challengeId]) {
      const ev = ensureEvidence(state, node.id);
      bumpStage(ev, "passing");
      ev.passes = Math.max(ev.passes, 1);
      ev.mastery = Math.max(ev.mastery, 0.7);
      ev.lastTs = Math.max(ev.lastTs, Date.now());
      for (const p of node.prereqs) {
        if (p.startsWith("dsa.pattern.")) {
          const pev = ensureEvidence(state, p);
          bumpStage(pev, "practicing");
          pev.mastery = Math.max(pev.mastery, 0.45);
          pev.lastTs = Math.max(pev.lastTs, Date.now());
        }
      }
    }
  }
  return state;
}

/**
 * Idempotent migration: rebuild from progress maps + persist snapshot.
 * Prefer {@link deriveSkillState} when events are available (avoids double-count).
 */
export function migrateSkillStateFromProgress(
  graph: SkillGraphFile,
  progress: Record<string, boolean>,
  dsaSolved: Record<string, boolean>
): SkillStateFile {
  const state = seedSkillStateFromProgress(graph, progress, dsaSolved);
  saveSkillState(state);
  return state;
}

/**
 * Rebuild skill evidence from progress maps + event log (idempotent).
 * Always starts empty so re-applying the same events does not inflate mastery.
 * Challenge nodes prefer event evidence over the boolean solved map when both exist.
 */
export function deriveSkillState(
  graph: SkillGraphFile,
  progress: Record<string, boolean>,
  dsaSolved: Record<string, boolean>,
  events: ProgressEvent[],
  options?: { persist?: boolean }
): SkillStateFile {
  const challenged = new Set(
    events
      .filter(
        (e) =>
          (e.type === "challenge_passed" || e.type === "challenge_failed") &&
          e.challengeId
      )
      .map((e) => e.challengeId as string)
  );
  const solvedWithoutEvents: Record<string, boolean> = {};
  for (const [id, ok] of Object.entries(dsaSolved)) {
    if (ok && !challenged.has(id)) solvedWithoutEvents[id] = true;
  }
  const seeded = seedSkillStateFromProgress(graph, progress, solvedWithoutEvents);
  return applyEventsToSkillState(graph, seeded, events, {
    persist: options?.persist !== false,
  });
}

export function findNodeByChallengeId(
  graph: SkillGraphFile,
  challengeId: string
): SkillNode | undefined {
  return graph.nodes.find((n) => n.challengeRef?.challengeId === challengeId);
}

export function findNodeByModuleRef(
  graph: SkillGraphFile,
  labId: string,
  moduleId: string
): SkillNode | undefined {
  return graph.nodes.find(
    (n) => n.moduleRef?.labId === labId && n.moduleRef?.moduleId === moduleId
  );
}

export function patternNodeIdFromKey(patternKey: string | undefined): string | null {
  if (!patternKey) return null;
  return PATTERN_KEY_TO_NODE[patternKey] ?? null;
}

export function recordChallengeResult(
  state: SkillStateFile,
  nodeId: string,
  passed: boolean,
  hintsUsed = 0
): SkillStateFile {
  const next = cloneState(state);
  const ev = { ...ensureEvidence(next, nodeId) };
  ev.attempts += 1;
  ev.lastTs = Date.now();
  ev.hintsUsed += hintsUsed;
  if (passed) {
    ev.passes += 1;
    const bump = hintsUsed > 0 ? 0.12 : 0.2;
    ev.mastery = Math.min(1, ev.mastery + bump);
    bumpStage(ev, ev.mastery >= 0.85 ? "mastered" : "passing");
  } else {
    ev.fails += 1;
    ev.mastery = Math.max(0, ev.mastery - 0.08);
    bumpStage(ev, "practicing");
  }
  next.evidence[nodeId] = ev;
  return next;
}

/**
 * Fold local event log into skill evidence (predict / challenge / module signals).
 * Pure except optional persist; returns updated state.
 */
export function applyEventsToSkillState(
  graph: SkillGraphFile,
  state: SkillStateFile,
  events: ProgressEvent[],
  options?: { persist?: boolean }
): SkillStateFile {
  const next = cloneState(state);
  const byChallenge = new Map<string, SkillNode>();
  const byModule = new Map<string, SkillNode>();
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
    const targetIds = new Set<string>([
      ...(evt.skillNodeIds ?? []),
      ...(moduleNode ? [moduleNode.id] : []),
      ...(challengeNode ? [challengeNode.id] : []),
    ]);

    for (const id of targetIds) {
      const ev = ensureEvidence(next, id);
      ev.lastTs = Math.max(ev.lastTs, evt.ts);
      switch (evt.type) {
        case "module_opened":
          bumpStage(ev, "exposed");
          break;
        case "prediction_submitted":
          ev.predictHits = (ev.predictHits ?? 0) + 1;
          ev.mastery = Math.min(1, ev.mastery + 0.04);
          bumpStage(ev, "practicing");
          break;
        case "prediction_skipped":
          ev.predictSkips = (ev.predictSkips ?? 0) + 1;
          bumpStage(ev, "exposed");
          break;
        case "module_completed":
        case "exercise_passed":
        case "review_submitted":
          bumpStage(ev, "passing");
          ev.mastery = Math.max(ev.mastery, 0.6);
          ev.passes = Math.max(ev.passes, 1);
          break;
        case "challenge_passed": {
          ev.attempts += 1;
          ev.passes += 1;
          const hints = typeof evt.meta?.hintsUsed === "number" ? evt.meta.hintsUsed : 0;
          ev.hintsUsed += hints;
          ev.mastery = Math.min(1, ev.mastery + (hints > 0 ? 0.12 : 0.2));
          bumpStage(ev, ev.mastery >= 0.85 ? "mastered" : "passing");
          break;
        }
        case "challenge_failed":
          ev.attempts += 1;
          ev.fails += 1;
          ev.mastery = Math.max(0, ev.mastery - 0.08);
          bumpStage(ev, "practicing");
          break;
        case "hint_revealed":
          ev.hintsUsed += 1;
          bumpStage(ev, "practicing");
          break;
        default:
          break;
      }
    }

    // Pattern node evidence from challenge events
    if (challengeNode && (evt.type === "challenge_passed" || evt.type === "challenge_failed")) {
      for (const p of challengeNode.prereqs) {
        if (!p.startsWith("dsa.pattern.")) continue;
        const pev = ensureEvidence(next, p);
        pev.lastTs = Math.max(pev.lastTs, evt.ts);
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

  if (options?.persist !== false) saveSkillState(next);
  return next;
}

/**
 * Build evidence-backed progress buckets for Progress UI.
 */
export function buildMasterySummary(
  graph: SkillGraphFile,
  state: SkillStateFile,
  nextLimit = 3
): MasterySummary {
  const summary: MasterySummary = {
    known: [],
    learning: [],
    weak: [],
    next: [],
    mastered: [],
  };

  const contentNodes = graph.nodes.filter(
    (n) =>
      n.kind !== "language" &&
      (n.moduleRef || n.challengeRef || n.kind === "pattern") &&
      !n.tags?.includes("scaffold")
  );

  for (const node of contentNodes) {
    const ev = state.evidence[node.id] ?? {
      nodeId: node.id,
      attempts: 0,
      passes: 0,
      fails: 0,
      hintsUsed: 0,
      lastTs: 0,
      mastery: 0,
      stage: "unseen" as SkillStage,
    };

    if (ev.stage === "mastered" || ev.mastery >= 0.85) {
      summary.mastered.push({ node, evidence: ev, bucket: "mastered" });
      continue;
    }
    if (ev.fails > 0 && ev.mastery < 0.5) {
      summary.weak.push({ node, evidence: ev, bucket: "weak" });
      continue;
    }
    if (ev.stage === "passing" || (ev.mastery >= 0.55 && ev.mastery < 0.85)) {
      summary.known.push({ node, evidence: ev, bucket: "known" });
      continue;
    }
    if (
      ev.stage === "practicing" ||
      ev.stage === "exposed" ||
      (ev.attempts > 0 && ev.mastery < 0.55)
    ) {
      summary.learning.push({ node, evidence: ev, bucket: "learning" });
    }
  }

  const recs = recommendNext(graph, state, nextLimit);
  for (const r of recs) {
    const ev = state.evidence[r.node.id] ?? {
      nodeId: r.node.id,
      attempts: 0,
      passes: 0,
      fails: 0,
      hintsUsed: 0,
      lastTs: 0,
      mastery: 0,
      stage: "unseen" as SkillStage,
    };
    summary.next.push({ node: r.node, evidence: ev, bucket: "next" });
  }

  const byMasteryDesc = (a: MasterySummaryItem, b: MasterySummaryItem) =>
    b.evidence.mastery - a.evidence.mastery || b.evidence.lastTs - a.evidence.lastTs;
  summary.mastered.sort(byMasteryDesc);
  summary.known.sort(byMasteryDesc);
  summary.learning.sort(byMasteryDesc);
  summary.weak.sort(
    (a, b) => b.evidence.fails - a.evidence.fails || a.evidence.mastery - b.evidence.mastery
  );

  return summary;
}

function prereqsMet(
  node: SkillNode,
  evidence: Record<string, SkillEvidence>,
  byId: Map<string, SkillNode>
): boolean {
  return node.prereqs.every((id) => {
    const prereq = byId.get(id);
    if (prereq?.kind === "language") return true;
    const ev = evidence[id];
    if (!ev) return false;
    return STAGE_RANK[ev.stage] >= STAGE_RANK.passing;
  });
}

/**
 * Related lab concepts for a DSA pattern key (soft bridges).
 */
export function relatedLabConcepts(
  graph: SkillGraphFile,
  patternKeyOrNodeId: string
): SkillNode[] {
  const byId = new Map(graph.nodes.map((n) => [n.id, n]));
  const nodeId =
    patternNodeIdFromKey(patternKeyOrNodeId) ??
    (byId.has(patternKeyOrNodeId) ? patternKeyOrNodeId : null);
  if (!nodeId) return [];
  const pattern = byId.get(nodeId);
  if (!pattern) return [];
  const ids = [...(pattern.related ?? []), ...pattern.prereqs];
  const out: SkillNode[] = [];
  const seen = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) continue;
    seen.add(id);
    const n = byId.get(id);
    if (n?.moduleRef && n.kind === "concept") out.push(n);
  }
  return out;
}

/**
 * Deterministic, explainable next-step picker (SKILL_GRAPH.md §4 + Phase 8 cross-lab).
 */
export function recommendNext(
  graph: SkillGraphFile,
  state: SkillStateFile,
  limit = 3
): NextStepRecommendation[] {
  type Scored = NextStepRecommendation & { score: number };
  const candidates: Scored[] = [];
  const byId = new Map(graph.nodes.map((n) => [n.id, n]));

  // Weak related concepts after failed challenges → boost lab revisit
  const weakRelatedBoost = new Map<string, number>();
  for (const node of graph.nodes) {
    const ev = state.evidence[node.id];
    if (!ev || ev.fails === 0) continue;
    if (node.kind === "challenge" || node.kind === "pattern") {
      for (const rel of [...(node.related ?? []), ...node.prereqs]) {
        const target = byId.get(rel);
        if (target?.moduleRef) {
          weakRelatedBoost.set(rel, (weakRelatedBoost.get(rel) ?? 0) + ev.fails);
        }
      }
    }
  }

  for (const node of graph.nodes) {
    if (node.kind === "language") continue;
    if (node.tags?.includes("scaffold") || node.tags?.includes("planned")) continue;
    const ev = state.evidence[node.id];
    if (ev?.stage === "mastered") continue;
    if (!prereqsMet(node, state.evidence, byId) && node.prereqs.length > 0) continue;
    if (!node.moduleRef && !node.challengeRef) continue;

    const prereqTitles = node.prereqs
      .map((id) => byId.get(id)?.title ?? id)
      .filter((_, i) => byId.get(node.prereqs[i])?.kind !== "language")
      .join(", ");

    let reason =
      !prereqTitles ? `Start here: ${node.title}.` : `Prerequisites met: ${prereqTitles}.`;

    if (ev && ev.fails > 0) {
      reason += ` You have ${ev.fails} fail(s) — reinforce this node.`;
    } else if ((ev?.predictSkips ?? 0) >= 2 && (ev?.predictHits ?? 0) === 0) {
      reason += ` You skipped predictions repeatedly — revisit before advancing.`;
    } else if (weakRelatedBoost.has(node.id)) {
      reason += ` Transfer: related judged practice needs this lab concept.`;
    } else if (node.moduleRef) {
      const labLabel =
        node.language === "javascript"
          ? "JS"
          : node.language === "typescript"
            ? "TS"
            : node.language === "python"
              ? "Python"
              : "Lab";
      reason += ` Open ${labLabel} module ${node.moduleRef.moduleId}.`;
    } else if (node.challengeRef) {
      reason += ` Practice judged challenge ${node.challengeRef.challengeId}.`;
    }

    // Cross-lab related evidence in reason
    if (node.related?.length) {
      const cross = node.related
        .map((id) => byId.get(id))
        .filter((n): n is SkillNode => !!n && n.language !== node.language)
        .slice(0, 2);
      if (cross.length) {
        reason += ` Bridges: ${cross.map((c) => c.title).join(", ")}.`;
      }
    }

    let score = 0;
    if (node.moduleRef) score += 3;
    if (node.challengeRef) score += 2;
    if (ev?.fails) score += ev.fails * 1.5;
    if (ev?.stage === "practicing") score += 1.2;
    if (!ev || ev.stage === "unseen") score += 0.5;
    if (node.tags?.includes("ready")) score += 1;
    if (weakRelatedBoost.has(node.id)) score += 2 + weakRelatedBoost.get(node.id)!;
    if ((ev?.predictSkips ?? 0) >= 2) score += 1.5;
    // Prefer diversity: slight boost for under-represented language in evidence
    if (node.language && node.language !== "cross") {
      const langEvidence = Object.values(state.evidence).filter((e) => {
        const n = byId.get(e.nodeId);
        return n?.language === node.language && STAGE_RANK[e.stage] >= STAGE_RANK.passing;
      }).length;
      if (langEvidence === 0) score += 0.8;
    }

    candidates.push({ node, reason, score });
  }

  candidates.sort((a, b) => b.score - a.score || a.node.id.localeCompare(b.node.id));
  return candidates.slice(0, limit).map(({ node, reason }) => ({ node, reason }));
}

/** Pure graph validation helpers for tests. */
export function findNode(graph: SkillGraphFile, id: string): SkillNode | undefined {
  return graph.nodes.find((n) => n.id === id);
}

export function validateGraphIds(graph: SkillGraphFile): string[] {
  const ids = new Set(graph.nodes.map((n) => n.id));
  const errors: string[] = [];
  for (const n of graph.nodes) {
    for (const p of n.prereqs) {
      if (!ids.has(p)) errors.push(`${n.id} missing prereq ${p}`);
    }
    for (const r of n.related ?? []) {
      if (!ids.has(r)) errors.push(`${n.id} missing related ${r}`);
    }
  }
  return errors;
}

export function countCrossLabBridges(graph: SkillGraphFile): {
  jsTs: number;
  labDsa: number;
} {
  const byId = new Map(graph.nodes.map((n) => [n.id, n]));
  let jsTs = 0;
  let labDsa = 0;
  for (const n of graph.nodes) {
    for (const r of n.related ?? []) {
      const other = byId.get(r);
      if (!other) continue;
      const a = n.language;
      const b = other.language;
      if (
        (a === "javascript" && b === "typescript") ||
        (a === "typescript" && b === "javascript")
      ) {
        jsTs += 1;
      }
      if (
        (n.kind === "pattern" && other.kind === "concept") ||
        (n.kind === "concept" && other.kind === "pattern")
      ) {
        labDsa += 1;
      }
    }
  }
  return { jsTs, labDsa };
}
