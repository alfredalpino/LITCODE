# P02 — Dishonest guard

**Difficulty:** ★★★  
**File:** `experiments/02-honesty.ts`

## DO NOT RUN YET

```ts
function isUser(u: unknown): u is User { return typeof u === "object" && u !== null && "id" in u; }
```

### 1. Predicted output / type

```text

```

### 2. Reasoning (compile-time vs runtime)

Why can this still be wrong at runtime?

```text

```

### 3. Run / type-check

Studio Run, or: `npx tsx 10-type-guards/experiments/02-honesty.ts`

### 4–7. Actual · discrepancy · deeper why · what-if

```text

```
