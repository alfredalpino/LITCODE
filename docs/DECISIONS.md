# Decision Log

Phase 1–3 decisions for the LITCODE workspace (formerly referred to as LEARN SDE / SDE Laboratory Studio).  
Format: Decision / Context / Options / Chosen / Reason / Trade-offs / Future implications.

---

## DEC-001 — Phase 1 is discovery-only

| Field | Content |
|---|---|
| **Decision** | No feature implementation, repo renames, or destructive rewrites in Phase 1 |
| **Context** | Multidisciplinary audit requested; existing studio + labs must be preserved |
| **Options** | (A) Audit + docs only (B) Audit + quick fixes (C) Start refactor during audit |
| **Chosen** | A |
| **Reason** | Correct problem framing before changing architecture; avoid destroying working shell |
| **Trade-offs** | Known bugs/stale README remain until later phases |
| **Future implications** | Phase 2 produces planning docs; Phase 3+ implements under those contracts |

---

## DEC-002 — DataFactor research is strategic input, not the product roadmap

| Field | Content |
|---|---|
| **Decision** | Treat `datafactor-analysis.md` as monetization/engineering hygiene research; learner product requirements win on conflicts |
| **Context** | Research optimizes for AI-lab licensing of private code + history; codebase is a learning studio |
| **Options** | (A) Optimize primarily for `/score` (B) Optimize primarily for learners (C) Dual-equal priorities |
| **Chosen** | B primary, A secondary asset hygiene |
| **Reason** | Confusing buyers (AI labs vs learners) produces overengineering and LeetCode-volume chasing |
| **Trade-offs** | May delay “perfect score” packaging; public history already started on studio |
| **Future implications** | If licensing becomes real: private fork/history policy, tests, ADRs — without inventing fake PRs |

---

## DEC-003 — Preserve sibling lab folders + sync pipeline (for now)

| Field | Content |
|---|---|
| **Decision** | Keep `javascript-laboratory`, `typescript-development-laboratory`, `python-dsa-laboratory` as sibling content sources synced by `scripts/sync-content.mjs` |
| **Context** | Studio depends on `../` paths; only studio is on public GitHub |
| **Options** | (A) Immediate monorepo merge (B) Keep siblings + sync (C) Publish labs only, drop studio |
| **Chosen** | B |
| **Reason** | Sync already works; merge is high-risk during discovery; pedagogy lives in lab repos |
| **Trade-offs** | Clone-studio-alone is broken; versioning fragmented |
| **Future implications** | `LAB_ARCHITECTURE.md` must define packaging (submodules, npm content package, or monorepo) |

---

## DEC-004 — Product positioning: laboratory platform, not LeetCode clone

| Field | Content |
|---|---|
| **Decision** | Commercial thesis is practice-first developer laboratory (predict → run → break → explain) with interview DSA as a bridge — not catalog-size competition |
| **Context** | UI chrome strongly copies LeetCode; DSA index is mostly outbound LC links; lab philosophy is the scarce IP |
| **Options** | (A) Full LeetCode parity roadmap (B) Lab-first + curated judged set (C) Content-only, abandon studio |
| **Chosen** | B |
| **Reason** | Parity is unwinnable and dilutes differentiation; pedagogy is unique |
| **Trade-offs** | Users expecting 2500 in-app judges will be disappointed unless UX honesty improves |
| **Future implications** | Phase 2 `PRODUCT_ARCHITECTURE.md` cuts Contest/10k scope; brand language shifts toward lab |

---

## DEC-005 — Prefer depth of judged seeds + real modules over index inflation

| Field | Content |
|---|---|
| **Decision** | Success metric = filled lab modules + judged problems mapped to skills — not `index.json` length |
| **Context** | 2501 indexed items, 10 `hasJudge: true`; JS has 41 dirs / 2 complete; generator comments target 10k |
| **Options** | (A) Generate thousands of pattern stubs (B) Curate small judged bank + finish modules (C) Link-out only forever |
| **Chosen** | B |
| **Reason** | Stubs and fake acceptance rates destroy trust; DataFactor and learners both punish hollowness |
| **Trade-offs** | Smaller vanity metrics; more content authoring cost |
| **Future implications** | `LEARNING_ENGINE.md` / `SKILL_GRAPH.md` define quality bars for “shippable” problems/modules |

---

## DEC-006 — localStorage persistence is acceptable for current MVP; backend is optional until multi-device or paid

| Field | Content |
|---|---|
| **Decision** | Do not introduce auth/DB in Phase 1–2 planning as a blocker; plan a persistence path when product requires sync or accounts |
| **Context** | All progress/profile/streak in localStorage; no API routes |
| **Options** | (A) Immediate Supabase/Auth (B) Stay local until wedge proven (C) File-based progress in labs only |
| **Chosen** | B (with documented upgrade path) |
| **Reason** | Auth without a sticky core loop is premature; local keeps DX simple |
| **Trade-offs** | No cross-device; weak commercial gate; progress loss on clear-site-data |
| **Future implications** | `PRODUCT_ARCHITECTURE.md` should specify when auth becomes mandatory |

---

## DEC-007 — Retain Next.js + Netlify as the studio platform

| Field | Content |
|---|---|
| **Decision** | Keep Next 15 App Router + Netlify Next plugin as the deployment baseline |
| **Context** | Recent migration from Vite (`ad1a05a`); `netlify.toml` configured; README still mentions Vite |
| **Options** | (A) Revert to Vite static (B) Keep Next/Netlify (C) Move to another host immediately |
| **Chosen** | B |
| **Reason** | Migration already done; App Router ready if APIs appear later; churn has no discovery value |
| **Trade-offs** | Heavier than pure static; leftover Vite CSS/docs debt |
| **Future implications** | Cleanup docs/dead CSS in a focused chore phase; APIs only when persistence needs them |

---

## DEC-008 — Browser `AsyncFunction` runner is a learning convenience, not a production sandbox

| Field | Content |
|---|---|
| **Decision** | Document runner as same-origin eval with stubs; isolate (Worker/iframe + CSP) before any multi-tenant or untrusted shared content |
| **Context** | `src/lib/runner.ts` labels experience a “sandbox” but executes in page context; Pyodide from CDN |
| **Options** | (A) Treat as secure now (B) Honest labeling + harden later (C) Immediate full isolate rewrite |
| **Chosen** | B |
| **Reason** | Adequate for personal/local learning; rewrite is Phase N once threat model exists |
| **Trade-offs** | Residual XSS-to-self risk; cannot host hostile multi-user code safely |
| **Future implications** | Security section in architecture docs; contest/shared code requires isolation first |

---

## DEC-009 — Phase 2 documentation priorities

| Field | Content |
|---|---|
| **Decision** | Next planning artifacts (in order): `PRODUCT_ARCHITECTURE.md` → `LAB_ARCHITECTURE.md` → `LEARNING_ENGINE.md` → `SKILL_GRAPH.md` |
| **Context** | Audits complete; implementation should wait for coherent plans |
| **Options** | (A) Code immediately (B) Docs-first as listed (C) Only DataFactor checklist |
| **Chosen** | B |
| **Reason** | Closes mental-model gaps (engine, graph, content contracts) before spending build cycles |
| **Trade-offs** | Delayed visible features |
| **Future implications** | Implementation PRs map to decisions in those docs; update this log when choices change |

---

## DEC-010 — Surface honesty about content completeness in future UX

| Field | Content |
|---|---|
| **Decision** | Planning must include UX that distinguishes 🧱 scaffold vs runnable lab modules (and judged vs link-out DSA) |
| **Context** | Scaffold READMEs already say “Scaffolded”; studio lists them like ready content |
| **Options** | (A) Hide scaffolds (B) Badge/filter scaffolds (C) Leave as-is |
| **Chosen** | B (direction); exact UI in Phase 2+ |
| **Reason** | Trust is prerequisite for commercial and licensing narratives |
| **Trade-offs** | Sidebar looks “smaller” — correctly |
| **Future implications** | Catalog schema may need `status: scaffold \| ready` from sync script |

---

*End of Phase 1 decision log. Amend with new DEC-xxx entries rather than silently rewriting history; mark superseded decisions explicitly.*

---

# Phase 2 — Architecture decisions

---

## DEC-011 — Phase 2 specs live under `docs/`; Phase 1 audits stay at repo root

| Field | Content |
|---|---|
| **Decision** | Place `PRODUCT_ARCHITECTURE.md`, `LAB_ARCHITECTURE.md`, `LEARNING_ENGINE.md`, `SKILL_GRAPH.md` in `docs/`; keep discovery audits (`ARCHITECTURE_AUDIT.md`, `PRODUCT_AUDIT.md`, `DATAFACTOR_GAP_ANALYSIS.md`) at workspace root; this file remains the living decision log |
| **Context** | Phase 1 put audits at root; user allowed either root or `docs/` for architecture specs |
| **Options** | (A) All docs at root (B) Specs in `docs/` + audits at root (C) Move audits into `docs/` now |
| **Chosen** | B |
| **Reason** | Root stays the discovery record; `docs/` holds living product/tech contracts beside `DECISIONS.md` without a risky file move mid-stream |
| **Trade-offs** | Two locations to remember; mitigated by root README index |
| **Future implications** | Implementation PRs cite `docs/*`; avoid duplicating long specs at root |

---

## DEC-012 — Monetisation: free core forever; Pro/Team later; no pricing implementation now

| Field | Content |
|---|---|
| **Decision** | Recommend freemium later (free ready labs + curated judged set; Pro = packs/sync/interview extras; Team = seats); do not implement paywalls, Stripe, or tier gates in Phases 3–5 |
| **Context** | No auth; pedagogy must be experienced before trust exists to pay |
| **Options** | (A) Paid-only (B) Free+Pro deferred (C) Ads/affiliates |
| **Chosen** | B |
| **Reason** | Matches learner-first thesis; ads conflict with lab brand (`PRODUCT_AUDIT.md`) |
| **Trade-offs** | No near-term revenue |
| **Future implications** | Auth (Phase 7) is prerequisite for Pro sync; DataFactor remains secondary private-asset path |

---

## DEC-013 — Unify product surfaces conceptually; migrate Labs/Problems progressively

| Field | Content |
|---|---|
| **Decision** | Adopt unified surface model (Labs / Challenges / Progress / Skill Graph / Profile / Interview; Projects & Assessments later). Keep existing routes initially; demote Contest; make Challenges honesty-first (judged primary, LC link-out secondary) without deleting working UX |
| **Context** | Dual `labs`/`dsa` modes; home → `/problems`; Contest/Interview are shells |
| **Options** | (A) Delete Problems (B) Progressive honesty + reframing (C) Keep LeetCode-parity forever |
| **Chosen** | B |
| **Reason** | Preserves Monaco/run flows; rebuilds trust; aligns with DEC-004 |
| **Trade-offs** | Temporary dual mental model during migration |
| **Future implications** | Phase 3 badges/filters; later default-home change behind care/flag |

---

## DEC-014 — Predict loop: soft-gate by default; hard-gate opt-in per module

| Field | Content |
|---|---|
| **Decision** | Productize predict → experiment → break → debug → fix → understand → build with **soft** enforcement default (prompt + skip logged); allow module metadata to require prediction before first run |
| **Context** | Pedagogy exists in markdown; app does not enforce (`LEARNING_ENGINE.md`) |
| **Options** | (A) Markdown only (B) Soft default + hard opt-in (C) Hard lock everywhere |
| **Chosen** | B |
| **Reason** | Labs need curiosity; pure honor system under-delivers; hard-all-blocks exploration |
| **Trade-offs** | Skips still happen — measurable via events |
| **Future implications** | Event log in localStorage before any backend |

---

## DEC-015 — Skill graph v0 = authored JSON DAG + local evidence map

| Field | Content |
|---|---|
| **Decision** | Ship simplest scalable graph: `SkillNode` with `prereqs[]` in static JSON; evidence/mastery in `localStorage`; deterministic explainable “next” algorithm — no graph DB/ML |
| **Context** | No skill graph software today; risk of overengineering |
| **Options** | (A) No graph, tags only (B) JSON DAG v0 (C) Full KT/ML recommender |
| **Chosen** | B |
| **Reason** | Enough for lab→pattern→challenge transfer; editable by authors; matches content scale |
| **Trade-offs** | Manual authoring cost for links |
| **Future implications** | Curate bridges only for judged challenges — never auto-link all 2501 LC titles |

---

## DEC-016 — Execution isolation required before multi-tenant; never untrusted code in primary app process (post-harden)

| Field | Content |
|---|---|
| **Decision** | Reaffirm honest same-origin runners for personal use; Target path is Worker and/or sandboxed iframe + CSP before public multi-user/contests; never execute untrusted code in the primary app process once that threat model applies |
| **Context** | Extends DEC-008; `runner.ts` uses `AsyncFunction` in page |
| **Options** | (A) Call current setup secure (B) Isolate before multi-tenant (C) Immediate rewrite blocking content work |
| **Chosen** | B (content/loop parallel in 3–5; harden in Phase 6 unless threat appears sooner) |
| **Reason** | Content depth unblocks learning value; isolation unblocks safe scale |
| **Trade-offs** | Public demo remains self-XSS-capable until Phase 6 |
| **Future implications** | Contests forbidden until isolation + auth + judge depth exist |

---

## DEC-017 — Contests and 10k-bank remain non-goals until core loop + curated judged set prove stickiness

| Field | Content |
|---|---|
| **Decision** | Do not invest in contest infra or mass problem generation in Phases 3–5; optional Phase 10 only if demand and Phase 6–7 exit criteria met |
| **Context** | `/contest` shell; generator comments target 10k; thesis rejects catalog competition |
| **Options** | (A) Build contests now (B) Defer/cut (C) Keep UI theater without backend) |
| **Chosen** | B (prefer hide/demote theater over expanding it) |
| **Reason** | Scope greed is a top product risk (`PRODUCT_AUDIT.md`) |
| **Trade-offs** | Less LC-familiar marketing chrome |
| **Future implications** | Success metrics = ready modules + judged mapped problems + loop completion |

---

## DEC-018 — Catalog must expose module readiness (`scaffold` \| `ready`) from sync heuristics

| Field | Content |
|---|---|
| **Decision** | Extend content contract (via `sync-content.mjs` or post-pass) so the studio can badge/filter scaffolds vs ready modules; DSA continues to use `hasJudge` for challenge honesty |
| **Context** | DEC-010 direction; UI currently lists scaffolds as first-class |
| **Options** | (A) Manual status files only (B) Sync heuristics + optional override (C) Hide all incomplete permanently |
| **Chosen** | B |
| **Reason** | Automated honesty scales; overrides fix false negatives |
| **Trade-offs** | Heuristics can misclassify — UI should allow “Ready only” filter |
| **Future implications** | Phase 3 implementation; do not claim modules ready in marketing without this signal |

---

*End of Phase 2 decision log section. Continue DEC-019+ in later phases.*

---

# Phase 3 — Branding decisions

---

## DEC-019 — Product name is LITCODE

| Field | Content |
|---|---|
| **Decision** | Adopt **LITCODE** as the product brand name, replacing “SDE Laboratory Studio” / “SDE Lab” / “SDE Laboratory” in user-facing and package metadata |
| **Context** | Phase 1–2 used descriptive working names; audits flagged weak memorability and LeetCode-chrome brand conflict; Phase 3 branding mission |
| **Options** | (A) Keep SDE Lab (B) LITCODE (C) Interlab (D) Titra / other shortlist — see `docs/brand/naming-analysis.md` |
| **Chosen** | B — LITCODE |
| **Reason** | Encodes scarce IP (predict→run→break→explain loop); short SaaS-extensible noun; developer-credible; clearer than collided alternatives (Drylab, Labora, Lathe, Speculo, etc.) |
| **Trade-offs** | “Loop*” category has adjacent brands (email, returns); compound still needs registrar + trademark counsel before public launch — light diligence only in Phase 3 |
| **Future implications** | Marketing, domains, and legal clearance use LITCODE; folder/GitHub/Netlify slugs may lag (`DEC-022`) |

---

## DEC-020 — Tagline and motto

| Field | Content |
|---|---|
| **Decision** | **Tagline:** “Predict. Run. Break. Prove.” · **Motto:** “Prove what you think you know.” · **Secondary:** “Run the experiment. Keep the skill.” |
| **Context** | Need lines that communicate engineering mastery / practice / experimentation — not generic “Learn to code” |
| **Options** | Compared in `docs/brand/tagline.md` (A–H) |
| **Chosen** | A tagline + C motto + B secondary |
| **Reason** | Tagline is the pedagogy loop compressed; motto is the strategic proof line from product architecture; secondary softens onboarding |
| **Trade-offs** | Tagline is instructional — acceptable for a laboratory brand |
| **Future implications** | Use one dominant line per surface; update `app/layout.tsx` metadata to lead with tagline |

---

## DEC-021 — Visual direction

| Field | Content |
|---|---|
| **Decision** | Deep slate base (`#0B0F14`), signal teal accent (`#2DD4A8`), steel neutrals; Instrument Sans + JetBrains Mono; logo = open geometric loop with break gap |
| **Context** | Elite developer-product bar; avoid purple-AI, cream+terracotta, broadsheet clichés; product already uses Instrument Sans / JetBrains Mono |
| **Options** | (A) Purple glow AI look (B) Warm editorial cream (C) Technical slate + teal LITCODE system |
| **Chosen** | C |
| **Reason** | Differentiates from AI-SaaS defaults; matches experimental/precise personality; reuses shipping type stack |
| **Trade-offs** | Dark-first bias — light tokens defined for settings parity |
| **Future implications** | Phase 4+ UI work should migrate CSS variables toward `--lf-*` tokens in `docs/brand/colors.md` when touching chrome |

---

## DEC-022 — Rename scope: brand strings now; paths/keys/host deferred

| Field | Content |
|---|---|
| **Decision** | Update README, package `name`, app metadata, UI brand strings, and docs product references to LITCODE now. **Do not** force-rename `sde-laboratory-studio/` folder, git remote, Netlify site slug, or `localStorage` keys in this phase |
| **Context** | Destructive renames risk sync paths, deploys, and wiping learner progress |
| **Options** | (A) Full mechanical rename everything (B) Brand/metadata only + manual checklist (C) Docs-only |
| **Chosen** | B |
| **Reason** | Preserves builds and progress; documents exact user steps in `LITCODE/README.md` |
| **Trade-offs** | Temporary dual reality (product name vs folder slug) |
| **Future implications** | Optional migrations: folder → `litcode/`, Netlify slug, GitHub repo name, localStorage key bump with migrator |

---

*End of Phase 3 decision log section. Continue DEC-023+ in later phases.*

---

# Phase 4 — Core shared laboratory infrastructure

---

## DEC-023 — Catalog status is sync-heuristic with optional override

| Field | Content |
|---|---|
| **Decision** | Emit `status: scaffold \| ready \| deprecated`, `hasPredictions`, `hasChallenges`, and `loop[]` from `scripts/lib/module-status.mjs` during `sync-content.mjs`; optional `STATUS.md` / README override wins |
| **Context** | DEC-018; scaffolds previously listed as first-class |
| **Options** | (A) Manual only (B) Heuristic + override (C) Hide scaffolds |
| **Chosen** | B |
| **Reason** | Scales with sibling labs; UI Ready-only filter corrects false negatives |
| **Trade-offs** | Heuristics can misclassify edge modules |
| **Future implications** | Phase 5 content fill flips scaffolds → ready automatically when experiments land |

---

## DEC-024 — Soft predict gate + append-only local events (no auth)

| Field | Content |
|---|---|
| **Decision** | Soft PredictGate on modules with `hasPredictions`; log to `sde-lab-events-v1`; keep existing `sde-lab-studio-progress-v1` / DSA keys unchanged |
| **Context** | DEC-014 / LEARNING_ENGINE |
| **Options** | (A) Markdown only (B) Soft gate + events (C) Hard lock everywhere |
| **Chosen** | B |
| **Reason** | Productizes loop without blocking curiosity; measurable skips |
| **Trade-offs** | sessionStorage unlock is per-tab |
| **Future implications** | Sync event log when auth lands (DEC-006) |

---

## DEC-025 — Skill graph v0 as static JSON + local evidence

| Field | Content |
|---|---|
| **Decision** | Ship `public/content/skill-graph.json` + `src/lib/skill-graph.ts`; evidence in `sde-skill-state-v1`; Progress/Interview show deterministic next-step stubs |
| **Context** | DEC-015 |
| **Options** | (A) Tags only (B) JSON DAG v0 (C) ML recommender |
| **Chosen** | B |
| **Reason** | Enough for lab→pattern→challenge bridges without overengineering |
| **Trade-offs** | Manual authoring for new nodes |
| **Future implications** | Expand bridges as judged bank grows in Phase 5–6 |

---

## DEC-026 — Challenges honesty + Interview = judged-only shell

| Field | Content |
|---|---|
| **Decision** | Default Challenges list to judged-first; replace fake acceptance % with Kind badges (Auto-judge / External); Interview mode lists/opens `hasJudge` only with Run=visible / Submit=full + browser timing label |
| **Context** | PRODUCT_AUDIT fake metrics; LAB_ARCHITECTURE migration B/F |
| **Options** | (A) Keep fake acceptance (B) Honest kind column + judged default (C) Delete LC index |
| **Chosen** | B |
| **Reason** | Trust > vanity; full index remains via External practice toggle |
| **Trade-offs** | First paint shows ~10 judged, not 2500 |
| **Future implications** | Grow judged set in Phase 5–6; never revive fake acceptance |

---

*End of Phase 4 decision log section.*

---

# Phase 5 — JavaScript Laboratory content fill (02–12)

---

## DEC-027 — Phase 5 ships JS modules 02–12 as ready laboratories

| Field | Content |
|---|---|
| **Decision** | Author full LITCODE pedagogy for `javascript-laboratory` modules `02-values-types` through `12-arrays` (lesson README, experiments, predictions, broken + written challenges, solutions, review). Leave `13`–`40` as honest scaffolds. Expand `skill-graph.json` concept chain and DSA pattern bridges. Do not start Phase 6 Python DSA 50–100 or Phase 7 TS rewrite in this pass. |
| **Context** | DEC-005 / DEC-023; only `00`/`01` were ready; product brief Phase 5 = JS lab fill along existing dirs |
| **Options** | (A) Stub empty experiments for vanity ready counts (B) Teachable 02–12 matching 00/01 depth band (C) Attempt all 41 modules thinly |
| **Chosen** | B |
| **Reason** | Quality over empty files; foundational chain unblocks PredictGate + skill graph; heuristics auto-mark ready |
| **Trade-offs** | Intermediate/async/DOM modules remain scaffold; generators live under `javascript-laboratory/scripts/fill-phase5-modules*.mjs` for regeneration |
| **Future implications** | Phase 6 grows judged DSA; later JS passes fill `13+` (iterators → async → event loop) using the same kit |

---

*End of Phase 5 decision log section.*

---

# Phase 6 — Python DSA Laboratory

---

## DEC-028 — Phase 6 ships Foundations ready path + curated judged bank (≥50)

| Field | Content |
|---|---|
| **Decision** | Fill `python-dsa-laboratory` modules `04`–`08` to ready laboratory depth; add honest scaffolds for Core DS `09`–`13`; grow auto-judged seeds from 10 → **52** with pattern/hints/discussion and ≥4 tests each; expand `skill-graph.json` bridges. Do **not** mass-generate to 100 if quality would dilute; do not fill Algorithms `14`–`48` thinly; do not start Phase 7 TypeScript rewrite. |
| **Context** | Phase 4 judge + Interview (judged-only); Phase 5 JS 02–12; DEC-005 / DEC-026; CURRICULUM had 04–48 planned with only 00–03 built |
| **Options** | (A) Stub 100 empty judges + empty module dirs (B) Foundations ready + ~50 verified judged + scaffold Core DS (C) Attempt full 00–48 + 100 problems |
| **Chosen** | B |
| **Reason** | Quality and honesty over catalog vanity; Interview mode scales with real tests; Foundations unlock pattern teaching before DS implementation labs |
| **Trade-offs** | Core DS/Algorithms labs still incomplete; judged set smaller than LeetCode |
| **Future implications** | Later passes fill `09+`; optional judged growth with `phase6-build-judged-bank.mjs` verification bar; Phase 7 = TypeScript depth |

---

*End of Phase 6 decision log section.*

---

# Phase 7 — TypeScript Development Laboratory

---

## DEC-029 — Phase 7 ships TS ready path fundamentals→operators + professional picks

| Field | Content |
|---|---|
| **Decision** | Fill `typescript-development-laboratory` modules **`04`–`23`, `26`, `29`, `32`, `45`, `48`** (catalog **29** ready with `00`–`03`) to ready laboratory depth (lesson, experiments, predictions, broken + written challenges, solutions, review). Add honest scaffolds for the next band (`24`–`25`, `27`–`28`, `30`–`31`, `33`–`34`, `40`–`44`, `46`–`47`, `49`–`50`, `61`). Expand `skill-graph.json` for the ready chain. Do **not** invent parallel trees; do not thin-fill all `04`–`74`; leave remaining modules planned without empty vanity dirs. |
| **Context** | Phase 6 left TS rewrite as Phase 7 focus; catalog had ready=4; CURRICULUM listed `04`–`74` as planned; JS/Python ready standard + Phase 4 module-status heuristics; Sucrase browser runner |
| **Options** | (A) Stub all 04–74 as ready (B) Coherent ready path + professional picks + next-band scaffolds (C) Only 04–10 |
| **Chosen** | B |
| **Reason** | Quality over volume; fundamentals→advanced operators is the scarce pedagogy; professional picks (enums, `.d.ts`, errors, API design) prove production judgment without claiming full 74-module completion |
| **Trade-offs** | Classes/modules/config/async/testing still scaffolds; cross-labs remain sync-excluded |
| **Future implications** | Phase 8 = Unified Learning System + later TS scaffold fills; JS `13+` / Python `09+` remain separate backlog |

---

*End of Phase 7 decision log section.*

---

# Phase 8 — Unified Learning System

---

## DEC-030 — Phase 8 unifies labs via skill graph + events; Assessments/Projects stay honest stubs

| Field | Content |
|---|---|
| **Decision** | Ship cross-lab `related[]` bridges (JS↔TS, pattern↔lab), idempotent `deriveSkillState` from events + progress maps, first-class Progress surface (`/progress`) with known/learning/weak/next/mastered, and pattern→lab links in Challenges/Interview. Keep `sde-lab-*` / events / skill-state keys stable. Assessments and Projects appear only as STATUS:planned stubs — no fake folders or depth theater. |
| **Context** | Phases 5–7 filled ready paths; Phase 4 infra existed but silos remained; PRODUCT_ARCHITECTURE Assessments/Projects are later; mission Phase 8 = Unified Learning System |
| **Options** | (A) Thin UI copy only (B) Graph+events+Progress+transfer links + honest stubs (C) Build full Assessments/Projects now |
| **Chosen** | B |
| **Reason** | Transfer moat requires real graph/events; Assessments/Projects without runner/checkpoints would fake depth |
| **Trade-offs** | Soft `related` does not AND-gate language tracks; DSA hard prereqs remain Python-primary |
| **Future implications** | Phase 9 Product Polish may add thin assessments, project runner, export, chrome polish; content backlog stays separate |

---

*End of Phase 8 decision log section.*

---

# Phase 9–10 — Product Polish & Commercial Readiness

---

## DEC-031 — Top-nav-only shell; evidence Progress; SEO without fake commercial features

| Field | Content |
|---|---|
| **Decision** | Remove left collapsible rail entirely; primary navigation via **AppNav** (icons + mobile row + ⌘K search). Problems workspace uses **All / Favorites** subnav. Progress dashboard reads **events + progress maps + skill graph** only. Ship SEO (metadata, robots, sitemap) and optional analytics endpoint hook. **Pricing tiers doc-only** — no paywall in UI. Delete `LeftRail`; `ProblemsRail` = `explore` \| `lists` only. |
| **Context** | Phase 8 unified learning; user spec cf4f5638; partial Phase 9 had rail + incomplete nav |
| **Options** | (A) Keep rail for favorites (B) Top nav + subnav + right insights (C) Rebuild as marketing site + app split |
| **Chosen** | B |
| **Reason** | Matches spec; reduces layout complexity; favorites discoverable on Problems; no fake stats or billing |
| **Trade-offs** | Library/Study Plan no longer separate rail icons — Labs/Interview top nav instead |
| **Future implications** | Footer legal links, OG image, export/sync when server features land |

---

*End of Phase 9–10 decision log section.*

---

# Post-launch — Audit & improvement plan

---

## DEC-032 — Post-launch audit is planning-only; P0 is ops/trust, not new product surfaces

| Field | Content |
|---|---|
| **Decision** | Treat `docs/POST_LAUNCH_AUDIT_AND_IMPROVEMENT_PLAN.md` as the authoritative post–Phase 10 backlog. Do **not** start large features from the audit alone. Public marketing launch P0 is **production URL/env, counsel-grade legal, Netlify smoke, Contest-nav honesty, README/deploy accuracy, judged-first retention banner** — not auth, contests, or 10k judges. Content growth and progress export remain P1; runner isolation / sync / Team remain P2. |
| **Context** | Phases 1–10 delivered lab wedge + polish + SEO hooks; FINAL_REPORT listed domain/legal/OG as blockers; OG + privacy/terms routes now exist but legal copy is placeholder; local production verified on :3000 |
| **Options** | (A) Immediate feature sprint from audit wishlist (B) Ops/trust P0 then content/export P1 (C) Pause product for DataFactor packaging |
| **Chosen** | B |
| **Reason** | Core loop works; remaining launch risk is trust/ops and content depth, not missing chrome. Keeps DEC-004/005 discipline |
| **Trade-offs** | Contest may still appear in nav until a small P0 UX change lands; judged bank stays at 52 until P1 content pass |
| **Future implications** | Implementation PRs should cite this DEC + the audit doc section IDs; update FINAL_REPORT when P0 checklist clears |

---

## DEC-033 — Ship DEC-032 P0 ops/trust items in studio (docs + honesty UX)

| Field | Content |
|---|---|
| **Decision** | Implement audit §6 P0 items in `sde-laboratory-studio`: document/lock `NEXT_PUBLIC_SITE_URL` (`.env.example`, README, `site.ts` comments — placeholder until operator sets real Netlify/custom domain); replace Privacy/Terms with stronger counsel-ready **drafts** (explicit “not legal advice / consult counsel”); Contest primary-nav **Deferred** chip + muted styling; README/deploy drift fixed to **Next.js 16.3.7** + `build && start -p 3000`; judged-first honesty banner when browsing the full DSA link-out index; Netlify smoke checklist documented for manual pass. |
| **Context** | DEC-032 framed P0; local `next-server` on :3000; cannot set production URL without operator domain |
| **Options** | (A) Docs-only (B) Docs + small honesty UX (Contest chip, Problems banner, legal drafts) (C) Demote Contest out of nav entirely |
| **Chosen** | B (Contest kept reachable with persistent Deferred badge) |
| **Reason** | Unblocks soft-launch trust without inventing live contests or fake legal claims; keeps Contest discoverable for deferred messaging |
| **Trade-offs** | Real Netlify domain + counsel sign-off remain **manual**; drafts are not a substitute for attorney review |
| **Future implications** | Operator sets `NEXT_PUBLIC_SITE_URL` on Netlify; counsel revises legal; P1 content/export per audit |

---

*End of post-launch decision log section.*
