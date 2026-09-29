# 08 — Closures

**Difficulty baseline:** ★★★★☆  
**Prerequisites:** [`07-scope`](../07-scope/)  
**Core loop:** Predict → Run → Break → Explain

---

## Learning outcomes

After this lab you can:

1. Define a closure in environment terms
2. Predict loop + closure interactions (`var` vs `let`)
3. Build private state with closures
4. Spot accidental retention / stale capture bugs
5. Explain why returned functions still see outer bindings

---

# Lesson 1 — Closure = function + lexical environment

## Concise explanation

A closure is a function that retains access to bindings from its outer lexical environment after that outer function has returned.

## Experiment

`experiments/01-basic-closure.js` + [`predictions/P01-basic.md`](./predictions/P01-basic.md)

---

# Lesson 2 — The classic loop trap

## Concise explanation

`var` in a `for` loop shares one binding. `let` creates a new binding per iteration.

## Experiment

`experiments/02-loop-closures.js` + [`predictions/P02-loop.md`](./predictions/P02-loop.md)

---

# Lesson 3 — Private state

## Concise explanation

Outer locals not returned are still reachable by inner functions — encapsulation without classes.

## Experiment

`experiments/03-private.js`

---

# Lesson 4 — Stale captures & async teaser

## Concise explanation

Closures capture bindings (not snapshots of primitive values at creation — they see current binding values when they run).

## Experiment

`experiments/04-live-binding.js` + [`predictions/P03-live.md`](./predictions/P03-live.md)


---

## Deliberate bugs

| File | Task |
|---|---|
| `challenges/broken/01-broken-buttons.js` | Fix so handlers report 0,1,2 not 3,3,3 (simulate with var loop) |

---

## Challenges

| ID | File | Difficulty |
|---|---|---|
| C01 | [`challenges/C01-explain-closure.md`](./challenges/C01-explain-closure.md) | ★★★★ |

---

## Developer Knowledge boxes

### Deep Fact
Closures capture **bindings**, not frozen copies of primitive values.

### Why This Works
Environment retention explains both power (privacy) and bugs (stale loops, leaks).

### Common Misconception
“Closures copy variables when created.” — They close over the binding.

### Interview Insight
Loop + setTimeout classic; private state via closure.

### Production Insight
Long-lived closures can retain large objects — beware accidental captures in listeners.


---

## How to work this module (order)

1. basic + P01  
2. loop + P02  
3. private + live + P03  
4. Broken buttons  
5. C01 + review

**Do not rush.** Depth beats speed.

---

## When you are done

1. Update [`PROGRESS.md`](../PROGRESS.md) — mark `08-closures`
2. Complete `review.md` Day 1 prompts cold
3. Proceed to [`09-objects/README.md`](../09-objects/README.md)
