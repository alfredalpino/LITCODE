# 13 — Structural Typing

**Difficulty baseline:** ★★★☆☆  
**Prerequisites:** [`12-type-aliases`](../12-type-aliases/)  
**Core loop:** Predict → Type-check → Run → Break → Explain  
**Core question:** Why does TypeScript accept values that were never declared as implementing a type?

---

## Learning outcomes

After this lab you can:

1. Predict structural assignability
2. Contrast structural vs nominal typing
3. Use fresh literal checks vs structural openness
4. Sketch branding when nominal-ish IDs are needed

---

# Lesson 1 — Structure matches

`experiments/01-structural.ts` · [`predictions/P01-struct.md`](./predictions/P01-struct.md)

# Lesson 2 — Extra fields

`experiments/02-extra-fields.ts`

# Lesson 3 — Branding sketch

`experiments/03-branding.ts` · [`predictions/P02-brand.md`](./predictions/P02-brand.md)


---

## Deliberate bugs

| File | Task |
|---|---|
| `challenges/broken/01-wrong-id.ts` | Prevent mixing OrderId and UserId with branding |

---

## Challenges

| ID | File | Difficulty |
|---|---|---|
| C01 | [`challenges/C01-nominal.md`](./challenges/C01-nominal.md) | ★★★ |

---

## Developer Knowledge boxes

### Deep Fact

TS is structural; nominal IDs need brands or classes.

### Why This Works

Duck typing at compile time matches JS's runtime openness.

### Common Misconception

Declaring `implements` is required for assignability.

### Interview Insight

How would you stop OrderId/UserId mixups?

### Production Insight

Brand critical IDs at module boundaries.

---

## How to work this module (order)

1 structural · 2 extras · 3 branding · 4 broken · 5 C01

**Do not rush.** Depth beats speed. Types that never survive to runtime still shape design — prove both sides.

---

## When you are done

1. Update [`PROGRESS.md`](../PROGRESS.md) — mark `13-structural-typing`
2. Complete `review.md` Day 1 prompts cold
3. Proceed to [`14-generics/README.md`](../14-generics/README.md)
