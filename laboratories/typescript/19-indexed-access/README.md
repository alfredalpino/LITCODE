# 19 — Indexed Access Types

**Difficulty baseline:** ★★★☆☆  
**Prerequisites:** [`18-typeof`](../18-typeof/)  
**Core loop:** Predict → Type-check → Run → Break → Explain  
**Core question:** How does `T[K]` extract property types — including from unions of keys?

---

## Learning outcomes

After this lab you can:

1. Use `T[K]` and `T[keyof T]`
2. Extract nested property types
3. Combine with generics for pluck-style APIs

---

# Lesson 1 — T[K]

`experiments/01-index.ts` · [`predictions/P01-idx.md`](./predictions/P01-idx.md)

# Lesson 2 — Unions of keys

`experiments/02-key-union.ts` · [`predictions/P02-union.md`](./predictions/P02-union.md)

# Lesson 3 — Nested

`experiments/03-nested.ts`


---

## Deliberate bugs

| File | Task |
|---|---|
| `challenges/broken/01-hardcoded.ts` | Derive the field type via indexed access |

---

## Challenges

| ID | File | Difficulty |
|---|---|---|
| C01 | [`challenges/C01-value-union.md`](./challenges/C01-value-union.md) | ★★ |

---

## Developer Knowledge boxes

### Deep Fact

Indexing with a key union distributes into a value union.

### Why This Works

Keep field types DRY with the source object type.

### Common Misconception

`T[K]` requires K to be a string literal only.

### Interview Insight

Extract a nested API response field type.

### Production Insight

Prefer indexed access over copy-pasted field types.

---

## How to work this module (order)

1 index · 2 key union · 3 nested · 4 broken · 5 C01

**Do not rush.** Depth beats speed. Types that never survive to runtime still shape design — prove both sides.

---

## When you are done

1. Update [`PROGRESS.md`](../PROGRESS.md) — mark `19-indexed-access`
2. Complete `review.md` Day 1 prompts cold
3. Proceed to [`20-mapped-types/README.md`](../20-mapped-types/README.md)
