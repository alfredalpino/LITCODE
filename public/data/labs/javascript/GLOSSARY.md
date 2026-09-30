# Glossary

Precise terms used throughout the laboratory. Prefer these over vague metaphors when explaining.

---

## Language & standards

| Term | Meaning |
|---|---|
| **JavaScript** | Common name for the language implemented by engines; usually means ECMAScript as hosted in real environments |
| **ECMAScript (ES)** | The standardized language specification (ECMA-262) |
| **TC39** | Committee that evolves ECMAScript |
| **Conformance** | An implementation matches required observable behavior |

---

## Runtime embedding

| Term | Meaning |
|---|---|
| **Engine** | Implementation of ECMAScript (e.g., V8, SpiderMonkey, JavaScriptCore) |
| **Host / Host environment** | Embedding that provides the engine plus platform APIs (browser, Node.js) |
| **Host API** | API provided by the host, not by the language core (`fs`, `document`, often `console`, `setTimeout`) |
| **Realm** | A global environment + intrinsics (roughly: one distinct global object world) |
| **Agent** | Spec concept for an execution thread-like entity with its own execution stack and job queues |
| **Job** | Unit of work scheduled by the spec (e.g., Promise Jobs) |
| **Event loop** | Host mechanism that drains queues / coordinates platform work (details vary by host) |

---

## Compilation & execution pipeline

| Term | Meaning |
|---|---|
| **Source text** | Your `.js` characters |
| **Lexing / Tokenizing** | Splitting source into tokens |
| **Parsing** | Building a syntactic structure from tokens |
| **AST** | Abstract Syntax Tree — structured representation of the program |
| **Bytecode / IR** | Engine-specific intermediate representation |
| **Interpreter** | Executes bytecode/IR without (or before) full native compilation |
| **JIT** | Just-In-Time compilation to machine code (engine optimization) |
| **Deoptimization** | Abandoning an optimized compilation when assumptions fail (engine detail) |

---

## Execution model

| Term | Meaning |
|---|---|
| **Evaluation** | Running code to produce a result (or throw) |
| **Call stack** | Stack of active function executions (mental model) |
| **Execution context** | Spec structure representing running code (script, function, etc.) |
| **Lexical Environment** | Spec structure mapping identifiers to bindings |
| **Environment Record** | Concrete binding storage within a Lexical Environment |
| **Scope** | Informal: which bindings are visible where (lexical) |
| **Closure** | Function object + referenced outer lexical environment bindings that remain reachable |
| **Synchronous** | Runs to completion on the stack without yielding to the host event loop |
| **Asynchronous** | Completes later via host scheduling / jobs |

---

## Values & objects

| Term | Meaning |
|---|---|
| **Primitive** | Non-object values: undefined, null, boolean, number, bigint, string, symbol |
| **Object** | Collection of properties with identity; includes arrays, functions, etc. |
| **Binding** | Association between a name and a value slot |
| **Reference** | Spec concept used in evaluating member access / assignment targets |
| **Identity** | Sameness of object (same reference), vs equal contents |
| **Coercion** | Implicit or explicit type conversion via abstract operations |
| **Abstract operation** | Spec algorithm (ToNumber, ToPrimitive, SameValue, …) — not user-callable JS |

---

## Equality (preview)

| Term | Meaning |
|---|---|
| **Strict Equality (`===`)** | Spec Strict Equality Comparison |
| **Loose Equality (`==`)** | Spec IsLooselyEqual — performs coercions |
| **SameValue** | Used by `Object.is` |
| **SameValueZero** | Like SameValue but treats `+0` and `-0` as equal (used by `Map`/`Set` keying for 0) |

---

## Properties & prototypes

| Term | Meaning |
|---|---|
| **Own property** | Property directly on the object |
| **Inherited property** | Found via prototype chain |
| **Property descriptor** | Attributes: value/get/set, writable, enumerable, configurable |
| **Prototype** | Object used for delegation in property lookup |
| **Prototype chain** | Linked prototypes walked during lookup |
| **Internal slot** | Spec-only object state (e.g., [[Prototype]], [[PromiseState]]) — not ordinary properties |

---

## Functions & `this`

| Term | Meaning |
|---|---|
| **Callable** | Object with [[Call]] internal method |
| **Constructor** | Object with [[Construct]] (can be used with `new`) |
| **Ordinary function** | Non-arrow function with dynamic `this` rules |
| **Arrow function** | Lexical `this`; not constructible |
| **This binding** | How `this` is determined for a call |

---

## Async (preview)

| Term | Meaning |
|---|---|
| **Promise** | Object representing eventual completion/failure |
| **Thenables** | Objects with a `then` method participating in Promise resolution |
| **Microtask / Promise Job** | Job queued for promise reactions (common term: microtask) |
| **Task / macrotask** | Host-queued work unit (timers, I/O callbacks — host terminology varies) |

---

## Modules (preview)

| Term | Meaning |
|---|---|
| **Script** | Classic script goal symbol / non-module script |
| **Module** | ES Module with module environment and imports/exports |
| **CommonJS** | Node’s historical `require`/`module.exports` system (host/module convention) |

---

## Memory (preview)

| Term | Meaning |
|---|---|
| **Stack (conceptual)** | Call frames / locals model |
| **Heap (conceptual)** | Dynamically allocated objects |
| **Reachability** | GC keeps objects reachable from roots |
| **Memory leak (app-level)** | Retaining objects longer than intended via references |

---

## How to use this glossary

When a lesson introduces a term:

1. Read the glossary entry
2. Run the experiment
3. Explain the term in your own words in `PROGRESS.md`
4. Only then move on
