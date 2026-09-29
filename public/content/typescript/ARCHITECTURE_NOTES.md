# Architecture Notes

How TypeScript supports application architecture — without pretending types replace design.

---

## Core idea

Types are most valuable at **boundaries**:

```text
Untrusted world          Trusted core
───────────────          ────────────
HTTP / JSON      → validate →  Domain types
Env / argv       → parse    →  Config types
DB rows          → map      →  Domain entities
Third-party APIs → adapt    →  Anti-corruption layer
UI events        → narrow   →  Intent / commands
```

Inside a module, inference can stay light. Across modules, contracts should be explicit.

---

## Layer sketch (backend)

```text
Routes / Controllers
        │  DTOs + validation
        ▼
    Services  (domain types)
        │
        ▼
   Repositories  (persistence types)
        │
        ▼
     Database
```

| Layer | Type focus |
|---|---|
| Transport | Request/response DTOs, status codes, error shapes |
| Domain | Entities, value objects, results, invariants |
| Persistence | Row shapes, query results — **not** assumed identical to domain |
| Shared contracts | Packages/types consumed by FE and BE carefully versioned |

**Production Insight:** A TypeScript type for a DB row does not guarantee the database schema matches. Migrations and runtime checks still matter.

---

## DTO vs domain

- **DTO:** shape of data crossing a boundary (API JSON, message payload)
- **Domain model:** shape optimized for business rules

Mapping functions are feature, not boilerplate waste — they are the trust adapter.

---

## Error modeling across layers

Prefer explicit models at boundaries:

- Discriminated error unions for expected failures
- `Result` / typed errors for domain operations where it clarifies control flow
- Exceptions for truly unexpected failures (judgment call — be consistent)

Caught values are `unknown` under modern strict settings — narrow before use.

---

## Frontend architecture (typed)

```text
UI state (discriminated)
   │
   ▼
Typed API client (contracts)
   │
   ▼
Validation of responses (runtime)
   │
   ▼
View models
```

Do not trust `fetch` JSON because a generic says `Promise<User>`.

---

## Dependency inversion with types

Define ports as types/interfaces in the domain; implement adapters in infrastructure.

```ts
interface UserRepository {
  findById(id: UserId): Promise<User | null>;
}
```

**Runtime Insight:** The interface is erased; the object implementing the methods is what runs. Types ensure the adapter matches the port at compile time.

---

## Library architecture

For a publishable TS library:

- Clear **public API** surface (`exports` / barrel carefully)
- Internal modules not part of semver surface
- Emitted `.d.ts` is what consumers type-check against
- Tests for runtime + type tests for public generics

Consumers see declarations + JS. They do not see your private types unless you export them.

---

## Anti-architecture (types edition)

- One giant `types.ts` dumping ground with no ownership
- Sharing DB row types directly as public API responses
- Cross-importing UI types into persistence
- “God” generic that parametrizes the entire app
- Encoding all business rules only in types no human can read

---

## Decision checklist for new types

1. Is this a boundary or an internal convenience?
2. What is trusted vs untrusted here?
3. What invalid states should be unrepresentable?
4. What must still be validated at runtime?
5. Will this type slow understanding more than it prevents bugs?

Write ADRs in later capstone modules when decisions become sticky.
