# 05 — Objects, Arrays & Tuples

**Difficulty baseline:** ★★☆☆☆  
**Prerequisites:** [`04-functions`](../04-functions/)  
**Core loop:** Predict → Type-check → Run → Break → Explain  
**Core question:** How do object types, arrays, and tuples model shape — including optional and readonly?

---

## Learning outcomes

After this lab you can:

1. Write object types with optional and readonly fields
2. Explain excess property checks on fresh literals
3. Distinguish `T[]` from tuples `[A, B]`
4. Use readonly arrays intentionally
5. Model nested records without `any`

---

# Lesson 1 — Object types

`experiments/01-object-types.ts` · [`predictions/P01-excess.md`](./predictions/P01-excess.md)

# Lesson 2 — Excess property checks

Fresh literals get excess checks; pre-typed variables often do not.

`experiments/02-excess-properties.ts`

# Lesson 3 — Arrays

`experiments/03-arrays.ts`

# Lesson 4 — Tuples

`experiments/04-tuples.ts` · [`predictions/P02-tuple.md`](./predictions/P02-tuple.md)


---

## Deliberate bugs

| File | Task |
|---|---|
| `challenges/broken/01-mutable-config.ts` | Harden shared config with readonly so callers cannot mutate |

---

## Challenges

| ID | File | Difficulty |
|---|---|---|
| C01 | [`challenges/C01-model-response.md`](./challenges/C01-model-response.md) | ★★★ |

---

## Developer Knowledge boxes

### Deep Fact

Excess checks are freshness heuristics — extra runtime fields can still exist.

### Why This Works

Object/tuple models keep DTOs honest at compile time.

### Common Misconception

TS strips unknown properties at runtime.

### Interview Insight

Contrast tuple vs array; readonly params as capability limits.

### Production Insight

Readonly shared config by default.

---

## How to work this module (order)

1 objects · 2 excess · 3 arrays · 4 tuples · 5 broken · 6 C01

**Do not rush.** Depth beats speed. Types that never survive to runtime still shape design — prove both sides.

---

## When you are done

1. Update [`PROGRESS.md`](../PROGRESS.md) — mark `05-objects`
2. Complete `review.md` Day 1 prompts cold
3. Proceed to [`06-unions/README.md`](../06-unions/README.md)
