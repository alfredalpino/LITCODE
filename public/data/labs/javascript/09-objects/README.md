# 09 — Objects

**Difficulty baseline:** ★★★☆☆  
**Prerequisites:** [`08-closures`](../08-closures/)  
**Core loop:** Predict → Run → Break → Explain

---

## Learning outcomes

After this lab you can:

1. Create and mutate object properties confidently
2. Use shorthand, computed keys, and methods
3. Read property descriptors at a basic level
4. Distinguish own vs inherited properties (bridge to prototypes)
5. Use Object.assign / spread as shallow copies

---

# Lesson 1 — Objects are property bags with identity

## Concise explanation

An ordinary object maps property keys (string/symbol) to values. Equality is by reference.

## Experiment

`experiments/01-literals.js` + [`predictions/P01-props.md`](./predictions/P01-props.md)

---

# Lesson 2 — Access, mutation, deletion

## Concise explanation

Dot vs bracket access. `delete` removes own properties. Missing properties yield `undefined` (not ReferenceError).

## Experiment

`experiments/02-access.js`

---

# Lesson 3 — Descriptors (intro)

## Concise explanation

Properties have attributes: writable, enumerable, configurable (data properties). Getters/setters are accessor properties.

## Experiment

`experiments/03-descriptors.js` + [`predictions/P02-desc.md`](./predictions/P02-desc.md)

---

# Lesson 4 — Shallow copy traps

## Concise explanation

`{...obj}` and `Object.assign` copy **enumerable own** properties one level deep — nested objects stay shared.

## Experiment

`experiments/04-shallow.js` + [`predictions/P03-shallow.md`](./predictions/P03-shallow.md)


---

## Deliberate bugs

| File | Task |
|---|---|
| `challenges/broken/01-broken-merge.js` | Fix merge so nested settings are not shared with the defaults object |

---

## Challenges

| ID | File | Difficulty |
|---|---|---|
| C01 | [`challenges/C01-pick.md`](./challenges/C01-pick.md) | ★★★ |

---

## Developer Knowledge boxes

### Deep Fact
`Object.keys` skips non-enumerable and symbol keys.

### Why This Works
Property attributes explain frozen APIs, libraries, and enumeration surprises.

### Common Misconception
“Spread deep-clones.” — It does not.

### Interview Insight
Shallow vs deep copy; hasOwnProperty vs `in`.

### Production Insight
Prefer immutable update patterns at state boundaries; freeze config objects when helpful.


---

## How to work this module (order)

1. literals + access + P01  
2. descriptors + P02  
3. shallow + P03  
4. Broken merge  
5. C01 + review

**Do not rush.** Depth beats speed.

---

## When you are done

1. Update [`PROGRESS.md`](../PROGRESS.md) — mark `09-objects`
2. Complete `review.md` Day 1 prompts cold
3. Proceed to [`10-prototypes/README.md`](../10-prototypes/README.md)
