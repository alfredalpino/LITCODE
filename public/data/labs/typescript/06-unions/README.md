# 06 — Union Types

**Difficulty baseline:** ★★☆☆☆  
**Prerequisites:** [`05-objects`](../05-objects/)  
**Core loop:** Predict → Type-check → Run → Break → Explain  
**Core question:** How do unions model 'one of these' — and how do discriminants make them usable?

---

## Learning outcomes

After this lab you can:

1. Build unions of primitives and object shapes
2. Use discriminated unions with a literal tag
3. Explain assignability into and out of unions
4. Avoid stringly unions when a discriminant exists

---

# Lesson 1 — Unions as sets

`string | number` means one inhabitant from either set.

`experiments/01-primitive-unions.ts` · [`predictions/P01-union.md`](./predictions/P01-union.md)

# Lesson 2 — Discriminated unions

A shared literal field enables safe narrowing.

`experiments/02-discriminated.ts` · [`predictions/P02-tag.md`](./predictions/P02-tag.md)

# Lesson 3 — Union members & exhaustiveness preview

`experiments/03-union-members.ts`


---

## Deliberate bugs

| File | Task |
|---|---|
| `challenges/broken/01-stringly.ts` | Replace string status with a discriminated union |

---

## Challenges

| ID | File | Difficulty |
|---|---|---|
| C01 | [`challenges/C01-event-union.md`](./challenges/C01-event-union.md) | ★★★ |

---

## Developer Knowledge boxes

### Deep Fact

Discriminated unions are the primary UI/state modeling tool in TS.

### Why This Works

A tag makes control-flow analysis precise.

### Common Misconception

Optional fields on one fat object equal a union.

### Interview Insight

Design a Result type without exceptions.

### Production Insight

Prefer tagged unions for async job/UI state.

---

## How to work this module (order)

1 primitives · 2 discriminated · 3 shapes · 4 broken · 5 C01

**Do not rush.** Depth beats speed. Types that never survive to runtime still shape design — prove both sides.

---

## When you are done

1. Update [`PROGRESS.md`](../PROGRESS.md) — mark `06-unions`
2. Complete `review.md` Day 1 prompts cold
3. Proceed to [`07-intersections/README.md`](../07-intersections/README.md)
