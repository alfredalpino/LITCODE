# 05 — Control Flow

**Difficulty baseline:** ★★☆☆☆ (peaks at ★★★)  
**Prerequisites:** [`04-operators`](../04-operators/)  
**Core loop:** Predict → Run → Break → Explain

---

## Learning outcomes

After this lab you can:

1. Predict if/else and switch (including fall-through)
2. Choose for / while / for...of intentionally
3. Use break/continue correctly
4. Explain truthiness-driven branches
5. Avoid off-by-one and accidental fall-through bugs

---

# Lesson 1 — Branches follow completion of a test

## Concise explanation

`if (test)` converts `test` with ToBoolean. Empty objects and arrays are truthy.

## Experiment

`experiments/01-if-truthiness.js` + [`predictions/P01-if.md`](./predictions/P01-if.md)

---

# Lesson 2 — Loops

## Concise explanation

- `for` — index control  
- `while` / `do...while` — condition-driven  
- `for...of` — iterate iterable values  
- `for...in` — enumerate keys (often the wrong tool for arrays)

## Experiments

`experiments/02-loops.js`  
`experiments/03-for-of-in.js` + [`predictions/P02-loops.md`](./predictions/P02-loops.md)

---

# Lesson 3 — switch fall-through

## Concise explanation

`switch` uses strict equality. Cases fall through until `break`/`return`.

## Experiment

`experiments/04-switch.js` + [`predictions/P03-switch.md`](./predictions/P03-switch.md)

---

# Lesson 4 — break, continue, labels (rare)

## Concise explanation

`break` exits the loop/switch. `continue` skips to next iteration. Labels exist; use sparingly.

## Experiment

`experiments/05-break-continue.js`


---

## Deliberate bugs

| File | Task |
|---|---|
| `challenges/broken/01-broken-sum-evens.js` | Fix so sumEvens([1,2,3,4]) returns 6 |

---

## Challenges

| ID | File | Difficulty |
|---|---|---|
| C01 | [`challenges/C01-fizzbuzz-control.md`](./challenges/C01-fizzbuzz-control.md) | ★★ |

---

## Developer Knowledge boxes

### Deep Fact

`switch` cases use `===` — string `"1"` does not match number `1`.

### Why This Works

Control flow bugs are usually boolean-coercion or off-by-one — both experimental.

### Common Misconception

“`for...in` is for arrays.” — Prefer `for...of` or indexed `for`.

### Interview Insight

Fall-through and off-by-one remain common whiteboard failures.

### Production Insight

Prefer early returns over deep nesting; keep switch exhaustive or default-log.


---

## How to work this module (order)

1. if + P01  
2. loops + for-of/in + P02  
3. switch + break + P03  
4. Broken sum  
5. C01 + review

**Do not rush.** Depth beats speed.

---

## When you are done

1. Update [`PROGRESS.md`](../PROGRESS.md) — mark `05-control-flow`
2. Complete `review.md` Day 1 prompts cold
3. Proceed to [`06-functions/README.md`](../06-functions/README.md)
