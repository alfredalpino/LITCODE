# 15 — Generic Constraints

**Difficulty baseline:** ★★★☆☆  
**Prerequisites:** [`14-generics`](../14-generics/)  
**Core loop:** Predict → Type-check → Run → Break → Explain  
**Core question:** How does `extends` constrain type parameters to useful shapes?

---

## Learning outcomes

After this lab you can:

1. Write `T extends Shape` constraints
2. Use `keyof` constraints (`K extends keyof T`)
3. Combine defaults with constraints

---

# Lesson 1 — extends constraints

`experiments/01-extends.ts` · [`predictions/P01-len.md`](./predictions/P01-len.md)

# Lesson 2 — keyof constraints

`experiments/02-keyof-constraint.ts` · [`predictions/P02-key.md`](./predictions/P02-key.md)

# Lesson 3 — Defaults

`experiments/03-defaults.ts`


---

## Deliberate bugs

| File | Task |
|---|---|
| `challenges/broken/01-unconstrained.ts` | Constrain so `.id` access is safe |

---

## Challenges

| ID | File | Difficulty |
|---|---|---|
| C01 | [`challenges/C01-merge.md`](./challenges/C01-merge.md) | ★★★ |

---

## Developer Knowledge boxes

### Deep Fact

`extends` on type params is a constraint, not inheritance runtime.

### Why This Works

Constraints unlock property access inside generic bodies.

### Common Misconception

`T extends string | number` means T is the whole union always.

### Interview Insight

Implement getProp with keyof.

### Production Insight

Constrain at the boundary; keep unconstrained when truly opaque.

---

## How to work this module (order)

1 extends · 2 keyof · 3 defaults · 4 broken · 5 C01

**Do not rush.** Depth beats speed. Types that never survive to runtime still shape design — prove both sides.

---

## When you are done

1. Update [`PROGRESS.md`](../PROGRESS.md) — mark `15-generic-constraints`
2. Complete `review.md` Day 1 prompts cold
3. Proceed to [`16-generic-patterns/README.md`](../16-generic-patterns/README.md)
