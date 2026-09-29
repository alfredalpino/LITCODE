# Common Mistakes

Mistakes seen in real TypeScript codebases and interviews. For each: symptom → why it's wrong → better approach → anti-fix to avoid.

---

## M01 — Treating types as runtime validation

**Symptom:** `as User` on `response.json()` and shipping.

**Why wrong:** Assertions do not validate. Malformed payloads pass the type checker.

**Better:** Validate unknown data → produce a `User` (schema, manual guards, parsers).

**Anti-fix:** More assertions.

---

## M02 — Defaulting to `any`

**Symptom:** `any` to silence errors; contagion across modules.

**Why wrong:** Disables the reason you adopted TypeScript.

**Better:** `unknown` + narrowing; proper generics; fix the model.

**Anti-fix:** `eslint-disable` forever without a quarantine plan.

---

## M03 — Using `as` / `!` as a first resort

**Symptom:** Non-null assertions on optional chains; cast to make `.map` compile.

**Why wrong:** Hides the real uncertainty.

**Better:** Narrow, redesign types, handle empty/missing cases.

**Anti-fix:** Ban forever without understanding justified cases (e.g., after a proven invariant).

---

## M04 — Optional boolean soup instead of discriminated unions

**Symptom:**

```ts
type State = {
  loading?: boolean;
  error?: string;
  data?: User[];
};
```

**Why wrong:** Invalid combinations are representable (`loading` + `data` + `error`).

**Better:** Discriminated union of valid states.

---

## M05 — Confusing `interface` erasure with class identity

**Symptom:** Expecting `instanceof` to work with an interface.

**Why wrong:** Interfaces do not exist at runtime.

**Better:** Classes, brands + validation, or schema tags.

---

## M06 — Believing `private` is runtime-safe

**Symptom:** Relying on TS `private` for security boundaries.

**Why wrong:** Emit still exposes ordinary properties; privacy is compile-time for TS keyword.

**Better:** `#private` for runtime encapsulation; never treat visibility as authz.

---

## M07 — Annotating everything (noise) or nothing (mystery APIs)

**Symptom:** Either wall-of-annotations or exported functions with opaque inference.

**Why wrong:** Extremely local inference is fine; **public boundaries** need clear contracts.

**Better:** Infer internals; annotate exports / API boundaries deliberately.

---

## M08 — Over-engineered conditional types for simple problems

**Symptom:** 80-line type to replace a 5-line function + clear union.

**Why wrong:** DX, compile times, and onboarding suffer.

**Better:** Simplest type that prevents real bugs; extract helpers with names.

---

## M09 — Ignoring `strictNullChecks` fallout with `!`

**Symptom:** `document.getElementById("x")!` everywhere.

**Why wrong:** Element may be missing; assertion lies.

**Better:** Handle `null`; create element; or assert once after a real guarantee.

---

## M10 — Trusting `Object.keys` as `keyof T`

**Symptom:** Assuming keys are exactly `keyof T` and indexing freely.

**Why wrong:** Objects may have excess keys; TypeScript types `Object.keys` defensively.

**Better:** Iterate known keys; validate; use typed entries helpers carefully.

---

## M11 — Mixing branded types without runtime checks

**Symptom:** `UserId` brand asserted at every boundary.

**Why wrong:** Brand is compile-time only.

**Better:** Parse/validate at edges; brand after success.

---

## M12 — Enum default without considering alternatives

**Symptom:** Numeric enums for stringly API protocols.

**Why wrong:** Reverse mappings, emit size, and readability trade-offs often unwanted.

**Better:** Compare string enums vs `as const` + union types for the use case.

---

## M13 — Path mapping without runtime mapping

**Symptom:** `paths` in tsconfig work in `tsc` / IDE but break at Node runtime.

**Why wrong:** Compile-time resolution ≠ Node resolution unless tooling mirrors it.

**Better:** Align bundler/Node with paths, or use relative/package imports.

---

## M14 — Catching errors as `any`

**Symptom:** `catch (e: any)` then `e.message`.

**Why wrong:** Thrown values are unknown; under modern strict settings prefer `unknown`.

**Better:** `unknown` + narrowing (`instanceof Error`, custom guards).

---

## M15 — “It compiles, so it's correct”

**Symptom:** Skipping tests because types passed.

**Why wrong:** Types don't prove business logic, concurrency, or I/O correctness.

**Better:** Types + runtime tests + validation at trust boundaries.

---

Add mistakes you personally make to this file. Link fixes to modules you complete.
