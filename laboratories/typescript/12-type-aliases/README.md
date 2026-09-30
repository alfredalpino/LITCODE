# 12 — Type Aliases

**Difficulty baseline:** ★★☆☆☆  
**Prerequisites:** [`11-interfaces`](../11-interfaces/)  
**Core loop:** Predict → Type-check → Run → Break → Explain  
**Core question:** What can type aliases express that interfaces cannot?

---

## Learning outcomes

After this lab you can:

1. Alias unions, tuples, and function types
2. Build reusable domain aliases
3. Know when aliases are erased completely

---

# Lesson 1 — Beyond objects

`experiments/01-aliases.ts` · [`predictions/P01-alias.md`](./predictions/P01-alias.md)

# Lesson 2 — Domain modeling

`experiments/02-domain.ts`

# Lesson 3 — Recursive preview

`experiments/03-recursive-preview.ts` · [`predictions/P02-json.md`](./predictions/P02-json.md)


---

## Deliberate bugs

| File | Task |
|---|---|
| `challenges/broken/01-any-alias.ts` | Replace `any` domain alias with precise types |

---

## Challenges

| ID | File | Difficulty |
|---|---|---|
| C01 | [`challenges/C01-result-alias.md`](./challenges/C01-result-alias.md) | ★★★ |

---

## Developer Knowledge boxes

### Deep Fact

Aliases are erased; they never add runtime brands by themselves.

### Why This Works

Express unions and computed types interfaces cannot.

### Common Misconception

`type UserId = string` creates a nominal UserId.

### Interview Insight

Interface vs type — give a decision rule.

### Production Insight

Domain aliases document intent; branded types need extra patterns.

---

## How to work this module (order)

1 aliases · 2 domain · 3 recursive · 4 broken · 5 C01

**Do not rush.** Depth beats speed. Types that never survive to runtime still shape design — prove both sides.

---

## When you are done

1. Update [`PROGRESS.md`](../PROGRESS.md) — mark `12-type-aliases`
2. Complete `review.md` Day 1 prompts cold
3. Proceed to [`13-structural-typing/README.md`](../13-structural-typing/README.md)
