# Advanced JavaScript Facts

A living database of facts many developers skip — or memorize without understanding.

Each fact uses this structure:

```text
Fact
Why it matters
Example
Underlying mechanism
Common misconception
Practical consequence
```

Add facts as you discover them throughout the curriculum. Prefer precision over cleverness.

---

## F01 — JavaScript ≠ the browser ≠ Node.js

**Fact:** JavaScript (ECMAScript) is a language. Browsers and Node.js are **host environments** that embed a JS engine and provide host APIs.

**Why it matters:** Confusing language features with host APIs creates broken mental models (`document` is not “JavaScript”; `fs` is not “JavaScript”).

**Example:**

```js
// Language: works in any conforming ECMAScript environment
const x = 1 + 1;

// Host API: Node.js
// require("fs");

// Host API: Browser
// document.querySelector("body");
```

**Underlying mechanism:** The ECMAScript specification defines language semantics. Hosts provide an embedding (agent, realm, jobs) plus platform APIs.

**Common misconception:** “JavaScript is what runs in the browser” (incomplete — JS also runs on servers, edge workers, embedded devices).

**Practical consequence:** When debugging, ask: is this language behavior or host API behavior?

---

## F02 — ECMAScript is the language standard; engines implement it

**Fact:** ECMAScript (ECMA-262) specifies the language. Engines (V8, SpiderMonkey, JavaScriptCore, etc.) implement it — sometimes with extensions and always with implementation choices.

**Why it matters:** Blog posts about “how V8 does X” are not the same as “what JavaScript guarantees.”

**Example:** Hidden classes / shapes are a V8 (and similar engines) optimization strategy, not an ECMAScript-required concept.

**Underlying mechanism:** Spec defines observable behavior; engines may optimize as long as observable behavior matches.

**Common misconception:** Treating engine blogs as language law.

**Practical consequence:** Prefer spec-backed reasoning for correctness; use engine insight for performance intuition — labeled as such.

---

## F03 — `console.log` is a host-provided API, not core language syntax

**Fact:** The ECMAScript language does not require `console`. Hosts commonly provide it.

**Why it matters:** Helps separate “language” from “environment.”

**Example:**

```js
console.log("Hello");
```

**Underlying mechanism:** Host object exposed to the realm’s global object (typical embedding).

**Common misconception:** “`console.log` is a JavaScript keyword.”

**Practical consequence:** In exotic embeddings, `console` may be missing or different.

---

## F04 — Source code is not what the CPU executes

**Fact:** Engines parse source into an AST (and typically bytecode / IR), then interpret and/or JIT-compile.

**Why it matters:** Errors can occur at parse time vs run time; mental model of “the computer reads my file line by line as text” is wrong.

**Example:** A syntax error fails before any statement runs.

**Underlying mechanism:** Lexing → parsing → AST → bytecode/IR → interpreter → (often) JIT → machine code. Pipeline details are engine-specific.

**Common misconception:** JavaScript is “only interpreted” in a simple line-by-line sense.

**Practical consequence:** Syntax errors vs runtime exceptions are different failure modes.

---

## F05 — Synchronous code runs to completion on the call stack

**Fact:** A function runs until it returns (or throws), pushing/popping frames on the call stack — unless it awaits/yields control via async mechanisms coordinated by the host.

**Why it matters:** Explains why long sync loops freeze UIs and why stack traces look the way they do.

**Example:** Nested function calls deepen the stack; returns unwind it.

**Underlying mechanism:** Execution contexts / call stack (conceptual model aligned with spec + host).

**Common misconception:** “JavaScript is multithreaded so my loop won’t block” (browser JS is typically single-threaded for page script; workers are separate).

**Practical consequence:** Never block the main thread with heavy sync work in UI code.

---

## F06 — The event loop is a host concept (not “just the language”)

**Fact:** Scheduling timers, I/O callbacks, and rendering is done by the **host** event loop / job queues, in coordination with ECMAScript Jobs (e.g., promise jobs).

**Why it matters:** `setTimeout` is not a language primitive; promise job scheduling is specified more tightly.

**Example:** `setTimeout(fn, 0)` queues a host timer task — not “run immediately.”

**Underlying mechanism:** Host task queues + ECMAScript Jobs / Promise Jobs (microtasks in common terminology).

**Common misconception:** “The event loop is purely an ECMAScript invention identical in every host.”

**Practical consequence:** Predict async order by distinguishing call stack, microtasks, and host tasks.

---

## F07 — `const` prevents rebinding, not mutation

**Fact:** `const` makes the **binding** immutable. If the value is an object, the object’s properties can still change.

**Why it matters:** Extremely common interview and production confusion.

**Example:**

```js
const user = { name: "Ada" };
user.name = "Grace"; // allowed
// user = {}; // TypeError
```

**Underlying mechanism:** Lexical binding immutability ≠ deep immutability of the value.

**Common misconception:** “`const` means the object is frozen.”

**Practical consequence:** Use `Object.freeze` / immutable patterns when you need immutability of contents.

---

## F08 — `typeof null === "object"` is a historical quirk

**Fact:** `typeof null` returns `"object"` for historical reasons; `null` is still a primitive.

**Why it matters:** Type checks that use `typeof` alone mishandle `null`.

**Example:**

```js
typeof null; // "object"
null === null; // true
```

**Underlying mechanism:** Historical bug / early implementation detail preserved for compatibility (widely documented history).

**Common misconception:** “`null` is an object.”

**Practical consequence:** Check `value === null` explicitly when needed.

---

## F09 — `NaN` is not equal to itself under `===`

**Fact:** `NaN === NaN` is `false`. `Object.is(NaN, NaN)` is `true`.

**Why it matters:** Equality and “same value” are different abstract operations.

**Example:**

```js
NaN === NaN; // false
Object.is(NaN, NaN); // true
Number.isNaN(NaN); // true
```

**Underlying mechanism:** IEEE-754 inspired behavior reflected in ECMAScript Strict Equality vs SameValue (`Object.is`).

**Common misconception:** “Any value equals itself.”

**Practical consequence:** Prefer `Number.isNaN` / `Object.is` when checking NaN.

---

## F10 — `-0` and `0` are distinct under SameValue, not under `===`

**Fact:** `-0 === 0` is `true`, but `Object.is(-0, 0)` is `false`.

**Why it matters:** Rare edge cases in math / hashing / serialization.

**Example:**

```js
0 === -0; // true
Object.is(0, -0); // false
```

**Underlying mechanism:** Strict Equality vs SameValue abstract operations.

**Common misconception:** “There is only one zero.”

**Practical consequence:** Know which equality you need for the domain.

---

## F11 — Arrays are objects; functions are objects

**Fact:** Arrays and functions are objects with special behavior (exotic array objects; callable objects).

**Why it matters:** Explains property assignment on functions, array methods inheritance, etc.

**Example:**

```js
typeof []; // "object"
typeof function () {}; // "function" (typeof quirk for callables)
```

**Underlying mechanism:** Object type with internal slots / special [[Call]] / array index semantics.

**Common misconception:** “Arrays are a separate primitive type.”

**Practical consequence:** Prototype and property mental models apply.

---

## F12 — Classes are syntax over prototypes

**Fact:** `class` does not introduce a separate inheritance model; it builds on prototypes.

**Why it matters:** Debugging inheritance and `instanceof` requires prototype understanding.

**Example:** `User.prototype` still exists for `class User {}` (constructor/prototype relationship).

**Underlying mechanism:** Class definition evaluation creates constructor functions and prototype objects.

**Common misconception:** “ES6 classes replaced prototypes.”

**Practical consequence:** Learn prototypes even if you only write classes.

---

## F13 — Arrow functions do not have their own `this`

**Fact:** Arrows lexically capture `this` from the enclosing scope (they also lack their own `arguments`, etc.).

**Why it matters:** Method extraction and `this` bugs.

**Example:** Arrow as object method often does the wrong thing for `this`.

**Underlying mechanism:** Lexical `ThisValue` / no `[[ThisMode]]` of own binding like ordinary functions (conceptual).

**Common misconception:** “Arrow functions are just shorter function syntax.”

**Practical consequence:** Use ordinary methods when you need dynamic `this`.

---

## F14 — Promise reactions are scheduled as Jobs (microtasks), unlike `setTimeout`

**Fact:** `.then` callbacks are Jobs (commonly “microtasks”); `setTimeout` uses host timer tasks (“macrotasks” in common parlance).

**Why it matters:** Output prediction of mixed async code.

**Example:** `Promise.resolve().then(...)` usually runs before `setTimeout(..., 0)`.

**Underlying mechanism:** ECMAScript Promise Jobs vs host timer task queues.

**Common misconception:** “All async callbacks go in one queue in arrival order.”

**Practical consequence:** Master this before event-loop interview questions.

---

## F15 — `setTimeout(fn, 0)` does not mean “execute immediately”

**Fact:** Delay `0` means “as soon as the host schedules it after current work / according to timer rules” — not “now.”

**Why it matters:** Race conditions and ordering bugs.

**Example:** Sync code after `setTimeout(fn, 0)` still runs first.

**Underlying mechanism:** Host timer minimum delay / task queueing; clamping rules vary by host (implementation/host detail).

**Common misconception:** “0 means next microtask.”

**Practical consequence:** Never use timer 0 as a substitute for understanding microtasks.

---

## More facts

Continue adding as modules expand (coercion abstract operations, property descriptors, iterator protocols, realms, agents, completion records, etc.).
