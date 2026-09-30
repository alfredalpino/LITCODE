# 01 — Toolchain

**Difficulty:** ★★☆☆☆  
**Prerequisites:** [`00-typescript-runtime-boundary`](../00-typescript-runtime-boundary/)  
**Core question:** How do I type-check, emit, and run TypeScript deliberately?

---

## Learning outcomes

1. Use `tsc`, `tsx`, `npm` scripts confidently in this lab  
2. Explain `tsconfig.json` roles: check vs emit  
3. Know what `strict` enables at a high level  
4. Separate **IDE checking**, **CLI checking**, and **runtime execution**  
5. Inspect declaration emit (`.d.ts`) and source maps at a glance  

---

## Concise explanation

| Tool | Job |
|---|---|
| `tsc` | Official TypeScript compiler — check and/or emit |
| `tsx` | Convenient execute-TypeScript-now (dev ergonomics) |
| `node` | Runs JavaScript (emitted or native) |
| `npm` | Scripts + dependency versions pinned in `package.json` |

**Runtime Insight:** `tsx` running a file is not proof your whole project typechecks. CI should run `tsc --noEmit`.

---

## Setup

```bash
cd typescript-development-laboratory
npm install
node -v   # >= 18
npx tsc -v
npx tsx -v
```

---

## Experiments

### 01 — Verify toolchain

```bash
npx tsx 01-toolchain/experiments/01-verify-toolchain.ts
```

→ Predict first: [`predictions/P01-versions.md`](./predictions/P01-versions.md)

### 02 — noEmit vs emit

```bash
# Check only (root config has noEmit: true)
npm run typecheck

# Emit to dist/
npm run build
ls dist/01-toolchain/experiments/
```

Open the emitted `.js`, `.d.ts`, and `.js.map` for `02-sample-export.ts`.

→ [`predictions/P02-artifacts.md`](./predictions/P02-artifacts.md)

### 03 — Strict catches a null bug

Read [`experiments/03-strict-null-demo.ts`](./experiments/03-strict-null-demo.ts).

1. Predict whether it typechecks  
2. Run `npm run typecheck`  
3. Fix using narrowing (no `!`)  
4. Re-check  

Broken starting point also in `challenges/broken/`.

### 04 — Script map

Read `package.json` scripts. Explain each in one sentence in your notes.

---

## What `strict` turns on (overview)

With `"strict": true`, TypeScript enables a family of checks (including `strictNullChecks`, `noImplicitAny`, `strictFunctionTypes`, and others — exact set is documented per TypeScript version).

This lab also enables extras:

- `noUncheckedIndexedAccess`
- `exactOptionalPropertyTypes`
- `useUnknownInCatchVariables`
- `noImplicitReturns`
- `noFallthroughCasesInSwitch`

You will break programs with individual flags in module `40-tsconfig`. For now: **treat strict as the default planet you live on**.

---

## Challenges

### C01 — Create a tiny checked file ★☆☆☆☆

Create `01-toolchain/experiments/scratch-hello.ts` that exports `hello(name: string): string`.  
Typecheck must pass. Run with `tsx`.

### C02 — Diagnose the failure ★★☆☆☆

→ [`challenges/broken/01-implicit-any.ts`](./challenges/broken/01-implicit-any.ts)  
(Excluded from root include via `challenges/broken` — check it explicitly:)

```bash
npx tsc --noEmit --strict 01-toolchain/challenges/broken/01-implicit-any.ts
```

Fix into a new file under `experiments/` without `any`.

### C03 — Interview blurb ★★☆☆☆

In 60 seconds: difference between `tsc --noEmit` and `tsx file.ts`.  
Sample: [`solutions/C03-blurb.md`](./solutions/C03-blurb.md)

---

## Developer Knowledge

### Common Misconception

“My editor shows no red squiggles, so the project is fine.” — Editor may use a different TS version or incomplete project load. CLI `tsc -p` is source of truth for CI.

### Production Insight

Pin `typescript` in `devDependencies`. Drift between local and CI versions causes “works on my machine” type errors.

---

## When done

1. Update `PROGRESS.md`  
2. Skim [`COMPILER_REFERENCE.md`](../COMPILER_REFERENCE.md)  
3. Go to [`02-basic-types`](../02-basic-types/)
