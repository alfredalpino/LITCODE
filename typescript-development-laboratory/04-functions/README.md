# 04 — Function Types

**Difficulty baseline:** ★★☆☆☆  
**Prerequisites:** [`03-type-inference`](../03-type-inference/)  
**Core loop:** Predict → Type-check → Run → Break → Explain  
**Core question:** How do you type parameters, returns, callbacks, and higher-order functions without lying?

---

## Learning outcomes

After this lab you can:

1. Annotate parameters and return types at API boundaries
2. Write callable type aliases vs inline function types
3. Type callbacks and higher-order functions
4. Explain optional / default / rest at the type level
5. Avoid `Function` and implicit `any` in APIs

---

# Lesson 1 — Parameter & return annotations

Annotate **boundaries**. Let inference handle obvious locals.

`experiments/01-params-returns.ts` · [`predictions/P01-callback.md`](./predictions/P01-callback.md)

# Lesson 2 — Function type positions

`(x: number) => string` is a type. Name it when reused.

`experiments/02-function-types.ts`

# Lesson 3 — Higher-order functions

Feel the need for generics before module 14 solves it cleanly.

`experiments/03-hof.ts` · [`predictions/P02-hof.md`](./predictions/P02-hof.md)

# Lesson 4 — Optional, default, rest

Optional ⇒ `T | undefined` in types. Defaults are runtime. Rest is a typed array.

`experiments/04-optional-rest.ts`


---

## Deliberate bugs

| File | Task |
|---|---|
| `challenges/broken/01-loose-callback.ts` | Replace `Function` so wrong arity becomes a type error |

---

## Challenges

| ID | File | Difficulty |
|---|---|---|
| C01 | [`challenges/C01-type-the-api.md`](./challenges/C01-type-the-api.md) | ★★★ |

---

## Developer Knowledge boxes

### Deep Fact

Prefer precise call signatures over `Function`.

### Why This Works

Typed callbacks catch integration bugs at the call site.

### Common Misconception

`Function` is the proper function type.

### Interview Insight

Explain contextual typing of `map` callbacks.

### Production Insight

Annotate public returns; infer internals.

---

## How to work this module (order)

1 Params · 2 aliases · 3 HOF · 4 optional/rest · 5 broken · 6 C01

**Do not rush.** Depth beats speed. Types that never survive to runtime still shape design — prove both sides.

---

## When you are done

1. Update [`PROGRESS.md`](../PROGRESS.md) — mark `04-functions`
2. Complete `review.md` Day 1 prompts cold
3. Proceed to [`05-objects/README.md`](../05-objects/README.md)
