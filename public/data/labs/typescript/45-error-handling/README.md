# 45 — Error Handling Types

**Difficulty baseline:** ★★★☆☆  
**Prerequisites:** [`10-type-guards`](../10-type-guards/)  
**Core loop:** Predict → Type-check → Run → Break → Explain  
**Core question:** How do you type failures with `unknown` catches and Result models — without pretending types validate?

---

## Learning outcomes

After this lab you can:

1. Type `catch` clauses as `unknown`
2. Normalize errors to a domain type
3. Use Result for expected failures
4. Avoid `catch (e: any)`

---

# Lesson 1 — unknown catches

`experiments/01-unknown-catch.ts` · [`predictions/P01-catch.md`](./predictions/P01-catch.md)

# Lesson 2 — Normalize errors

`experiments/02-normalize.ts`

# Lesson 3 — Result for expected failure

`experiments/03-result-errors.ts` · [`predictions/P02-result.md`](./predictions/P02-result.md)


---

## Deliberate bugs

| File | Task |
|---|---|
| `challenges/broken/01-any-catch.ts` | Remove any from catch and narrow safely |

---

## Challenges

| ID | File | Difficulty |
|---|---|---|
| C01 | [`challenges/C01-try-map.md`](./challenges/C01-try-map.md) | ★★★ |

---

## Developer Knowledge boxes

### Deep Fact

Thrown values are `unknown` in modern TS — anything can be thrown.

### Why This Works

Honest failure typing prevents silent `any` propagation.

### Common Misconception

`catch (e: Error)` is always valid.

### Interview Insight

How do you type errors at API boundaries?

### Production Insight

Expected domain failures → Result; truly exceptional → throw.

---

## How to work this module (order)

1 unknown catch · 2 normalize · 3 Result · 4 broken · 5 C01

**Do not rush.** Depth beats speed. Types that never survive to runtime still shape design — prove both sides.

---

## When you are done

1. Update [`PROGRESS.md`](../PROGRESS.md) — mark `45-error-handling`
2. Complete `review.md` Day 1 prompts cold
3. Proceed to [`48-api-design/README.md`](../48-api-design/README.md) (ready path; `46`–`47` are scaffolds)
