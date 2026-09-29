# Progress Tracker

Honest tracking beats optimistic skimming.

---

## How to use

After each session:

1. Mark modules / experiments completed
2. Note weak areas (be specific)
3. Schedule spaced reviews (Day 1 / 3 / 7 / 14 / 30)
4. Record one interview-ready explanation in your own words

---

## Session log

### Session template

```text
Date:
Module(s):
Time spent:
Experiments completed:
Predictions correct / incorrect:
Weak areas:
One thing I can explain out loud now:
Next review dates: D+1 __  D+3 __  D+7 __  D+14 __  D+30 __
```

### Sessions

| # | Date | Modules | Notes | Review dates |
|---|---|---|---|---|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |

---

## Module checklist

| Module | Started | Completed | Confidence (1–5) | Notes |
|---|---|---|---|---|
| 00-typescript-runtime-boundary | | | | |
| 01-toolchain | | | | |
| 02-basic-types | | | | |
| 03-type-inference | | | | |
| 04-functions | | | | |
| 05-objects | | | | |
| 06-unions | | | | |
| 07-intersections | | | | |
| 08-literal-types | | | | |
| 09-type-narrowing | | | | |
| 10-type-guards | | | | |
| 11–74 (track as unlocked) | | | | |

---

## Skill radar (self-score 1–5)

| Skill | Score | Evidence |
|---|---|---|
| Compile-time vs runtime distinction | | |
| Reading compiler errors | | |
| Inference & widening | | |
| `any` / `unknown` / `never` judgment | | |
| Structural typing intuition | | |
| Generics (design, not just syntax) | | |
| Runtime validation at boundaries | | |
| API / domain modeling | | |
| Avoiding unjustified assertions | | |
| Interview explanation clarity | | |

---

## Weak area register

| Weak area | First noticed | Last practiced | Status |
|---|---|---|---|
| | | | |

---

## Spaced review queue

| Concept | D1 | D3 | D7 | D14 | D30 |
|---|---|---|---|---|---|
| Type erasure | | | | | |
| `unknown` vs `any` | | | | | |
| `const` vs `let` inference | | | | | |
| | | | | | |

Reviews must use: predict · type-check · debug · derive · explain — **not** rereading alone.

---

## Assertion / escape hatch log

Every time you use `as`, `!`, or `any`, log it:

| Date | Escape | Why TypeScript didn't know | Better alternative tried? |
|---|---|---|---|
| | | | |

Goal: make unjustified escapes rare and intentional.
