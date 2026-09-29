# C01 Infer quiz — answers

1. `const a = null` → `null`
2. `let b = null` → type is `null` under `strictNullChecks` (not `any`). Prefer an explicit annotation when you need a union, e.g. `let b: string | null = null`. Experiment with reassignment in your pinned `tsc` version and record surprises in `TYPE_SYSTEM_FACTS.md`.
3. `(number | null)[]`
4. `{ ok: true; value: number }` with `ok` as literal `true` (from `as const` on `true`)
5. `R` is `Promise<{ id: string }>`; `Awaited<R>` is `{ id: string }`

Always verify with your pinned TypeScript version — record surprises in TYPE_SYSTEM_FACTS.md.
