# 26 — Utility Types

**Difficulty baseline:** ★★★☆☆  
**Prerequisites:** [`23-template-literal-types`](../23-template-literal-types/)  
**Core loop:** Predict → Type-check → Run → Break → Explain  
**Core question:** Can you reimplement and correctly choose Partial, Pick, Omit, Record, Readonly?

---

## Learning outcomes

After this lab you can:

1. Use Partial / Required / Readonly / Pick / Omit / Record / Exclude / Extract
2. Reimplement 2–3 utilities via mapped/conditional types
3. Choose utilities over hand-rolled duplicates

---

# Lesson 1 — Everyday utilities

`experiments/01-everyday.ts` · [`predictions/P01-pick.md`](./predictions/P01-pick.md)

# Lesson 2 — Reimplement Partial & Pick

`experiments/02-reimplement.ts` · [`predictions/P02-partial.md`](./predictions/P02-partial.md)

# Lesson 3 — Exclude / Extract

`experiments/03-exclude-extract.ts`


---

## Deliberate bugs

| File | Task |
|---|---|
| `challenges/broken/01-wrong-omit.ts` | Use Omit correctly so password is removed from the public type |

---

## Challenges

| ID | File | Difficulty |
|---|---|---|
| C01 | [`challenges/C01-my-readonly.md`](./challenges/C01-my-readonly.md) | ★★★ |

---

## Developer Knowledge boxes

### Deep Fact

Most utilities are thin wrappers over mapped/conditional types.

### Why This Works

Shared vocabulary across codebases and docs.

### Common Misconception

Omit removes the field at runtime automatically.

### Interview Insight

Implement Pick and Omit.

### Production Insight

Prefer utilities; document when you need custom maps.

---

## How to work this module (order)

1 everyday · 2 reimplement · 3 exclude/extract · 4 broken · 5 C01

**Do not rush.** Depth beats speed. Types that never survive to runtime still shape design — prove both sides.

---

## When you are done

1. Update [`PROGRESS.md`](../PROGRESS.md) — mark `26-utility-types`
2. Complete `review.md` Day 1 prompts cold
3. Proceed to [`29-enums/README.md`](../29-enums/README.md)
