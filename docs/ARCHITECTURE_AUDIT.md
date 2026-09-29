# Architecture Audit — Phase 1 Discovery

**Date:** 2026-09-29  
**Scope:** Workspace `/Users/ubaid/LEARN SDE - NON LARPING`  
**Mode:** Discovery only — no code changes evaluated as recommendations unless already present.

---

## 1. Executive architecture snapshot

The workspace is a **multi-folder learning platform**, not a formal monorepo:

| Artifact | Role | Stack / status |
|---|---|---|
| `sde-laboratory-studio/` | Product shell (Next.js app) | Next 15, React 19, Monaco, Netlify; **git** → `alfredalpino/sde-laboratory-studio` (public), 9 commits |
| `javascript-laboratory/` | Content lab (JS) | Markdown + Node scripts; **no git**; 41 module dirs, **2 filled** |
| `typescript-development-laboratory/` | Content lab (TS) | Markdown + `tsc`/`tsx`; **no git**; **4 filled** modules |
| `python-dsa-laboratory/` | Content lab (Python/DSA foundations) | Markdown + `.py`; **empty git** (no commits); **4 filled** modules |
| `datafactor-analysis.md` | Strategic research note | Not product code |

**There is no workspace-root git repo, no package workspace, no shared `packages/` domain layer, and no backend service.**

Ideal mental model vs reality:

```text
Ideal:  User → App Shell → Laboratory System → Learning Engine → Execution/Eval → Progress/Analytics → Persistence/Backend
Actual: User → Next SPA-ish shell → synced static content + DSA JSON → localStorage maps → browser runners (no backend)
```

---

## 2. Application shell

### Stack (evidence)

- `sde-laboratory-studio/package.json`: Next `^15.5.14`, React `^19.2.8`, `@monaco-editor/react`, `sucrase`, `framer-motion`, `react-markdown`, `oxlint`, `@netlify/plugin-nextjs`
- App Router pages: `app/layout.tsx`, `app/page.tsx` (redirect → `/problems`), `app/problems|labs|contest|interview|profile/page.tsx`
- Client state hub: `src/components/StudioProvider.tsx` (large React context)
- Deploy: `netlify.toml` + `@netlify/plugin-nextjs`, `NODE_VERSION=22`
- Styling: custom CSS (`app/globals.css`, `src/lc-shell.css`, legacy `src/App.css` / `src/index.css`)

### What exists

- LeetCode-inspired chrome: nav, left rail, problem table, company filters, lab library, profile, settings, notifications, streaks
- Dual modes: `labs` vs `dsa` (`src/types.ts` → `AppMode`)
- Mobile Read/Code pane toggle
- Keyboard: ⌘/Ctrl+Enter runs code (`StudioProvider`)

### What is missing / divergent

- **No API routes** under `app/api/` — purely static content + client logic
- **No auth, session, or multi-user identity** — profile is localStorage (`sde-lab-profile-v1`)
- **Contest / Interview** routes render the same `StudioShell` with filter/section tweaks (`app/contest/page.tsx`, `SectionViews.tsx`) — not separate engines
- README still says “Static Vite build on Netlify” (`sde-laboratory-studio/README.md`) — **stale** after Next migration (commit `ad1a05a`)
- Dead/legacy CSS files suggest incomplete Vite → Next cleanup

---

## 3. Laboratory system

### Content pipeline

`scripts/sync-content.mjs`:

- Walks sibling folders `../javascript-laboratory`, `../python-dsa-laboratory`, `../typescript-development-laboratory`
- Emits `public/content/catalog.json` + mirrored files under `public/content/{labId}/`
- Excludes playgrounds / node_modules / some TS cross-lab folders (`will-it-compile`, etc.)
- Hooked via `predev` / `prebuild`

Runtime loaders: `src/lib/content.ts` (`fetch('/content/...')`).

### Content completeness (critical)

| Lab | Module dirs | Fully built (experiments/LAB cycle) | Catalog stats (synced) |
|---|---|---|---|
| JavaScript | 41 (`00`–`40`) | **2** (`00-orientation`, `01-runtime`); rest are 🧱 scaffold READMEs | modules=41, docs=61, code=20 |
| TypeScript | 4 numbered + cross-labs | **4** solid modules | modules=4, docs=34, code=25 |
| Python + DSA | 4 | **4** solid modules (`LAB.md`, experiments, debug, exercises) | modules=4, docs=21, code=23 |

Curriculum docs (`CURRICULUM.md` ×3) describe a much larger surface than exists on disk. The studio UI lists scaffolds as first-class modules — **architecture overstates inventory**.

Pedagogical design (when filled) is strong and consistent: Learn → Predict → Code → Run → Break → Explain. Encoded in lab READMEs, not enforced by the app.

---

## 4. Learning / practice engine

### Present as content conventions

- Predictions folders, challenges with progressive hints, `review.md`, `PROGRESS.md`, `LEARNING_LOG.md` (Python), spaced-review stubs
- JS `predict-the-output/level-01` has real E01/E02 pairs

### Absent as product software

- No spaced-repetition scheduler in the app
- No “write prediction before Run” gate
- No hint ladder UI; solutions travel with synced content (temptation to peek)
- Progress is binary module complete (`src/lib/progress.ts`) — not skill mastery
- No skill graph linking modules ↔ DSA patterns ↔ interview topics

---

## 5. Code execution & evaluation

| Language | Mechanism | Path | Limits |
|---|---|---|---|
| JavaScript | `new AsyncFunction(...)` with stubbed `console`/`process`/`require` | `src/lib/runner.ts` | **Not a sandbox** — same origin as app; Node APIs warn/stub only |
| TypeScript | Sucrase strip → JS runner | same | No real `tsc` diagnostics in-browser |
| Python | Pyodide 0.27.5 from jsDelivr CDN | same | First-load latency; CDN dependency |
| DSA judge | `judgeSolution()` deep-equal tests | same | **Only 10 seeds** have `hasJudge: true` |

DSA bank (`public/dsa/index.json`):

- **2501** indexed items; kinds ≈ `{ seed: 10, leetcode: 2491 }`
- LeetCode entries hydrate to **external link + generic starter**, `hasJudge: false` (`src/lib/dsa/loader.ts`)
- Company packs from liquidslr dataset: **470 companies**, **3392** problem mappings (`company-packs.json`)
- Generator script comments target 10k+ pattern problems (`scripts/generate-dsa-bank.mjs`); current index is mostly LC titles, not generated judged drills
- `acceptanceRate()` in `src/lib/stats.ts` is **deterministic fake UI parity**

Smoke tests only: `npm run test:runners` → `scripts/smoke-runners.mjs` (JS + Sucrase). No Vitest/Jest/Playwright suite.

---

## 6. Progress, analytics, persistence

| Concern | Implementation | Backend? |
|---|---|---|
| Lab module complete | `localStorage` `sde-lab-studio-progress-v1` | No |
| DSA solved | `sde-dsa-solved-v1` | No |
| Favorites / streak | `sde-favorites-v1`, `sde-lab-streak-v1` | No |
| Profile / settings / notifs | localStorage keys in `StudioProvider` | No |
| Analytics / logging / error tracking | **None** (no Sentry, PostHog, etc.) | — |
| Database | **None** | — |

Cross-device sync, accounts, and cheating-resistant progress are architecturally unavailable.

---

## 7. Frontend / UX architecture

**Strengths**

- Coherent shell composition (`StudioShell` → rail + list/solve + workbench)
- Monaco editor + console + split panes
- Partial a11y: many `aria-label` / `role="tablist|log"` usages in nav, reader, workbench
- Theme + font-size settings; Instrument Sans + JetBrains Mono

**Weaknesses**

- Heavy client context (almost all interactive state in one provider)
- Routes are thin wrappers; section state still mostly in-memory (URL does not deeply encode lab/module/problem in all cases — pages remount same shell)
- SEO: basic `metadata` in `layout.tsx` only; no OG images, sitemap, robots strategy, per-problem pages as crawlable entities
- Performance: large DSA JSON (~1MB index + ~1.7MB company packs) fetched client-side; Monaco + Pyodide are heavy; no evidence of code-splitting strategy beyond Next defaults
- Branding: “SDE Lab” LeetCode-parity chrome — strong familiarity, weak differentiation → **Phase 3: LITCODE** (see `LITCODE/`)

---

## 8. Security

| Area | Finding |
|---|---|
| Secrets in repo | No `.env` files found in workspace scan; good for current static app |
| User code execution | `AsyncFunction` in page context — XSS to self / privilege confusion if ever combined with privileged cookies; **no Worker/iframe sandbox** |
| CSP / security headers | Only Cache-Control for `/content/*` and `/dsa/*` in `netlify.toml` — no CSP, COOP/COEP |
| AuthZ | N/A (no server resources) |
| Dependency hygiene | Present lockfile; no automated audit in scripts |
| Third-party | Google Fonts, jsDelivr Pyodide — supply-chain / privacy surface |

---

## 9. Build, deploy, DX

- Local: `npm install` → `npm run sync` / `predev` generates content + company packs + DSA index
- Deploy path: Netlify Next plugin publishing `.next`
- Lint: `oxlint` only
- DX friction: studio **depends on sibling folders** at `../`; cloning only the GitHub studio repo breaks sync unless labs are present
- Three content labs lack publishable git history; Python has uncommitted local git

---

## 10. Scalability & tech debt

**Scales today as:** static educational SPA for a single browser profile.

**Won’t scale without redesign:** multi-tenant progress, real contests, trusted judging, TS typechecking fidelity, Node-lab exercises, AI tutoring with cost controls.

**Tech debt hotspots**

1. Content completeness vs UI inventory mismatch  
2. DSA “bank” mostly outbound LC links + fake acceptance  
3. Runner security model labeled “sandbox” but isn’t  
4. Stale README / leftover Vite CSS  
5. Public studio repo vs private-lab licensing goals (see gap analysis)  
6. No automated tests beyond runner smoke  
7. Sync script excludes some of the most interesting TS cross-lab folders from the product

---

## 11. Layer map (honest)

```text
┌─────────────────────────────────────────────────────────────┐
│ UI (App Router pages → StudioShell / components)            │
├─────────────────────────────────────────────────────────────┤
│ Client state (StudioProvider + localStorage adapters)       │
├──────────────────────┬──────────────────────────────────────┤
│ Content catalog JSON │ DSA index / seeds / company packs    │
│ (synced from labs)   │ (generated scripts)                  │
├──────────────────────┴──────────────────────────────────────┤
│ Runners (AsyncFunction / Sucrase / Pyodide) + thin judge    │
├─────────────────────────────────────────────────────────────┤
│ Persistence: browser only                                   │
│ Backend / Auth / DB / Observability: absent                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 12. Audit verdict

Architecturally this is a **credible client-side studio prototype** with a smart content-sync idea and a serious pedagogical *intent* in the labs. It is **not yet** a layered full-stack product, a secure execution platform, or a complete laboratory curriculum productized end-to-end.

Priority architecture work (Phase 2 docs, not build-yet): clarify product boundaries, content contracts, learning-engine software vs markdown, and a persistence path that matches ambition without overbuilding.
