# Product Architecture — Phase 2

**Status:** Target architecture (planning)  
**Date:** 2026-09-30  
**Inputs:** `ARCHITECTURE_AUDIT.md`, `PRODUCT_AUDIT.md`, `DATAFACTOR_GAP_ANALYSIS.md`, `docs/DECISIONS.md`  
**Mode:** Documentation only — no product implementation in this phase.

**Legend:** **Current** = shipped today · **Target** = intentional design · **Non-goal** = explicitly out of scope for v1.

---

## 1. Product thesis

> **LITCODE is a practice-first developer laboratory:** language mastery and interview problem-solving share one shell, differentiated by an experimental pedagogy (**predict → run → break → explain**) and **verifiable skill progress** — not by cloning LeetCode’s catalog depth.

Commercially:

| Track | Role | Timing |
|---|---|---|
| **Learner product (primary)** | App + curriculum + progress/skill proof | Ship core loop before monetization |
| **DataFactor `/score` (secondary)** | Private, original, tested system + history | Asset hygiene only; not the feature backlog |

Evidence that tools exist but content/engine lag: studio shell in `sde-laboratory-studio/` (LITCODE app; folder slug deferred — see `LITCODE/README.md`); sync from sibling labs via `scripts/sync-content.mjs`; progress as binary `localStorage` maps (`src/lib/progress.ts`, `src/lib/stats.ts`); ~10 auto-judged DSA seeds vs ~2501 indexed titles (`public/dsa/index.json`).

---

## 2. Positioning vs alternatives

| Alternative | They win | We win (if we stay disciplined) |
|---|---|---|
| LeetCode | Scale, prestige, contests, judge fleet | Pedagogy depth; language labs; skill transfer |
| NeetCode / Blind lists | Curation clarity | Lab → pattern → judged challenge path in one UX |
| Frontend Masters / courses | Production polish, instructors | Active experiment loop, not video consumption |
| Local repos + Node | Host fidelity (DOM/Node) | Unified browser studio + DSA bridge |

**Positioning statement (Target):**  
*Stop consuming tutorials. Run experiments. Prove what you think you know — then transfer that skill to interview problems.*

**Anti-positioning (Non-goal):** “LeetCode with prettier chrome” or “10k problems.”

---

## 3. Target users & jobs-to-be-done

### Primary ICP

Self-taught and early-career engineers preparing for startup / mid-market interviews who sense that **YouTube + grind** does not produce durable language understanding.

### Secondary ICP (later)

Bootcamp / mentor cohorts; small engineering teams that want a shared practice environment (**Team** tier — see monetisation).

### Jobs-to-be-done

| Job | Surface | Success signal |
|---|---|---|
| Understand how JS/TS/Python *actually* behave | Labs | Completes predict → run → break → explain without peeking solutions first |
| Build interview patterns with transfer from labs | Challenges (DSA) | Solves curated judged set mapped to patterns taught in labs |
| Know what to study next | Progress + Skill Graph | Accepts a recommended next concept/challenge and completes it |
| Prove readiness under interview constraints | Interview mode | Timed/statement-first solves with visible + hidden tests |
| Show durable progress (personal) | Profile / Progress | Mastery evidence survives refreshes; later sync |

---

## 4. Unified surface model

Conceptual product surfaces map to **Current** routes without a big-bang rewrite.

| Surface | Intent | Current | Target v1 |
|---|---|---|---|
| **JS Lab** | Language mastery modules | `/labs` + `javascript` catalog | First-class; honesty badges for scaffolds |
| **Python DSA Lab** | Foundations + DSA-oriented Python | `/labs` + `python-dsa` | Same; bridge nodes → Challenges |
| **TS Lab** | Types as design tool | `/labs` + `typescript` | Same; restore excluded cross-labs later via sync allowlist |
| **Projects** | Multi-file build-to-learn | Scaffold modules `39`/`40` in JS curriculum | Ship only when multi-file project runner exists |
| **Challenges** | Verifiable problem solves | `/problems` (default home today) | Curated **judged** set primary; link-out LC demoted |
| **Assessments** | Checkpoint mastery checks | Absent | Lightweight quizzes / pattern checks after clusters |
| **Progress** | Evidence over time | Module complete + DSA solved maps | Event log + mastery scores (see `LEARNING_ENGINE.md`) |
| **Skill Graph** | Navigable prerequisites + next step | Implicit tags/folders only | Authored JSON + UI (see `SKILL_GRAPH.md`) |
| **Profile** | Identity, streak, prefs | `/profile` localStorage | Keep local-first; cloud when auth lands |
| **Interview** | Statement-first DSA practice | `/interview` shell (same `StudioShell`) | Real interview mode mechanics on judged set |
| **Contest** | Competitive timed sets | `/contest` shell | **Deferred** until isolation + auth + judge depth |

```text
┌──────────────────────────────────────────────────────────────┐
│ Shell (nav, theme, settings)                                 │
├─────────────┬──────────────┬─────────────┬───────────────────┤
│ Labs        │ Challenges   │ Progress    │ Profile           │
│ JS/Py/TS    │ + Interview  │ + Skill     │ (local → cloud) │
│ + Projects* │  mode        │   Graph     │                   │
└─────────────┴──────────────┴─────────────┴───────────────────┘
 * Projects after multi-file support
```

**Default entry (Target):** Lab-forward hub or last-session resume — not “infinite problem table” as the brand first impression. **Current** redirects to `/problems` (`app/page.tsx`); change only in implementation phases with care for existing users.

---

## 5. Monetisation model (recommendation only — do not implement pricing)

| Tier | Who | What they get | When it makes sense |
|---|---|---|---|
| **Free** | Individual learners | Ready lab modules, core predict/run loop, curated free judged set (~50–100), local progress | Now → forever core |
| **Pro** | Serious interview prep | Expanded judged packs, interview mode extras, cloud sync, skill reports, offline export | After stickiness + auth |
| **Team** | Bootcamps / small teams | Seats, shared tracks, mentor dashboard (read-only progress) | After Pro proven |
| **Enterprise** | Orgs needing SSO / compliance | SSO, admin controls, private content mounts | Only on demand |
| **DataFactor path** | AI-lab licensing | Private repo asset — not a learner SKU | Parallel hygiene |

**Justification**

- Freemium fits a trust-sensitive learning product: free must demonstrate the lab loop without paywalling the pedagogy.
- Pro monetises **depth of verified practice** and **sync**, not “more LeetCode titles.”
- Ads / LC affiliate (**Non-goal**): brand-hostile (see `PRODUCT_AUDIT.md` §6).
- Do not gate auth before the wedge works (`DEC-006`).

---

## 6. Differentiation & moat hypotheses

| Hypothesis | Why it could be a moat | Falsifier |
|---|---|---|
| **Experimental pedagogy IP** | Predict/break/explain content is scarce vs grind sites | Users skip predictions; no retention lift |
| **Lab → pattern → judged challenge graph** | Transfer story competitors don’t productize | Graph unused; users stay in one silo |
| **Honesty UX** | Scaffold vs ready vs judged vs link-out builds trust | Users still bounce on empty modules |
| **Browser multi-runtime without install** | Low friction (**Current** runners) | Node/DOM fidelity gaps drive power users away |
| **Original curriculum + system** | Licensing + uniqueness | Public thin clone judgment |

**Not a moat:** problem count, fake acceptance rates (`src/lib/stats.ts`), contest chrome without infra.

---

## 7. Non-goals / what we will NOT build in v1

1. Contest platform (live brackets, ratings, anti-cheat) — keep route as stub or hide.
2. 10k auto-generated judged problems — curation over inflation (`DEC-005`).
3. Auth/SSO/payments before core loop + curated judged set.
4. Server-side execution of arbitrary user code in the primary app process.
5. Full Node/DOM fidelity for every curriculum module inside the browser.
6. Social feed, public profiles, leaderboards-as-product.
7. AI tutor as the primary pedagogy (optional assist later; not the differentiator to bet the company on in v1).
8. Empty `api/` / `domain/` folders for DataFactor cosmetics (`DATAFACTOR_GAP_ANALYSIS.md` §6).
9. Invented git history / fake PRs for licensing optics.

---

## 8. Phased commercial roadmap (pruned)

Aligned with original long-horizon phases 3–10, cut by judgment:

| Phase | Focus | Exit criteria |
|---|---|---|
| **3 — Core loop software** | Predict soft-gate UI; scaffold/ready badges; judged-vs-link-out honesty; catalog `status` | Users can tell what works; lab loop is app-visible |
| **4 — Content depth** | Fill JS modules **02–12** to lab standard; grow judged DSA to **~50–100** mapped to patterns | Wedge completable without leaving the product |
| **5 — Skill + Interview** | Skill graph v0; “what next?”; Interview mode on judged set | Next-step recommendations feel earned |
| **6 — Harden execution** | Worker/iframe isolation; CSP; performance budgets | Safe enough for multi-user later |
| **7 — Persistence** | Auth + cloud progress sync (opt-in) | Cross-device progress; Pro-ready |
| **8 — Pro / Team pilots** | Paid packs + seat pilots | Paying users without ads |
| **9 — Assessments + Projects** | Checkpoint assessments; multi-file projects | Capstone path productized |
| **10 — Contests (optional)** | Only if phases 6–7 solid and demand clear | Else remain **Non-goal** |

**DataFactor hygiene** runs in parallel from Phase 3+: tests, ADRs, private policy if licensing is pursued — never ahead of learner value.

---

## 9. Success metrics (product, not vanity)

| Metric | Why |
|---|---|
| Count of **ready** modules (not dirs) | Honesty |
| Count of **hasJudge: true** problems with real tests | Immersion |
| Predict → run completion rate | Pedagogy productization |
| Lab concept → related challenge solve rate | Transfer moat |
| 7-day return with progress delta | Stickiness before auth |

---

## 10. Relationship to other Phase 2 docs

- `LAB_ARCHITECTURE.md` — shared lab infra, sync, security, migration
- `LEARNING_ENGINE.md` — domain model, loop, interview mode, enforcement
- `SKILL_GRAPH.md` — graph schema, next-step, storage shape
