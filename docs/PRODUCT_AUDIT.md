# Product Audit — Phase 1 Discovery

**Date:** 2026-09-29  
**Lens:** PM · Design · Learning science · Marketing · Commercial viability  
**Inputs:** Codebase inspection + `datafactor-analysis.md` (research, not mandate)

---

## 1. What the product is today

**Working name (Phase 1):** SDE Laboratory Studio (“SDE Lab” in nav) — **superseded in Phase 3 by LITCODE** (see `LITCODE/` and `docs/DECISIONS.md` DEC-019)

**Promise (implicit):** One place to (a) learn JS / Python / TypeScript by doing, and (b) grind interview DSA with company-tagged problems — LeetCode-familiar UX, laboratory philosophy underneath.

**Actual delivered experience:**

1. **Problems** — browse ~2501 titles (mostly LeetCode index + company tags); open Monaco; only **10** problems auto-judge; rest are “practice here / verify on LeetCode”
2. **Labs** — read synced markdown; run experiments for modules that have code; mark complete in browser
3. **Contest / Interview / Profile** — UI surfaces with limited differentiated mechanics (Hard filter, company packs, local profile)

**ICP (inferred, not validated):** Self-taught / early-career engineers preparing for startup interviews who want deeper language understanding than tutorial YouTube + LeetCode grind alone.

---

## 2. Product thesis (proposed)

> **LITCODE (Phase 3 name; was “SDE Lab”) is a practice-first developer laboratory:** language mastery and interview problem-solving share one shell, differentiated by an experimental pedagogy (predict → run → break → explain) and verifiable skill progress — not by cloning LeetCode’s catalog depth.

Commercially, that thesis supports two monetization tracks that must not be confused:

| Track | Customer | Asset | Timing |
|---|---|---|---|
| **B2C / B2B learning product** | Learners, bootcamps, teams | App + curriculum + progress | Requires product-market fit |
| **DataFactor `/score` licensing** | AI labs (via DataFactor) | Private original repo + engineering history | Requires private, composed, tested system over time |

DataFactor does **not** define the user product. It defines how to *build and version* the system if licensing is a goal.

---

## 3. Differentiation (honest)

### Real differentiators (present in DNA)

- Explicit runtime vs language vs host distinctions (JS/TS/Python lab doctrine)
- Predict-before-run culture; anti-notebook early Python stance
- Multi-lab sync into one studio
- Company-wise problem metadata from a real community dataset (liquidslr)
- In-browser multi-language run loop without installing three toolchains (for filled modules)

### Fake / fragile differentiators (UI theater)

- “10k DSA” aspiration vs **10 judged seeds + LC outbound links**
- Fake acceptance percentages
- Contest / Biweekly / Virtual cards without contest infra
- 41 JS modules in the sidebar where ~39 are scaffold placeholders

### Competitive alternatives

| Alternative | They win on | We can win on |
|---|---|---|
| LeetCode | Scale, judge, contests, prestige | Pedagogy depth, language labs |
| NeetCode / Blind 75 lists | Curation clarity | Integrated lab → pattern → problem path |
| Frontend Masters / courses | Production production production | Active experimentation loop |
| Local repos + Node only | Fidelity for Node/DOM | Unified UX + DSA bridge |

**Judgment:** Do not compete on problem count. Compete on **learning loop quality** and **skill transfer from lab → interview**.

---

## 4. UX audit

### Strengths

- Familiar problem-list mental model reduces onboarding friction
- Split read/code for labs; mobile pane toggle
- Visual polish (dark theme, typography, motion-ready deps)
- Profile / streak / favorites create light habit loops

### Gaps

| UX area | Issue |
|---|---|
| Honesty | Scaffolds look like ready modules |
| Lab loop | Prediction, hints, review not first-class UI |
| DSA | Outbound to LeetCode breaks immersion |
| Empty states | Weak guidance when `hasJudge: false` |
| Brand | LeetCode-clone signal dominates “laboratory” brand |
| Onboarding | Home redirects to `/problems` — labs philosophy secondary |
| A11y | Partial labels; no full keyboard/focus audit or reduced-motion policy |
| SEO / share | Thin metadata; profiles not real social objects |

---

## 5. Learning product audit

### Pedagogy quality (where content exists)

**High.** Module design in `00`/`01` JS, all four TS modules, and four Python modules is unusually rigorous for a personal project: misconceptions, engine vs language labels, interview prompts, progressive solutions.

### Pedagogy completion

**Low for JS.** Curriculum map is a promise; product currently teaches a thin slice.

### Learning engine software maturity

**Low.** Progress = checkbox. No mastery model, spaced review automation, or adaptive next-step.

### Skill graph

**Absent.** Topics exist as DSA tags and lab folders but are not a navigable graph with prerequisites and evidence of skill.

---

## 6. Monetisation readiness (product side)

| Model | Fit today | Blockers |
|---|---|---|
| Freemium / Pro | UI once had Pro framing (removed in history `ea2f0c5`) | No auth, no sync, no premium content gate |
| Course / cohort | Strong content philosophy | Incomplete labs; delivery is DIY |
| B2B licenses | Possible later | No admin, SSO, analytics |
| Ads / affiliate LC | Easy but brand-hostile | Conflicts with lab trust |
| DataFactor license | Separate path | Public studio repo; missing lab git history; thin tests |

**Judgment:** Monetise the **learning product** only after the core loop works without LeetCode for a curated problem set. Treat DataFactor as **repo asset strategy**, not feature backlog.

---

## 7. Branding & marketing

- **Name:** Phase 1 flagged “SDE Laboratory Studio / SDE Lab” as weak — **resolved Phase 3 → LITCODE**
- **Positioning conflict:** LeetCode shell vs laboratory manifesto in READMEs
- **Story that should win:** “Stop consuming tutorials. Run experiments. Prove what you think you know.”
- **Story that currently ships:** “Problems list that looks like LeetCode”
- **datafactor.com positioning:** If licensing is a goal, brand the *engineering of the platform* (architecture, content compiler, judge, curriculum schema) as the unique system — not a theme park of UI clones

---

## 8. Go-to-market readiness

Not launch-ready as a commercial product. Ready as:

1. Personal learning environment for the author
2. Demo of studio + sync architecture
3. Seed for a private productization effort

Minimum commercial wedge (recommended):

1. Finish JS modules 02–12 (highest leverage language core) to lab standard  
2. Curate **50–100 judged** DSA problems mapped to patterns taught in labs  
3. App-enforced predict → run → review for labs  
4. Auth + cloud progress only if multi-device or paid is real  

---

## 9. Risks

| Risk | Severity | Note |
|---|---|---|
| Trust: UI oversells completeness | High | Users bounce when scaffolds appear |
| Legal: LC titles/links + company tags | Medium | Indexing/linking vs hosting problem statements; review ToS before scaling |
| Security of “sandbox” | Medium | Fine for personal demo; not fine for multi-tenant |
| Scope greed (10k problems, contests) | High | Dilutes lab differentiation |
| Public repo vs licensing research | Medium | Conflicts with DataFactor private-code advice |

---

## 10. Product audit verdict

The **idea** is commercially viable: experimental language labs + interview practice in one product is a real gap in the market. The **current build** is an impressive shell around a **partial curriculum** and a **mostly referential DSA index**. Phase 2 should write architecture for depth and honesty — not feature expansion for parity with LeetCode.
