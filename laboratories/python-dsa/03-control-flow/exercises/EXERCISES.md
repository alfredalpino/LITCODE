# Exercises — module 03

## E1 · Values, not vibes · ★

What does each expression evaluate to? Not “truthy”. The actual object.

1. `[] or "empty"`
2. `[0] or "empty"`
3. `0 and 5`
4. `2 and 5`
5. `"0" and "yes"`

## E2 · Off by one · ★★

`sum_through(n)` must return the sum of the integers from 1 through `n` inclusive. `sum_through(0)` is `0`. `sum_through(3)` is `6`.

This version is wrong. Find the bug before you rewrite it.

```python
def sum_through(n):
    total = 0
    i = 0
    while i < n:
        total += i
        i += 1
    return total
```

Write a correct `while` version and a correct `for` version. State the invariant of your `while` at the start of each iteration: what `total` represents, in terms of `i`.

## E3 · Loop else on purpose · ★★★

Write `first_index(xs, target)`. Return the index of the first equal element, or `None` if it is absent. Use a `for` loop and an `else` clause. Do not use a flag, `list.index`, or a `return` inside the loop.

The empty list returns `None`. A missing target returns `None`. Two copies of the target: return the earlier index.

Time and auxiliary space.

## E4 · Interview · ★★★

Interviewer, pointing at `debug/contains.py`: “What does this return for `[1, 2, 3]` and `3`, and why? What is the complexity of the repaired function? Give me an input that makes a correct version look at every element.”

Then: “`name or "anon"` — what inputs become `"anon"`, and which of those might be legitimate names or counts?”

Answer both. The complexity sentence needs a “because”.
