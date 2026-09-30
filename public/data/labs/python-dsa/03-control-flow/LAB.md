# Lab — Control flow

A program is a sequence of operations, but the sequence is not “every line, top to bottom, once”. Conditions skip work. Loops repeat work. Short-circuit operators skip operands. The computer-science point under this module is evaluation order: you should be able to say which operations run, how many times, and which state is true at the start of each iteration.

That last sentence is a loop invariant in embryonic form. Binary search and BFS will depend on you being able to say it precisely. Here the state is small enough to track by hand.

---

## 1. What counts as true

`if` and `while` do not require a `bool`. They ask the object whether it is true.

**Predict** `True` or `False` for each:

```python
bool(None)
bool(False)
bool(0)
bool(0.0)
bool("")
bool([])
bool({})
bool(set())
bool("0")
bool("False")
bool([0])
bool([False])
bool(1)
bool(" ")
```

Run:

```bash
python3 experiments/01_truthiness.py
```

The rule worth keeping: `None`, `False`, numeric zero, and empty containers are false. Everything in that list’s second half is true, including containers whose elements are false, and strings whose text is the word false.

**Modify.** Add `bool(())` and `bool(range(0))`. Predict first. An empty range is empty.

---

## 2. `and` and `or` are control flow

They return one of the operands. They do not wrap it in `bool`. They do not evaluate the right operand when the left one already decides the result.

**Predict** what is printed and what the expression evaluates to.

```python
0 and print("left") or print("right")
1 and print("left") or print("right")
"" or "anon"
0 or 5
```

Run:

```bash
python3 experiments/02_short_circuit.py
```

`print` returns `None`. That return value is the operand the operator yields. This is why the first expression’s value is `None` even though something was printed.

**Modify.** You want a default only when `name` is `None`, not when it is `""` or `0`. Write the condition with `is None`. Predict `backup(None)`, `backup("")`, and `backup(0)` before you run your function. The `or` form treats all three as missing. That is a real bug in production code, and it comes from this section, not from carelessness about strings.

---

## 3. Loops, `break`, and `else`

`for` and `while` may take an `else`. The `else` suite runs when the loop finishes without `break`. It does not mean “else, each time the `if` failed”. An `else` indented under the `if` is a different statement.

**Predict** the prints.

```python
def search(xs, target):
    for item in xs:
        if item == target:
            print("found", item)
            break
    else:
        print("missing")

search([1, 2, 3], 2)
search([1, 2, 3], 9)
search([], 1)
```

Run:

```bash
python3 experiments/03_loop_else.py
```

The empty list never `break`s, so the `else` runs. That surprises people who think `else` means “the sequence was non-empty and we failed”.

**Modify.** Rewrite `search` with a flag variable and no `else`. It should print the same lines. The flag version makes the state explicit. The `else` version is the same state, stored in “did we break”.

---

## 4. Counting work

```python
def pair_count(n):
    count = 0
    for i in range(n):
        for j in range(i):
            count += 1
    return count
```

**Predict** `pair_count(0)`, `pair_count(1)`, `pair_count(4)`, and a closed form in `n`.

Run:

```bash
python3 experiments/04_pair_count.py
```

The body runs `0 + 1 + ... + (n - 1)` times. That sum is `n(n - 1) / 2`, which is Θ(n²). The constant `1/2` does not create a cheaper class. This is the derivation in `COMPLEXITY_REFERENCE.md`, done with an actual counter so you can see the number.

**Modify.** Change the inner loop to `range(n)`. Predict the new closed form before you run it. Then change it to `range(i, n)` and predict again.

---

## 5. Pattern matching, only as syntax

`match` compares a value to patterns, top to bottom, and runs the first suite that fits. It does not make an algorithm. It is another way to write a conditional.

**Predict** the label for `0`, `[1, 2]`, `[1, 2, 3]`, and `"0"`.

```python
def classify(value):
    match value:
        case 0:
            return "zero"
        case [x, y]:
            return "pair"
        case _:
            return "other"
```

Run:

```bash
python3 experiments/05_match.py
```

`case [x, y]` matches a sequence of length 2. It does not match a longer list, and it does not parse the string `"0"` as the integer `0`. Order matters: a wildcard first would swallow everything. That is the same discipline as `except Exception` before a specific exception, which belongs to the exceptions module later. The habit starts here: specific case first.

---

## 6. Break it

`debug/contains.py` is supposed to report whether `target` occurs anywhere in the list.

Run:

```bash
python3 debug/contains.py
```

One of the checks fails immediately. Do not “fix” it by testing only the first element in the examples.

Write:

1. On which input does it return the wrong answer?
2. Which `else` is running, the loop’s or the `if`’s?
3. What does the function return on `[1, 2, 3]` looking for `1`, and why does that result hide the bug?

---

## 7. Exercises

`exercises/EXERCISES.md`.

---

## Checkpoint

- Falsy: `None`, `False`, zero, empty containers. `[0]` and `"0"` and `"False"` are true.
- `and` / `or` return operands and skip the side that does not need to run.
- Loop `else` runs when the loop did not `break`.
- You can count nested iterations and simplify the sum.
- `match` is ordered conditional structure, not a search algorithm.
