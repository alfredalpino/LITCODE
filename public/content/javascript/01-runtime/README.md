# 01 — Runtime: What Actually Happens When JavaScript Runs?

**Difficulty baseline:** ★★☆☆☆ (peaks at ★★★★)  
**Prerequisites:** [`00-orientation`](../00-orientation/)  
**Core question:** What is REALLY happening between source text and observable behavior?

---

## Learning outcomes

After this lab you can:

1. Trace a program from **source → parse → AST → execution**
2. Separate **language / engine / host** with concrete examples
3. Explain why syntax errors differ from runtime errors
4. Reason about **synchronous** execution and a simple **call stack**
5. Explain what `console.log("Hello")` involves end-to-end
6. Compare **browser vs Node** at the embedding level
7. Use correct vocabulary: realm (intro), agent (intro), job (preview)

---

## The big picture

```text
JavaScript source text (.js)
        │
        ▼
   Lexing / Parsing
        │
        ▼
        AST
        │
        ▼
 Bytecode / IR  (engine-specific)
        │
        ▼
 Interpreter / JIT  (engine-specific)
        │
        ▼
   Evaluation (language semantics)
        │
        ▼
 Host environment (Node, browser, …)
   — APIs, event loop, I/O, DOM, …
```

**Specification Insight:** ECMAScript defines *what* evaluation means. Engines choose *how* to implement it. Hosts embed engines and provide platform services.

**Engine Insight:** Modern engines (e.g., V8 in Node) typically parse to an AST, generate bytecode, interpret, then JIT-compile hot code. Pipeline details vary and are **not** language guarantees.

---

# Lesson 1 — The smallest program

## 1. Concise explanation

A JavaScript program is source text that an engine parses and evaluates inside a host.

## 2. Mechanism

For:

```js
console.log("Hello");
```

Roughly:

1. Host starts the engine with your file as a **script** (in Node’s default `node file.js` workflow)
2. Engine **parses** the source (syntax must be valid)
3. Engine **evaluates** the statement
4. Evaluating the call looks up `console`, then `log`, then invokes it with `"Hello"`
5. The host’s `console` implementation writes to the terminal (or browser console)

## 3. Tiny example

See `experiments/01-hello.js`.

## 4. Predict

→ [`predictions/P01-hello.md`](./predictions/P01-hello.md)

## 5. Execute

```bash
node 01-runtime/experiments/01-hello.js
```

## 6–7. Observe & modify

- Change the string
- Add two more logs
- Predict order every time

---

# Lesson 2 — Parse time vs run time

## Concise explanation

If source is syntactically invalid, evaluation never starts. If source is valid but does something illegal at runtime, evaluation starts and then throws.

## Mechanism

| Failure | When | Example |
|---|---|---|
| Syntax / parse error | Before evaluation | Unclosed string |
| Runtime exception | During evaluation | Calling a non-function |

## Experiments

| File | Purpose |
|---|---|
| `experiments/02-syntax-error.js` | Intentionally invalid (see comments) |
| `experiments/03-runtime-error.js` | Parses, then throws |
| `experiments/04-partial-execution.js` | What runs before a throw? |

### Predict

→ [`predictions/P02-errors.md`](./predictions/P02-errors.md)

### Extra experiment (you invent)

Create `experiments/scratch-syntax.js` with a syntax error **after** a `console.log`.  
**Predict:** Does the log run?  
Then run. Explain using parse-vs-runtime.

---

# Lesson 3 — Statements run synchronously (for now)

## Concise explanation

Top-level statements in a simple script run one after another on a single call stack turn. Nothing “parallel” happens inside pure synchronous code.

## Mechanism

Evaluation proceeds through the statement list. Each statement completes before the next begins (for ordinary synchronous statements).

## Experiment

`experiments/05-sync-order.js` + [`predictions/P03-sync-order.md`](./predictions/P03-sync-order.md)

### Weird JavaScript / Host teaser

Later you will see `setTimeout(..., 0)` print “out of order” relative to sync logs. That is **not** because JavaScript randomly reorders sync statements — it is **host scheduling**. Park that thought for modules 16–17.

---

# Lesson 4 — Call stack introduction

## Concise explanation

Calling a function pushes a frame; returning pops it. The currently running function is at the top.

## Mechanism (conceptual)

```text
(script)
  └─ main-ish top-level
       └─ alpha()
            └─ beta()   ← running
```

**Specification Insight:** The spec talks in terms of execution contexts. “Call stack” is the widely used mental model for the nest of active executions.

## Experiment

`experiments/06-call-stack-intro.js` + [`predictions/P04-call-stack.md`](./predictions/P04-call-stack.md)

`experiments/07-stack-trace.js` — force a throw and **read** the stack trace.

### Modify

Add `gamma()` called from `beta()`. Predict stack order in the trace. Run.

---

# Lesson 5 — What is `console` really?

## Concise explanation

`console` is typically a host-provided object. Logging is a side effect implemented by the host.

## Mechanism

Property lookup on the global object → find `console` → find `log` → [[Call]].

## Experiment

`experiments/08-console-is-host.js`

### Interview Insight

“Is `console.log` JavaScript?” — Strong answer: “It’s a common host API exposed to JS, not an ECMAScript syntactic form or required built-in in the language standard the way `Object` is.”

---

# Lesson 6 — Language vs host vs engine (with evidence)

## Experiment

`experiments/09-layers-evidence.js`

This prints:

- A pure language expression result
- Node host info (`process.versions`)
- Engine version string Node embeds

### Predict

→ [`predictions/P05-layers.md`](./predictions/P05-layers.md)

### Common Misconception

“Node.js is a programming language.”  
Node.js is a **runtime/host** built around a JS engine (V8) plus APIs modules, and an event loop implementation.

### Historical Context

Browsers needed a scripting language for pages → language evolved → standardized as ECMAScript → engines competed → Node reused V8 outside the browser to build server tooling. Same language family, different hosts.

---

# Lesson 7 — Scripts (today) vs modules (preview)

## Concise explanation

Node can run classic scripts (`node file.js`) and ES modules (`.mjs` or `"type":"module"`). Modules have different loading and scope rules — deep dive in `19-modules`.

## Experiment

`experiments/10-script-scope-teaser.js` shows top-level `var` vs `let` visibility on `globalThis` **in Node classic scripts** — behavior differs from browsers; read comments carefully.

**Production Insight:** Never assume browser global rules === Node global rules.

---

# Lesson 8 — Strict mode teaser

## Concise explanation

`"use strict";` enables a restricted variant of the language with fewer silent mistakes.

## Experiment

`experiments/11-strict-mode-teaser.js`

We use strict mode in most lab files. Module code is automatically strict (later).

---

# Lesson 9 — From source to AST (conceptual experiment)

You will not build a full parser. You will observe that structure matters.

## Experiment

`experiments/12-structure-matters.js` — same tokens-ish intent, different structure, different meaning.

Optional (advanced): run Node’s parser introspection later in `37-internals`. For now, stay conceptual.

### Engine Insight

Engines build an AST (or equivalent structural representation). Your mental model should be structural, not “lines of text the CPU reads.”

---

# Lesson 10 — Synchronous busy work blocks

## Concise explanation

Long synchronous work occupies the call stack / thread of the agent. The host cannot process other tasks for that agent until it finishes (simplified but crucial model).

## Experiment

`experiments/13-blocking-sync.js` — feel the pause between logs.

### Performance Insight

UI freezes and “slow Node” often start with accidental sync work on the main agent — not “JavaScript is slow” as a slogan.

---

## Deliberate bugs

| File | Task |
|---|---|
| `challenges/broken/01-silent-order.js` | Fix so output order matches the comment contract |
| `challenges/broken/02-not-a-function.js` | Debug the TypeError |

---

## Challenges

| ID | File | Difficulty |
|---|---|---|
| C01 | [`challenges/C01-trace-hello.md`](./challenges/C01-trace-hello.md) | ★★★ |
| C02 | [`challenges/C02-predict-stack.md`](./challenges/C02-predict-stack.md) | ★★★★ |
| C03 | [`challenges/C03-classify.md`](./challenges/C03-classify.md) | ★★ |

---

## Implement yourself (educational)

[`challenges/C04-mini-tracer.md`](./challenges/C04-mini-tracer.md) — build a tiny enter/leave tracer to visualize stack depth.

---

## Deeper theory summary

### Specification concepts introduced

| Concept | Role here |
|---|---|
| Source text | Input to parsing |
| Script evaluation | How classic scripts run |
| Execution context | Spec structure for running code |
| Jobs | Preview — async scheduling unit (later) |
| Realm / Agent | Preview — embedding concepts (later depth) |

### What we are NOT claiming

- Exact V8 pipeline stages for your Node build  
- That all hosts schedule identically  
- That “AST” is a user-visible JavaScript value  

---

## Real-world connection

When production fails:

1. Did it **parse**? (deployed broken syntax / wrong file)  
2. Did it **throw at runtime**? (stack trace)  
3. Is the bug in **language semantics** or a **host API** misuse?  
4. Is something **blocking** the agent?

---

## Interview connection

Common prompts this lab prepares:

- What happens when Node runs a file?
- Difference between syntax error and exception?
- What is the call stack?
- Is `console` part of JavaScript?
- Browser JS vs Node JS — what’s the same?

Answer with layers + mechanisms, not slogans.

---

## Developer Knowledge boxes (module-level)

### Deep Fact

Observable JavaScript behavior is defined by the language + host interactions. Engines may optimize aggressively as long as observable results match.

### Why This Works

A correct mental model of parse → evaluate → host side effects lets you debug unfamiliar code without memorizing APIs.

### Common Misconception

“JavaScript reads and executes one line of text at a time like a shell script, and `setTimeout(0)` means immediately.”  
Both halves are wrong or incomplete.

### Security Insight

Host APIs are powerful (`fs`, DOM). Language skill without host threat modeling is incomplete — later in `29-security`.

---

## How to work this module (order)

1. `01-hello.js` + P01  
2. Error experiments + P02  
3. Sync order + P03  
4. Call stack + P04 + stack trace  
5. Console / layers + P05  
6. Script teaser, strict teaser, structure, blocking  
7. Broken challenges  
8. C01–C04  
9. Read facts F01–F06 in `ADVANCED_JAVASCRIPT_FACTS.md`  
10. `review.md` Day 1  

**Do not rush.** Depth beats speed.

---

## Diagram

See [`diagrams/execution-pipeline.md`](./diagrams/execution-pipeline.md)
