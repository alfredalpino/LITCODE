# 12 — Arrays

**Difficulty baseline:** ★★★☆☆  
**Prerequisites:** [`11-classes`](../11-classes/)  
**Core loop:** Predict → Run → Break → Explain

---

## Learning outcomes

After this lab you can:

1. Distinguish dense vs sparse arrays
2. Choose mutating vs non-mutating methods deliberately
3. Use map / filter / reduce with accurate mental models
4. Predict length behavior with holes and deletes
5. Bridge array iteration to later iterator labs

---

# Lesson 1 — Arrays are objects with length

## Concise explanation

Arrays are exotic objects specializing in numeric index keys + `length`. They are not a separate primitive type (`typeof [] === "object"`).

## Experiment

`experiments/01-basics.js` + [`predictions/P01-basics.md`](./predictions/P01-basics.md)

---

# Lesson 2 — Sparse arrays & holes

## Concise explanation

Holes are missing properties — not slots filled with `undefined`. Many methods skip holes; some do not.

## Experiment

`experiments/02-sparse.js` + [`predictions/P02-sparse.md`](./predictions/P02-sparse.md)

---

# Lesson 3 — Mutators vs non-mutators

## Concise explanation

`push/pop/splice/sort` mutate. `map/filter/slice/concat/toSorted` (modern) return new arrays.

## Experiment

`experiments/03-mutate.js`

---

# Lesson 4 — map / filter / reduce

## Concise explanation

- `map` — transform each element  
- `filter` — keep elements  
- `reduce` — accumulate  

## Experiment

`experiments/04-mfr.js` + [`predictions/P03-mfr.md`](./predictions/P03-mfr.md)


---

## Deliberate bugs

| File | Task |
|---|---|
| `challenges/broken/01-broken-sum-sq.js` | Fix so sum of squares of evens for [1,2,3,4] is 20 |

---

## Challenges

| ID | File | Difficulty |
|---|---|---|
| C01 | [`challenges/C01-chunk.md`](./challenges/C01-chunk.md) | ★★★ |

---

## Developer Knowledge boxes

### Deep Fact
`length` is more than a count — assigning to it can create holes or truncate.

### Why This Works
Knowing mutators vs copies prevents accidental shared-state bugs.

### Common Misconception
“Holes are undefined elements.” — Missing properties ≠ present undefined.

### Interview Insight
Implement map/filter/reduce; discuss sparsity; complexity of methods.

### Production Insight
Prefer non-mutating updates in UI state; beware `sort` in place.


---

## How to work this module (order)

1. basics + P01  
2. sparse + mutate + P02  
3. mfr + P03  
4. Broken sum sq  
5. C01 + review

**Do not rush.** Depth beats speed.

---

## When you are done

1. Update [`PROGRESS.md`](../PROGRESS.md) — mark `12-arrays`
2. Complete `review.md` Day 1 prompts cold
3. Proceed to [`13-iterators/README.md`](../13-iterators/README.md)
