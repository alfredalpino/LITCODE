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
| 04-functions | | | | ready |
| 05-objects | | | | ready |
| 06-unions | | | | ready |
| 07-intersections | | | | ready |
| 08-literal-types | | | | ready |
| 09-type-narrowing | | | | ready |
| 10-type-guards | | | | ready |
| 11-interfaces | | | | ready |
| 12-type-aliases | | | | ready |
| 13-structural-typing | | | | ready |
| 14-generics | | | | ready |
| 15-generic-constraints | | | | ready |
| 16-generic-patterns | | | | ready |
| 17-keyof | | | | ready |
| 18-typeof | | | | ready |
| 19-indexed-access | | | | ready |
| 20-mapped-types | | | | ready |
| 21-conditional-types | | | | ready |
| 22-infer | | | | ready |
| 23-template-literal-types | | | | ready |
| 26-utility-types | | | | ready |
| 29-enums | | | | ready |
| 32-declaration-files | | | | ready |
| 45-error-handling | | | | ready |
| 48-api-design | | | | ready |
| 24–25, 27–28, 30–31, 33–34, 40–44, 46–47, 49–50, 61 (scaffolds) | | | | scaffold |
| 35–39, 51–60, 62–74 (planned — no folders yet) | | | | ○ |

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
