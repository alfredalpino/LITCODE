# 03 — Variables & Bindings

**Difficulty baseline:** ★★☆☆☆ (peaks at ★★★★)  
**Prerequisites:** [`02-values-types`](../02-values-types/)  
**Core loop:** Predict → Run → Break → Explain

---

## Learning outcomes

After this lab you can:

1. Explain bindings vs values
2. Predict `var` vs `let` vs `const` behavior
3. Locate Temporal Dead Zone (TDZ) failures
4. Describe hoisting accurately (without myth)
5. Predict shadowing across nested scopes

---

# Lesson 1 — Bindings hold values

## Concise explanation

A binding is a name associated with a value in an environment. Reassignment changes which value the name refers to (when allowed). Mutation can change an object’s contents without rebinding.

## Experiment

`experiments/01-binding-vs-mutation.js`

```js
let x = { n: 1 };
const y = x;
x = { n: 2 }; // rebind x
// y still points at the first object
```

---

# Lesson 2 — `let`, `const`, `var`

## Concise explanation

| Keyword | Scope (typical) | Rebind? | Hoist behavior |
|---|---|---|---|
| `let` | block | yes | TDZ until init |
| `const` | block | no | TDZ until init |
| `var` | function / script | yes | initialized `undefined` |

`const` prevents **rebinding**, not object mutation.

## Experiments

`experiments/02-let-const-var.js` + [`predictions/P01-declarations.md`](./predictions/P01-declarations.md)  
`experiments/03-const-mutation.js`

---

# Lesson 3 — Temporal Dead Zone

## Concise explanation

From the start of the block until initialization, a `let`/`const` binding exists but cannot be accessed — ReferenceError.

## Experiment

`experiments/04-tdz.js` + [`predictions/P02-tdz.md`](./predictions/P02-tdz.md)

### Common Misconception

“Hoisting means the variable is `undefined` until assigned.” — True-ish for `var`; **false** for `let`/`const` (TDZ).

---

# Lesson 4 — Hoisting without mythology

## Concise explanation

Declarations are processed before evaluation of the body. `var` bindings are created and set to `undefined`. `let`/`const` are created but uninitialized (TDZ). Function declarations are instantiated differently from `let` fn expressions.

## Experiment

`experiments/05-hoisting.js`

---

# Lesson 5 — Shadowing

## Concise explanation

An inner binding with the same name shadows an outer one. Lookup walks the scope chain outward.

## Experiment

`experiments/06-shadowing.js` + [`predictions/P03-shadow.md`](./predictions/P03-shadow.md)


---

## Deliberate bugs

| File | Task |
|---|---|
| `challenges/broken/01-broken-counter.js` | Fix so each call to `makeCounter().inc()` increments an independent counter |

---

## Challenges

| ID | File | Difficulty |
|---|---|---|
| C01 | [`challenges/C01-tdz-story.md`](./challenges/C01-tdz-story.md) | ★★★ |

---

## Developer Knowledge boxes

### Deep Fact

`const` is about the binding, not deep immutability. Use `Object.freeze` (shallow) when you need frozen objects.

### Why This Works

Correct binding models make closures, modules, and React state updates comprehensible.

### Common Misconception

“`let` is not hoisted.” — The binding is created at the start of the block; access before init is TDZ.

### Interview Insight

Classic: explain TDZ; explain why `const` object properties can change.

### Production Insight

Prefer `const` by default; `let` when rebinding is required; avoid `var` in modern codebases unless maintaining legacy.


---

## How to work this module (order)

1. Binding vs mutation  
2. Declarations + P01 + const mutation  
3. TDZ + hoisting + P02  
4. Shadowing + P03  
5. Broken counter  
6. C01 + review

**Do not rush.** Depth beats speed.

---

## When you are done

1. Update [`PROGRESS.md`](../PROGRESS.md) — mark `03-variables`
2. Complete `review.md` Day 1 prompts cold
3. Proceed to [`04-operators/README.md`](../04-operators/README.md)
