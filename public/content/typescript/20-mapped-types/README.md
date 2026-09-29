# 20 — Mapped Types

**Difficulty baseline:** ★★★★☆  
**Prerequisites:** [`19-indexed-access`](../19-indexed-access/)  
**Core loop:** Predict → Type-check → Run → Break → Explain  
**Core question:** How do mapped types transform every property of a type?

---

## Learning outcomes

After this lab you can:

1. Write `{ [K in keyof T]: ... }` maps
2. Apply readonly/optional modifiers via mapping
3. Use key remapping (`as`) at a basic level

---

# Lesson 1 — Basic maps

`experiments/01-mapped.ts` · [`predictions/P01-opt.md`](./predictions/P01-opt.md)

# Lesson 2 — Modifiers

`experiments/02-modifiers.ts`

# Lesson 3 — Remapping preview

`experiments/03-remap.ts` · [`predictions/P02-remap.md`](./predictions/P02-remap.md)


---

## Deliberate bugs

| File | Task |
|---|---|
| `challenges/broken/01-manual-partial.ts` | Replace hand-written optional fields with a mapped type |

---

## Challenges

| ID | File | Difficulty |
|---|---|---|
| C01 | [`challenges/C01-nullable.md`](./challenges/C01-nullable.md) | ★★★ |

---

## Developer Knowledge boxes

### Deep Fact

Mapped types are the engine behind Partial, Readonly, Pick helpers.

### Why This Works

Transform shapes systematically instead of rewriting fields.

### Common Misconception

Mapped types run at runtime over objects.

### Interview Insight

Implement Partial via mapping.

### Production Insight

Use maps for DTO ↔ domain field transforms.

---

## How to work this module (order)

1 mapped · 2 modifiers · 3 remap · 4 broken · 5 C01

**Do not rush.** Depth beats speed. Types that never survive to runtime still shape design — prove both sides.

---

## When you are done

1. Update [`PROGRESS.md`](../PROGRESS.md) — mark `20-mapped-types`
2. Complete `review.md` Day 1 prompts cold
3. Proceed to [`21-conditional-types/README.md`](../21-conditional-types/README.md)
