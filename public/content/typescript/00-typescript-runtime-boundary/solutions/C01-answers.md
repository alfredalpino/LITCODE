# C01 Answers

Open only after serious attempts.

## A — NO

`string` is not assignable to `number`.

## B — NO (typically)

Fresh object literal `{ name, age }` assigned to `Animal` triggers **excess property check** on `age`.

## C — YES

`wider` is not a fresh literal in that assignment position; structural typing allows assignability when required props are present. Extra `age` remains at runtime on the object.

## D — Call without ignore: NO

`number` is not assignable to `string`.  
If JS calls `f(42)` anyway, runtime may throw when calling `toUpperCase` on a number (or coerce depending on how you wrote the body — with `.toUpperCase()` it throws).

---

**Takeaway:** Compile-time rejection and runtime behavior are different layers. Structural typing + excess property checks are easy to confuse.
