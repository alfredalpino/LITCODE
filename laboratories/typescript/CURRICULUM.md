# Curriculum Map

Complete learning structure for the TypeScript Development Laboratory.

**Legend**

| Symbol | Meaning |
|---|---|
| ✅ | Content ready to study |
| 🧱 | Scaffolded / seeded — expand next |
| ○ | Planned |

Estimated depth is conceptual density, not calendar time. Move at the speed of understanding.

**Assumption:** You are already learning JavaScript deeply in Laboratory 1. This curriculum does **not** re-teach JavaScript language fundamentals.

---

## Phase 0 — Boundary & Toolchain

| # | Module | Focus | Status |
|---|---|---|---|
| 00 | [`00-typescript-runtime-boundary`](./00-typescript-runtime-boundary/) | What TS adds; type erasure; compile-time vs runtime | ✅ |
| 01 | [`01-toolchain`](./01-toolchain/) | `tsc`, `tsx`, npm, project layout, first configs | ✅ |

**Outcome:** You can predict what survives compilation and run the lab toolchain confidently.

---

## Phase 1 — Types, Inference, Core Composition

| # | Module | Focus | Status |
|---|---|---|---|
| 02 | [`02-basic-types`](./02-basic-types/) | Primitives; `any`/`unknown`/`never`/`void`/`object`/`{}` | ✅ |
| 03 | [`03-type-inference`](./03-type-inference/) | Widening, literals, contextual typing, annotation vs inference | ✅ |
| 04 | `04-functions` | Params, callbacks, HOF, function types | ✅ |
| 05 | `05-objects` | Object types, excess properties, optional/readonly | ✅ |
| 06 | `06-unions` | Unions as sets; discriminated unions intro | ✅ |
| 07 | `07-intersections` | `A & B`; incompatible intersections | ✅ |
| 08 | `08-literal-types` | Literal types, `as const`, state modeling | ✅ |
| 09 | `09-type-narrowing` | Control-flow analysis | ✅ |
| 10 | `10-type-guards` | Predicates vs real validation | ✅ |

**Outcome:** Fluent with core type composition and safe narrowing habits.

---

## Phase 2 — Structural Model & Generics

| # | Module | Focus | Status |
|---|---|---|---|
| 11 | `11-interfaces` | Interfaces, merging, vs type aliases | ✅ |
| 12 | `12-type-aliases` | Aliases for unions, tuples, advanced forms | ✅ |
| 13 | `13-structural-typing` | Structural vs nominal; assignability | ✅ |
| 14 | `14-generics` | Type parameters, inference, defaults | ✅ |
| 15 | `15-generic-constraints` | `extends`, key constraints | ✅ |
| 16 | `16-generic-patterns` | Practical generic APIs | ✅ |

**Outcome:** You design generic APIs without cargo-culting patterns.

---

## Phase 3 — Type Operators & Transformations

| # | Module | Focus | Status |
|---|---|---|---|
| 17 | `17-keyof` | Key unions; safe property access | ✅ |
| 18 | `18-typeof` | `typeof` in type positions | ✅ |
| 19 | `19-indexed-access` | `T[K]` | ✅ |
| 20 | `20-mapped-types` | Mapped types, remapping, modifiers | ✅ |
| 21 | `21-conditional-types` | `T extends U ? X : Y` | ✅ |
| 22 | `22-infer` | `infer`; rebuild `ReturnType` / `Parameters` / `Awaited` | ✅ |
| 23 | `23-template-literal-types` | Template literals for APIs | ✅ |
| 24 | `24-recursive-types` | Recursive aliases; JSONValue-style | 🧱 |
| 25 | `25-distributive-types` | Distributive conditionals; anti-distribution | 🧱 |
| 26 | `26-utility-types` | Understand + reimplement utilities | ✅ |

**Outcome:** You can read and write advanced transformations — and know when not to.

---

## Phase 4 — Classes, Modules, Declarations

| # | Module | Focus | Status |
|---|---|---|---|
| 27 | `27-classes` | Classes; TS modifiers vs runtime | 🧱 |
| 28 | `28-abstract-classes` | Abstract members | 🧱 |
| 29 | `29-enums` | Enums + `as const` alternatives; trade-offs | ✅ |
| 30 | `30-namespaces` | Namespaces (legacy + when you still see them) | 🧱 |
| 31 | `31-modules` | ESM; `import type` | 🧱 |
| 32 | `32-declaration-files` | `.d.ts`; writing typings for untyped JS | ✅ |
| 33 | `33-ambient-types` | `declare`; ambient contexts | 🧱 |
| 34 | `34-module-resolution` | Resolution vs execution | 🧱 |

**Outcome:** You navigate real packages, typings, and module boundaries.

---

## Phase 5 — Advanced Functions & Compatibility

| # | Module | Focus | Status |
|---|---|---|---|
| 35 | `35-functions-advanced` | Advanced function typing | ○ |
| 36 | `36-overloads` | Overloads vs unions | ○ |
| 37 | `37-this-types` | `this` parameters / polymorphic `this` | ○ |
| 38 | `38-variance` | Co/contra/bivariance (where relevant) | ○ |
| 39 | `39-type-compatibility` | Assignability laboratory | ○ |

**Outcome:** You predict function compatibility and design overloadable APIs carefully.

---

## Phase 6 — Compiler, Build, Project Scale

| # | Module | Focus | Status |
|---|---|---|---|
| 40 | `40-tsconfig` | Important options with break/fix experiments | 🧱 |
| 41 | `41-compiler` | `tsc` modes; emit vs check | 🧱 |
| 42 | `42-build-pipelines` | Bundlers vs `tsc`; when each fits | 🧱 |
| 43 | `43-source-maps` | Debugging emitted code | 🧱 |
| 44 | `44-project-references` | Monorepo-scale TypeScript | 🧱 |

**Outcome:** You configure and reason about TypeScript at project scale.

---

## Phase 7 — Trust Boundaries, Async, APIs

| # | Module | Focus | Status |
|---|---|---|---|
| 45 | `45-error-handling` | `unknown` catches; error modeling | ✅ |
| 46 | `46-runtime-validation` | Untrusted data → trusted types | 🧱 |
| 47 | `47-schema-validation` | Schema concepts (library-light) | 🧱 |
| 48 | `48-api-design` | Request → validate → domain → response | ✅ |
| 49 | `49-async-types` | `Promise<T>`, `Awaited` | 🧱 |
| 50 | `50-promises` | Combinators, tuple inference | 🧱 |

**Outcome:** You never confuse types with trust.

---

## Phase 8 — Platforms

| # | Module | Focus | Status |
|---|---|---|---|
| 51 | `51-dom-types` | DOM typings | ○ |
| 52 | `52-browser-applications` | Typed browser apps (no framework required) | ○ |
| 53 | `53-node-types` | Node typings | ○ |
| 54 | `54-backend-types` | Backend TypeScript principles | ○ |
| 55 | `55-api-contracts` | Shared contracts across clients | ○ |

**Outcome:** Platform APIs typed without confusing host APIs with TypeScript features.

---

## Phase 9 — Production Patterns & State

| # | Module | Focus | Status |
|---|---|---|---|
| 56 | `56-generics-in-production` | Repository, Result, EventMap, … | ○ |
| 57 | `57-type-safe-patterns` | Branded IDs, exhaustiveness, builders | ○ |
| 58 | `58-design-patterns` | Patterns through TS lenses | ○ |
| 59 | `59-functional-types` | Composition, readonly transforms | ○ |
| 60 | `60-state-modeling` | Discriminated unions as state machines | ○ |

**Outcome:** You model valid states and reusable typed abstractions.

---

## Phase 10 — Quality, Security, Dependencies

| # | Module | Focus | Status |
|---|---|---|---|
| 61 | `61-testing` | Runtime tests + typed mocks | 🧱 |
| 62 | `62-debugging` | Difficult type-error diagnosis | ○ |
| 63 | `63-performance` | Compile-time vs runtime performance | ○ |
| 64 | `64-security` | Type safety ≠ security | ○ |
| 65 | `65-dependency-types` | `@types`, untyped libs, JS interop | ○ |

**Outcome:** You ship maintainable, tested, realistically secure TypeScript.

---

## Phase 11 — Application Stacks

| # | Module | Focus | Status |
|---|---|---|---|
| 66 | `66-react-typescript` | Props, hooks, generics (React assumed known in JS) | ○ |
| 67 | `67-node-typescript` | Node backends with TS discipline | ○ |
| 68 | `68-full-stack-typescript` | End-to-end typed systems | ○ |

**Outcome:** Stack-specific TypeScript without re-teaching the frameworks from zero.

---

## Phase 12 — Interview, Review, Capstone

| # | Module | Focus | Status |
|---|---|---|---|
| 69 | `69-interview-lab` | Categorized interview drills | ○ |
| 70 | `70-code-review-lab` | Realistic PR mistakes | ○ |
| 71 | `71-refactoring-lab` | Ugly TS → clear + safe | ○ |
| 72 | `72-system-design-types` | Modeling systems with types | ○ |
| 73 | `73-capstone` | Architecture-level project milestones | ○ |
| 74 | `74-final-project` | Full-stack typed application (you build it) | ○ |

**Outcome:** Startup-interview readiness and production judgment.

---

## Cross-cutting banks

| Bank | Purpose | Status |
|---|---|---|
| [`predict-the-type/`](./predict-the-type/) | Hundreds of “what type / why?” drills | 🧱 |
| [`will-it-compile/`](./will-it-compile/) | YES/NO then explain | 🧱 |
| [`what-exists-at-runtime/`](./what-exists-at-runtime/) | Erasure / runtime survival drills | 🧱 |
| [`fix-without-assertion/`](./fix-without-assertion/) | Ban `as` / `any` / `!` initially | 🧱 |
| [`spaced-review/`](./spaced-review/) | Day 1/3/7/14/30 active recall | 🧱 |

---

## Project progression (build as modules unlock)

| # | Project | Depends on (approx.) |
|---|---|---|
| 1 | Typed CLI utility | 00–04, 45 |
| 2 | Typed browser application | 51–52 |
| 3 | Typed API client | 48–50, 55 |
| 4 | Runtime-validated API app | 46–48 |
| 5 | Type-safe state system | 60 |
| 6 | Typed Node backend | 54, 67 |
| 7 | Full-stack TypeScript app | 68, 74 |
| 8 | Reusable TypeScript library | 31–32, 41 |
| 9 | Typed event-driven system | 56–57 |
| 10 | Architecture capstone | 72–73 |

---

## Daily training template

Each study session (adapt difficulty to performance):

```text
1 TypeScript concept
2 compiler experiments
2 type-prediction exercises
2 debugging exercises
2 implementation exercises
1 advanced type challenge (later modules)
1 production-design problem
1 interview question
```

Log everything in [`PROGRESS.md`](./PROGRESS.md).

---

## Recommended first path

```text
README → CURRICULUM skim
  → 00-typescript-runtime-boundary
  → 01-toolchain
  → 02-basic-types
  → 03-type-inference
  → 04–16 (composition & generics)\n  → 17–23, 26 (type operators)\n  → 29, 32, 45, 48 (professional picks)\n  → scaffolds as published
```

Do **not** skip module `00`. The compile-time / runtime boundary is the foundation of every later “why.”
