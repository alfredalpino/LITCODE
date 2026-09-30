# Glossary

Precise terms for this laboratory. Prefer these over vague metaphors.

---

## Assignability

Whether a value of type `S` may be used where type `T` is expected, according to TypeScript's checking rules (structural compatibility, variance, freshness, etc.).

## Assertion (type assertion)

A compile-time claim (`expr as T` or `<T>expr`) that changes how the checker treats an expression. **Not** a runtime conversion or validation.

## Ambient declaration

A declaration that describes types for values that exist elsewhere (globals, untyped modules), often in `.d.ts` files via `declare`.

## Binder (compiler pipeline)

**Implementation detail:** compiler stage that connects declarations and usages (symbols / scopes) before/alongside checking. Pipeline labels can evolve across TypeScript versions.

## Branded / opaque type

A type that is structurally based on a primitive/object but intersects with a unique phantom property so accidental mixing of similarly shaped values fails at compile time. Brands are usually erased; runtime validation still needed at boundaries.

## Conditional type

`T extends U ? X : Y` — chooses a type based on a type relationship. May be **distributive** over unions when `T` is a naked type parameter.

## Contextual typing

Inference influenced by the expected type of an expression's surrounding context (e.g., callback parameters).

## Declaration file (`.d.ts`)

TypeScript file containing types/ambient declarations without full runtime implementation (or alongside JS).

## Discriminated union

A union of object types sharing a common literal property (the discriminant) used for narrowing.

## Emit / emission

The JavaScript (and optionally declaration) output produced by `tsc` (or other compilers/transpilers).

## Excess property check

Extra checking applied to fresh object literals to catch unknown properties relative to a target type.

## Gradual typing

A typing discipline allowing mixtures of typed and untyped (`any` / JS interop) regions. TypeScript is often described this way in practice.

## Indexed access type

`T[K]` — the type of properties of `T` keyed by `K`.

## Inference

The checker filling in types you did not annotate (return types, generic arguments, contextual parameter types, etc.).

## `infer`

Keyword inside conditional types that introduces a type variable to be inferred from a matched pattern.

## `keyof`

Operator producing a union of keys of a type.

## Literal type

A type consisting of a single concrete primitive value (e.g., `"success"`, `2`, `true`).

## Mapped type

Object type constructed by iterating keys: `{ [K in Keys]: ... }`.

## Narrowing

Refining a type along a control-flow path based on checks (typeof, equality, `in`, predicates, etc.).

## Nominal typing

Compatibility based on explicit type identity / branding rather than shape alone. TypeScript is primarily structural; brands simulate nominality.

## `satisfies`

Operator that type-checks an expression against a type while generally preserving the expression's inferred (often narrower) type.

## Structural typing

Compatibility based on shape (members), not declared name.

## Type erasure

Removal of type-only constructs during emit so runtime JS does not retain those types.

## Type guard

A check that narrows types. User-defined guards use predicates: `value is Type`. Predicates do not magically validate unless the runtime check is correct.

## Type parameter (generic)

A placeholder type (`T`) instantiated by inference or explicit arguments.

## Union / intersection

`A | B` — value assignable to at least one constituent (set of possibilities).  
`A & B` — value assignable to both (must satisfy all constraints).

## Variance

How type constructors (e.g., function types, arrays, generics) relate when their type arguments relate — covariance, contravariance, invariance, bivariance (historical/special cases). Study with experiments; slogans alone mislead.

## Widening

Inference step that generalizes a literal/mutable binding to a broader type (e.g., `"hello"` → `string` for `let`).

## `unknown` / `any` / `never` / `void`

| Type | Intuition |
|---|---|
| `unknown` | Safe top — must narrow before use |
| `any` | Escape hatch — opt out of checking |
| `never` | Bottom — impossible / non-returning |
| `void` | Absence of a meaningful return value in function types (not identical to `undefined` in all positions) |

---

Add terms as modules introduce them. Keep definitions falsifiable and short.
