# WHY TypeScript — sample notes

1. **Static typing catches entire classes of bugs before execution** (wrong fields, bad call shapes, many null mistakes under strict) across refactors, which tests may miss if coverage is incomplete.
2. **It does not authenticate external data, prove business correctness, or replace runtime testing.**
3. **Gradual typing** lets teams annotate incrementally (`allowJs`, `any` quarantine, progressive `strict`) without a big-bang rewrite.
4. **Structural typing** eases interop and duck-typed APIs but allows accidental mixing of similarly shaped types — brands/validation when identity matters.

Your wording may differ; mechanisms matter more than slogans.
