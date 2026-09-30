# Solutions — module 03

---

## LAB predictions

### Truthiness

False: `None`, `False`, `0`, `0.0`, `""`, `[]`, `{}`, `set()`.

True: `"0"`, `"False"`, `[0]`, `[False]`, `1`, `" "` (a space is a non-empty string).

`bool(())` and `bool(range(0))` are false. Both containers are empty.

### Short-circuit

First expression: `0` is false, so `print("left")` does not run. `0 or print("right")` runs the print, which returns `None`. The value of the expression is `None`. The output line is `right` and then the script prints that `None`.

Second expression: `1` is true, so `1 and print("left")` runs the print and yields `None`. `None` is false, so `print("right")` also runs and the expression is `None`. Both words print.

`"" or "anon"` is `"anon"`. `0 or 5` is `5`.

A default that should trigger only for `None`:

```python
def backup(name):
    if name is None:
        return "anon"
    return name
```

`backup(None)` is `"anon"`. `backup("")` is `""`. `backup(0)` is `0`.

### Loop else

`search([1, 2, 3], 2)` prints `found 2` and does not print `missing`.

`search([1, 2, 3], 9)` prints `missing`.

`search([], 1)` prints `missing`, because the loop body never runs and therefore never breaks.

### Pair count

| n | count |
| --- | --- |
| 0 | 0 |
| 1 | 0 |
| 4 | 6 |
| 5 | 10 |
| 10 | 45 |

Closed form: `n(n - 1) / 2`. For `n = 4` the inner lengths are `0 + 1 + 2 + 3 = 6`.

Inner `range(n)` runs `n` times for each of the `n` values of `i`, so `n²`. For `n = 4` that is 16.

Inner `range(i, n)` has length `n - i`. As `i` goes from `0` to `n - 1`, the lengths are `n, n - 1, ..., 1`, which sums to `n(n + 1) / 2`. For `n = 4` that is 10. This is not the same count as `range(i)`. The diagonal `j == i` is included here and was excluded before. Dropping that one term is how the two formulas get mixed up.

### Match

`0` → `"zero"`. `[1, 2]` → `"pair"`. `[1, 2, 3]` → `"other"`. `"0"` → `"other"`.

The experiment also passes `False`. A literal pattern such as `case 0` succeeds when the subject compares equal to that literal, and `False == 0`, so `classify(False)` is `"zero"`. That is fact F7 again. Patterns that are themselves `True`, `False`, or `None` are matched by identity; `case 0` is not one of those patterns.

---

## Debug — `contains`

The `else` belongs to the `if`, not the loop. On the first element, either the function returns `True` or it returns `False`. Later elements are never examined.

`contains([1, 2, 3], 3)` returns `False`, because `1 == 3` fails and the `else` returns immediately.

`contains([1, 2, 3], 1)` returns `True`. The target is first, so the bug is invisible.

`contains([1, 2, 3], 9)` returns `False` for the wrong reason (gave up at the first element) and happens to match the expected value.

`contains([], 1)` returns `False` from the final line. The loop body does not run.

Repairs:

```python
def contains(xs, target):
    for x in xs:
        if x == target:
            return True
    return False
```

Or a loop-else that is actually on the loop:

```python
def contains(xs, target):
    for x in xs:
        if x == target:
            return True
    else:
        return False
```

The `else` there is redundant because nothing breaks; falling out of the loop is enough. The useful shape is `break` plus loop-else, which `first_index` in E3 practices. Time of the repair: O(n) worst case, one comparison per element. Space: O(1) auxiliary.

---

## Exercises

### E1

1. `"empty"` — `[]` is false, so `or` yields the right operand.
2. `[0]` — a non-empty list is true, so `or` yields the left operand.
3. `0` — left is false, `and` yields it and does not look at `5`.
4. `5` — left is true, `and` yields the right operand.
5. `"yes"` — `"0"` is a non-empty string, true, so `and` yields `"yes"`.

### E2

The loop adds `0` through `n - 1`. `sum_through(3)` returns `3`, not `6`.

Invariant that works: at the start of each iteration, `i` is the next integer to add, and `total` is the sum of integers from 1 through `i - 1`. Start with `i = 1`, `total = 0`. Stop when `i > n`.

```python
def sum_through(n):
    total = 0
    i = 1
    while i <= n:
        total += i
        i += 1
    return total


def sum_through_for(n):
    total = 0
    for i in range(1, n + 1):
        total += i
    return total
```

`range(1, n + 1)` is empty when `n` is 0, so the sum is 0. Negative `n` is outside the stated contract; say that out loud rather than inventing a meaning.

### E3

```python
def first_index(xs, target):
    for i in range(len(xs)):
        if xs[i] == target:
            break
    else:
        return None
    return i
```

If the loop breaks, `i` is the index. If it never breaks, the `else` returns `None`, including when `xs` is empty. Duplicates: the break fires on the first hit, so the earlier index is the one kept.

Time O(n). Auxiliary space O(1). `len` and indexing a list are O(1).

### E4

“For `[1, 2, 3]` and `3` it returns `False`. The `else` is attached to the `if`, so the first element `1` is not `3` and the function returns immediately. A repaired scan is O(n) time worst case because it may compare every element once, and O(1) extra space. An input that forces every comparison is a miss, such as `[1, 2, 3]` looking for `9`, or a hit in the last position.”

“`name or "anon"` becomes `"anon"` when `name` is falsy: `None`, `""`, `0`, `False`, empty containers. An empty string can be a legitimate blank field. `0` can be a legitimate count. If the only missing value is `None`, test `is None` instead of using `or`.”
