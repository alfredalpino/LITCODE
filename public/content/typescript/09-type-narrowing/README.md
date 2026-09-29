# 09 — Type Narrowing

**Difficulty baseline:** ★★★☆☆  
**Prerequisites:** [`08-literal-types`](../08-literal-types/)  
**Core loop:** Predict → Type-check → Run → Break → Explain  
**Core question:** How does control-flow analysis narrow unions — and where does it fail?

---

## Learning outcomes

After this lab you can:

1. Use typeof / equality / in / instanceof narrowing
2. Predict when CFA loses narrowing (aliases, mutations)
3. Combine discriminants with switch exhaustiveness

---

# Lesson 1 — Built-in narrowing

`experiments/01-typeof-in.ts` · [`predictions/P01-in.md`](./predictions/P01-in.md)

# Lesson 2 — Equality & discriminants

`experiments/02-equality.ts`

# Lesson 3 — Narrowing pitfalls

`experiments/03-pitfalls.ts` · [`predictions/P02-alias.md`](./predictions/P02-alias.md)


---

## Deliberate bugs

| File | Task |
|---|---|
| `challenges/broken/01-unsafe-access.ts` | Narrow before property access |

---

## Challenges

| ID | File | Difficulty |
|---|---|---|
| C01 | [`challenges/C01-parse-unknown.md`](./challenges/C01-parse-unknown.md) | ★★★ |

---

## Developer Knowledge boxes

### Deep Fact

CFA tracks discriminants and typeof; stored boolean aliases can lose correlation.

### Why This Works

Narrowing turns unions into actionable types without casts.

### Common Misconception

Once narrowed, mutations never widen again.

### Interview Insight

Walk through narrowing a Result type.

### Production Insight

Prefer discriminants over parallel optional fields.

---

## How to work this module (order)

1 typeof/in · 2 equality · 3 pitfalls · 4 broken · 5 C01

**Do not rush.** Depth beats speed. Types that never survive to runtime still shape design — prove both sides.

---

## When you are done

1. Update [`PROGRESS.md`](../PROGRESS.md) — mark `09-type-narrowing`
2. Complete `review.md` Day 1 prompts cold
3. Proceed to [`10-type-guards/README.md`](../10-type-guards/README.md)
