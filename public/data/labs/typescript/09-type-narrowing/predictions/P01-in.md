# P01 — `in` operator

**Difficulty:** ★★  
**File:** `experiments/01-typeof-in.ts`

## DO NOT RUN YET

```ts
function label(p: { name: string } | { id: number }) {
  if ("name" in p) return p.name;
  return String(p.id);
}
```

### 1. Predicted output / type

```text

```

### 2. Reasoning (compile-time vs runtime)

Why is `in` valid narrowing here?

```text

```

### 3. Run / type-check

Studio Run, or: `npx tsx 09-type-narrowing/experiments/01-typeof-in.ts`

### 4–7. Actual · discrepancy · deeper why · what-if

```text

```
