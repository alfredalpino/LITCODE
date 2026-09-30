# Type Patterns

Production-oriented patterns. Each entry:

```text
Problem
Type-level idea
Implementation
Why it works
Runtime behavior
Trade-offs
Production use
Anti-pattern
```

Expand as you complete later modules. Prefer clarity over cleverness.

---

## P01 — Discriminated union state

**Problem:** Invalid UI/async state combinations.

**Type-level idea:** Model only legal states with a shared literal tag.

**Implementation:**

```ts
type RequestState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: Error };
```

**Why it works:** Narrowing on `status` unlocks the right fields.

**Runtime behavior:** Ordinary objects; tag must be set correctly at runtime.

**Trade-offs:** Slightly more verbose updates; far fewer impossible states.

**Production use:** Data fetching, forms, connection status.

**Anti-pattern:** Optional `data?` / `error?` / `loading?` soup.

---

## P02 — Result type

**Problem:** Errors as untyped exceptions across layers.

**Type-level idea:** Make success/failure explicit in the type.

**Implementation:**

```ts
type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };
```

**Why it works:** Callers must handle both branches (if they respect the type).

**Runtime behavior:** Plain objects; no magic.

**Trade-offs:** Verbosity; doesn't replace all exceptions (e.g., truly unexpected bugs).

**Production use:** Parsing, domain operations, partial failure pipelines.

**Anti-pattern:** `Result` everywhere including trivial getters.

---

## P03 — Exhaustive `assertNever`

**Problem:** Adding a union member silently breaks switches.

**Type-level idea:** Remaining value must be `never`.

**Implementation:**

```ts
function assertNever(value: never): never {
  throw new Error(`Unexpected: ${JSON.stringify(value)}`);
}
```

**Why it works:** Compiler errors when a case is missing; runtime throw if data violates the model.

**Runtime behavior:** Only runs if an unexpected value appears.

**Trade-offs:** Need discipline to call it in default branches.

**Production use:** Reducers, protocol handlers, state machines.

**Anti-pattern:** Empty `default: break` with no exhaustiveness check.

---

## P04 — Branded IDs

**Problem:** Mixing `userId` and `orderId` strings.

**Type-level idea:** Intersect with a unique phantom brand.

**Implementation:**

```ts
type UserId = string & { readonly __brand: "UserId" };
type OrderId = string & { readonly __brand: "OrderId" };
```

**Why it works:** Structural conflict on the brand property at compile time.

**Runtime behavior:** Still strings; brand erased. Validate/parse at boundaries.

**Trade-offs:** Ceremony; need constructors/parsers.

**Production use:** Multi-id domains, money/currency codes, permissions tokens.

**Anti-pattern:** Brand via `as` without validation on untrusted input.

---

## P05 — `satisfies` for config tables

**Problem:** Want literal inference **and** shape checking.

**Type-level idea:** `satisfies` preserves narrow inference while verifying a contract.

**Implementation:**

```ts
const routes = {
  home: "/",
  user: "/users/:id",
} as const satisfies Record<string, string>;
```

**Why it works:** Checks assignability without widening to the annotation alone.

**Runtime behavior:** None beyond the object.

**Trade-offs:** Need familiarity on the team.

**Production use:** Route maps, feature flags metadata, event name tables.

**Anti-pattern:** `as Config` that widens away literals you needed.

---

## P06 — Type-safe event map (sketch)

**Problem:** `emit("login", wrongPayload)`.

**Type-level idea:** Map event names to payload types; generic `emit`/`on`.

**Implementation:** (derive in module 56–57)

```ts
type Events = {
  login: { userId: string };
  logout: { userId: string };
};
```

**Why it works:** `K extends keyof Events` ties name to payload.

**Runtime behavior:** Map/listeners like any emitter; types erased.

**Trade-offs:** Harder dynamic event names.

**Production use:** Analytics, domain events, WS message routers.

**Anti-pattern:** `emit(event: string, payload: any)`.

---

## P07 — Readonly domain boundaries

**Problem:** Accidental mutation of shared domain objects.

**Type-level idea:** `Readonly<T>` / `readonly` props / readonly arrays at API edges.

**Implementation:**

```ts
function publish(users: readonly User[]): void {
  // users.push(...) // error
}
```

**Why it works:** Prevents local mutation through that alias (shallow).

**Runtime behavior:** Readonly is mostly compile-time; arrays still mutable if cast away.

**Trade-offs:** Shallow by default; deep readonly can be noisy.

**Production use:** Public library APIs, Redux-like states, shared caches.

**Anti-pattern:** Deep readonly everywhere with no mutation strategy.

---

## Pattern discipline

Before adding a pattern, answer:

1. What bug class does this prevent?
2. What does runtime still need to enforce?
3. Can a simpler union/interface do it?
4. Will juniors understand this in code review?

If answers are weak, don't add the pattern yet — add a test and a clearer model first.
