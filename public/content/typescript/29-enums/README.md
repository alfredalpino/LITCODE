# 29 — Enums & const alternatives

**Difficulty baseline:** ★★★☆☆  
**Prerequisites:** [`08-literal-types`](../08-literal-types/)  
**Core loop:** Predict → Type-check → Run → Break → Explain  
**Core question:** When do enums help — and when is `as const` + union safer?

---

## Learning outcomes

After this lab you can:

1. Use string and numeric enums
2. Predict runtime emit for enums
3. Prefer `as const` objects for many modern APIs
4. Explain const enum trade-offs

---

# Lesson 1 — String enums

`experiments/01-string-enum.ts` · [`predictions/P01-enum.md`](./predictions/P01-enum.md)

# Lesson 2 — Numeric enums & reverse mapping

`experiments/02-numeric-enum.ts`

# Lesson 3 — as const alternative

`experiments/03-as-const-alt.ts` · [`predictions/P02-alt.md`](./predictions/P02-alt.md)


---

## Deliberate bugs

| File | Task |
|---|---|
| `challenges/broken/01-open-status.ts` | Replace open string with enum or const union |

---

## Challenges

| ID | File | Difficulty |
|---|---|---|
| C01 | [`challenges/C01-enum-vs-const.md`](./challenges/C01-enum-vs-const.md) | ★★★ |

---

## Developer Knowledge boxes

### Deep Fact

Enums are one of the few type-system features that emit runtime values (unless const enum).

### Why This Works

Named finite sets — but unions often suffice.

### Common Misconception

Enums are erased like interfaces.

### Interview Insight

Enum vs union literal trade-offs.

### Production Insight

Default to `as const` + union unless enum interop is required.

---

## How to work this module (order)

1 string enum · 2 numeric · 3 as const · 4 broken · 5 C01

**Do not rush.** Depth beats speed. Types that never survive to runtime still shape design — prove both sides.

---

## When you are done

1. Update [`PROGRESS.md`](../PROGRESS.md) — mark `29-enums`
2. Complete `review.md` Day 1 prompts cold
3. Proceed to [`32-declaration-files/README.md`](../32-declaration-files/README.md) (ready path; `30`–`31` are scaffolds)
