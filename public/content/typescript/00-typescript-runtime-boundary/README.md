# 00 — TypeScript Runtime Boundary

**Difficulty baseline:** ★★☆☆☆ (peaks at ★★★)  
**Prerequisites:** JavaScript fundamentals (Laboratory 1); Node 18+  
**Core question:** What actually happens when TypeScript “runs”?

---

## Learning outcomes

1. Explain TypeScript as a **typed layer over JavaScript**, not a separate runtime
2. Trace: source → parse → typecheck → emit → JS runtime
3. Demonstrate **type erasure** on a real `tsc` emit
4. Distinguish compile-time constructs from runtime constructs
5. Predict what remains after compilation for types, interfaces, generics, classes, enums (preview)
6. Explain why types do not protect untrusted runtime data by themselves

---

## The big picture

```text
TypeScript source (.ts)
        │
        ▼
   Parser → AST
        │
        ▼
   Type checker  ←── types, inference, diagnostics
        │
        ▼
   Emitter → JavaScript (.js)   ← type erasure (generally)
        │
        ▼
   JavaScript engine + host (Node / browser)
```

**Deep Fact:** TypeScript never changes program behavior *based on the types it inferred*. Checking can reject a program; types themselves are not runtime rules.

**Compiler Insight:** Exact pipeline stage names are implementation details and can evolve. Observable truths: diagnostics, emit, and runtime JS behavior.

---

# Lesson 1 — What is TypeScript?

## Concise explanation

TypeScript is JavaScript **plus** a static type system and compiler/tooling. You write `.ts` (or typed JS). The checker analyzes types. Emit produces JavaScript your host already understands.

## Mechanism

| Layer | Role |
|---|---|
| TypeScript language | Syntax for types + JS syntax |
| Type checker | Assignability, inference, diagnostics |
| Emitter / transpiler | JS output (and optional `.d.ts`) |
| JS runtime | Executes emitted (or directly transformed) JS |

## Tiny example

```ts
const username: string = "Ubaid";
```

## Predict

→ [`predictions/P01-username-annotation.md`](./predictions/P01-username-annotation.md)

## Type-check & run

```bash
npx tsx 00-typescript-runtime-boundary/experiments/02-username.ts
npx tsc --noEmit -p tsconfig.json
```

## Break it

Change `"Ubaid"` to `42` in the experiment. Predict the diagnostic. Type-check again. Fix it.

---

# Lesson 2 — The greet pipeline (main lab)

## Concise explanation

Annotations on `greet` exist for the checker. After emit, they are gone. The runtime only sees a function.

## Mechanism

```ts
function greet(name: string): string {
  return `Hello ${name}`;
}
```

1. Parser builds AST including type nodes  
2. Checker verifies call sites against `string`  
3. Emitter strips type annotations  
4. Node runs the JS function  

## Experiments

| File | Purpose |
|---|---|
| [`experiments/01-greet.ts`](./experiments/01-greet.ts) | Runnable greet |
| [`experiments/03-inspect-erasure.ts`](./experiments/03-inspect-erasure.ts) | Prints guidance + runtime typeof checks |

## Predict

→ [`predictions/P02-greet-erasure.md`](./predictions/P02-greet-erasure.md)

## Compile (inspect erasure)

Module-local emit config writes only this module’s experiments:

```bash
npx tsc -p 00-typescript-runtime-boundary/tsconfig.emit.json
```

Then open:

```text
dist/00-typescript-runtime-boundary/experiments/01-greet.js
```

**Questions to answer in your notes:**

1. Is `: string` present in the `.js` file?  
2. Is the function still there?  
3. Does `greet(42)` fail at runtime if you bypass the type checker?

## Run emitted JS

```bash
node dist/00-typescript-runtime-boundary/experiments/01-greet.js
```

Or: `npm run lab:00:emit`

---

# Lesson 3 — Compile-time vs runtime catalog

## Concise explanation

Many TypeScript constructs are **type-space only**. Some language features have dual nature (class fields, enums, etc.).

## Experiment

→ [`experiments/04-runtime-survival.ts`](./experiments/04-runtime-survival.ts)

## Predict

→ [`predictions/P03-what-survives.md`](./predictions/P03-what-survives.md)

Fill the table before running. Then confirm with emit + runtime.

| Construct | Exists at compile-time? | In emitted JS? | Runtime observable? |
|---|---|---|---|
| `type` alias | | | |
| `interface` | | | |
| type annotation | | | |
| generic `<T>` | | | |
| `as Type` | | | |
| `class` | | | |
| `enum` (non-const) | | | |
| `function` | | | |

---

# Lesson 4 — Types do not validate external data

## Concise explanation

`JSON.parse` returns a runtime value. Annotating or asserting does not verify shape.

## Experiment

→ [`experiments/05-json-lie.ts`](./experiments/05-json-lie.ts)

## Predict

→ [`predictions/P04-json-assertion.md`](./predictions/P04-json-assertion.md)

**Production Insight:** Trust boundaries need validation. Types document and check *your* code paths; they do not authenticate the network.

---

# Lesson 5 — Why TypeScript exists

Answer in writing (3–6 sentences each):

1. What problem does static typing solve that tests alone struggle with?  
2. What problem does static typing **not** solve?  
3. Why is gradual typing useful when migrating JS → TS?  
4. How does structural typing change API design vs nominal languages you know?

Compare your answers with [`solutions/WHY-typescript.md`](./solutions/WHY-typescript.md) only after writing.

---

## Challenges

### C01 — Will this compile? ★★☆☆☆

→ [`challenges/C01-will-it-compile.md`](./challenges/C01-will-it-compile.md)

### C02 — Fix the lie without `any` ★★★☆☆

→ [`challenges/broken/02-unsafe-greet.ts`](./challenges/broken/02-unsafe-greet.ts)

Constraints: no `any`, prefer not to use `as`. Goal: make invalid calls fail at compile time; keep runtime greet working for strings.

### C03 — Explain the stack ★★☆☆☆

→ [`challenges/C03-explain-pipeline.md`](./challenges/C03-explain-pipeline.md)

---

## Developer Knowledge boxes

### Common Misconception

“TypeScript runs my types.” — No. The runtime runs JavaScript. Types constrain what you're allowed to compile (when you respect the checker).

### Why This Works

Erasure keeps TypeScript aligned with the JS ecosystem: same runtimes, same libraries, incremental adoption.

### Interview Insight

Strong candidates separate: (1) what the checker proves, (2) what emit contains, (3) what must be validated at runtime.

### Anti-Pattern

Disabling typecheck in CI while “using TypeScript” — you keep the syntax tax without the guarantee.

---

## The "Why" checklist (use every lesson)

- What problem does this solve?
- Why can't ordinary JS solve it at compile time?
- What does the compiler know?
- What does the runtime know?
- What disappears after compilation?

---

## Files in this module

| Path | Purpose |
|---|---|
| `experiments/01-greet.ts` | Core greet example |
| `experiments/02-username.ts` | Annotation intro |
| `experiments/03-inspect-erasure.ts` | Runtime probes |
| `experiments/04-runtime-survival.ts` | Survival catalog |
| `experiments/05-json-lie.ts` | Assertion ≠ validation |
| `tsconfig.emit.json` | Emit only this module’s experiments |
| `predictions/` | Write before running |
| `challenges/` | Drills |
| `solutions/` | After attempts |
| `review.md` | Spaced review |

---

## When you are done

1. Update [`PROGRESS.md`](../PROGRESS.md)  
2. Add one personal fact to [`TYPESCRIPT_FACTS.md`](../TYPESCRIPT_FACTS.md)  
3. Skim glossary: type erasure, emit, assignability  
4. Proceed to [`01-toolchain/README.md`](../01-toolchain/README.md)
