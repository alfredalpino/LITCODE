# What Exists at Runtime?

For each construct: **erased**, **emitted**, or **depends on config**. Then verify with emit.

---

## R001

```ts
interface User { name: string }
type Id = string
function id<T>(x: T): T { return x }
enum E { A = "a" }
class C {}
const u = { name: "x" } as User
```

| Piece | Runtime? |
|---|---|
| `interface User` | |
| `type Id` | |
| `<T>` on `id` | |
| `id` function | |
| `enum E` | |
| `class C` | |
| `as User` | |

Reveal: [`solutions/R001.md`](./solutions/R001.md)
