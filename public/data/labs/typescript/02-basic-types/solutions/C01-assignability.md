# C01 Assignability — answers

| # | YES/NO | Why |
|---|---|---|
| 1 | YES | `any` is assignable to everything (escape hatch) |
| 2 | NO | `unknown` must be narrowed |
| 3 | YES | `never` is assignable to every type |
| 4 | NO | under `strictNullChecks` |
| 5 | YES | everything assignable to `unknown` |
| 6 | YES | including `null` |
| 7 | YES | `any` accepts anything |
| 8 | NO | primitives ≠ `object` |
| 9 | YES | non-nullish values generally assignable to `{}` |
| 10 | NO | nullish not assignable to `{}` |
| 11 | NO | only `never` values inhabit `never` |
| 12 | YES conceptually | functions with no return produce `undefined` at runtime; annotated `void` |

Verify by uncommenting lines in experiment 05.
