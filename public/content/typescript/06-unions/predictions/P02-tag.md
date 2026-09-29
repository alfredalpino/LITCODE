# P02 — Discriminant

**Difficulty:** ★★★  
**File:** `experiments/02-discriminated.ts`

## DO NOT RUN YET

```ts
type Result = { ok: true; value: string } | { ok: false; error: string };
function show(r: Result) { if (r.ok) return r.value; return r.error; }
```

### 1. Predicted output / type

```text

```

### 2. Reasoning (compile-time vs runtime)

What property makes narrowing reliable here?

```text

```

### 3. Run / type-check

Studio Run, or: `npx tsx 06-unions/experiments/02-discriminated.ts`

### 4–7. Actual · discrepancy · deeper why · what-if

```text

```
