# 07 — Scope & Lexical Environments

**Difficulty baseline:** ★★★☆☆ (peaks at ★★★★)  
**Prerequisites:** [`06-functions`](../06-functions/)  
**Core loop:** Predict → Run → Break → Explain

---

## Learning outcomes

After this lab you can:

1. Explain lexical scope vs dynamic scope (JS is lexical)
2. Walk a scope chain for free variables
3. Contrast block scope and function scope
4. Predict nested lookup and shadowing outcomes
5. Connect environments to what closures capture (bridge to 08)

---

# Lesson 1 — Lexical scope

## Concise explanation

Where you **write** a function determines which bindings it can see — not where you **call** it.

## Experiment

`experiments/01-lexical.js` + [`predictions/P01-lexical.md`](./predictions/P01-lexical.md)

---

# Lesson 2 — Scope chain

## Concise explanation

Free variable lookup walks outer environment records until found or ReferenceError.

## Experiment

`experiments/02-chain.js`

---

# Lesson 3 — Block vs function scope

## Concise explanation

`let`/`const` are block-scoped. `var` is function-scoped (or script-scoped at top level).

## Experiment

`experiments/03-block-fn.js` + [`predictions/P02-block.md`](./predictions/P02-block.md)

---

# Lesson 4 — Nested functions see outer bindings

## Concise explanation

Inner functions close over the lexical environment where they were defined (formalized next module).

## Experiment

`experiments/04-nested.js` + [`predictions/P03-nested.md`](./predictions/P03-nested.md)


---

## Deliberate bugs

| File | Task |
|---|---|
| `challenges/broken/01-broken-lookup.js` | Fix so printCount always reads the module-level count (not a shadowed local) |

---

## Challenges

| ID | File | Difficulty |
|---|---|---|
| C01 | [`challenges/C01-draw-chain.md`](./challenges/C01-draw-chain.md) | ★★★ |

---

## Developer Knowledge boxes

### Deep Fact
JavaScript uses **lexical** environments. Call-site does not redefine free variables.

### Specification Insight
ECMAScript Environment Records hold bindings; outer pointers form the chain.

### Common Misconception
“Scope is determined by where the function is called.” — That’s dynamic scope; JS is not that.

### Interview Insight
Explain lexical scope with a nested function example on a whiteboard.

### Production Insight
Shadowing bugs are silent logic errors — name carefully at boundaries.


---

## How to work this module (order)

1. lexical + P01  
2. chain + block + P02  
3. nested + P03  
4. Broken lookup  
5. C01 + review

**Do not rush.** Depth beats speed.

---

## When you are done

1. Update [`PROGRESS.md`](../PROGRESS.md) — mark `07-scope`
2. Complete `review.md` Day 1 prompts cold
3. Proceed to [`08-closures/README.md`](../08-closures/README.md)
