# 14 — Generics

**Difficulty baseline:** ★★★☆☆  
**Prerequisites:** [`13-structural-typing`](../13-structural-typing/)  
**Core loop:** Predict → Type-check → Run → Break → Explain  
**Core question:** How do type parameters let APIs stay precise without hard-coding types?

---

## Learning outcomes

After this lab you can:

1. Write generic functions and infer type arguments
2. Use multiple type parameters
3. Read generic errors
4. Avoid unnecessary generics (YAGNI at type level)

---

# Lesson 1 — First type parameter

`experiments/01-identity.ts` · [`predictions/P01-infer.md`](./predictions/P01-infer.md)

# Lesson 2 — Generic collections

`experiments/02-box.ts`

# Lesson 3 — Inference vs explicit

`experiments/03-inference.ts` · [`predictions/P02-explicit.md`](./predictions/P02-explicit.md)


---

## Deliberate bugs

| File | Task |
|---|---|
| `challenges/broken/01-any-generic.ts` | Replace any with a real type parameter |

---

## Challenges

| ID | File | Difficulty |
|---|---|---|
| C01 | [`challenges/C01-pluck.md`](./challenges/C01-pluck.md) | ★★★ |

---

## Developer Knowledge boxes

### Deep Fact

Generics preserve relationships between inputs and outputs.

### Why This Works

One implementation, many types — without `any`.

### Common Misconception

More type parameters always means better API.

### Interview Insight

Implement identity and explain inference.

### Production Insight

Generic only when callers need preserved relationships.

---

## How to work this module (order)

1 identity · 2 box · 3 inference · 4 broken · 5 C01

**Do not rush.** Depth beats speed. Types that never survive to runtime still shape design — prove both sides.

---

## When you are done

1. Update [`PROGRESS.md`](../PROGRESS.md) — mark `14-generics`
2. Complete `review.md` Day 1 prompts cold
3. Proceed to [`15-generic-constraints/README.md`](../15-generic-constraints/README.md)
