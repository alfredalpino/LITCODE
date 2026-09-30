# 48 — Type-Safe API Design

**Difficulty baseline:** ★★★★☆  
**Prerequisites:** [`45-error-handling`](../45-error-handling/)  
**Core loop:** Predict → Type-check → Run → Break → Explain  
**Core question:** How do you design request → validate → domain → response without trusting types alone?

---

## Learning outcomes

After this lab you can:

1. Separate wire types from domain types
2. Type a handler that validates unknown input
3. Return typed success/error envelopes
4. Keep DTOs and domain models from leaking into each other

---

# Lesson 1 — Wire vs domain

`experiments/01-wire-domain.ts` · [`predictions/P01-wire.md`](./predictions/P01-wire.md)

# Lesson 2 — Validate unknown

`experiments/02-validate.ts` · [`predictions/P02-val.md`](./predictions/P02-val.md)

# Lesson 3 — Envelope responses

`experiments/03-envelope.ts`


---

## Deliberate bugs

| File | Task |
|---|---|
| `challenges/broken/01-trust-json.ts` | Stop casting JSON.parse directly to a domain type |

---

## Challenges

| ID | File | Difficulty |
|---|---|---|
| C01 | [`challenges/C01-handler.md`](./challenges/C01-handler.md) | ★★★★ |

---

## Developer Knowledge boxes

### Deep Fact

Types on DTOs do not validate JSON — parsers do.

### Why This Works

Clear boundaries prevent corrupt data from becoming trusted domain objects.

### Common Misconception

`as User` after JSON.parse is fine in production.

### Interview Insight

Design a typed HTTP handler end-to-end.

### Production Insight

One mapper at the edge; domain stays pure.

---

## How to work this module (order)

1 wire/domain · 2 validate · 3 envelope · 4 broken · 5 C01

**Do not rush.** Depth beats speed. Types that never survive to runtime still shape design — prove both sides.

---

## When you are done

1. Update [`PROGRESS.md`](../PROGRESS.md) — mark `48-api-design`
2. Complete `review.md` Day 1 prompts cold
3. Proceed to [`49-async-types/README.md`](../49-async-types/README.md)
