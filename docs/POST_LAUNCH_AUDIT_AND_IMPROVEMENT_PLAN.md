# LITCODE — Post-Launch Audit & Improvement Plan

**Auditor role:** Principal product / engineering  
**Date:** 2026-09-30  
**Studio:** `sde-laboratory-studio/` (product: **LITCODE**, Next.js **16.3.7**, React 19.3)  
**Local verify:** production `next start -p 3000` — `/labs`, `/problems`, `/progress`, `/privacy`, `/og.png`, `/sitemap.xml` return HTTP 200 ( `/` → 307 to labs)  
**Scope:** Audit + prioritized plan only. No large feature implementation in this pass.

**Sources:** `FINAL_REPORT.md`, `docs/PRODUCT_ARCHITECTURE.md`, `docs/PHASE6–10*.md`, `docs/DECISIONS.md`, `package.json`, key UI (`AppNav`, `StudioShell`, `ProgressView`, `DsaProblemsList`, `SiteFooter`, legal pages), live content sync output, spot curl of local production.

---

## 1. Executive verdict

LITCODE is a coherent **practice-first laboratory** with honest product discipline: judged-first Problems, evidence Progress, lab-forward default home, deferred Contest, local-first privacy, and a real (if still thin) auto-judged bank. Phase 9–10 chrome and SEO hooks are shippable.

It is **not yet a defensible commercial launch** until production domain/env is locked, legal copy is counsel-grade, and the content wedge (ready labs + judged depth) is visibly stronger than the 2.5k link-out index. The product thesis is right; the risk is dilution by catalog gravity and incomplete curriculum bands.

**Ship posture:** Soft-launch / preview OK. Public marketing launch blocked on P0 ops + trust items below.

---

## 2. Snapshot of what exists (facts)

| Dimension | Current state (verified 2026-09-30) |
| --- | --- |
| Modules synced | **102** total · **51 ready** · **51 scaffold** |
| DSA index | **2504** problems · **52** `hasJudge: true` seeds |
| Company packs | **470** companies · **3392** tagged titles (external LC source) |
| Primary nav | Labs · Problems · Progress · Interview · Contest (+ Profile / settings) |
| Default home | `/` → `/labs` |
| Persistence | `localStorage` (`sde-lab-*`, events v1) — no auth |
| Runners | JS `AsyncFunction` same-origin; TS Sucrase; Python Pyodide CDN |
| Legal / SEO | `/privacy`, `/terms`, `og.png`, robots, sitemap — present |
| Deploy target | Netlify + `@netlify/plugin-nextjs` |
| Tests | `npm test` suite (status, events, skill-graph, Phase 6/8) |

---

## 3. Strengths (keep)

### Product / UX
- Clear thesis: **Predict → Run → Break → Prove** — not “LeetCode with better CSS.”
- **Judged-first** Problems default + Kind badges; fake acceptance % removed (`stats.ts`).
- **Contest honesty** — deferred copy, Hard practice fallback, no fake rankings.
- Lab-forward entry + first-run tip; FeatureCards contextualize Problems/Interview.
- Progress is **evidence-shaped** (events + skill graph buckets), not vanity streaks alone.

### Engineering
- Next App Router shell with dynamic Monaco / DSA arena (SSR-safe split).
- Content sync pipeline (`prebuild` sync + company + DSA gen) keeps studio as presentation layer.
- Module `status: scaffold | ready` honesty wired through catalog.
- Small, focused test scripts for learning infra (not theater).

### Learning content
- Ready paths across JS (00–12), Python Foundations (00–08), TS professional band (29 ready).
- 52 judged seeds with tests, hints, pattern discussion — quality bar documented.
- Cross-lab `related[]` + pattern → lab transfer links (Phase 8).

### DX / Security posture (appropriate for single-user today)
- No server execution of learner code.
- Analytics no-op unless `NEXT_PUBLIC_ANALYTICS_ENDPOINT` set.
- Runner labeled as learning convenience in README (DEC-008 / DEC-016).

### Branding
- LITCODE token system (Instrument Sans + JetBrains Mono, signal/slate) documented under `LITCODE/`.
- Product name consistent in chrome, metadata, footer.

---

## 4. Gaps & risks (by domain)

### 4.1 Product / UX
| Gap | Why it matters |
| --- | --- |
| Contest still in **primary nav** | Occupies trust-critical chrome for a deferred surface; invites “empty product” judgment |
| 2504-row table + company packs dominate mental model | Users can toggle away from judged-first and feel “thin LC clone” |
| Interview mode depth | Statement-first + Run/Submit exists; timed interview UX / session replay still light |
| No progress export / backup | Local-only progress loss on clear-site-data is a retention cliff |
| Notifications UI | Bell present; value unclear vs noise for solo local app |
| Mobile Problems | Paginated table (50/page) — still table-first; card layout called out as remaining polish |

### 4.2 Engineering
| Gap | Why it matters |
| --- | --- |
| Folder slug `sde-laboratory-studio` vs product LITCODE | DX, Netlify default hostname, share URLs, contributor confusion |
| README still says “Next.js 15” | Doc drift after 16.3.7 upgrade |
| SPA-ish shell + pathname sync | Works; deep-link edge cases and loading flash (“Loading laboratories…”) still feel boot-heavy |
| Sibling labs not in studio repo | Clone-studio-alone breaks content (`DEC-003`) |
| No CSP / Worker isolation | Fine for personal use; blocks Team / Contest / shared untrusted content |

### 4.3 Learning content
| Gap | Why it matters |
| --- | --- |
| JS **13–40** scaffolds | Async / event-loop / DOM — high interview + lab value missing |
| Python Core DS **09–13** scaffolds; Algorithms planned | Pattern teaching without DS labs weakens transfer story |
| TS scaffolds (classes, config, async, testing) | Pro path incomplete after strong fundamentals |
| Judged bank **52** vs index **2504** | Ratio still ~2%; growth must stay verified (DEC-005) |
| Assessments / Projects | Honest stubs only — correct, but leaves “prove mastery” incomplete |

### 4.4 DX
| Gap | Why it matters |
| --- | --- |
| `predev`/`prebuild` always regenerates large DSA/company JSON | Slow iteration; easy to confuse generated vs authored content |
| Dual docs locations historically | Prefer workspace `docs/` as SoT (studio README already links there) |
| Env example present; local `.env.local` discipline not enforced in README flow prominently enough | Wrong canonical URL in local OG/sitemap if unset |

### 4.5 Security
| Gap | Why it matters |
| --- | --- |
| Same-origin `AsyncFunction` runner | XSS-to-self; not multi-tenant safe |
| Pyodide from CDN | Supply-chain + first-load trust; pin/SRI strategy unclear |
| Google Fonts runtime link in `layout.tsx` | Privacy + performance; third-party dependency on every page |
| Legal pages are **placeholders** | Footer links exist but counsel review missing — launch liability |

### 4.6 Performance
| Gap | Why it matters |
| --- | --- |
| Large `public/dsa/index.json` client load | Boot cost for Problems/search |
| Monaco + Pyodide cold start | Expected; no progressive empty-state timing guidance for Python first run |
| External font CSS | Render-blocking; no `next/font` self-host |
| Company packs JSON size | Filter UX may pull heavy data into memory |

### 4.7 Accessibility
| Gap | Why it matters |
| --- | --- |
| Good foundations | Focus rings, `aria-current`, search `aria-controls`, reduced-motion CSS, progressbars |
| Remaining | Dense tables may lack keyboard row activation patterns consistently; color-only difficulty cues; loading states need live regions |

### 4.8 Commercial
| Gap | Why it matters |
| --- | --- |
| Pricing doc-only (correct) | No paywall on local features — good; Pro needs sync/auth first |
| No production domain / env lock | SEO canonical defaults to `https://litcode.dev` — must match real host |
| Netlify site slug may still be studio-named | Brand mismatch on share URLs |
| No conversion surface | Fine pre-auth; don’t add fake Upgrade CTAs |

### 4.9 Branding
| Gap | Why it matters |
| --- | --- |
| Folder / Netlify / GitHub rename optional | Brand lag dilutes LITCODE |
| `localStorage` still `sde-lab-*` | Correct for migration safety; document forever or schedule migrator |
| Contest trophy in nav | LeetCode-adjacent signal vs lab brand |

---

## 5. What’s strong vs what gaps (summary)

| Area | Strong now | Gaps |
| --- | --- | --- |
| Product thesis | Lab-first positioning, honesty UX | Contest chrome; index gravity |
| Core loop | Predict gate, runners, judged seeds | Incomplete curriculum bands |
| Progress | Events + mastery buckets + next steps | Export, cloud sync |
| Polish | Top nav, FeatureCards, EmptyState | Mobile table → cards; boot loading |
| Launch ops | robots/sitemap/OG/legal routes | Domain, counsel-grade legal, Netlify smoke |
| Security | No server eval | Isolation before multi-user |
| Commercial | Freemium plan documented | Auth/sync prerequisites |

---

## 6. Prioritized improvement plan

### P0 — Do before public marketing launch (trust + ops)

Concrete, shippable items:

1. **Lock production canonical URL**  
   - Set Netlify `NEXT_PUBLIC_SITE_URL` to the real production origin (custom domain or final Netlify name).  
   - Verify `/sitemap.xml` and OG tags resolve to that host (not a stale default).

2. **Replace placeholder Privacy / Terms with counsel-ready copy**  
   - Keep local-first + browser execution + optional analytics facts.  
   - Add contact email / repo issue link; version “Last updated” after review.  
   - Do not remove footer links.

3. **Production smoke checklist (Netlify preview + prod)**  
   - Manual: `/labs` open module → predict → run; `/problems` judged open → Run/Submit; `/progress` shows activity after solve; `/privacy` `/terms` `/og.png` `/robots.txt`.  
   - Capture pass/fail in a short runbook under `docs/` or CI comment.

4. **Contest nav treatment**  
   - Either demote Contest out of primary `NAV_ITEMS` (keep route reachable from Interview/footer) **or** keep but add persistent “Deferred” chip in the nav item itself so first-time users never misread it as live.

5. **README / deploy doc accuracy**  
   - Fix “Next.js 15” → **16.3.7**; document `npm run build && npm run start -- -p 3000` for local production.  
   - Clarify sibling-lab requirement for sync.

6. **Judged-first retention in Problems UX**  
   - When user disables judge-only and browses 2.5k link-outs, show a one-line honesty banner: “Most of this index opens on LeetCode; LITCODE judges N problems in-app.”  
   - Prevent accidental dilution of the product story.

### P1 — Post-launch 1–2 cycles (retention + wedge)

1. **Content wedge fills (quality bar unchanged)**  
   - JS: prioritize async / promises / event-loop modules in the 13+ band (highest transfer value).  
   - Python: Core DS 09–13 to ready.  
   - Grow judged bank **52 → ~80–100** only with verified solvers + ≥4 tests (reuse `dsa:phase6` pipeline).

2. **Progress JSON export + import**  
   - Download `sde-lab-events-v1` + progress maps; optional restore. Unblocks Pro narrative without auth.

3. **Boot / perf**  
   - Self-host fonts via `next/font` (drop runtime Google Fonts link).  
   - Lazy-load DSA index / company packs after shell paint; consider splitting judged subset for Interview default path.

4. **Interview mode hardening**  
   - Timed session, visible vs hidden test clarity, end-of-session summary wired to events (no fake scoreboard).

5. **Folder / Netlify rename to LITCODE** (user-driven)  
   - Follow `LITCODE/README.md` manual steps; update share URL in Profile.

6. **A11y pass on Problems table**  
   - Row keyboard activation, difficulty not color-only, announce filter result counts.

7. **Analytics endpoint (optional)**  
   - If enabled: document event schema, no PII, sampling; keep learning evidence local.

### P2 — Later (scale / monetization prerequisites)

1. **Auth + cloud progress sync** — gate for Pro; do not paywall local labs.  
2. **Runner isolation** (Worker/iframe + CSP) — required before Team, Contest, or shared code.  
3. **Assessments v0** — thin pattern quizzes after skill clusters (only if quality bar met).  
4. **Multi-file Projects runner** — unlock JS 39/40 style modules.  
5. **Mobile card UI** for large Problems lists.  
6. **Team seats / mentor read-only** — after Pro sticky.  
7. **localStorage key migration** `sde-lab-*` → `litcode-*` with one-time migrator.  
8. **Monorepo or content package** — fix clone-studio-alone broken content (`DEC-003` future).

---

## 7. Explicit non-goals (reaffirm)

Do **not** prioritize in the next cycle:

- Live contests / ratings / anti-cheat  
- 10k auto-generated judged stubs  
- Paywalls on local-only features  
- Fake assessments / project depth theater  
- Server-side execution of arbitrary learner code in the Next process  

Aligned with `PRODUCT_ARCHITECTURE.md` §7 and DEC-004 / DEC-005 / DEC-031.

---

## 8. Suggested sequencing (actionable, not calendar fluff)

1. Finish **P0.1–P0.5** in one ops PR + Netlify config pass.  
2. Ship **P0.6** honesty banner (small UI).  
3. Content: one JS async module band + Python 09–10 in parallel with judged bank +10 verified seeds.  
4. Progress export (half-day feature) before any auth work.  
5. Fonts + DSA lazy-load perf PR.  
6. Revisit Contest nav demotion after one week of preview analytics/feedback.

---

## 9. Local deployment note (this audit session)

| Item | Value |
| --- | --- |
| Prefer command | `npm run build && npm run start -- -p 3000` (or `npx next start -p 3000` after build) |
| URL | http://localhost:3000 |
| Status | Responding after clean restart (200 on core routes; `/` → 307 `/labs`) |

---

## 9b. P0 implementation status (2026-09-30)

**Shipped in studio (DEC-033):**

| P0 | Status |
| --- | --- |
| P0.1 `NEXT_PUBLIC_SITE_URL` docs/lock | Done — `.env.example`, README, `site.ts` comments; placeholder kept until operator sets real domain |
| P0.2 Privacy / Terms counsel-ready drafts | Done — stronger drafts + “not legal advice / consult counsel”; counsel sign-off still manual |
| P0.3 Netlify smoke checklist | Documented below — remote deploy remains manual |
| P0.4 Contest nav honesty | Done — persistent **Deferred** chip + muted nav styling |
| P0.5 README / deploy accuracy | Done — Next.js **16.3.7** + local `build && start -p 3000` |
| P0.6 Judged-first honesty banner | Done — shown when browsing full DSA link-out index |

**Still manual (operator):** set production `NEXT_PUBLIC_SITE_URL` on Netlify; counsel review of legal pages; run smoke checklist on preview/prod; optional folder/Netlify rename to LITCODE.

### Netlify smoke checklist (manual)

Run on **Preview** then **Production** after deploy. Check pass/fail:

- [ ] `/labs` — open a **ready** module → Predict gate → Run in editor
- [ ] `/problems` — judged-only open → Run / Submit; disable judged-only → honesty banner visible
- [ ] `/progress` — activity / mastery updates after a solve
- [ ] `/contest` — Deferred messaging (not live rankings)
- [ ] `/privacy` · `/terms` — draft pages load; footer links work
- [ ] `/og.png` · `/robots.txt` · `/sitemap.xml` — 200; sitemap/OG host matches `NEXT_PUBLIC_SITE_URL`
- [ ] Env: Netlify `NEXT_PUBLIC_SITE_URL` equals the origin in the browser address bar (no trailing slash)

Capture results in a PR comment or short runbook note.

---

## 10. Decision log

See **DEC-032** (P0 framing) and **DEC-033** (P0 implementation) in `docs/DECISIONS.md`.

---

*End of post-launch audit.*
