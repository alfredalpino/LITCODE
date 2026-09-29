# P02 — Distribution

**Difficulty:** ★★★★  
**File:** `experiments/02-distributive.ts`

## DO NOT RUN YET

```ts
type ToArray<T> = T extends unknown ? T[] : never;
type X = ToArray<string | number>;
```

### 1. Predicted output / type

```text

```

### 2. Reasoning (compile-time vs runtime)

Why is X a union of arrays?

```text

```

### 3. Run / type-check

Studio Run, or: `npx tsx 21-conditional-types/experiments/02-distributive.ts`

### 4–7. Actual · discrepancy · deeper why · what-if

```text

```
