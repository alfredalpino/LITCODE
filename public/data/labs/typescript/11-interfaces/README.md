# 11 — Interfaces

**Difficulty baseline:** ★★☆☆☆  
**Prerequisites:** [`10-type-guards`](../10-type-guards/)  
**Core loop:** Predict → Type-check → Run → Break → Explain  
**Core question:** When do interfaces win over type aliases — and what does merging do?

---

## Learning outcomes

After this lab you can:

1. Declare interfaces with optional/readonly/method syntax
2. Extend interfaces
3. Explain declaration merging
4. Choose interface vs type alias intentionally

---

# Lesson 1 — Interface basics

`experiments/01-interface.ts` · [`predictions/P01-ext.md`](./predictions/P01-ext.md)

# Lesson 2 — Extends

`experiments/02-extends.ts`

# Lesson 3 — Merging

`experiments/03-merging.ts` · [`predictions/P02-merge.md`](./predictions/P02-merge.md)


---

## Deliberate bugs

| File | Task |
|---|---|
| `challenges/broken/01-bad-impl.ts` | Satisfy the interface without `any` |

---

## Challenges

| ID | File | Difficulty |
|---|---|---|
| C01 | [`challenges/C01-interface-vs-type.md`](./challenges/C01-interface-vs-type.md) | ★★ |

---

## Developer Knowledge boxes

### Deep Fact

Interfaces can merge; type aliases cannot.

### Why This Works

Stable object contracts for public APIs and class implements.

### Common Misconception

Interfaces exist at runtime.

### Interview Insight

When would declaration merging surprise you?

### Production Insight

Library ambient augmentation uses merging carefully.

---

## How to work this module (order)

1 basics · 2 extends · 3 merging · 4 broken · 5 C01

**Do not rush.** Depth beats speed. Types that never survive to runtime still shape design — prove both sides.

---

## When you are done

1. Update [`PROGRESS.md`](../PROGRESS.md) — mark `11-interfaces`
2. Complete `review.md` Day 1 prompts cold
3. Proceed to [`12-type-aliases/README.md`](../12-type-aliases/README.md)
