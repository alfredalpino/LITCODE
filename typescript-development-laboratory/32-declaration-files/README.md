# 32 — Declaration Files

**Difficulty baseline:** ★★★★☆  
**Prerequisites:** [`12-type-aliases`](../12-type-aliases/)  
**Core loop:** Predict → Type-check → Run → Break → Explain  
**Core question:** How do `.d.ts` files describe JavaScript to the type checker?

---

## Learning outcomes

After this lab you can:

1. Read ambient module declarations
2. Write a minimal typing for an untyped helper
3. Explain `declare` vs implementation
4. Know DefinitelyTyped / `@types` workflow at a high level

---

# Lesson 1 — declare vs value

`experiments/01-declare-sketch.ts` · [`predictions/P01-declare.md`](./predictions/P01-declare.md)

# Lesson 2 — Typing an untyped function shape

`experiments/02-shim-types.ts` · [`predictions/P02-shim.md`](./predictions/P02-shim.md)

# Lesson 3 — Module shape notes

`experiments/03-module-shape.ts`


---

## Deliberate bugs

| File | Task |
|---|---|
| `challenges/broken/01-any-global.ts` | Replace any global with a precise declare shape (local simulation OK) |

---

## Challenges

| ID | File | Difficulty |
|---|---|---|
| C01 | [`challenges/C01-write-dts.md`](./challenges/C01-write-dts.md) | ★★★★ |

---

## Developer Knowledge boxes

### Deep Fact

`.d.ts` files are types-only; they must match real runtime or you lie to users.

### Why This Works

Untyped JS becomes usable under strict TypeScript.

### Common Misconception

Installing `@types/foo` implements foo.

### Interview Insight

How do you type a legacy global?

### Production Insight

Prefer shipping types with the package; DefinitelyTyped as fallback.

---

## How to work this module (order)

1 declare · 2 shim · 3 module shape · 4 broken · 5 C01

**Do not rush.** Depth beats speed. Types that never survive to runtime still shape design — prove both sides.

---

## When you are done

1. Update [`PROGRESS.md`](../PROGRESS.md) — mark `32-declaration-files`
2. Complete `review.md` Day 1 prompts cold
3. Proceed to [`45-error-handling/README.md`](../45-error-handling/README.md) (ready path; `33`–`44` scaffolds / later)
