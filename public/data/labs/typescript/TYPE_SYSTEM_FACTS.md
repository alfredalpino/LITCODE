# Type System Facts

Facts about how TypeScript's type system reasons. Each entry includes a **compiler experiment** you should run.

Label carefully:

- **Language / type-system behavior** — what checking means
- **Compiler implementation detail** — may change between TypeScript versions

---

## TS01 — Structural subtyping

**Claim:** Assignability is primarily structural.

**Experiment:**

```ts
type A = { x: number };
type B = { x: number; y: string };
declare let a: A;
declare let b: B;
a = b; // OK
// b = a; // Error: missing y
```

**Predict:** Which assignment fails?  
**Run:** Put in a file and `npx tsc --noEmit`.

**Why:** `B` has at least `A`'s members; `A` does not have `B`'s.

---

## TS02 — Fresh literal excess property checking

**Claim:** Fresh object literals get extra property checks against the target type.

**Experiment:**

```ts
type Point = { x: number; y: number };
const p: Point = { x: 1, y: 2, z: 3 }; // Error
const q = { x: 1, y: 2, z: 3 };
const r: Point = q; // OK structurally (z survives at runtime)
```

**Predict:** Which lines error?  
**Insight:** Extra props can still exist at runtime when values flow through variables.

---

## TS03 — Widening vs literal preservation

**Claim:** `let` widens mutable primitive literals; `const` often preserves them.

**Experiment:**

```ts
const a = "on";
let b = "on";
type Mode = "on" | "off";
const ok: Mode = a;
// const bad: Mode = b; // Error: string not assignable to Mode
```

---

## TS04 — Contextual typing

**Claim:** Expected type context can influence inference of expressions (e.g., callbacks).

**Experiment:**

```ts
type Handler = (n: number) => void;
const h: Handler = (n) => {
  // n is number from context
  console.log(n.toFixed(2));
};
```

**Predict:** What is `n`'s type without an annotation?

---

## TS05 — Best common type (intuition)

**Claim:** Heterogeneous arrays infer a union (or other common type) rather than always `any`.

**Experiment:**

```ts
const arr = [0, 1, "two"];
// hover / inspect: (string | number)[]
```

Under `strict`, this is not `any[]`.

---

## TS06 — Narrowing is control-flow sensitive

**Claim:** Checks refine types along execution paths.

**Experiment:**

```ts
function len(x: string | string[] | null) {
  if (x === null) return 0;
  if (typeof x === "string") return x.length;
  return x.length; // string[]
}
```

**Predict:** Type of `x` in each branch.

---

## TS07 — Discriminated unions

**Claim:** A shared literal discriminant enables precise narrowing.

**Experiment:**

```ts
type Shape =
  | { kind: "circle"; r: number }
  | { kind: "square"; s: number };

function area(s: Shape) {
  switch (s.kind) {
    case "circle":
      return Math.PI * s.r ** 2;
    case "square":
      return s.s ** 2;
  }
}
```

---

## TS08 — Assignability is not always symmetric

**Claim:** `A` assignable to `B` does not imply `B` assignable to `A`.

**Experiment:** Use TS01 (`A`/`B` with extra fields) and also function parameter positions (variance) in later modules.

---

## TS09 — Function parameter compatibility (preview)

**Claim:** Parameter positions are checking-sensitive under `strictFunctionTypes` (contravariant for function types in many cases). Methods historically had different bivariant behavior — learn precisely in modules 38–39.

**Experiment (preview):**

```ts
type F = (x: string | number) => void;
type G = (x: string) => void;
declare let f: F;
declare let g: G;
// Which assignments fail under strict?
```

Do not memorize slogans — run experiments when you reach variance modules.

---

## TS10 — `unknown` is a safe top; `never` is bottom

**Claim:** Every type is assignable to `unknown`. `never` is assignable to every type; only empty/impossible values inhabit `never`.

**Experiment:**

```ts
let u: unknown;
// let s: string = u; // Error
u = "ok";

function absurd(x: never): string {
  return x; // ok: never assignable to string
}
```

---

## TS11 — Distributive conditional types

**Claim:** Naked type-parameter conditionals distribute over unions.

**Experiment:**

```ts
type Wrap<T> = T extends any ? { v: T } : never;
type W = Wrap<string | number>;
// { v: string } | { v: number }

type NoDistribute<T> = [T] extends [any] ? { v: T } : never;
type N = NoDistribute<string | number>;
// { v: string | number }
```

---

## TS12 — Generic inference seeks candidates from arguments

**Claim:** Calling `identity(42)` can infer `T = number` (often literal then widen depending on context).

**Experiment:**

```ts
function identity<T>(value: T): T {
  return value;
}
const a = identity("hi");
const b = identity(Math.random() > 0.5 ? "a" : 1);
```

**Predict:** Types of `a` and `b`.

---

## TS13 — Constraints unlock members and restrict callers

**Claim:** `T extends { length: number }` both rejects bad arguments and allows `.length` in the body.

**Experiment:** `getLength(true)` should fail; `getLength([1,2])` should work.

---

## TS14 — Recursive type aliases model nested data

**Claim:** Type aliases may recurse through object/array members (with compiler limits).

**Experiment:**

```ts
type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue };
```

---

## TS15 — Type complexity has DX cost

**Claim:** Extremely deep conditional/recursive types can slow the checker and worsen errors.

**Experiment:** Later performance module — for now, prefer readable types that prevent real bugs.

**Discipline:** If a type takes longer to understand than the runtime code it protects, redesign.

---

## How to add entries

When you discover a surprising assignability / inference rule:

1. Minimal snippet
2. Predict
3. `tsc --noEmit`
4. Write Fact + Experiment here
5. Link related [`TYPESCRIPT_FACTS.md`](./TYPESCRIPT_FACTS.md) entry
