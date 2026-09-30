# 04 — Operators & Coercion

**Difficulty baseline:** ★★★☆☆ (peaks at ★★★★)  
**Prerequisites:** [`03-variables`](../03-variables/)  
**Core loop:** Predict → Run → Break → Explain

---

## Learning outcomes

After this lab you can:

1. Predict arithmetic and comparison results with mixed types
2. Apply ToBoolean / ToNumber / ToString mentally for common operators
3. Explain `+` string concat vs numeric addition
4. Use `??`, `||`, `&&` deliberately (nullish vs falsy)
5. Avoid accidental coercion bugs in conditionals and APIs

---

# Lesson 1 — Operators trigger abstract operations

## Concise explanation

Most surprising JS results come from **implicit conversion** before the operator runs (ToPrimitive, ToNumber, ToString, ToBoolean).

## Experiment

`experiments/01-plus-minus.js` + [`predictions/P01-plus.md`](./predictions/P01-plus.md)

---

# Lesson 2 — ToBoolean (truthiness)

## Concise explanation

Falsy values: `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, `NaN`. Everything else is truthy — including `"0"` and `[]`.

## Experiment

`experiments/02-truthiness.js`

---

# Lesson 3 — Comparisons and coercion

## Concise explanation

`<` / `>` may coerce via ToNumber (or ToPrimitive). `===` does not coerce. `==` does — prefer `===` unless you intentionally want nullish `== null`.

## Experiment

`experiments/03-compare.js` + [`predictions/P02-compare.md`](./predictions/P02-compare.md)

---

# Lesson 4 — `||` vs `??` vs `&&`

## Concise explanation

- `a || b` — uses truthiness (skips `0`, `""`)
- `a ?? b` — only substitutes for `null`/`undefined`
- `a && b` — short-circuit; returns first falsy or last value

## Experiment

`experiments/04-nullish.js` + [`predictions/P03-nullish.md`](./predictions/P03-nullish.md)

---

# Lesson 5 — Unary `+`, `!`, and `!!`

## Concise explanation

`+x` ≈ ToNumber. `!x` / `!!x` are boolean coercions.

## Experiment

`experiments/05-unary.js`


---

## Deliberate bugs

| File | Task |
|---|---|
| `challenges/broken/01-broken-defaults.js` | Fix defaults so volume 0 and title '' are kept; only null/undefined get defaults |

---

## Challenges

| ID | File | Difficulty |
|---|---|---|
| C01 | [`challenges/C01-coercion-map.md`](./challenges/C01-coercion-map.md) | ★★★★ |

---

## Developer Knowledge boxes

### Deep Fact

`==` is not “approximate equality” — it follows a defined coercion algorithm. Still usually the wrong tool.

### Why This Works

Naming the abstract operation turns “weird JS” into predictable mechanics.

### Common Misconception

“Empty array is falsy.” — `Boolean([])` is `true`.

### Interview Insight

Classic traps: `[] + {}`, `null == 0` vs `null >= 0`, `||` eating zeros.

### Production Insight

Prefer explicit `Number`, `String`, `Boolean`, or nullish coalescing at API boundaries.


---

## How to work this module (order)

1. plus/minus + P01  
2. truthiness + compare + P02  
3. nullish + unary + P03  
4. Broken defaults  
5. C01 + review

**Do not rush.** Depth beats speed.

---

## When you are done

1. Update [`PROGRESS.md`](../PROGRESS.md) — mark `04-operators`
2. Complete `review.md` Day 1 prompts cold
3. Proceed to [`05-control-flow/README.md`](../05-control-flow/README.md)
