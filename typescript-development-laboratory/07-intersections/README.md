# 07 — Intersection Types

**Difficulty baseline:** ★★☆☆☆  
**Prerequisites:** [`06-unions`](../06-unions/)  
**Core loop:** Predict → Type-check → Run → Break → Explain  
**Core question:** When does `A & B` mean 'both', and when does it collapse to `never`?

---

## Learning outcomes

After this lab you can:

1. Compose object types with `&`
2. Predict incompatible intersections → `never`
3. Contrast intersections vs extends/interface merging
4. Use intersections for mixin-style composition carefully

---

# Lesson 1 — Object intersections

`experiments/01-object-and.ts` · [`predictions/P01-and.md`](./predictions/P01-and.md)

# Lesson 2 — Incompatible intersections

`experiments/02-never-intersection.ts` · [`predictions/P02-never.md`](./predictions/P02-never.md)

# Lesson 3 — Practical composition

`experiments/03-compose.ts`


---

## Deliberate bugs

| File | Task |
|---|---|
| `challenges/broken/01-conflict.ts` | Fix the model so props are composable without never |

---

## Challenges

| ID | File | Difficulty |
|---|---|---|
| C01 | [`challenges/C01-with-id.md`](./challenges/C01-with-id.md) | ★★ |

---

## Developer Knowledge boxes

### Deep Fact

Intersecting conflicting primitive/literal properties yields `never`.

### Why This Works

Composition expresses 'all of these shapes simultaneously'.

### Common Misconception

`A & B` means 'either A or B'.

### Interview Insight

When to use `&` vs interface extends.

### Production Insight

Variants → union; mixins/cross-cutting fields → intersection.

---

## How to work this module (order)

1 object & · 2 never · 3 compose · 4 broken · 5 C01

**Do not rush.** Depth beats speed. Types that never survive to runtime still shape design — prove both sides.

---

## When you are done

1. Update [`PROGRESS.md`](../PROGRESS.md) — mark `07-intersections`
2. Complete `review.md` Day 1 prompts cold
3. Proceed to [`08-literal-types/README.md`](../08-literal-types/README.md)
