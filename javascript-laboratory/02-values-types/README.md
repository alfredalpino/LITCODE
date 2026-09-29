# 02 — Values & Types

**Difficulty baseline:** ★★☆☆☆ (peaks at ★★★)  
**Prerequisites:** [`01-runtime`](../01-runtime/)  
**Core loop:** Predict → Run → Break → Explain

---

## Learning outcomes

After this lab you can:

1. List JavaScript’s primitive types and distinguish them from objects
2. Predict `typeof` results — including the notorious `typeof null`
3. Explain value equality (`===`) vs SameValueZero / `Object.is`
4. Reason about identity for objects vs copy-by-value for primitives
5. Spot where coercion begins (preview for operators lab)

---

# Lesson 1 — Values, not “types of variables”

## Concise explanation

JavaScript values have types. Bindings hold values. Talking about “the type of a variable” is sloppy — the binding can be reassigned a different value later (`let`).

## Mechanism

Every value is either a **primitive** or an **object** (including arrays, functions, dates, …).

| Primitive | Example |
|---|---|
| Undefined | `undefined` |
| Null | `null` |
| Boolean | `true` / `false` |
| Number | `42`, `NaN`, `Infinity` |
| BigInt | `10n` |
| String | `"hi"` |
| Symbol | `Symbol("x")` |

Everything else is an object.

## Experiment

`experiments/01-typeof-primitives.js` + [`predictions/P01-typeof.md`](./predictions/P01-typeof.md)

---

# Lesson 2 — `typeof null` is a historical bug

## Concise explanation

`typeof null === "object"`. That is wrong conceptually and preserved for compatibility.

## Experiment

`experiments/02-typeof-null.js`

### Common Misconception

“`null` is an object.” — No. `null` is a primitive. `typeof` lies.

### Historical Context

Early engines tagged values; the null tag collided with the object tag. Fixing it would break the web.

---

# Lesson 3 — Equality: `===`, `Object.is`, and identity

## Concise explanation

- `===` — Strict Equality Comparison (no coercion; `NaN !== NaN`; `+0 === -0`)
- `Object.is` — SameValue (distinguishes `+0`/`-0`; `Object.is(NaN, NaN)` is true)
- Objects compare by **reference** (identity), not deep structure

## Experiments

| File | Focus |
|---|---|
| `experiments/03-equality.js` | `===` vs `Object.is` |
| `experiments/04-identity.js` | Two `{}` are not the same object |

→ [`predictions/P02-equality.md`](./predictions/P02-equality.md)

### Specification Insight

ECMAScript defines several equality algorithms (IsStrictlyEqual, SameValue, SameValueZero used by `Map`/`Set`). Memorizing slogans is weaker than knowing which algorithm an API uses.

---

# Lesson 4 — Primitives are not mutable; wrappers exist

## Concise explanation

You cannot mutate a string’s characters in place. Methods return new strings. Temporary Number/String/Boolean **wrapper objects** exist for method dispatch — then usually disappear.

## Experiment

`experiments/05-immutable-primitives.js`

### Weird JavaScript

```js
const s = "hi";
s.foo = 1; // silent fail in non-strict assignment to primitive property; strict throws in some paths
```

Prefer thinking: primitives have no own mutable fields.

---

# Lesson 5 — Coercion teaser

## Concise explanation

Operators and APIs often convert values (ToNumber, ToString, ToBoolean). Full coercion lab is `04-operators`. Here you only observe that `"5" - 2` becomes numeric.

## Experiment

`experiments/06-coercion-teaser.js` + [`predictions/P03-coercion-teaser.md`](./predictions/P03-coercion-teaser.md)


---

## Deliberate bugs

| File | Task |
|---|---|
| `challenges/broken/01-broken-type-check.js` | Fix so `isNullish` returns true only for `null` and `undefined` |

---

## Challenges

| ID | File | Difficulty |
|---|---|---|
| C01 | [`challenges/C01-classify-values.md`](./challenges/C01-classify-values.md) | ★★★ |

---

## Developer Knowledge boxes

### Deep Fact

`typeof` is a unary operator with special-case behavior — not a perfect type oracle.

### Why This Works

Separating “what value is this?” from “how does this API compare values?” prevents Map/Set/React-key class bugs later.

### Common Misconception

“`==` is always wrong / `===` always right.” Prefer `===` by default; know the algorithms when you reach for `==` or `Object.is`.

### Interview Insight

Expect: explain `typeof null`, `NaN` equality, and reference vs value.

### Production Insight

APIs that use SameValueZero (`Set`, `Map` keys) treat `NaN` as equal to itself — unlike `===`.


---

## How to work this module (order)

1. typeof experiments + P01  
2. null + equality + identity + P02  
3. immutability + coercion teaser + P03  
4. Broken challenge  
5. C01  
6. `review.md` Day 1

**Do not rush.** Depth beats speed.

---

## When you are done

1. Update [`PROGRESS.md`](../PROGRESS.md) — mark `02-values-types`
2. Complete `review.md` Day 1 prompts cold
3. Proceed to [`03-variables/README.md`](../03-variables/README.md)
