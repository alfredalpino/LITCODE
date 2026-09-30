# 02 — Basic Types

**Difficulty:** ★★☆☆☆ (peaks ★★★ with `never` / `unknown`)  
**Prerequisites:** 00, 01  
**Core question:** What do the fundamental TypeScript types mean — and how do they differ?

---

## Learning outcomes

1. Use and compare: `string` `number` `boolean` `bigint` `symbol` `null` `undefined` `object` `unknown` `any` `never` `void`
2. Explain why `any` and `unknown` are radically different
3. Use `never` for non-returning functions and exhaustiveness previews
4. Contrast `object`, `{}`, and “real” object types
5. Decide assignability experimentally — not by memorizing a poster

---

## Critical comparisons

| Type | Intuition | Use when |
|---|---|---|
| `any` | Opt out of checking | Rare quarantine of untyped JS |
| `unknown` | Must narrow before use | External data, catch clauses |
| `never` | Impossible / no return | fail(), exhaustiveness |
| `void` | No meaningful return | callbacks ignored return |
| `null` / `undefined` | Absence (distinct under strict) | Optional APIs, missing values |
| `object` | Non-primitive (historical quirks) | Rarely best API type |
| `{}` | Any non-nullish value (approx.) | Almost never what you want for “empty object” |

**Deep Fact:** Prefer specific object types / `Record` / `unknown` over `Object`, `object`, or `{}` for APIs.

---

## Lesson loop (every experiment)

```text
Predict assignability → typecheck snippet → run if meaningful → break → fix → explain
```

---

## Experiments

| # | File | Focus |
|---|---|---|
| 01 | `experiments/01-primitives-exist.ts` | Runtime typeof vs TS types |
| 02 | `experiments/02-any-vs-unknown.ts` | Safety difference |
| 03 | `experiments/03-never-fail.ts` | `never` return |
| 04 | `experiments/04-void-vs-undefined.ts` | `void` nuance |
| 05 | `experiments/05-assignability-matrix.ts` | Compile drills via comments |
| 06 | `experiments/06-object-vs-empty.ts` | `object` / `{}` surprises |

Predictions: `predictions/P01`–`P04`.

### Assignability worksheet

Open [`challenges/C01-assignability-worksheet.md`](./challenges/C01-assignability-worksheet.md).  
For each row: **compiles?** YES/NO — then verify with temporary uncommenting in `05-assignability-matrix.ts` or scratch files.

---

## Major topic: `any` vs `unknown`

Read and run `02-any-vs-unknown.ts`.

Refactor challenge: [`challenges/broken/01-any-bug.ts`](./challenges/broken/01-any-bug.ts) — a bug hidden by `any`. Replace with `unknown` + narrowing so the bug becomes a type error or a handled case.

---

## Major topic: `never`

```ts
function fail(message: string): never {
  throw new Error(message);
}
```

After `fail`, the checker treats following code as unreachable.  
Preview exhaustiveness in `experiments/03-never-fail.ts`.

---

## Challenges

- **C01** Assignability worksheet ★★★  
- **C02** Any-bug refactor ★★★  
- **C03** Implement `assertNever` sketch ★★★ — [`challenges/C03-assert-never.md`](./challenges/C03-assert-never.md)

---

## Interview prompts

1. Why is `unknown` better than `any` for `JSON.parse` results?  
2. Is `void` the same as `undefined`?  
3. What inhabiting values does `never` have?

---

## When done

Update progress → [`03-type-inference`](../03-type-inference/)
