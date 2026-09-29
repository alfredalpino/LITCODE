# DataFactor Gap Analysis — Phase 1

**Date:** 2026-09-29  
**Research source:** `datafactor-analysis.md` (treated as strategic research, not unquestionable requirements)  
**Codebase:** Workspace audit evidence in `ARCHITECTURE_AUDIT.md` / `PRODUCT_AUDIT.md`

---

## 1. What DataFactor actually optimizes for

DataFactor is a **marketplace for proprietary training data** AI labs cannot scrape. Relevant seller path for this workspace: **`/score` code licensing** — private repos graded on architecture, testing, maintainability, documentation, security, and development history.

**They buy:** how real software is designed, reviewed, and evolved (code + PRs + issues + history).  
**They do not buy:** a pretty learning UI alone, public tutorial clones, or one-shot dumps.

**Separately:** DataFactor does not tell you how to win learners. Confusing “score well for licensing” with “ship a great learning product” creates overengineering.

---

## 2. Research insights worth keeping

| Insight | Keep? | Why |
|---|---|---|
| Prefer complete original systems over fragments | **Yes** | Aligns with shipping a coherent studio + labs |
| Architecture boundaries, tests, docs, security hygiene | **Yes** | Good engineering regardless of DataFactor |
| Git history / PRs / issues as asset | **Yes if licensing** | Meaningless for pure personal learning |
| Keep monetization candidates **private** | **Yes if licensing** | Studio is currently **public** on GitHub |
| Multi-repo portfolio | **Maybe** | Labs-as-repos can work; messy without contracts |
| Chase payout estimate numbers | **No** | Explicitly discouraged by research note itself |
| Company workflow / Slack data partner path | **No (now)** | Wrong scale for this product |

---

## 3. Gap matrix: research axes × current workspace

### Architecture

| Expected (research) | Current evidence | Gap |
|---|---|---|
| Clear layers (`api/`, `domain/`, `ui/`, `infra/`) | Flat Next `app/` + `src/components` + `src/lib`; no domain/API | **Large** |
| Separation of concerns | Content sync + runners + UI mixed in client | **Medium–Large** |
| One coherent app | Studio + 3 labs; sync coupling; incomplete curricula | **Medium** |

### Testing

| Expected | Current | Gap |
|---|---|---|
| Unit + integration for critical paths | `smoke-runners.mjs` only | **Large** |
| Tests that pass with the code | No CI test suite observed | **Large** |

### Maintainability

| Expected | Current | Gap |
|---|---|---|
| Typed, focused modules | TypeScript app present; large `StudioProvider` | **Medium** |
| Lint/format consistency | `oxlint`; no formatter config called out | **Small–Medium** |
| No dead branches | Legacy Vite CSS; stale README; scaffold modules | **Medium** |

### Documentation

| Expected | Current | Gap |
|---|---|---|
| Strong README (what/why/run/architecture) | Lab READMEs excellent; studio README stale/wrong (Vite) | **Medium** |
| ADRs / decision docs | **None before this Phase 1** | **Medium** (closing now) |
| Buyer-readable system docs | Missing product/lab architecture docs | **Large** until Phase 2 docs |

### Security

| Expected | Current | Gap |
|---|---|---|
| No secrets committed | No `.env` found | **OK** |
| Auth/validation on user-facing | N/A server; client execution unsafe as multi-tenant | **OK for solo / Large for SaaS** |
| Dependency hygiene | Lockfiles exist; no audit automation | **Small** |

### Development history

| Expected | Current | Gap |
|---|---|---|
| Private repo from day one | Studio **public** `github.com/alfredalpino/sde-laboratory-studio` | **Large** for licensing |
| Meaningful commits over time | Studio: 9 commits, same-day burst (2026-09-29) | **Large** |
| PRs + issues | Not evidenced as workflow | **Large** |
| Lab repos with history | JS/TS: **no git**; Python: init, **zero commits** | **Critical** |

---

## 4. Cross-cutting gap analysis (Product × Engineering × …)

| Dimension | Research / market pressure | Codebase reality | Priority judgment |
|---|---|---|---|
| **Product** | Complete original app | Shell strong; curriculum incomplete; DSA mostly referential | Finish core loop before licensing theater |
| **UX** | (DataFactor silent) | LeetCode clone chrome vs lab manifesto | Re-center brand on laboratory honesty |
| **Engineering** | Layered, tested system | Client SPA + scripts | Add layers when backend appears — not fake folders |
| **Learning** | Uniqueness / niche scarce data | Pedagogy is the scarce IP | **Protect and deepen** — this is the moat |
| **DX** | Maintainable | Sibling-folder sync fragile for clone/deploy | Document contract; consider packaging content |
| **Monetisation** | Private score path vs SaaS | Neither ready | Choose primary path per repo |
| **Branding** | Originality over boilerplate | UI looks like LeetCode boilerplate | Risk of “thin clone” judgment by buyers *and* users |
| **Security** | Clean responsible code | Runner mislabeled sandbox | Fix wording + isolate before multi-user |
| **Performance** | (Indirect via quality) | Heavy JSON + Monaco + Pyodide | Acceptable for MVP; plan splitting |

---

## 5. Mental model divergence (User → … → Backend)

```text
TARGET MODEL                         CURRENT SYSTEM
──────────────                       ──────────────
User                                 ✓ Browser user (anonymous)
  → Application Shell                ✓ Next StudioShell (LeetCode-like)
    → Laboratory System              ~ Content synced; mostly scaffolds in JS
      → Learning / Practice Engine   ✗ Markdown discipline, not software
        → Code Execution / Eval      ~ Browser runners; 10 judged DSA
          → Progress / Analytics     ~ localStorage checkboxes / streak
            → Persistence / Backend  ✗ None
```

**Biggest divergences:** Learning Engine and Persistence are almost entirely missing as systems; Laboratory completeness and Evaluation depth are overstated by UI.

---

## 6. What we should *not* copy from the research

1. **Do not invent fake PRs/issues** to look “historical” — research itself warns against organic-history games.  
2. **Do not build enterprise workflow telemetry** (data-partner path) for this product.  
3. **Do not add empty `api/` / `domain/` folders** just to look layered — add them when real boundaries exist.  
4. **Do not expand to 10k judged problems** to impress a scorer — uniqueness and pedagogy beat volume of stubs.  
5. **Do not make DataFactor the product roadmap** — learners don’t care about AI-lab licensing.

---

## 7. Recommended stance (Phase 1 decision)

**Primary product goal:** Commercially viable **developer laboratory platform** (learner value first).

**Secondary asset goal:** Shape the codebase so that *if* submitted to DataFactor later, it is a private, original, documented, tested system with real history — not a public LeetCode skin.

**Immediate honesty gap to close in Phase 2 planning docs:** content contracts (what “module complete” means), skill graph, learning engine, and product architecture that cuts Contest/10k-bank scope until the lab loop is undeniable.

---

## 8. Scorecard (subjective, evidence-based)

| DataFactor axis | Grade | One-line reason |
|---|---|---|
| Architecture | C | Works, but not layered full-stack |
| Testing | D | Smoke only |
| Maintainability | C+ | Typed app; debt and scaffolds |
| Documentation | B− | Labs excellent; product docs weak/stale |
| Security | C | Fine for local demo; weak isolation story |
| Development history | D− | Public burst commits; labs mostly unversioned |

**Learner-product grade (separate):** B shell / C− content completeness / D learning-engine software.

These grades are diagnostic for Phase 2 priorities — not a prediction of any third-party payout.
