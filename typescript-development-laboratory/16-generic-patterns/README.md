# 16 — Generic Patterns

**Difficulty baseline:** ★★★★☆  
**Prerequisites:** [`15-generic-constraints`](../15-generic-constraints/)  
**Core loop:** Predict → Type-check → Run → Break → Explain  
**Core question:** Which generic API patterns show up in real codebases — and when are they overkill?

---

## Learning outcomes

After this lab you can:

1. Implement Result / Option-style helpers
2. Type a simple event map
3. Build a typed factory / repository sketch
4. Judge when a pattern improves DX vs puzzles

---

# Lesson 1 — Result helpers

`experiments/01-result.ts` · [`predictions/P01-map.md`](./predictions/P01-map.md)

# Lesson 2 — Event map

`experiments/02-event-map.ts` · [`predictions/P02-emit.md`](./predictions/P02-emit.md)

# Lesson 3 — Repository sketch

`experiments/03-repo.ts`


---

## Deliberate bugs

| File | Task |
|---|---|
| `challenges/broken/01-loose-emit.ts` | Type emit so wrong payloads fail |

---

## Challenges

| ID | File | Difficulty |
|---|---|---|
| C01 | [`challenges/C01-option.md`](./challenges/C01-option.md) | ★★★ |

---

## Developer Knowledge boxes

### Deep Fact

Event maps couple string keys to payload types via keyof.

### Why This Works

Patterns encode invariants once for many call sites.

### Common Misconception

Every API should be fully generic.

### Interview Insight

Design a typed pub/sub for 3 events.

### Production Insight

Prefer boring concrete types until a second use appears.

---

## How to work this module (order)

1 Result · 2 EventMap · 3 Repo · 4 broken · 5 C01

**Do not rush.** Depth beats speed. Types that never survive to runtime still shape design — prove both sides.

---

## When you are done

1. Update [`PROGRESS.md`](../PROGRESS.md) — mark `16-generic-patterns`
2. Complete `review.md` Day 1 prompts cold
3. Proceed to [`17-keyof/README.md`](../17-keyof/README.md)
