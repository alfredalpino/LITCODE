# Learning Engine — Phase 2

**Status:** Target architecture (planning)  
**Date:** 2026-09-30  
**Companions:** `PRODUCT_ARCHITECTURE.md`, `SKILL_GRAPH.md`, `LAB_ARCHITECTURE.md`

**Legend:** **Current** · **Target** · **Non-goal**

---

## 1. Purpose

Turn laboratory *pedagogy* (already strong in filled markdown modules) into a **product system** that:

1. Runs a consistent practice loop  
2. Records evidence of skill  
3. Feeds the skill graph’s “what next?”  
4. Supports interview-shaped DSA practice without becoming LeetCode

**Current:** Conventions in lab folders + binary progress (`src/lib/progress.ts`) + DSA solved map (`src/lib/stats.ts`). No spaced-repetition scheduler, no predict gate, no mastery model in software.

---

## 2. Domain model

```text
Concept → Skill → Exercise → Challenge → Project → Assessment → Mastery
```

| Entity | Definition | Examples | Persistence |
|---|---|---|---|
| **Concept** | Teachable idea | Closures; Event loop; Python name binding; TS structural typing | Skill graph node |
| **Skill** | Observable capability over one or more concepts | “Predict closure output”; “Implement two-sum with hashmap” | Graph node + evidence |
| **Exercise** | Short guided practice inside a module | `exercises/`, experiment scripts | Content files; attempt events |
| **Challenge** | Verifiable task with tests or rubric | Lab `challenges/`; DSA `hasJudge: true` | Content + judge results |
| **Project** | Multi-file synthesis | JS `39-project-lab`, `40-capstone` (mostly scaffolds **Current**) | Later |
| **Assessment** | Checkpoint across a cluster | Pattern quiz; timed mini-set | Target |
| **Mastery** | Aggregate confidence from evidence | Score / stage per skill node | Derived, not hand-toggled alone |

IDs should be stable strings (e.g. `js.closures`, `dsa.pattern.hashmap`, `challenge.two-sum-seed`) shared with `SKILL_GRAPH.md`.

---

## 3. Core learning loop

### Canonical loop (Target)

```text
Predict → Experiment → Break → Debug → Fix → Understand → Build
```

| Stage | Learner action | Product support |
|---|---|---|
| **Predict** | Write expected output/type/behavior *before* run | Soft gate UI; store prediction text |
| **Experiment** | Run prepared or edited code | Runner + console (**Current**) |
| **Break** | Mutate code to violate assumptions | Prompts / break-the-code content |
| **Debug** | Read errors, use debug folders | Debug docs + console |
| **Fix** | Restore correct behavior | Editor |
| **Understand** | Explain in own words / review.md | Review prompt; optional short note |
| **Build** | Transfer to exercise/challenge/project | Deep links to Challenges |

This matches lab doctrine (Learn → Predict → Code → Run → Break → Explain) with explicit Debug/Fix/Build for interview transfer.

### Soft vs hard enforcement

| Mode | Behavior | When |
|---|---|---|
| **Soft (default v1)** | Prompt for prediction; allow skip with “I want to peek”; log skip | All ready modules |
| **Hard (opt-in per module)** | Require non-empty prediction before first Run | Modules with `loop` metadata flag |
| **Honor system (Current)** | Markdown says predict first; app does not enforce | Being replaced gradually |

**Non-goal:** Punitive lockdown that blocks exploration — laboratories need curiosity.

---

## 4. Progress persistence strategy

### Current keys (keep; version carefully)

| Key | Shape |
|---|---|
| `sde-lab-studio-progress-v1` | `{ [labId:moduleId]: boolean }` |
| `sde-dsa-solved-v1` | solved map |
| `sde-favorites-v1`, `sde-lab-streak-v1` | prefs / habit |
| `sde-lab-profile-v1` | profile |

### Target local-first event log

Append-only events in `localStorage` (or IndexedDB if size bites):

```ts
type ProgressEvent = {
  id: string;          // uuid
  ts: number;
  type:
    | "module_opened"
    | "prediction_submitted"
    | "prediction_skipped"
    | "run"
    | "break_attempt"
    | "hint_revealed"
    | "exercise_passed"
    | "challenge_passed"
    | "challenge_failed"
    | "review_submitted"
    | "module_completed"
    | "assessment_passed";
  labId?: string;
  moduleId?: string;
  challengeId?: string;
  skillNodeIds?: string[];
  meta?: Record<string, unknown>;
};
```

**Derived views:** module complete (compatible with today’s boolean map), mastery scores, streak.

**Upgrade path (`DEC-006`):** When auth lands, sync event log / snapshots to backend; resolve conflicts by union of events + max mastery. Do not block Phase 3–5 on sync.

**Export (Target nice-to-have):** JSON download of progress for learners — builds trust and Pro story.

---

## 5. Feedback, hints, diagnostics

| Layer | Current | Target |
|---|---|---|
| Runtime errors | Console error lines | Map common errors to concept tips (small static dict, not ML) |
| DSA judge | Pass/fail deep-equal | Per-test visible results; hidden tests summary only |
| Hints | Solutions in synced tree (temptation to peek) | Collapsed ladder: Hint 1 → 2 → … → Solution; log `hint_revealed` |
| Lab review | `review.md` content | Checkbox “I can explain X” + optional free text |
| Fake stats | Deterministic fake acceptance | **Remove or relabel** as non-metric |

**Diagnostics principle:** Prefer teaching signals over gamified noise.

---

## 6. Interview mode for DSA

**Current:** `/interview` is largely the same shell with section tweaks — not a distinct engine (`ARCHITECTURE_AUDIT.md`).

**Target:** Interview mode is a **presentation + constraint profile** over **judged** challenges only.

### Required problem payload (mostly already on `DsaProblem`)

| Field | Role | Current support |
|---|---|---|
| Statement / description | Read before code | Yes |
| Constraints | Interview realism | Yes |
| Examples | Worked samples | Yes |
| Visible tests | Run | `tests` array |
| Hidden tests | Submit | Same array can be split by flag (**Target**) |
| Starter code | JS/TS/Python | Yes |
| Pattern / topics | Transfer + graph | Partial (`pattern`, `topics`) |
| Companies | Optional filter | Yes (packs) |

### Interview session UX (Target)

1. Statement-first pane (code collapsed or secondary on desktop; mobile Read first).  
2. **Run** = visible tests only.  
3. **Submit** = visible + hidden; mark solved only on full pass.  
4. Show coarse **runtime** (client elapsed ms) — honest label “browser timing, not judge hardware.”  
5. Memory: **Non-goal** as precise RSS; optional later via isolate instrumentation.  
6. After solve: show **pattern** + linked lab concepts (“Understand / Build” step).  
7. Optional timer (user-toggled) — not a global contest clock.

### What Interview mode must not do in v1

- Live multiplayer contests  
- Ranked Elo  
- Server anti-cheat  
- Rely on LeetCode outbound as “submit”

---

## 7. App-enforced vs markdown-pedagogy

| Concern | Markdown (content labs) | App-enforced (studio) |
|---|---|---|
| Conceptual explanations | **Primary** | Rendering only |
| Misconception callouts | **Primary** | Optional callout component |
| Predict-before-run | Instructed today | **Soft/hard gate Target** |
| Hint order | Folder naming / docs | Ladder UI + logging |
| Module “complete” | `PROGRESS.md` culture | Boolean + evidence events |
| Skill prerequisites | Curriculum narrative | Skill graph edges |
| Judge correctness | N/A for prose | DSA harness |
| Spaced review | Stub folders exist | Scheduler **later** (Phase 5+); not v1 blocker |
| Tone / doctrine (engine vs language) | **Primary IP** | Never replace with generic AI blurb |

**Rule:** Software amplifies discipline; it does not replace authored pedagogy.

---

## 8. Quality bar: “shippable” learning units

A **ready module** must include:

1. Primary lesson (`README.md` or `LAB.md`)  
2. At least one runnable experiment or exercise  
3. Predict or break affordance (folder or in-lesson tasks)  
4. Review / explain prompt  
5. Catalog `status: ready`

A **shippable judged challenge** must include:

1. Clear statement, constraints, examples  
2. Starters for supported languages  
3. ≥1 visible and ≥1 hidden test (or explicit single-stage with disclosure)  
4. Pattern tag + skill node id  
5. `hasJudge: true` with tests that actually run in `judgeSolution`

Scaffolds and LC link-outs may remain in the repo but must not count toward shippable metrics.

---

## 9. Non-goals for learning engine v1

- Full SRS algorithm (SM-2 etc.) as launch blocker  
- Proctored certification exams  
- Mandatory social accountability  
- AI auto-generating curriculum as source of truth  
- Replacing lab authors with template generators at scale  
