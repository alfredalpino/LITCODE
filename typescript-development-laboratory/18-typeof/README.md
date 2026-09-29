# 18 — typeof Types

**Difficulty baseline:** ★★★☆☆  
**Prerequisites:** [`17-keyof`](../17-keyof/)  
**Core loop:** Predict → Type-check → Run → Break → Explain  
**Core question:** How does `typeof` in type position capture value shapes?

---

## Learning outcomes

After this lab you can:

1. Use `typeof value` in type positions
2. Derive types from const configs
3. Contrast typeof operator (value) vs typeof type query

---

# Lesson 1 — Type queries

`experiments/01-typeof.ts` · [`predictions/P01-cfg.md`](./predictions/P01-cfg.md)

# Lesson 2 — Config derivation

`experiments/02-config.ts` · [`predictions/P02-keys.md`](./predictions/P02-keys.md)

# Lesson 3 — ReturnType preview

`experiments/03-return-type.ts`


---

## Deliberate bugs

| File | Task |
|---|---|
| `challenges/broken/01-duplicate-type.ts` | Derive the type from the value instead of duplicating |

---

## Challenges

| ID | File | Difficulty |
|---|---|---|
| C01 | [`challenges/C01-fn-typeof.md`](./challenges/C01-fn-typeof.md) | ★★ |

---

## Developer Knowledge boxes

### Deep Fact

Value-space `typeof` ≠ type-query `typeof` — same keyword, different spaces.

### Why This Works

Single source of truth: values drive types.

### Common Misconception

`typeof` always returns a string at compile time.

### Interview Insight

Derive a type from a const object.

### Production Insight

Config objects + typeof + keyof for typed settings.

---

## How to work this module (order)

1 typeof · 2 config · 3 ReturnType · 4 broken · 5 C01

**Do not rush.** Depth beats speed. Types that never survive to runtime still shape design — prove both sides.

---

## When you are done

1. Update [`PROGRESS.md`](../PROGRESS.md) — mark `18-typeof`
2. Complete `review.md` Day 1 prompts cold
3. Proceed to [`19-indexed-access/README.md`](../19-indexed-access/README.md)
