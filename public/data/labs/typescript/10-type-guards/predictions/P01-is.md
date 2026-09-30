# P01 — Predicate narrowing

**Difficulty:** ★★  
**File:** `experiments/01-predicate.ts`

## DO NOT RUN YET

```ts
function isCat(a: Cat | Dog): a is Cat { return "meow" in a; }
```

### 1. Predicted output / type

```text

```

### 2. Reasoning (compile-time vs runtime)

What does `a is Cat` change for the checker after a true result?

```text

```

### 3. Run / type-check

Studio Run, or: `npx tsx 10-type-guards/experiments/01-predicate.ts`

### 4–7. Actual · discrepancy · deeper why · what-if

```text

```
