# 23 — Template Literal Types

**Difficulty baseline:** ★★★★☆  
**Prerequisites:** [`22-infer`](../22-infer/)  
**Core loop:** Predict → Type-check → Run → Break → Explain  
**Core question:** How do template literal types build string APIs at the type level?

---

## Learning outcomes

After this lab you can:

1. Compose string literal types with templates
2. Use Capitalize / Uppercase helpers
3. Model event names and routes from parts

---

# Lesson 1 — Templates

`experiments/01-template.ts` · [`predictions/P01-tpl.md`](./predictions/P01-tpl.md)

# Lesson 2 — Intrinsic string manipulators

`experiments/02-intrinsic.ts`

# Lesson 3 — Event names

`experiments/03-events.ts` · [`predictions/P02-on.md`](./predictions/P02-on.md)


---

## Deliberate bugs

| File | Task |
|---|---|
| `challenges/broken/01-open-string.ts` | Constrain route strings with templates |

---

## Challenges

| ID | File | Difficulty |
|---|---|---|
| C01 | [`challenges/C01-css-var.md`](./challenges/C01-css-var.md) | ★★★ |

---

## Developer Knowledge boxes

### Deep Fact

Template literals distribute over unions in interpolations.

### Why This Works

Stringly APIs gain autocomplete and typo checking.

### Common Misconception

Template types validate arbitrary runtime strings beyond patterns.

### Interview Insight

Type `onClick`/`onFocus` from event names.

### Production Insight

Great for routes, CSS vars, event prop names.

---

## How to work this module (order)

1 template · 2 intrinsic · 3 events · 4 broken · 5 C01

**Do not rush.** Depth beats speed. Types that never survive to runtime still shape design — prove both sides.

---

## When you are done

1. Update [`PROGRESS.md`](../PROGRESS.md) — mark `23-template-literal-types`
2. Complete `review.md` Day 1 prompts cold
3. Proceed to [`26-utility-types/README.md`](../26-utility-types/README.md) (ready path; `24`–`25` are scaffolds)
