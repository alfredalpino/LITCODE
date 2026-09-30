# 08 — Literal Types & as const

**Difficulty baseline:** ★★★☆☆  
**Prerequisites:** [`07-intersections`](../07-intersections/)  
**Core loop:** Predict → Type-check → Run → Break → Explain  
**Core question:** How do literal types and `as const` lock down finite state spaces?

---

## Learning outcomes

After this lab you can:

1. Use string/number/boolean literal types
2. Apply `as const` to objects and arrays
3. Model finite state with literal unions
4. Contrast `satisfies` preview mentally (where available)

---

# Lesson 1 — Literal types

`experiments/01-literals.ts` · [`predictions/P01-widen.md`](./predictions/P01-widen.md)

# Lesson 2 — as const

`experiments/02-as-const.ts` · [`predictions/P02-const.md`](./predictions/P02-const.md)

# Lesson 3 — State modeling

`experiments/03-state.ts`


---

## Deliberate bugs

| File | Task |
|---|---|
| `challenges/broken/01-string-mode.ts` | Replace open string mode with literal union + as const config |

---

## Challenges

| ID | File | Difficulty |
|---|---|---|
| C01 | [`challenges/C01-http-methods.md`](./challenges/C01-http-methods.md) | ★★ |

---

## Developer Knowledge boxes

### Deep Fact

`as const` asks for the narrowest inferred type (readonly + literals).

### Why This Works

Finite literals make illegal states unrepresentable.

### Common Misconception

`as const` changes runtime values.

### Interview Insight

How do you derive a union from a const array?

### Production Insight

Config tables with `as const` + derived unions.

---

## How to work this module (order)

1 literals · 2 as const · 3 state · 4 broken · 5 C01

**Do not rush.** Depth beats speed. Types that never survive to runtime still shape design — prove both sides.

---

## When you are done

1. Update [`PROGRESS.md`](../PROGRESS.md) — mark `08-literal-types`
2. Complete `review.md` Day 1 prompts cold
3. Proceed to [`09-type-narrowing/README.md`](../09-type-narrowing/README.md)
