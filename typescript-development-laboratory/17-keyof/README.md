# 17 — keyof

**Difficulty baseline:** ★★★☆☆  
**Prerequisites:** [`16-generic-patterns`](../16-generic-patterns/)  
**Core loop:** Predict → Type-check → Run → Break → Explain  
**Core question:** How does `keyof` produce key unions for safe property access?

---

## Learning outcomes

After this lab you can:

1. Compute `keyof T` for object types
2. Combine with generics for safe getters/setters
3. Predict keyof for unions and index signatures

---

# Lesson 1 — Key unions

`experiments/01-keyof.ts` · [`predictions/P01-keys.md`](./predictions/P01-keys.md)

# Lesson 2 — Safe get/set

`experiments/02-safe-access.ts` · [`predictions/P02-set.md`](./predictions/P02-set.md)

# Lesson 3 — keyof pitfalls

`experiments/03-pitfalls.ts`


---

## Deliberate bugs

| File | Task |
|---|---|
| `challenges/broken/01-string-key.ts` | Stop using bare string keys |

---

## Challenges

| ID | File | Difficulty |
|---|---|---|
| C01 | [`challenges/C01-pick-keys.md`](./challenges/C01-pick-keys.md) | ★★★ |

---

## Developer Knowledge boxes

### Deep Fact

`keyof` of a union is the intersection of keys.

### Why This Works

Key unions enable typed dynamic access.

### Common Misconception

`keyof` returns a runtime array of keys.

### Interview Insight

Implement typed get/set.

### Production Insight

Prefer keyof over `string` for known object maps.

---

## How to work this module (order)

1 keyof · 2 safe access · 3 pitfalls · 4 broken · 5 C01

**Do not rush.** Depth beats speed. Types that never survive to runtime still shape design — prove both sides.

---

## When you are done

1. Update [`PROGRESS.md`](../PROGRESS.md) — mark `17-keyof`
2. Complete `review.md` Day 1 prompts cold
3. Proceed to [`18-typeof/README.md`](../18-typeof/README.md)
