# Exercises — module 02

Draw objects as boxes with arrows when a prediction is about aliasing. A list of final values with no drawing will not stick.

## E1 · On paper · ★★

Start from `a = [[0, 0], [0, 0]]` and `b = a`. Apply one statement at a time. Write `a` and `b` after each.

1. `a.append([1, 1])`
2. `b[0][0] = 7`
3. `a = a + [[9]]`
4. `b[0][1] = 8`

State, at the end, whether `a is b`.

## E2 · The caller still sees the old list · ★★

```python
def reset(items):
    items = []
```

`data = [1, 2, 3]` then `reset(data)` leaves `data` unchanged. Explain why, in terms of bindings. Then write `reset` so the caller’s list becomes empty and the same list object remains (`data is` the same object before and after). Name the method you used.

## E3 · Clone a grid without `deepcopy` · ★★★

Write `clone_grid(grid)` for a rectangular list of lists of ints. The result must be a new grid, new row lists, equal values. You may not import `copy`.

```python
original = [[1, 2], [3, 4]]
cloned = clone_grid(original)
cloned[0][0] = 9
```

`original[0][0]` stays `1`, and `cloned[0] is not original[0]`.

Then answer: why is copying the integers by sharing them acceptable here, and what would break if a cell were itself a list?

Time and auxiliary space for an `r` by `c` grid: say both, with the reason.

## E4 · Interview · ★★★

Interviewer: “I wrote a function that takes a matrix and sets every cell to 0. The caller’s matrix does not change. I wrote another one that sets one cell and several rows change. What is going on?”

Give the two diagnoses. They are not the same bug. Then say which repair mutates and which repair rebinds, and how the caller can tell.
