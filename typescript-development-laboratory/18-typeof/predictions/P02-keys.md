# P02 — as const config

**Difficulty:** ★★★  
**File:** `experiments/02-config.ts`

## DO NOT RUN YET

```ts
const config = { retries: 3 } as const;
type R = typeof config.retries;
```

### 1. Predicted output / type

```text

```

### 2. Reasoning (compile-time vs runtime)

Is R `number` or `3`?

```text

```

### 3. Run / type-check

Studio Run, or: `npx tsx 18-typeof/experiments/02-config.ts`

### 4–7. Actual · discrepancy · deeper why · what-if

```text

```
