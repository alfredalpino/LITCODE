# Lab Architecture — Phase 2

**Status:** Target architecture (planning)  
**Date:** 2026-09-30  
**Companion:** `PRODUCT_ARCHITECTURE.md`, `LEARNING_ENGINE.md`  
**Evidence base:** `sde-laboratory-studio/` (LITCODE product shell) + sibling lab folders + `scripts/sync-content.mjs`

**Legend:** **Current** · **Target** · **Non-goal**

---

## 1. Mental model

```text
Sibling content labs (source of truth)
        │  sync-content.mjs (predev/prebuild)
        ▼
public/content/{labId}/ + catalog.json
        │  fetch via src/lib/content.ts
        ▼
Studio shell (Next App Router + StudioProvider)
        │
        ├─ Reader (markdown)
        ├─ Workbench (Monaco + console)
        ├─ Execution facade (language runners)
        └─ Progress adapters (localStorage → later API)
```

**Current reality:** One client-heavy shell (`StudioShell` / `StudioProvider`), dual `AppMode` (`labs` | `dsa` in `src/types.ts`), no real terminal/FS, runners in page context (`src/lib/runner.ts`).

---

## 2. Shared laboratory infrastructure

Shared across JS / Python / TypeScript labs (and Challenge workbench where applicable):

| Capability | Current | Target v1 | Notes |
|---|---|---|---|
| **Editor** | Monaco (`@monaco-editor/react`) | Keep; lazy-load; language-aware defaults | Do not replace |
| **Console / log** | In-app console lines from runners | Keep; structured pass/fail panels for judges | |
| **Terminal** | Absent | **Non-goal** for v1 | Fake terminal adds complexity without Node fidelity |
| **Virtual FS** | Single buffer / code files list from catalog | Optional multi-tab buffers for projects only | Full FS emulator deferred |
| **Test runner** | DSA `judgeSolution` deep-equal; lab exercises mostly manual | Shared `Harness` interface: visible tests, hidden tests, timeouts | Labs may use light asserts; DSA uses full judge |
| **Execution** | JS `AsyncFunction`, TS Sucrase→JS, Python Pyodide CDN | Same APIs behind `run(language, code, opts)` + **isolate later** | See §5 |
| **Challenges UI** | Lab `challenges/` docs + DSA arena | Unified “Challenge” chrome with kind=`lab` \| `dsa` | |
| **Hints** | Markdown progressive solutions in content | Hint ladder UI (Level 1…n); spoilers collapsed | Solutions still in sync — UI discipline first |
| **Progress** | `sde-lab-studio-progress-v1` boolean map | Event-enriched progress (see learning engine) | Keep key versioning |
| **Nav** | Top bar modes + left rail | Labs / Challenges / Progress / Profile; demote Contest | Preserve keyboard ⌘/Ctrl+Enter |
| **Themes** | Settings localStorage; fonts Instrument Sans + JetBrains Mono | Keep; add reduced-motion respect | |

### Shared contracts (Target)

```ts
// Conceptual — not implemented in Phase 2
interface LabRuntime {
  language: "javascript" | "typescript" | "python";
  run(code: string, opts?: RunOpts): Promise<RunResult>;
  // Target: runInIsolate(...) after Worker/iframe work
}

interface ContentModuleMeta {
  id: string;
  status: "scaffold" | "ready" | "deprecated";
  loop: ("predict" | "experiment" | "break" | "explain")[];
  skillNodeIds?: string[];
}
```

---

## 3. How three labs share vs specialize

| Concern | Shared | JavaScript | TypeScript | Python DSA |
|---|---|---|---|---|
| Catalog shape | `Lab` / `LabModule` in `src/types.ts` | `labId: javascript` | `typescript` | `python-dsa` |
| Pedagogy folders | `experiments`, `predictions`, `challenges`, `debug`, … via `categorize()` in sync | Strong predict-the-output tradition | Type-prediction / compile-boundary doctrine | `LAB.md` + anti-notebook early stance |
| Runner | Facade | **Current:** `AsyncFunction` same origin | **Current:** Sucrase strip types | **Current:** Pyodide 0.27.x CDN |
| Fidelity limits | Browser host | No real Node `fs`/`require` (stubs/warns in `runner.ts`) | No real `tsc` diagnostics in-browser | Slow first load; not CPython native |
| Curriculum depth | Sync mirrors whatever exists | **Current:** ~2 ready of 41 dirs | **Current:** 4 solid modules | **Current:** 4 solid modules |

**Specialization rule:** Language-specific pedagogy stays in sibling lab markdown/code. Studio specializes only via **runtime adapter + language chrome**, not forked shells.

**Target improvement:** Re-evaluate `excludeDirs` for TypeScript cross-labs (`will-it-compile`, `predict-the-type`, etc. currently skipped in `sync-content.mjs`) — those folders are high-pedagogy and should become first-class modules or a separate catalog section once ready.

---

## 4. Content model & sync pipeline

### Intent to preserve (`DEC-003`)

- Source of truth remains:
  - `javascript-laboratory/`
  - `python-dsa-laboratory/`
  - `typescript-development-laboratory/`
- Studio builds via `scripts/sync-content.mjs` → `public/content/catalog.json` + mirrored files.
- `predev` / `prebuild` continue to hook sync.
- Deploy/CI mode that keeps committed `public/content` when siblings are missing (**Current** exit path in sync script) stays valid.

### Content object model

| Object | Source | Consumed by |
|---|---|---|
| Lab | Sync LABS config | Studio lab switcher |
| Module (`NN-slug`) | Numbered dirs | Left rail |
| Doc / CodeFile | Walk + `categorize()` | Reader / editor tabs |
| DSA index / seeds | `scripts/generate-dsa-bank.mjs` + packs | Challenges |
| Skill graph (Target) | Authored `skill-graph.json` | Progress / next-step |

### Catalog honesty extension (Target — Phase 3)

Extend sync (or a thin post-pass) so each module gets:

| Field | Derivation (simple heuristics) |
|---|---|
| `status: scaffold \| ready` | Scaffold if README contains scaffold marker / lacks `experiments`+runnable code; ready if primary doc + code under experiments/exercises |
| `hasPredictions` | `predictions/` present |
| `hasChallenges` | `challenges/` present |

UI badges consume these fields (`DEC-010`). Do not invent readiness by curriculum markdown alone.

### Packaging roadmap (not Phase 2 implementation)

Keep siblings now. Later choose one when clone/deploy pain dominates:

1. Git submodules / subtree  
2. Published content package  
3. True monorepo  

Document the choice in a future DEC when migrating — do not merge recklessly.

---

## 5. Execution security model

### Current (honest)

| Runtime | Mechanism | Boundary |
|---|---|---|
| JS | `new AsyncFunction(...)` in page | **Same origin as app** — not a sandbox |
| TS | Sucrase → JS runner | Same |
| Python | Pyodide from jsDelivr | WASM in page; CDN trust surface |
| DSA judge | Deep-equal in client | Same process as UI |

`DEC-008`: label honestly; harden before multi-tenant.

### Target rules (non-negotiable)

1. **Never** execute untrusted learner code in the **primary app process** once multi-user, shared content, or contests exist.
2. Isolation path: **Dedicated Worker and/or sandboxed iframe** with opaque origin, tight CSP, no privileged cookies, structured message protocol for console/results.
3. Time/memory budgets enforced in the isolate; kill runaway loops.
4. Hidden tests stay in client for v1 judged seeds (acceptable for learning trust model); move to server judge only when cheating resistance matters (Pro contests / certifications) — **not** a v1 requirement.
5. CSP / COOP / COEP headers on Netlify when isolation lands (`netlify.toml` today only sets Cache-Control for `/content/*` and `/dsa/*`).
6. Pyodide: pin version; prefer self-host over unbounded CDN when going multi-tenant.

### Threat tiers

| Tier | Audience | Required isolation |
|---|---|---|
| Personal / local | Author, trusted | Current OK with honest labeling |
| Public anonymous SaaS | Strangers | Worker/iframe + CSP minimum |
| Contests / shared snippets | Adversarial | Isolate + rate limits + later server judge |

---

## 6. Performance budgets (lab UX)

Budgets are **contracts for Phase 3–6**, not current measurements.

| Interaction | Budget (Target) | Strategy |
|---|---|---|
| Shell interactive (cached) | ≤ 3s on mid laptop | Code-split Monaco; defer Pyodide |
| Open ready lab module | ≤ 1s to readable lesson | Cache catalog; lazy fetch docs |
| First JS/TS run (warm) | ≤ 200ms to first console line | Keep AsyncFunction/Sucrase path |
| First Python run (cold) | Progress UI < 1s; runtime may take longer | Explicit “loading Pyodide…” — never silent hang |
| DSA list first paint | ≤ 2s | Do not block on full 1MB+ index; progressive load / default **judged-only** slice |
| Theme / pane toggle | ≤ 100ms | CSS variables; avoid remounting Monaco |

**Anti-patterns:** Fetching entire company packs + full LC index before first paint; loading Pyodide on JS-only sessions.

---

## 7. Migration path: Labs ↔ Problems without destroying UX

**Problem:** Dual surfaces feel like two products; home defaults to Problems; scaffolds look ready; most DSA is link-out.

### Principles

1. **No big-bang deletion** of `/problems`, company filters, or LC index overnight.  
2. **Progressive honesty** then **progressive centrality** of labs.  
3. Preserve working Monaco + run + mark-complete flows.

### Steps (implementation phases)

| Step | Change | Risk control |
|---|---|---|
| A | Badge `scaffold` / `ready`; filter “Ready only” | Low — additive |
| B | Default Challenges list to `hasJudge` or “Skill Bridge” curated set; LC link-out under “External practice” | Medium — power users can still access full index via toggle |
| C | Cross-links: module → related pattern challenges; challenge → prerequisite lab | Low |
| D | Reframe nav labels (Labs / Challenges / Interview); Contest → hidden or “Coming later” | Low |
| E | Soft-change default home to hub or last session | Medium — feature-flag |
| F | Interview mode uses **only** judged problems | Low |

**Current** components to reuse: `DsaProblemsList` already has judge filter patterns; `DsaArena` already branches on `hasJudge`; lab reader/workbench split remains the Labs path.

---

## 8. Layering guidance (when code grows)

Do **not** create empty enterprise folders now. When persistence/APIs appear:

```text
ui/          — components, pages (existing)
lib/content  — catalog loaders (existing)
lib/runtime  — runners + future isolate adapter
lib/progress — localStorage adapters → later API client
lib/dsa      — index/judge (existing)
domain/      — ONLY when shared business rules exist (mastery, graph)
```

---

## 9. Out of scope for lab infra v1

- Full Linux terminal emulator  
- Collaborative multiplayer editing  
- Arbitrary npm install in-browser  
- Replacing Next/Netlify (`DEC-007`)  
- Merging sibling labs into studio repo immediately  
