# 21 — Conditional Types

**Difficulty baseline:** ★★★★☆  
**Prerequisites:** [`20-mapped-types`](../20-mapped-types/)  
**Core loop:** Predict → Type-check → Run → Break → Explain  
**Core question:** How does `T extends U ? X : Y` branch on types?

---

## Learning outcomes

After this lab you can:

1. Write basic conditional types
2. See distributive conditionals over unions
3. Use conditionals for API capability types

---

# Lesson 1 — Basics

`experiments/01-conditional.ts` · [`predictions/P01-cond.md`](./predictions/P01-cond.md)

# Lesson 2 — Distribution

`experiments/02-distributive.ts` · [`predictions/P02-dist.md`](./predictions/P02-dist.md)

# Lesson 3 — Practical filter

`experiments/03-extract-preview.ts`


---

## Deliberate bugs

| File | Task |
|---|---|
| `challenges/broken/01-non-dist.ts` | Explain/fix wrapping to control distribution (tuple wrap) |

---

## Challenges

| ID | File | Difficulty |
|---|---|---|
| C01 | [`challenges/C01-non-null.md`](./challenges/C01-non-null.md) | ★★★ |

---

## Developer Knowledge boxes

### Deep Fact

Naked type params in conditionals distribute over unions.

### Why This Works

Branching types enable Extract/Exclude/ReturnType family.

### Common Misconception

Conditionals execute at runtime.

### Interview Insight

Explain distributive conditional types.

### Production Insight

Reach for conditionals when unions must map differently.

---

## How to work this module (order)

1 basics · 2 distributive · 3 extract · 4 broken · 5 C01

**Do not rush.** Depth beats speed. Types that never survive to runtime still shape design — prove both sides.

---

## When you are done

1. Update [`PROGRESS.md`](../PROGRESS.md) — mark `21-conditional-types`
2. Complete `review.md` Day 1 prompts cold
3. Proceed to [`22-infer/README.md`](../22-infer/README.md)
