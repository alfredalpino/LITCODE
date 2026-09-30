# TypeScript Facts

Living database of facts. Prefer precision over cleverness. Add facts as you discover them.

Each entry:

```text
Fact
Explanation
Code example
Compiler behavior
Runtime behavior
Common misconception
Practical consequence
```

---

## F01 — TypeScript types are generally erased from emitted JavaScript

**Fact:** After type checking, TypeScript normally **erases** type-only constructs when emitting JavaScript.

**Explanation:** Types exist for the checker and tooling. They are not a second runtime language layered on JavaScript.

**Code example:**

```ts
function greet(name: string): string {
  return `Hello ${name}`;
}
```

Emitted JS (conceptually) keeps the function and string template/behavior appropriate to `target`, but not `: string`.

**Compiler behavior:** Type annotations are removed during emit. Invalid types produce **compile-time** diagnostics; they do not become runtime checks by themselves.

**Runtime behavior:** The JavaScript engine never sees your `string` annotation.

**Common misconception:** “TypeScript will throw if I pass the wrong type at runtime.”

**Practical consequence:** Validate untrusted runtime data separately (see F16).

---

## F02 — TypeScript uses structural typing

**Fact:** Compatibility is based primarily on **shape** (members), not on nominal type identity / declared name.

**Explanation:** If value `X` has the members required by type `T` (with correct types), `X` is generally assignable to `T`, even if declared under a different name.

**Code example:**

```ts
interface User { name: string }
interface Employee { name: string }
const employee: Employee = { name: "Ubaid" };
const user: User = employee; // OK structurally
```

**Compiler behavior:** Assignability checks members (with rules for optionality, readonly, excess property checks in some contexts, function variance, etc.).

**Runtime behavior:** No runtime “User” vs “Employee” brand unless you invent one (branded types, classes, validation).

**Common misconception:** “Two interfaces with the same fields are still incompatible because names differ.”

**Practical consequence:** Accidental mix-ups of similarly shaped IDs/DTOs are easy — branded types or validation help when needed.

---

## F03 — `any` disables many safety checks

**Fact:** `any` opts out of useful checking; values of type `any` can flow almost anywhere and accept almost any operations (with caveats).

**Explanation:** `any` is an escape hatch and a contagion vector in large codebases.

**Code example:**

```ts
let value: any = "hello";
value.notARealMethod(); // no compile error
```

**Compiler behavior:** Much of the type system stops protecting you around `any`.

**Runtime behavior:** You still get normal JavaScript failures if the operation is invalid at runtime.

**Common misconception:** “`any` means dynamic typing like a smart runtime.”

**Practical consequence:** Prefer `unknown` + narrowing at boundaries; quarantine `any` when integrating untyped JS.

---

## F04 — `unknown` is safer than `any`

**Fact:** `unknown` is the type-safe top type for values you must not use until narrowed.

**Explanation:** Almost anything can be assigned *to* `unknown`, but `unknown` cannot be used freely without checks or assertions.

**Code example:**

```ts
let value: unknown = JSON.parse('{"a":1}');
// value.a; // error
if (typeof value === "object" && value !== null && "a" in value) {
  // narrowed usage patterns…
}
```

**Compiler behavior:** Forces narrowing (or an explicit assertion you should justify).

**Runtime behavior:** Still no automatic validation — your checks must be correct.

**Common misconception:** “`unknown` validates JSON.”

**Practical consequence:** Default catch variables and external data to `unknown`, then validate.

---

## F05 — `never` represents impossible values / non-returning paths

**Fact:** `never` is the bottom type: no values inhabit it. It appears for impossible states and functions that never return normally.

**Explanation:** Exhaustive checks use `never` to prove all union members were handled.

**Code example:**

```ts
function fail(message: string): never {
  throw new Error(message);
}
```

**Compiler behavior:** After `never`-returning calls, control flow treats following code as unreachable. Assigning a leftover union member to `never` fails if a case was missed.

**Runtime behavior:** Throwing / infinite loops are runtime phenomena; `never` is a compile-time description.

**Common misconception:** “`never` means `void` or `undefined`.”

**Practical consequence:** Use `assertNever` in switches over discriminated unions.

---

## F06 — `const` and literal inference interact strongly

**Fact:** `const` bindings of primitive literals often keep **literal types**; `let` usually widens to the general primitive type.

**Explanation:** Mutability signals that the value may change to other values of the widened type.

**Code example:**

```ts
const x = "hello"; // type: "hello"
let y = "hello";   // type: string
```

**Compiler behavior:** Widening rules + contextual typing + `as const` change results.

**Runtime behavior:** Identical JavaScript values; only the checker's knowledge differs.

**Common misconception:** “`const` makes the *value* immutable for objects” (objects are still mutable unless deeply frozen / readonly modeled).

**Practical consequence:** Prefer `as const` / literal unions for config and state machines.

---

## F07 — `as` does not convert or validate at runtime

**Fact:** A type assertion tells the checker to treat an expression as a type; it does not rewrite the value.

**Explanation:** Assertions can silence errors even when the runtime value is wrong.

**Code example:**

```ts
const data = JSON.parse("{}") as { userId: string };
// data.userId may be undefined at runtime
```

**Compiler behavior:** Relaxes / overrides checking (within assertion rules; some impossible assertions are still rejected).

**Runtime behavior:** No conversion, no check.

**Common misconception:** “Casting fixes the data.”

**Practical consequence:** Assert only when you have an independent reason to trust the type (or after validation).

---

## F08 — `satisfies` checks compatibility while preserving inference

**Fact:** `satisfies` verifies an expression matches a type without forcing the expression's type to become that wider annotated type (preserving narrower inference).

**Explanation:** Useful for config objects: validate shape, keep literal types.

**Code example:**

```ts
type Config = { mode: "dev" | "prod"; retries: number };
const config = { mode: "dev", retries: 3 } satisfies Config;
// config.mode is "dev", not "dev" | "prod"
```

**Compiler behavior:** Type-checks against `Config` while inferring from the value.

**Runtime behavior:** No runtime effect.

**Common misconception:** “`satisfies` is the same as `as Config`.”

**Practical consequence:** Prefer `satisfies` over assertions for config/tables when you want both checking and literals.

---

## F09 — Interfaces can participate in declaration merging

**Fact:** Multiple `interface` declarations with the same name in the same scope can merge members.

**Explanation:** Useful for extending lib types; dangerous if accidental.

**Code example:**

```ts
interface Box { width: number }
interface Box { height: number }
// Box has width and height
```

**Compiler behavior:** Merges compatible declarations.

**Runtime behavior:** No interface object exists at runtime.

**Common misconception:** “Interfaces always replace previous definitions like variables.”

**Practical consequence:** Know merging when reading DefinitelyTyped / ambient augmentation.

---

## F10 — Type aliases can express unions and intersections freely

**Fact:** `type` aliases name any type form, including unions, intersections, mapped, and conditional types.

**Explanation:** Interfaces are primarily for object-ish shapes and merging; aliases are the general naming tool for advanced types.

**Code example:**

```ts
type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };
```

**Compiler behavior:** Aliases are transparent for checking (with recursion/instantiation limits).

**Runtime behavior:** Erased.

**Common misconception:** “Always prefer interface” / “always prefer type” as dogma.

**Practical consequence:** Choose based on merging needs, union/intersection needs, and readability — not slogans.

---

## F11 — Generic constraints restrict type parameters

**Fact:** `T extends Constraint` limits what can be substituted for `T` and unlocks properties from the constraint.

**Explanation:** Constraints encode relationships between parameters (`K extends keyof T`).

**Code example:**

```ts
function getLength<T extends { length: number }>(value: T) {
  return value.length;
}
```

**Compiler behavior:** Rejects arguments not assignable to the constraint; inside the body, `T` has constraint members.

**Runtime behavior:** No generic object remains; only the function.

**Common misconception:** “Generics are just templates that generate runtime copies per type.”

**Practical consequence:** Constraints make generic APIs both safer and more useful.

---

## F12 — Conditional types can distribute over naked type parameters

**Fact:** A conditional type of the form `T extends U ? X : Y` **distributes** over unions when `T` is a naked type parameter.

**Explanation:** `ToArray<string | number>` can become `string[] | number[]` rather than `(string | number)[]`.

**Code example:**

```ts
type ToArray<T> = T extends any ? T[] : never;
type A = ToArray<string | number>; // string[] | number[]
```

**Compiler behavior:** Distribution is a defined checking rule; wrapping in a tuple (`[T] extends [U]`) can disable it.

**Runtime behavior:** N/A (type-level only).

**Common misconception:** “Conditionals always treat the whole union as one `T`.”

**Practical consequence:** Essential for utilities like `Exclude` / `Extract`; a frequent source of surprise.

---

## F13 — `keyof` produces a union of property keys

**Fact:** `keyof T` is a union of `T`'s known public property key types (string/number/symbol as applicable).

**Explanation:** Combined with indexed access, it enables type-safe property APIs.

**Code example:**

```ts
type User = { id: number; name: string };
type UserKeys = keyof User; // "id" | "name"
```

**Compiler behavior:** Depends on exact type of `T` (homomorphic mapped types, index signatures, etc. change results).

**Runtime behavior:** Erased — use `Object.keys` carefully; it is typed loosely for soundness reasons.

**Common misconception:** “`Object.keys(user)` returns `(keyof User)[]` with full safety.”

**Practical consequence:** Pair `keyof` with generics for safe getters; validate dynamic keys from outside.

---

## F14 — Indexed access types retrieve property types

**Fact:** `T[K]` yields the type of properties keyed by `K`.

**Explanation:** When `K` is a union, results combine appropriately.

**Code example:**

```ts
type User = { id: number; name: string };
type UserName = User["name"]; // string
```

**Compiler behavior:** Requires `K` to be assignable to `keyof T` (in strict, meaningful setups).

**Runtime behavior:** Erased; indexing at runtime is ordinary JS property access.

**Common misconception:** “`User['name']` runs at runtime.”

**Practical consequence:** Foundation for `Pick`, deep getters, and event maps.

---

## F15 — Mapped types transform properties

**Fact:** Mapped types iterate keys and build a new object type (`{ [K in keyof T]: ... }`).

**Explanation:** Modifiers (`?`, `readonly`, `-?`, key remapping via `as`) enable utilities like `Partial` / `Readonly`.

**Code example:**

```ts
type Optional<T> = { [K in keyof T]?: T[K] };
```

**Compiler behavior:** Homomorphic mapped types preserve modifiers in special ways; remapping changes keys.

**Runtime behavior:** Erased.

**Common misconception:** “Mapped types clone objects at runtime.”

**Practical consequence:** Build domain-specific utilities — but keep them readable.

---

## F16 — The type system is not a complete runtime validator

**Fact:** Types describe intent and enable checking of *your* TypeScript code; they do not authenticate external data.

**Explanation:** Trust boundaries need runtime validation that then produces typed values.

**Code example:**

```ts
// Bad: trust boundary with assertion only
const user = (await res.json()) as User;

// Better conceptual pipeline:
// unknown → validate → User
```

**Compiler behavior:** Happy if assertions / annotations say so.

**Runtime behavior:** Malicious or malformed payloads still flow.

**Common misconception:** “Strict mode means production data is safe.”

**Practical consequence:** Validate HTTP / JSON / env / DB / user input.

---

## F17 — JavaScript runtime behavior still determines execution

**Fact:** After emit, the program is JavaScript (plus host APIs). Types do not change runtime semantics of the program based on inferred types.

**Explanation:** TypeScript generally does not inject runtime behavior from type information alone (decorators/metadata and emit helpers are separate, config-dependent topics).

**Code example:** Same control flow and values run whether or not you annotated them, if emit is equivalent.

**Compiler behavior:** May downlevel syntax (`target`), emit helpers, elide type-only imports.

**Runtime behavior:** Engine + host execute JS.

**Common misconception:** “TypeScript is a different runtime.”

**Practical consequence:** Debug runtime bugs in JS terms; use types to prevent classes of bugs earlier.

---

## F18 — Type-only imports exist to erase cleanly

**Fact:** `import type` / `export type` mark imports used only in type positions so emit can omit them.

**Explanation:** Prevents runtime dependency on modules that only provide types; works well with `isolatedModules` / bundlers.

**Code example:**

```ts
import type { User } from "./types.js";
```

**Compiler behavior:** Type-only imports are elided in emit (with `verbatimModuleSyntax` / related flags affecting exact rules — learn flags in module 40).

**Runtime behavior:** No import of that binding if fully type-only.

**Common misconception:** “All TypeScript imports always remain in JS.”

**Practical consequence:** Use `import type` at API boundaries for types-only dependencies.

---

## F19 — Excess property checks are a special assignability case

**Fact:** Fresh object literals assigned to a non-generic target get extra checks for unknown properties.

**Explanation:** Helps catch typos in config objects; not the same as full deep structural rejection in every assignability scenario.

**Code example:**

```ts
type Options = { verbose?: boolean };
const o: Options = { verbose: true, verbos: true }; // error on fresh literal
```

**Compiler behavior:** Freshness / excess property checking applies in specific assignment contexts.

**Runtime behavior:** Extra properties would still exist if you bypassed the check.

**Common misconception:** “Structural typing always forbids extra properties.”

**Practical consequence:** Understand when excess property checks apply vs when wider values flow in.

---

## F20 — `private` (TS) ≠ `#private` (JS)

**Fact:** TypeScript `private` / `protected` are primarily compile-time visibility; `#field` is a JavaScript runtime private field.

**Explanation:** Emit for `private` still leaves an ordinary property unless you use `#`.

**Code example:**

```ts
class A {
  private x = 1; // compile-time privacy
  #y = 2;        // runtime privacy
}
```

**Compiler behavior:** Rejects external access to `private` in typed code.

**Runtime behavior:** `private` fields are still accessible via ordinary JS property access from outside if someone bypasses types; `#` is enforced by the engine.

**Common misconception:** “`private` hides the property in emitted JS.”

**Practical consequence:** Choose based on whether you need runtime encapsulation.

---

Add new facts as modules expand. Cross-link related entries in [`TYPE_SYSTEM_FACTS.md`](./TYPE_SYSTEM_FACTS.md).
