# Solutions — module 00

Open this after a written attempt. If your run on a different Python version disagrees with a CPython detail below, trust your run for the implementation detail and keep the language point.

Checked on CPython 3.14.7.

---

## Predictions from LAB.md

### Section 1 — phases

- A missing colon is a `SyntaxError` while compiling. The function is never created.
- A missing name inside a function body does not fail at compile time. The name is stored and looked up when that instruction runs. The call raises `NameError`.
- Adding a string to an integer is a `TypeError` when the addition instruction runs.

`experiments/04_when_errors_happen.py` compiles `missing_colon` unsuccessfully, compiles and defines `missing_name`, and fails on the call. `runs_cleanly` returns 3.

### Section 2 — `dis` output changing

The implementation’s instruction set changed. The language did not. Return values are a language-level behavior. Opcode names are not.

### Section 3 — AST of `answer = 1 + 2`

One `Assign`. The target name `answer` is a `Store`. The value is a `BinOp` with `Add`, left constant `1`, right constant `2`.

For `1 + 2 * 3`, the parent operator is addition. The right child is a multiplication of `2` and `3`. The parser uses precedence. Evaluation has not run.

### Section 4 — `def f(n): return n + 1`

On CPython 3.14.7:

- `n` is in `co_varnames` only.
- `1` is in `co_consts`.
- `co_names` is empty.

You may also see `LOAD_SMALL_INT` in the disassembly. The constant can still appear in `co_consts`. Do not treat the opcode list as stable.

`def g(a): return a + missing` defines `g` without error. `missing` is in `co_names`. The `NameError` waits for a call that actually loads it.

### Section 5 — rewrite

Replacing each `2` with `10` makes the tree mean `answer = 10 + 10`, so `answer` is `20`. Replacing with `7` yields `14`.

### Section 6 — rebinding

```python
x = 1
x = "a"
y = x + 1
```

Line 1 binds `x` to an int. Line 2 rebinds `x` to a str. Line 3 raises `TypeError`. Dynamic typing allowed line 2. Strong checking rejected line 3.

---

## Debug — `same_object.py`

**What fails.** `int("257") is int("257")` and `int("-6") is int("-6")` are false. `==` is true for every pair. `0`, `256`, and `-5` are the same object across the two calls, on this CPython.

**Why some pass.** CPython keeps one shared object for each integer from `-5` through `256` inclusive. That is a cache, not a language rule. `-6` and `257` are outside it, so each `int(...)` call builds a new object.

**Why the claim is wrong.** The language guarantees that equal integers compare equal with `==`. It does not guarantee they are one object. A correct check is `a == b`. Using `is` for numeric value is a bug that happens to pass inside the cache, which is why the author’s tests looked partly green.

**A trap inside one function.** `257 is 257` written as one expression can be true, because both literals are the same constant on one code object. That still does not make `is` a value test. The debug file uses `int(text)` so the integers are created independently.

**What not to do.** Do not prebuild a dict of integers so that `is` starts passing. That hides the bug in the claim.

---

## Exercises

### E1

Stages worth naming:

1. The operating system reads the file bytes. Not a Python rule.
2. CPython decodes the source (UTF-8 by default).
3. It tokenizes and parses. Illegal syntax stops here (`SyntaxError`).
4. It builds an AST.
5. It compiles to a code object. CPython’s bytecode and `__pycache__` are implementation details. Another Python may compile differently.
6. The evaluation loop runs the code object. `1 + 2` creates an int `3`. `print` writes it.

Language: syntax, the meaning of `+` on ints, the meaning of a call to `print`. CPython: this bytecode, the `.pyc` cache, the opcode names.

### E2

| Snippet | Error | Phase |
| --- | --- | --- |
| `a` | `TypeError` | call, at the `+` |
| `b` | `SyntaxError` | compile; `b` is never defined |
| `c` | `NameError` | call |
| `d` | no error | returns `"a"` |

Defining `a` and `c` succeeds. The bodies are not running yet.

### E3

| Table | Contents |
| --- | --- |
| `co_varnames` | `left`, `right` |
| `co_consts` | includes `100` |
| `co_names` | `extra` |

`100` is a constant. `extra` is a global load, recorded at compile time and resolved at run time, so definition succeeds and a call raises `NameError` until some `extra` exists in the global namespace. Exact `co_consts` tuple layout can include other implementation constants; `100` will be among them. Check with `mix.__code__` rather than arguing with a printout.

### E4 — a solid interview answer

“A `.py` file is text. CPython parses it into an abstract syntax tree, compiles that to a code object, and then an evaluation loop executes the instructions, creating objects and binding names. Syntax errors are raised while parsing or compiling. A misspelled name inside a function is stored in the code object and raises `NameError` only when that load runs. Bytecode and `.pyc` files are how CPython implements this. The language specifies the behavior, not those opcodes. Another implementation has to match the behavior and can compile differently.”

Follow-up: “The GIL is a lock in the default CPython build, not a Python language rule, and it is not why a quadratic loop is slow. The loop’s complexity dominates. Threads on a GIL build also would not turn that algorithm into a linear one.”

Then stop.
