# 22 — infer

**Difficulty baseline:** ★★★★☆  
**Prerequisites:** [`21-conditional-types`](../21-conditional-types/)  
**Core loop:** Predict → Type-check → Run → Break → Explain  
**Core question:** How does `infer` extract pieces of types inside conditionals?

---

## Learning outcomes

After this lab you can:

1. Use `infer` in conditional types
2. Rebuild ReturnType / Parameters sketches
3. Extract Promise payload with Awaited-style infer

---

# Lesson 1 — infer basics

`experiments/01-infer.ts` · [`predictions/P01-ret.md`](./predictions/P01-ret.md)

# Lesson 2 — Parameters

`experiments/02-parameters.ts`

# Lesson 3 — Promise payload

`experiments/03-awaited.ts` · [`predictions/P02-await.md`](./predictions/P02-await.md)


---

## Deliberate bugs

| File | Task |
|---|---|
| `challenges/broken/01-any-unpack.ts` | Unpack promise type with infer instead of any |

---

## Challenges

| ID | File | Difficulty |
|---|---|---|
| C01 | [`challenges/C01-head.md`](./challenges/C01-head.md) | ★★★★ |

---

## Developer Knowledge boxes

### Deep Fact

`infer` introduces a type variable in the true branch of a conditional.

### Why This Works

Unpack nested structures for libraries and utilities.

### Common Misconception

`infer` works outside conditional types.

### Interview Insight

Reimplement ReturnType.

### Production Insight

Prefer built-in Awaited/ReturnType unless teaching or specializing.

---

## How to work this module (order)

1 infer return · 2 params · 3 awaited · 4 broken · 5 C01

**Do not rush.** Depth beats speed. Types that never survive to runtime still shape design — prove both sides.

---

## When you are done

1. Update [`PROGRESS.md`](../PROGRESS.md) — mark `22-infer`
2. Complete `review.md` Day 1 prompts cold
3. Proceed to [`23-template-literal-types/README.md`](../23-template-literal-types/README.md)
