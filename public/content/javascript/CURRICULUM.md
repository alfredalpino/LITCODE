# Curriculum Map

Complete learning structure for the JavaScript Laboratory.

**Legend**

| Symbol | Meaning |
|---|---|
| ✅ | Content ready to study |
| 🧱 | Scaffolded — expand next |
| ○ | Planned |

Estimated depth is conceptual density, not calendar time. Move at the speed of understanding.

---

## Phase 0 — Orientation

| # | Module | Focus | Status |
|---|---|---|---|
| 00 | [`00-orientation`](./00-orientation/) | How this lab works, environment, learning cycle, mental models | ✅ |

**Outcome:** You can run experiments, predict before executing, and track progress honestly.

---

## Phase 1 — Language Foundations

| # | Module | Focus | Status |
|---|---|---|---|
| 01 | [`01-runtime`](./01-runtime/) | Source → parse → AST → execute; language vs host vs engine | ✅ |
| 02 | [`02-values-types`](./02-values-types/) | Primitives, objects, equality, identity, SameValue, coercion intro | 🧱 |
| 03 | [`03-variables`](./03-variables/) | `var`/`let`/`const`, bindings, TDZ, hoisting, shadowing | 🧱 |
| 04 | [`04-operators`](./04-operators/) | Operators + **full coercion laboratory** (ToPrimitive, ToNumber, …) | 🧱 |
| 05 | [`05-control-flow`](./05-control-flow/) | Conditionals, loops, `switch`, labels, completion records intro | 🧱 |

**Outcome:** Accurate model of values, bindings, and evaluation.

---

## Phase 2 — Functions, Scope, Closures

| # | Module | Focus | Status |
|---|---|---|---|
| 06 | [`06-functions`](./06-functions/) | Declarations, expressions, arrows, HOF, call stack, recursion | 🧱 |
| 07 | [`07-scope`](./07-scope/) | Lexical environments, environment records, scope chain | 🧱 |
| 08 | [`08-closures`](./08-closures/) | Dedicated closure lab — survival, GC, loops, async, debugging | 🧱 |

**Outcome:** You can explain closures in terms of lexical environments, not metaphors alone.

---

## Phase 3 — Objects, Prototypes, Classes, `this`

| # | Module | Focus | Status |
|---|---|---|---|
| 09 | [`09-objects`](./09-objects/) | Properties, descriptors, getters/setters, Reflect, extensibility | 🧱 |
| 10 | [`10-prototypes`](./10-prototypes/) | Prototype chain, delegation, constructors, `__proto__` vs `prototype` | 🧱 |
| 11 | [`11-classes`](./11-classes/) | Class syntax as prototype sugar; private fields; inheritance | 🧱 |
| 15 | [`15-this`](./15-this/) | Binding rules, call/apply/bind/new, arrows, precedence | 🧱 |

> Note: `this` is listed after objects/prototypes conceptually; study after 09–11, or revisit.

**Outcome:** You treat classes as syntax over prototypes and predict `this` reliably.

---

## Phase 4 — Collections & Iteration

| # | Module | Focus | Status |
|---|---|---|---|
| 12 | [`12-arrays`](./12-arrays/) | Dense/sparse arrays, mutators, map/filter/reduce, complexity | 🧱 |
| 13 | [`13-iterators`](./13-iterators/) | Iterable/iterator protocols, `Symbol.iterator`, `for...of` | 🧱 |
| 14 | [`14-generators`](./14-generators/) | `function*`, `yield`, generator state machines | 🧱 |

**Outcome:** You can build custom iterators/generators and use array methods deliberately.

---

## Phase 5 — Asynchrony

| # | Module | Focus | Status |
|---|---|---|---|
| 16 | [`16-async`](./16-async/) | Sync vs async, callbacks, timers, host APIs | 🧱 |
| 17 | [`17-event-loop`](./17-event-loop/) | Call stack, tasks, microtasks, rendering — **20+ predictions** | 🧱 |
| 18 | [`18-promises`](./18-promises/) | States, chaining, thenables, combinators, toy Promise | 🧱 |

**Outcome:** You can predict mixed promise/timer output and explain *why*.

---

## Phase 6 — Modules, Errors, Browser Surface

| # | Module | Focus | Status |
|---|---|---|---|
| 19 | [`19-modules`](./19-modules/) | ESM vs CJS, loading, caching, cycles, dynamic import | 🧱 |
| 20 | [`20-error-handling`](./20-error-handling/) | throw/try/catch/finally, async errors, unhandled rejection | 🧱 |
| 21 | [`21-dom`](./21-dom/) | DOM tree, events, bubbling/capturing, delegation | 🧱 |
| 22 | [`22-browser-runtime`](./22-browser-runtime/) | Window, realms, browsing context, scripting environment | 🧱 |
| 23 | [`23-web-apis`](./23-web-apis/) | Timers, observers, workers conceptually, platform APIs | 🧱 |

**Outcome:** Clear separation of language features vs browser platform APIs.

---

## Phase 7 — Networking & Storage

| # | Module | Focus | Status |
|---|---|---|---|
| 24 | [`24-networking`](./24-networking/) | HTTP, headers, status, CORS concepts, auth concepts | 🧱 |
| 25 | [`25-fetch`](./25-fetch/) | `fetch`, Response/Request, error modes, practical clients | 🧱 |
| 26 | [`26-storage`](./26-storage/) | cookies, localStorage, sessionStorage, IndexedDB concepts | 🧱 |

---

## Phase 8 — Performance, Memory, Security, Internals

| # | Module | Focus | Status |
|---|---|---|---|
| 27 | [`27-performance`](./27-performance/) | Complexity, measurement, DOM cost, debounce/throttle | 🧱 |
| 28 | [`28-memory`](./28-memory/) | Stack/heap model, reachability, leaks, Weak* APIs | 🧱 |
| 29 | [`29-security`](./29-security/) | XSS, prototype pollution, token exposure — safe local labs | 🧱 |
| 37 | [`37-internals`](./37-internals/) | Parse → AST → bytecode → interpreter → JIT (V8-labeled) | 🧱 |

---

## Phase 9 — Programming Discipline

| # | Module | Focus | Status |
|---|---|---|---|
| 30 | [`30-functional-programming`](./30-functional-programming/) | Purity, immutability, composition, currying | 🧱 |
| 31 | [`31-design-patterns`](./31-design-patterns/) | Practical patterns + when NOT to use them | 🧱 |
| 32 | [`32-testing`](./32-testing/) | Assertions, isolation, mocks, TDD exercises | 🧱 |

---

## Phase 10 — Node & Ecosystem

| # | Module | Focus | Status |
|---|---|---|---|
| 33 | [`33-node-runtime`](./33-node-runtime/) | Process, fs, streams, buffers, HTTP server, async I/O | 🧱 |
| 34 | [`34-npm`](./34-npm/) | package.json, semver, lockfiles, supply-chain awareness | 🧱 |
| 35 | [`35-typescript-preview`](./35-typescript-preview/) | Types as a lens on JS — not a replacement for JS depth | 🧱 |
| 36 | [`36-advanced-language`](./36-advanced-language/) | Proxies, Reflect, symbols advanced, well-known symbols, realms | 🧱 |

---

## Phase 11 — Integration

| # | Module | Focus | Status |
|---|---|---|---|
| 38 | [`38-interview-lab`](./38-interview-lab/) | Conceptual, output, debug, architecture — understanding not tricks | 🧱 |
| 39 | [`39-project-lab`](./39-project-lab/) | Projects 1–9 after conceptual groundwork | 🧱 |
| 40 | [`40-capstone`](./40-capstone/) | Full-stack architecture project — requirements, not spoon-fed solution | 🧱 |

---

## Cross-cutting laboratories

| Lab | Purpose | Status |
|---|---|---|
| [`predict-the-output/`](./predict-the-output/) | Levels 1–10 prediction bank | 🧱 Seeded |
| [`break-the-code/`](./break-the-code/) | Break then repair | 🧱 Seeded |
| [`implement-yourself/`](./implement-yourself/) | Educational reimplementations | 🧱 Seeded |
| [`debugging-lab/`](./debugging-lab/) | Subtle bug curriculum | 🧱 Seeded |
| [`spaced-review/`](./spaced-review/) | Day 1/3/7/14/30 active recall | 🧱 Seeded |

---

## Recommended study order (first 10 sessions)

1. `00-orientation` — full
2. `01-runtime` — full (do not rush)
3. Seed facts in `ADVANCED_JAVASCRIPT_FACTS.md` related to runtime — review
4. Spaced review Day 1 for runtime
5. Begin `02-values-types` when ready (content expands next)

---

## Projects (after groundwork)

| Project | Theme | Prerequisite modules (approx.) |
|---|---|---|
| 1 | CLI utility | 01–07, 33 basics |
| 2 | Interactive browser app | 09–12, 21–22 |
| 3 | API client | 18, 24–25 |
| 4 | Async data dashboard | 16–18, 25 |
| 5 | State-management app | 08–11, 30–31 |
| 6 | Real-time application | 16–18, 23 |
| 7 | Node backend | 33–34, 20 |
| 8 | Full-stack JS | 19, 21–26, 33 |
| 9 | Performance-focused app | 27–28 |
| 10 | Capstone | All prior |

Projects live under `39-project-lab/` and `40-capstone/`. Build them yourself from requirements.

---

## How modules expand

Each module eventually contains:

```text
XX-name/
├── README.md           # Learn cycle + theory depth
├── experiments/        # Runnable .js
├── predictions/        # Predict-before-run cards
├── challenges/         # Problems + progressive hints
├── solutions/          # Peek only after attempt
└── review.md           # Spaced-review prompts
```

Template: [`templates/LESSON_TEMPLATE.md`](./templates/LESSON_TEMPLATE.md)
