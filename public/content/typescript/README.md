# TypeScript Development Laboratory

A **learn-by-doing TypeScript laboratory** for becoming exceptionally strong at TypeScript in real-world software development and startup software-engineering interviews.

This is **not** a beginner TypeScript tutorial.  
This is **not** “learn JavaScript, then sprinkle types.”

You already have (or are building):

| Laboratory | Focus |
|---|---|
| **Lab 1 — JavaScript** | Language, runtime, browser, Node, engineering depth |
| **Lab 2 — Python** | Python + DSA + algorithms + interview problem solving |
| **Lab 3 — TypeScript (this)** | Type system + compiler + production development + architecture + interviews |

This lab assumes JavaScript fundamentals are already being learned deeply elsewhere. It constantly answers:

> **What does TypeScript add to JavaScript, how does the type system reason about my program, and how can I use that information to build better software?**

---

## The question this lab answers

> **What does the compiler know — and what does the runtime actually do?**

For every feature:

| Question | Goal |
|---|---|
| What problem does this solve? | Motivation |
| Why can't ordinary JavaScript solve this at compile time? | Value of types |
| What does the compiler know? | Type-system model |
| What does the runtime know? | Execution model |
| What disappears after compilation? | Type erasure |
| What does TypeScript infer? | Inference skill |
| Why accept / reject this code? | Assignability |
| Does this improve the program or only the type puzzle? | Engineering judgment |

---

## Core philosophy

Every major concept follows:

```text
Learn → Predict → Type-check → Compile → Run → Break → Debug → Refactor → Explain → Apply
```

You should spend far more time **writing, predicting, type-checking, compiling, and debugging** than reading theory chapters.

---

## The critical distinction (tattoo this on your brain)

```text
TypeScript source
        │
        ▼
 Compile-time type system   ← types, interfaces, generics, narrowing, …
        │
        ▼
 JavaScript emission        ← type erasure (generally)
        │
        ▼
 JavaScript runtime         ← objects, functions, promises, DOM, I/O, …
```

### Compile-time (usually)

types · interfaces · type aliases · generics · conditional / mapped types · utility types · narrowing · overload signatures · `satisfies` · type assertions · most access-modifier *checking*

### Runtime (actually executes)

objects · functions · classes · arrays · promises · prototypes · DOM · network · exceptions · **and whatever JavaScript emits for enums/classes/decorators/helpers under your config**

**Deep Fact:** TypeScript's type system is not a runtime validator. Untrusted data (HTTP, JSON, env, DB) must be validated at the boundary.

---

## Prerequisites

- Node.js **18+**
- Completed (or actively working) the JavaScript laboratory foundations
- Terminal comfort
- Willingness to predict before running / type-checking
- Willingness to fix types **without** reaching for `as` / `any` / `!` first

---

## How to use this laboratory

### 1. Start here

1. Read this `README.md`
2. Skim [`CURRICULUM.md`](./CURRICULUM.md)
3. Complete [`00-typescript-runtime-boundary/`](./00-typescript-runtime-boundary/)
4. Complete [`01-toolchain/`](./01-toolchain/)
5. Continue [`02-basic-types/`](./02-basic-types/) → [`03-type-inference/`](./03-type-inference/)

### 2. For every lesson

1. Read the **concise** explanation
2. Read the **mechanism** (compile-time vs runtime)
3. Open the experiment
4. **Predict** (type + compile result + runtime) — write it down
5. Type-check: `npx tsc --noEmit -p tsconfig.json` (or module-local config)
6. Compile/emit when asked: `npm run build` or module emit config
7. Run with `npx tsx path/to/file.ts` or emitted `node dist/...`
8. Compare prediction vs reality
9. Break it / fix it / explain **why**
10. Attempt challenges **before** `solutions/`
11. Log progress in [`PROGRESS.md`](./PROGRESS.md)

### 3. Difficulty stars

| Stars | Meaning |
|---|---|
| ★ | Beginner — direct reasoning |
| ★★ | Developing — one non-obvious step |
| ★★★ | Intermediate — multi-step type reasoning |
| ★★★★ | Advanced — generics / variance / conditionals |
| ★★★★★ | Expert — production design + deep type-system |

Difficulty = **reasoning required**, not line count.

### 4. Hints policy

```text
Hint 1 — conceptual
Hint 2 — directional
Hint 3 — implementation
Solution — only after a serious attempt
```

### 5. Assertion discipline

Never treat `as SomeType` as a universal fix.

Ask: *Why doesn't TypeScript know this?*  
Then prefer: narrowing · constraints · better modeling · validation · API redesign · overloads · type guards.

---

## Repository map

```text
typescript-development-laboratory/
├── README.md
├── CURRICULUM.md
├── PROGRESS.md
├── TYPESCRIPT_FACTS.md
├── TYPE_SYSTEM_FACTS.md
├── GLOSSARY.md
├── COMPILER_REFERENCE.md
├── INTERVIEW_PLAYBOOK.md
├── COMMON_MISTAKES.md
├── TYPE_PATTERNS.md
├── ARCHITECTURE_NOTES.md
├── package.json
├── tsconfig.json
├── tsconfig.emit.json
├── templates/
├── lib/
├── 00-typescript-runtime-boundary/   ✅ What happens when TS “runs”?
├── 01-toolchain/                     ✅ tsc / tsx / npm / configs
├── 02-basic-types/                   ✅ primitives + any/unknown/never/void
├── 03-type-inference/                ✅ inference, widening, contextual typing
├── 04–74 …                           ○ Planned (see CURRICULUM.md)
├── predict-the-type/                 🧱 growing drill bank
├── will-it-compile/                  🧱 YES/NO compiler challenges
├── what-exists-at-runtime/           🧱 erasure drills
├── fix-without-assertion/            🧱 no as / any / !
└── spaced-review/                    🧱 Day 1/3/7/14/30
```

Modules `04`–`74` are mapped in the curriculum and will be implemented progressively — same pattern as the JavaScript laboratory. Do not wait for every folder to exist; master `00`–`03` first.

---

## Running experiments

From `typescript-development-laboratory/`:

```bash
npm install

# Execute TypeScript directly (no emit step)
npx tsx 00-typescript-runtime-boundary/experiments/01-greet.ts

# Type-check the lab (strict)
npm run typecheck

# Emit JavaScript to inspect erasure
npm run build
# then inspect files under dist/
```

Useful scripts:

| Script | Purpose |
|---|---|
| `npm run typecheck` | Strict type check, no emit |
| `npm run build` | Emit JS + declarations + source maps |
| `npm run lab:00` | Run first greet experiment via tsx |
| `npm run lab:00:emit` | Compile module 00 and run emitted JS |
| `npm run clean` | Remove `dist/` |

---

## Knowledge systems

| File | Purpose |
|---|---|
| [`TYPESCRIPT_FACTS.md`](./TYPESCRIPT_FACTS.md) | Language / compiler / runtime facts |
| [`TYPE_SYSTEM_FACTS.md`](./TYPE_SYSTEM_FACTS.md) | Subtyping, inference, variance, distributivity |
| [`GLOSSARY.md`](./GLOSSARY.md) | Precise terminology |
| [`COMPILER_REFERENCE.md`](./COMPILER_REFERENCE.md) | Pipeline overview (implementation details labeled) |
| [`INTERVIEW_PLAYBOOK.md`](./INTERVIEW_PLAYBOOK.md) | Startup SE interview prompts |
| [`COMMON_MISTAKES.md`](./COMMON_MISTAKES.md) | Mistakes with fixes / anti-fixes |
| [`TYPE_PATTERNS.md`](./TYPE_PATTERNS.md) | Production type patterns |
| [`ARCHITECTURE_NOTES.md`](./ARCHITECTURE_NOTES.md) | Boundaries, DTOs, trust |
| [`PROGRESS.md`](./PROGRESS.md) | Sessions, weak areas, review dates |

---

## Developer Knowledge boxes

Lessons use labeled boxes:

- **Deep Fact** — under-taught truth
- **Why This Works** — mechanism
- **Common Misconception** — frequent wrong model
- **Compiler Insight** — what `tsc` / the checker does (version-sensitive when noted)
- **Runtime Insight** — JavaScript / host behavior
- **Interview Insight** — how depth is tested
- **Production Insight** — real systems
- **Anti-Pattern** — cleverness that hurts maintainability
- **Type Complexity Discipline** — prefer clarity + safety

---

## Balance rule (no type-puzzle obsession)

```text
TypeScript theory
+ Practical development
+ Architecture
+ Debugging
+ Testing
+ Real-world API design
```

Advanced types matter. Production engineering is the objective. The best type is often the clearest type that still prevents real bugs.

---

## What “done” looks like

After this laboratory you should be able to enter an unfamiliar TypeScript codebase and:

- understand, modify, debug, design, and extend it confidently
- distinguish compile-time guarantees from runtime truth
- use generics, unions, narrowing, and mapped/conditional types judiciously
- design typed APIs with validation at trust boundaries
- configure strict projects and debug hard type errors
- review and refactor TypeScript for clarity + safety
- explain TypeScript in interviews without hand-waving

Not merely write:

```ts
interface User {
  name: string;
}
```

but know **why** that type exists, what the compiler does with it, what it cannot guarantee, what happens after emission, and whether it improves the architecture.

---

## Current status

| Area | Status |
|---|---|
| Core structure + knowledge bases | ✅ Built |
| Module `00` runtime boundary | ✅ Ready |
| Module `01` toolchain | ✅ Ready |
| Module `02` basic types | ✅ Ready |
| Module `03` type inference | ✅ Ready |
| Modules `04`–`74` | ○ Planned in curriculum |
| Cross-labs (predict / compile / runtime / fix) | 🧱 Seeded |

**Your next action:** open [`00-typescript-runtime-boundary/README.md`](./00-typescript-runtime-boundary/README.md).

---

## License

Personal learning laboratory — `UNLICENSED`.
