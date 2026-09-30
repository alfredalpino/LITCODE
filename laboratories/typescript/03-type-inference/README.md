# 03 — Type Inference

**Difficulty:** ★★★☆☆  
**Prerequisites:** 02-basic-types  
**Core question:** When TypeScript fills in types for you — what does it choose, and why?

---

## Learning outcomes

1. Predict inference for `const` vs `let` vs arrays vs conditionals  
2. Explain **widening** and **literal** preservation  
3. Recognize **contextual typing** in callbacks  
4. Choose annotation vs inference deliberately (no dogma)  
5. See how control-flow narrowing interacts with inference  

---

## Core experiments

### 01 — const vs let

```bash
npx tsx 03-type-inference/experiments/01-const-vs-let.ts
```

Hover in the IDE (or mentally): types of `x`, `y`, `arr`.

→ [`predictions/P01-const-let.md`](./predictions/P01-const-let.md)

### 02 — conditional inference

→ `experiments/02-conditional-union.ts` + [`predictions/P02-conditional.md`](./predictions/P02-conditional.md)

### 03 — contextual typing

→ `experiments/03-contextual-typing.ts`

### 04 — annotation vs inference boundaries

→ `experiments/04-annotation-vs-inference.ts`  
Write your rule of thumb in notes; compare [`solutions/annotation-guidance.md`](./solutions/annotation-guidance.md)

### 05 — const assertion preview

→ `experiments/05-as-const-preview.ts`  
(Full `as const` module comes later; this is the inference hook.)

---

## Predict-the-type bank (start)

Also seed: [`../predict-the-type/P001-basic.md`](../predict-the-type/P001-basic.md)

---

## Challenges

### C01 — Will these infer? ★★★

[`challenges/C01-infer-quiz.md`](./challenges/C01-infer-quiz.md)

### C02 — Fix without annotation spam ★★★

[`challenges/broken/01-over-annotated.ts`](./challenges/broken/01-over-annotated.ts) — remove redundant annotations **without** losing safety at the export boundary.

### C03 — Fix without `as` ★★★

[`challenges/broken/02-needs-literal.md`](./challenges/broken/02-needs-literal.md)

---

## Annotation vs inference (non-dogmatic)

| Prefer inference | Prefer annotation |
|---|---|
| Local variables with obvious init | Public / exported API signatures |
| Implementation details | Catching bad object literals at assignment |
| When IDE shows clear types | When inference widens too much for your domain |

**Production Insight:** Exported functions are contracts. Locals are drafts.

---

## When done

1. Update `PROGRESS.md` + skill radar (inference)  
2. Add a `TYPE_SYSTEM_FACTS` experiment you personally verified  
3. Next planned module: `04-functions` (upcoming) — until then deepen banks in `predict-the-type/` and `will-it-compile/`
