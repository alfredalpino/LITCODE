# P02 — getName

**Difficulty:** ★★★★  
**File:** `experiments/03-remap.ts`

## DO NOT RUN YET

```ts
type Getters<T> = { [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K] };
```

### 1. Predicted output / type

```text

```

### 2. Reasoning (compile-time vs runtime)

What key appears for `{ name: string }`?

```text

```

### 3. Run / type-check

Studio Run, or: `npx tsx 20-mapped-types/experiments/03-remap.ts`

### 4–7. Actual · discrepancy · deeper why · what-if

```text

```
