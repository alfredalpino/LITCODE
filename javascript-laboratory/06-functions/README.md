# 06 — Functions

**Difficulty baseline:** ★★★☆☆  
**Prerequisites:** [`05-control-flow`](../05-control-flow/)  
**Core loop:** Predict → Run → Break → Explain

---

## Learning outcomes

After this lab you can:

1. Distinguish declarations, expressions, and arrow functions
2. Predict parameter defaults and rest/spread
3. Use functions as values (higher-order)
4. Trace simple recursion on the call stack
5. Know when arrows differ (preview of `this` — module 15)

---

# Lesson 1 — Functions are values

## Concise explanation

Functions are objects you can call. They can be stored, passed, and returned.

## Experiment

`experiments/01-fn-values.js` + [`predictions/P01-values.md`](./predictions/P01-values.md)

---

# Lesson 2 — Declaration vs expression vs arrow

## Concise explanation

- Function **declaration** — hoisted as callable  
- Function **expression** — created at evaluation time  
- **Arrow** — concise; lexical `this` (later); no `arguments` object

## Experiment

`experiments/02-forms.js`

---

# Lesson 3 — Parameters

## Concise explanation

Defaults apply when the argument is `undefined`. Rest gathers remaining args. Spread expands.

## Experiment

`experiments/03-params.js` + [`predictions/P02-params.md`](./predictions/P02-params.md)

---

# Lesson 4 — Higher-order functions

## Concise explanation

A function that takes/returns functions. Foundation for array methods and middleware.

## Experiment

`experiments/04-hof.js`

---

# Lesson 5 — Recursion teaser

## Concise explanation

A function calls itself with a smaller problem until a base case. Stack grows each call.

## Experiment

`experiments/05-recursion.js` + [`predictions/P03-recursion.md`](./predictions/P03-recursion.md)


---

## Deliberate bugs

| File | Task |
|---|---|
| `challenges/broken/01-broken-once.js` | Fix once(fn) so fn runs only on the first call |

---

## Challenges

| ID | File | Difficulty |
|---|---|---|
| C01 | [`challenges/C01-compose.md`](./challenges/C01-compose.md) | ★★★ |

---

## Developer Knowledge boxes

### Deep Fact
Functions are callable objects — they have properties (`length`, `name`).

### Why This Works
Treating functions as values unlocks composition and clean APIs.

### Common Misconception
“Arrow functions are just shorter functions.” — Also change `this`/`arguments`/`new` rules.

### Interview Insight
Implement once, memoize, or compose; explain recursion base cases.

### Production Insight
Prefer pure helpers at boundaries; name your functions for stack traces.


---

## How to work this module (order)

1. fn values + P01  
2. forms + params + P02  
3. HOF + recursion + P03  
4. Broken once  
5. C01 + review

**Do not rush.** Depth beats speed.

---

## When you are done

1. Update [`PROGRESS.md`](../PROGRESS.md) — mark `06-functions`
2. Complete `review.md` Day 1 prompts cold
3. Proceed to [`07-scope/README.md`](../07-scope/README.md)
