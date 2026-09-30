# P01 — MyReturn

**Difficulty:** ★★★  
**File:** `experiments/01-infer.ts`

## DO NOT RUN YET

```ts
type MyReturn<T> = T extends (...args: never[]) => infer R ? R : never;
```

### 1. Predicted output / type

```text

```

### 2. Reasoning (compile-time vs runtime)

What does `infer R` bind?

```text

```

### 3. Run / type-check

Studio Run, or: `npx tsx 22-infer/experiments/01-infer.ts`

### 4–7. Actual · discrepancy · deeper why · what-if

```text

```
