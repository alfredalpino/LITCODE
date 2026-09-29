# Skill Graph — Phase 2

**Status:** Target architecture (planning)  
**Date:** 2026-09-30  
**Companions:** `LEARNING_ENGINE.md`, `PRODUCT_ARCHITECTURE.md`

**Legend:** **Current** · **Target** · **Non-goal**

---

## 1. Purpose & anti-overengineering

Provide the **simplest graph that scales**:

- Answer “what should I learn next?” from **performance signals**  
- Link Labs ↔ Challenges without a graph database  
- Stay editable as JSON by humans

**Current:** Topics/tags on DSA items; folder names in labs; **no** navigable prerequisite graph.

**Non-goals:** Neo4j, ML recommenders, fine-grained knowledge tracing models, auto-inferred graphs from embeddings (v1).

---

## 2. Graph schema

### Node kinds

```text
Language → Concept → Pattern → Challenge → Project → Assessment → Mastery*
```

\* **Mastery** is usually a **derived state** on a Concept/Pattern/Skill node, not a separate content node. Optionally represent as `kind: "mastery_gate"` assessment nodes.

### Node record (Target)

```ts
type SkillNodeKind =
  | "language"
  | "concept"
  | "pattern"
  | "challenge"
  | "project"
  | "assessment";

interface SkillNode {
  id: string;                 // stable: "js.closures"
  kind: SkillNodeKind;
  title: string;
  language?: "javascript" | "typescript" | "python" | "cross";
  summary?: string;
  /** Prerequisite node ids (DAG). Prefer this over a separate edges array for simplicity. */
  prereqs: string[];
  /** Soft transfer links (Phase 8) — not AND-gating; used for JS↔TS and pattern↔lab UI/next-step. */
  related?: string[];
  /** Content bindings */
  moduleRef?: { labId: string; moduleId: string };
  challengeRef?: { challengeId: string };
  tags?: string[];
}
```

### Evidence & mastery (client-derived)

```ts
interface SkillEvidence {
  nodeId: string;
  attempts: number;
  passes: number;
  fails: number;
  hintsUsed: number;
  lastTs: number;
  /** 0–1 heuristic */
  mastery: number;
  stage: "unseen" | "exposed" | "practicing" | "passing" | "mastered";
}

interface SkillGraphFile {
  version: 1;
  updatedAt: string;
  nodes: SkillNode[];
}

interface SkillStateFile {
  version: 1;
  evidence: Record<string, SkillEvidence>;
}
```

**Edges:** `prereqs[]` on nodes is enough for v1. Add explicit `edges: {from,to,rel}[]` only if multiple relation types become necessary (e.g. `teaches` vs `requires`).

---

## 3. Example subgraphs

### JavaScript (excerpt)

```text
javascript
  ├─ js.orientation           (00) Ready
  ├─ js.runtime               (01) Ready
  ├─ js.values-types          (02) Ready — Phase 5
  ├─ js.variables             (03) Ready — Phase 5
  ├─ js.operators             (04) Ready — Phase 5
  ├─ js.control-flow          (05) Ready — Phase 5
  ├─ js.functions             (06) Ready — Phase 5
  ├─ js.scope                 (07) Ready — Phase 5  prereqs: [js.functions]
  ├─ js.closures              (08) Ready — Phase 5  prereqs: [js.scope]
  ├─ js.objects               (09) Ready — Phase 5
  ├─ js.prototypes            (10) Ready — Phase 5  prereqs: [js.objects]
  ├─ js.classes               (11) Ready — Phase 5  prereqs: [js.prototypes]
  ├─ js.arrays                (12) Ready — Phase 5  prereqs: [js.classes]
  ├─ js.this                  (15)  prereqs: [js.functions, js.objects]  // scaffold module
  ├─ js.event-loop            (17)  prereqs: [js.runtime]
  ├─ js.promises              (18)  prereqs: [js.event-loop]
  └─ js.async                 (16)  prereqs: [js.promises]
```

**Ready anchors (Phase 5):** `javascript/00`–`12` — remaining concept nodes for `13+` stay planned until those modules fill.

### Python DSA foundations (excerpt)

```text
python
  ├─ py.runtime               (00-python-runtime)   Current ready
  ├─ py.values-types          (01)                  Current ready
  ├─ py.bindings              (02)                  Current ready
  ├─ py.control-flow          (03)                  Current ready
  ├─ dsa.pattern.arrays       prereqs: [py.control-flow]
  ├─ dsa.pattern.hashmap      prereqs: [py.values-types]
  ├─ dsa.pattern.two-pointers prereqs: [dsa.pattern.arrays]
  └─ challenge.*              prereqs: matching pattern
```

### TypeScript (excerpt)

```text
typescript
  ├─ ts.runtime-boundary      (00) Current ready
  ├─ ts.toolchain             (01) Current ready
  ├─ ts.basic-types           (02) Current ready
  ├─ ts.inference             (03) Current ready
  ├─ ts.predict-the-type      (cross-lab — Target re-include in sync)
  └─ ts.will-it-compile       (cross-lab — Target)
```

### Pattern → Challenge bridge (example)

```text
dsa.pattern.hashmap
  prereqs: [js.objects] or [py.values-types]  // language track dependent
  ← challenge.two-sum-seed (hasJudge Current)
  ← challenge.group-anagrams (Target curated)
```

Keep bridges **sparse and curated** — quality over linking every LC title.

---

## 4. “What should I learn next?”

### Algorithm (v1 — deterministic, explainable)

1. **Filter** nodes whose `prereqs` are all `stage >= passing` (or prereqs empty).  
2. **Exclude** `mastered`.  
3. **Prefer** nodes with `moduleRef`/`challengeRef` that exist and are ready.  
4. **Score** candidates:
   - Higher weight: concepts with prior `fails` or low mastery on dependents the user attempted  
   - Medium: next concept in language track order  
   - Boost: pattern whose challenges were failed recently  
5. **Return** top 1–3 with human reasons (“Prerequisites met: Closures. You failed 2 hashmap challenges.”).

### Signals consumed

From `LEARNING_ENGINE` events:

| Signal | Effect |
|---|---|
| `challenge_failed` | Lower mastery; recommend prereq lab or easier sibling |
| `challenge_passed` (no hints) | Strong mastery bump |
| `hint_revealed` | Smaller bump on pass |
| `prediction_skipped` repeatedly | Soft recommend revisit concept |
| `module_completed` | Mark exposed/passing for linked concept |

**No black-box ranking** in v1 — every recommendation must be printable as a sentence.

---

## 5. Storage / API shape

### Phase now (local)

| Artifact | Location | Writer |
|---|---|---|
| Authored graph | `public/content/skill-graph.json` (or `/public/skill-graph.json`) | Humans / rare codegen |
| Evidence state | `localStorage` key `sde-skill-state-v1` | Studio |
| Optional cache | IndexedDB if events grow | Studio |

Load graph like catalog (`src/lib/content.ts` pattern).

### Later (auth)

```http
GET  /api/skill-graph          # static or CMS
GET  /api/me/skill-state
PUT  /api/me/skill-state       # snapshot
POST /api/me/skill-events      # append batch
```

Same JSON shapes — no early GraphQL.

### Mapping from Current progress

On first load of skill state:

- For each `labId:moduleId` true in `sde-lab-studio-progress-v1`, if a node has that `moduleRef`, set `stage` at least `passing` with weak mastery (e.g. 0.6).  
- For DSA solved ids, bump linked challenge/pattern nodes.

Idempotent migration; keep old keys.

---

## 6. Authoring workflow

1. Add/fill lab module or judged challenge.  
2. Add/update **one** skill node + `prereqs`.  
3. Point `moduleRef` / `challengeRef`.  
4. Sync content as today; commit graph JSON with the content PR.  
5. UI “Next” picks up automatically.

Avoid generating thousands of nodes from the 2501 LC index — **curated only**.

---

## 7. UI surfaces (Target)

| Surface | Behavior |
|---|---|
| Progress | List languages → mastery bars for concepts |
| Skill Graph | Simple indented tree or small DAG (not a physics toy) |
| Module / Challenge footer | “Related skills” + “Next up” |
| Profile | Top skills summary |

**Non-goal:** Fancy force-directed graph as the primary nav.

---

## 8. Scaling rule

If the graph exceeds ~300 curated nodes, split files per language (`skill-graph/javascript.json`, …) and merge at load. Until then, **one file**.

If recommendations feel wrong, fix **content links and prereqs** before adding ML.
