# 11 — Classes

**Difficulty baseline:** ★★★☆☆ (peaks at ★★★★)  
**Prerequisites:** [`10-prototypes`](../10-prototypes/)  
**Core loop:** Predict → Run → Break → Explain

---

## Learning outcomes

After this lab you can:

1. Treat `class` as syntax over prototypes
2. Use constructor, methods, extends, super
3. Predict prototype relationships for subclasses
4. Know private fields exist (`#`) at a practical level
5. Avoid class mythology that hides the prototype model

---

# Lesson 1 — Class syntax, same engine model

## Concise explanation

`class Foo {}` creates a constructor function and puts methods on `Foo.prototype` (mostly).

## Experiment

`experiments/01-class-basics.js` + [`predictions/P01-class.md`](./predictions/P01-class.md)

---

# Lesson 2 — extends & super

## Concise explanation

`extends` wires the prototype chain. `super` in constructors calls the parent constructor; in methods it refers to the parent prototype’s method.

## Experiment

`experiments/02-extends.js` + [`predictions/P02-extends.md`](./predictions/P02-extends.md)

---

# Lesson 3 — Instance vs static

## Concise explanation

Instance methods live on the prototype. `static` methods hang on the constructor itself.

## Experiment

`experiments/03-static.js`

---

# Lesson 4 — Private fields teaser

## Concise explanation

`#field` is truly private to the class (not just underscore convention).

## Experiment

`experiments/04-private.js` + [`predictions/P03-private.md`](./predictions/P03-private.md)


---

## Deliberate bugs

| File | Task |
|---|---|
| `challenges/broken/01-broken-super.js` | Fix subclass constructor to call super before using this |

---

## Challenges

| ID | File | Difficulty |
|---|---|---|
| C01 | [`challenges/C01-desugar.md`](./challenges/C01-desugar.md) | ★★★★ |

---

## Developer Knowledge boxes

### Deep Fact
`typeof Class` is `"function"`. Classes are not a separate runtime type.

### Why This Works
Keeping the prototype model prevents cargo-cult OOP.

### Common Misconception
“Classes create a new inheritance system different from prototypes.” — Syntax over the same system.

### Interview Insight
super ordering; static vs prototype methods; private fields.

### Production Insight
Prefer composition when inheritance hierarchies get deep.


---

## How to work this module (order)

1. basics + P01  
2. extends + static + P02  
3. private + P03  
4. Broken super  
5. C01 + review

**Do not rush.** Depth beats speed.

---

## When you are done

1. Update [`PROGRESS.md`](../PROGRESS.md) — mark `11-classes`
2. Complete `review.md` Day 1 prompts cold
3. Proceed to [`12-arrays/README.md`](../12-arrays/README.md)
