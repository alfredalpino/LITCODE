# DataFactor Analysis — Build Apps We Can Sell

How [datafactor.com](https://datafactor.com) works, what [datafactor.com/score](https://datafactor.com/score) actually grades, and how we should build so our repos can qualify for licensing money.

---

## What DataFactor is

DataFactor is a **two-sided marketplace for proprietary data that AI labs cannot scrape from the open web**.

| Side | Who | What they want |
|------|-----|----------------|
| **Buyers** | Frontier AI companies | Private datasets: enterprise workflows, private code + engineering history, multimodal media, expert/domain knowledge |
| **Sellers** | Companies & developers | Cash for licensing data/code they already own — without giving up ownership by default |

They do **not** crawl the public internet. Provenance is the product: licensed from the owner, rights verified, then prepared and delivered to AI teams.

### Their core data categories

1. **Enterprise workflow data** — email, chat, docs, CRM, support, SOPs, project activity  
2. **Private code & engineering data** — repos, commits, PRs, issues, tests, review history  
3. **Video / audio / multimodal** — real-world specialized media  
4. **Expert & domain data** — software, math, healthcare, science, finance

### How they sell to AI labs (buyer funnel)

1. Define the model capability needed  
2. Source proprietary datasets from their network  
3. Evaluate quality, provenance, uniqueness, scale, fit  
4. Prepare (anonymize, normalize, enrich)  
5. License and deliver  

**Implication for us:** AI buyers pay for *how real software gets built* — not just a zip of source files. Code + git history + PRs + issues is the product.

---

## The `/score` page (developer / code seller funnel)

This is the channel for individual developers and portfolios.

**Pitch:** Submit repos → free quality score → if it qualifies, possible cash licensing offer. You keep ownership unless the signed agreement says otherwise.

### How it works (their 3 steps)

1. **Submit** — private repo link (GitHub / GitLab / Bitbucket), account URL for multi-repo scoring, or upload. Prefer a fine-grained token with read-only `Contents`, `Pull requests`, and `Issues`.  
2. **Score** — graded on architecture, testing, maintainability, documentation, security, and development history. Structural analysis + Claude judgment pass → grade, evidence, recommendations, payout *estimate*.  
3. **Offer** — if it qualifies, they may make a cash licensing offer.

### What they say you could earn

- A **single strong** repo: thousands of dollars  
- **Multi-repo portfolios**: more  
- **Larger codebases + strong history**: volume value  
- Final pay = quality × scope × uniqueness  
- All numbers on the page (and in the report) are **approximate, non-binding estimates** — real money only appears in a **signed licensing agreement**

### What they’re looking for

High-quality, **original** code across:

- Full-stack applications  
- Backend systems and APIs  
- Infrastructure and developer tools  
- Data engineering and machine learning  
- Mobile and desktop applications  
- Specialized / industry-specific software  
- Complete multi-repo portfolios (bulk licensing)

### Privacy claims (scoring only)

| Claim | Meaning |
|-------|---------|
| Never stored | Ephemeral sandbox; destroyed after scoring; scores kept, not the code |
| Never executed | Static, read-only; not run/installed/built; not used for training during scoring |
| Token for follow-up | Token saved with session for read-only access + sales follow-up |
| Scores only | They retain score, grade, evidence lines, recommendations |

Training rights exist **only after** you accept an offer and sign.

### Critical signals they make explicit

1. **Private code is what has value.** Public repos are “far more likely to be rejected with no payout” because labs already have them.  
2. **PRs + issues are extra valuable.** Their token guide says Contents is for scoring; Pull requests and Issues are “the review history buyers pay extra for.”  
3. You must **own or control the rights** to anything you submit.  
4. Submitting ≠ guaranteed offer.

---

## Scoring dimensions → how we build

Every app we ship should deliberately score well on these six axes.

### 1. Architecture

**They want:** Clear structure, sensible layers, scalable shape — not a spaghetti tutorial dump.

**We do:**

- Explicit folder boundaries (`api/`, `domain/`, `ui/`, `infra/`, etc.)  
- Real separation of concerns (routes ≠ business logic ≠ data access)  
- Consistent patterns across the repo (naming, modules, error handling)  
- Prefer one coherent app over many half-finished stubs  

### 2. Testing

**They want:** Evidence the system was engineered, not just vibe-coded once.

**We do:**

- Unit tests for core logic  
- Integration / API tests for critical paths  
- Tests that live with the code and actually pass  
- Prefer meaningful coverage of business rules over snapshot theater  

### 3. Maintainability

**They want:** Code another engineer (or model) can reason about.

**We do:**

- Small, focused files and functions  
- Typed where it helps (TS / type hints)  
- Lint + format consistency  
- No dead experimental branches left hanging  
- Dependencies pinned and justified  

### 4. Documentation

**They want:** Enough context to understand purpose, setup, and design.

**We do:**

- Strong `README`: what it is, why it exists, how to run, architecture sketch  
- Docs for non-obvious decisions (`docs/` or ADRs for bigger apps)  
- Inline comments only where intent isn’t obvious  
- Changelog or release notes for mature projects  

### 5. Security

**They want:** Clean, responsible code — not a secrets dump.

**We do:**

- Never commit `.env`, keys, tokens, customer data  
- Use env vars / secrets managers patterns  
- Auth, validation, and input sanitization on anything user-facing  
- Dependency hygiene (no known-vulnerable junk left unfixed)  

### 6. Development history

**They want:** Proof of real engineering process over time.

**We do:**

- Build in **private** repos from day one when monetization is a goal  
- Meaningful commits over weeks/months (not one giant dump)  
- Use branches, PRs, and code review — even solo (self-review PRs are fine)  
- Track work with issues (features, bugs, decisions)  
- Prefer organic history over rewriting git to look fake  

---

## Value multipliers (what increases payout odds)

| Factor | Why it matters |
|--------|----------------|
| **Private** | Public code is already available to labs |
| **Original** | Unique work beats clones, course forks, boilerplates |
| **Volume** | Larger codebases + multi-repo portfolios = bulk deals |
| **History** | Commits + PRs + issues = engineering process data buyers pay for |
| **Quality** | High scores on the six dimensions above |
| **Uniqueness** | Niche / industry-specific systems are scarce |
| **Completeness** | Working full apps > fragments and demos |

---

## What kills value (avoid these)

- Public GitHub “portfolio” dumps of the same tutorials everyone has  
- Create-react-app / Next boilerplate with almost no original logic  
- Copy-paste from Stack Overflow / LLMs with no design ownership  
- One-commit repos (“Initial commit” of 10k lines)  
- No tests, no README, no structure  
- Secrets, scraped data, or code you don’t own  
- Thin wrappers around third-party APIs with no real system  

---

## Practical build rules for this workspace

Use these as the bar for anything we intend to license later:

1. **Ship real products**, not notebook demos — full-stack, APIs, tools, ML pipelines, mobile/desktop when relevant.  
2. **Keep monetization candidates private** until we decide otherwise.  
3. **Treat git as part of the asset** — commits, PRs, issues are inventory.  
4. **Score yourself before they do** — checklist the six dimensions before calling a repo “done.”  
5. **Prefer portfolios** — several strong related repos beat one mediocre mega-repo.  
6. **Own the rights** — original work; no stolen code; clear license ownership.  
7. **Document like a buyer will read it** — README + architecture should explain the system without a tour.  
8. **Don’t optimize for the estimate number** — optimize for quality, originality, and history; the estimate is marketing, the agreement is money.

---

## Two monetization paths (know which one you’re on)

| Path | Entry | Asset | Scale |
|------|-------|-------|-------|
| **`/score` (code licensing)** | Submit private repos | Code + engineering history | Single repo: ~thousands; portfolios: more |
| **Data partner (company data)** | Company program | Anonymized workflow signals from Slack/email/CRM/etc. | Directional company estimates from tens of thousands to $1M+ |

For solo / small-team app building, **`/score` is the relevant path**. Build complete original systems with private history.

---

## Bottom line

DataFactor pays for **scarce, high-signal proprietary software artifacts** that help train AI on how real systems are designed, tested, documented, secured, and evolved.

So we don’t just “finish features.” We build **licensable repositories**:

> Original · Private · Architected · Tested · Documented · Secure · With real development history · Preferably as a portfolio

That is the product we are selling — not the UI alone.

---

*Sources: datafactor.com, datafactor.com/score, datafactor.com/data-partner (retrieved for this note). Payout figures on their site are estimates only.*
