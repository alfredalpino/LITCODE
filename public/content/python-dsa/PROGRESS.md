# Progress

Mark a line only when you can do it without the lab open. Reading is not completion.

Difficulty of the built work: modules 00–03 are ★ to ★★★. The interview prompts at the end of each lab are the ★★★ items.

---

## 00 — Python runtime

- [ ] I can draw source → parse → AST → compile → code object → execution
- [ ] I ran `experiments/01_ast_dump.py` after writing a prediction
- [ ] I ran `experiments/02_disassemble.py` after writing a prediction
- [ ] I ran `experiments/03_code_object.py` and can say where `n` and `1` live
- [ ] I can point at one error that is raised at compile time and one that is raised at run time
- [ ] I changed a constant in the AST experiment and predicted the new value before running
- [ ] I diagnosed `debug/same_object.py` in writing before opening solutions
- [ ] I answered the interview prompt out loud
- [ ] I filled a learning-log entry

## 01 — Values and types

- [ ] I can classify the core built-ins by mutable / immutable and hashable / unhashable
- [ ] I predicted `True + True`, `{True, 1, 1.0}`, and `bool("False")` before running
- [ ] I can say why a list cannot be a dict key and why a tuple of lists cannot either
- [ ] I diagnosed `debug/distinct_count.py` before opening solutions
- [ ] I finished the small exercise and the harder variation
- [ ] I filled a learning-log entry

## 02 — Bindings and mutability

- [ ] I can explain `a = [1, 2, 3]; b = a; c = a.copy()` using objects and names
- [ ] I predicted the nested shallow-versus-deep copy before running
- [ ] I can predict `p += [2]` versus `p = p + [3]` for a shared list
- [ ] I diagnosed `debug/zeros_grid.py` before opening solutions
- [ ] I finished both exercises
- [ ] I filled a learning-log entry

## 03 — Control flow

- [ ] I can list the truth value of `[]`, `0`, `"0"`, `None`, and `[0]`
- [ ] I predicted the short-circuit experiment, including what does not print
- [ ] I can say what loop-`else` means
- [ ] I counted the iterations of the triangular loop on paper
- [ ] I diagnosed `debug/contains.py` before opening solutions
- [ ] I finished both exercises
- [ ] I filled a learning-log entry

---

## Review schedule

Do the task. Do not reread the lab unless you are stuck after an attempt.

### Day 1 — same day as you finish a module

Rewrite the module’s one-sentence model from memory, then rerun one experiment you change yourself.

| Module | Rewrite this sentence in your own words | Then change and rerun |
| --- | --- | --- |
| 00 | A `.py` file is text; CPython compiles it to a code object and interprets that | Change the integer in `experiments/05_rewrite_constant.py` |
| 01 | `==` asks about value; `is` asks about object identity; hashability is about usable dict keys | Add one value to `experiments/03_hashability.py` |
| 02 | Assignment binds a name; methods like `append` mutate the object other names may already see | Add a third level of nesting to the copy experiment |
| 03 | `and` / `or` return operands and may skip the right-hand side; `else` on a loop runs when the loop did not `break` | Change the target in `debug/contains.py`’s examples only after you understand the bug |

### Day 3

- 00: Without `dis`, list `co_varnames`, `co_consts`, and `co_names` for `def add(a, b): return a + b + 10`. Then check.
- 01: On paper, what is `len({0, False, 0.0})` and why?
- 02: Draw the objects after `row = [0, 0]; grid = [row, row]; grid[0][1] = 7`.
- 03: What does this print, and what is `flag`?

```python
flag = [] and "yes" or "no"
```

### Day 7

- Explain to an empty room the difference between a `SyntaxError` and a `NameError`.
- Implement `distinct_count` so that `True` and `1` count as different if the problem says they are different. Say what you gave up.
- Write a `zeros(rows, cols)` that returns independent rows. Prove independence by setting one cell.
- Write `contains` correctly, then write a version that uses loop-`else` on purpose.

### Day 14

Timed, 20 minutes, no solutions folder:

1. Read a 10-line function and say whether each name is local, global, or a constant load. (Full LEGB is module 05; here, just “local versus not”.)
2. Find one complexity bug: a loop that uses `x in some_list` on every iteration. State the cost. The reference is `COMPLEXITY_REFERENCE.md`.
3. A function receives a list and “clears” it by assigning `[]` to the parameter. Explain why the caller still sees the old list.

### Day 30

Mixed, 45 minutes:

1. Draw the execution pipeline.
2. Given an object, decide: mutable? hashable? iterable? callable? Say what each decision allows.
3. Given a nested structure, predict `copy.copy` versus `copy.deepcopy` after one inner mutation.
4. Given a loop, count iterations and point at the off-by-one risk.
5. Explain one fact from `PYTHON_FACTS.md` and one from `DSA_FACTS.md` without looking, then check.

---

## Log

| Date | Module | Result | Review due |
| --- | --- | --- | --- |
| | | | |
