# P02 — After null check

**Difficulty:** ★★  
**File:** `experiments/03-pitfalls.ts`

## DO NOT RUN YET

```ts
function maybe(x: string | null) {
  if (x === null) return;
  console.log(x.toUpperCase());
}
```

### 1. Predicted output / type

```text

```

### 2. Reasoning (compile-time vs runtime)

What is `x`'s type after the early return?

```text

```

### 3. Run / type-check

Studio Run, or: `npx tsx 09-type-narrowing/experiments/03-pitfalls.ts`

### 4–7. Actual · discrepancy · deeper why · what-if

```text

```
