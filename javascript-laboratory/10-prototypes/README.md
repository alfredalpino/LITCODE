# 10 — Prototypes

**Difficulty baseline:** ★★★★☆  
**Prerequisites:** [`09-objects`](../09-objects/)  
**Core loop:** Predict → Run → Break → Explain

---

## Learning outcomes

After this lab you can:

1. Explain [[Prototype]] delegation
2. Contrast `obj.__proto__` vs `Constructor.prototype`
3. Use Object.create and getPrototypeOf
4. Predict own vs inherited property lookup
5. See classes as syntax over the same model (bridge to 11)

---

# Lesson 1 — Delegation, not copying

## Concise explanation

If a property is missing on an object, the engine continues lookup on its prototype link.

## Experiment

`experiments/01-delegation.js` + [`predictions/P01-delegate.md`](./predictions/P01-delegate.md)

---

# Lesson 2 — `prototype` vs `[[Prototype]]`

## Concise explanation

- `Fn.prototype` — the object that will become `[[Prototype]]` of instances created with `new Fn`  
- `obj.[[Prototype]]` — the actual delegate link (`Object.getPrototypeOf(obj)`)

## Experiment

`experiments/02-constructor.js` + [`predictions/P02-ctor.md`](./predictions/P02-ctor.md)

---

# Lesson 3 — Object.create

## Concise explanation

Create an object with a chosen prototype (including `null` for a pure dictionary).

## Experiment

`experiments/03-create.js`

---

# Lesson 4 — Own vs inherited

## Experiment

`experiments/04-own-vs-inherited.js` + [`predictions/P03-own.md`](./predictions/P03-own.md)


---

## Deliberate bugs

| File | Task |
|---|---|
| `challenges/broken/01-broken-proto-link.js` | Fix so dog.speak() works via prototype delegation |

---

## Challenges

| ID | File | Difficulty |
|---|---|---|
| C01 | [`challenges/C01-diagram.md`](./challenges/C01-diagram.md) | ★★★★ |

---

## Developer Knowledge boxes

### Deep Fact
Almost all ordinary objects eventually delegate to `Object.prototype` unless you cut the chain.

### Why This Works
One lookup model explains methods, inheritance, and many “weird” missing-property cases.

### Common Misconception
“`__proto__` is the real property you should set.” — Prefer `getPrototypeOf` / `Object.create`.

### Interview Insight
Explain prototype chain for `new` + method sharing.

### Production Insight
Don’t mutate built-in prototypes in shared apps.


---

## How to work this module (order)

1. delegation + P01  
2. constructor + create + P02  
3. own vs inherited + P03  
4. Broken link  
5. C01 + review

**Do not rush.** Depth beats speed.

---

## When you are done

1. Update [`PROGRESS.md`](../PROGRESS.md) — mark `10-prototypes`
2. Complete `review.md` Day 1 prompts cold
3. Proceed to [`11-classes/README.md`](../11-classes/README.md)
