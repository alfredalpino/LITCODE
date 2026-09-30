# 10 — Type Guards & Predicates

**Difficulty baseline:** ★★★☆☆  
**Prerequisites:** [`09-type-narrowing`](../09-type-narrowing/)  
**Core loop:** Predict → Type-check → Run → Break → Explain  
**Core question:** When is a custom type predicate honest — and when is it a lie?

---

## Learning outcomes

After this lab you can:

1. Write `value is T` predicates
2. Contrast predicates vs real runtime validation
3. Use assertion functions (`asserts`) carefully
4. Keep guards honest at trust boundaries

---

# Lesson 1 — Type predicates

`experiments/01-predicate.ts` · [`predictions/P01-is.md`](./predictions/P01-is.md)

# Lesson 2 — Predicates are not validators

`experiments/02-honesty.ts` · [`predictions/P02-lie.md`](./predictions/P02-lie.md)

# Lesson 3 — asserts

`experiments/03-asserts.ts`


---

## Deliberate bugs

| File | Task |
|---|---|
| `challenges/broken/01-bad-guard.ts` | Make the guard check actual string fields |

---

## Challenges

| ID | File | Difficulty |
|---|---|---|
| C01 | [`challenges/C01-is-string-array.md`](./challenges/C01-is-string-array.md) | ★★★ |

---

## Developer Knowledge boxes

### Deep Fact

A predicate is a contract you make with the checker — lying is allowed and dangerous.

### Why This Works

Custom guards extend CFA to your domain types.

### Common Misconception

Type guards validate data like Zod.

### Interview Insight

Difference between predicate and assertion function.

### Production Insight

Untrusted JSON → real validation; guards for trusted in-process unions.

---

## How to work this module (order)

1 predicate · 2 honesty · 3 asserts · 4 broken · 5 C01

**Do not rush.** Depth beats speed. Types that never survive to runtime still shape design — prove both sides.

---

## When you are done

1. Update [`PROGRESS.md`](../PROGRESS.md) — mark `10-type-guards`
2. Complete `review.md` Day 1 prompts cold
3. Proceed to [`11-interfaces/README.md`](../11-interfaces/README.md)
