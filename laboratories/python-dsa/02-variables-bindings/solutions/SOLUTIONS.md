# Solutions — module 02

---

## LAB predictions

### Shared list

Before the append: `a is b`, `a == b`, `a == c`, `a == d` are true. `a is c` and `a is d` are false. `copy` and `[:]` are different new lists; both equal the old one.

After `a.append(4)`: `a` and `b` are `[1, 2, 3, 4]`. `c` and `d` are `[1, 2, 3]`.

If `a` starts as `[[1], [2], [3]]` and you shallow-copy then append to `a[0]`, both `a[0]` and `c[0]` grow, because the copy stored the same inner lists. `a.append(...)` of a new row would not show up in `c`, because that changes the outer list only.

### Nested copy

After `nested[0].append(9)`:

- `nested` is `[[1, 9], [2]]`
- `shallow` is `[[1, 9], [2]]`
- `deep` is `[[1], [2]]`
- `nested[0] is shallow[0]` is true
- `nested[0] is deep[0]` is false
- `nested is shallow` is false

A third level `[[[1]]]`: a shallow copy allocates a new outer list whose single slot still refers to the same middle list, which still refers to the same innermost list. Deep copy allocates all three.

### Rebind versus mutate

| Step | `p` | `q` | same object? |
| --- | --- | --- | --- |
| start | `[1]` | `[1]` | yes |
| `p += [2]` | `[1, 2]` | `[1, 2]` | yes |
| `p = p + [3]` | `[1, 2, 3]` | `[1, 2]` | no |

`x` becomes `11`. `y` stays `10`. They are not the same object.

`replace` rebinds its local name. `data` is still `[1, 2, 3]`. `clear` mutates that object. `data` is `[]`.

### Tuple

`holder[0].append(1)` does not raise. `holder` is `([1],)`. `hash(holder)` raises `TypeError`. `holder[0] = ...` raises `TypeError` because the tuple slot cannot be replaced. Both facts are true at once.

---

## Debug — `zeros_grid`

`[[0] * cols] * rows` evaluates the inner list once, then repeats that one reference `rows` times. `plant_corner(3, 3)` builds one row object. `grid[0][0] = 1` mutates it, so every row shows `[1, 0, 0]`. The printout of `len({id(row) for row in grid})` is `1`.

`[0] * cols` repeats a reference to the integer `0`. Integers have no mutating operations that would let one cell’s change be observed through another cell. The bug is the repeated row, not the repeated zero.

Independent rows:

```python
def zeros(rows, cols):
    return [[0] * cols for _ in range(rows)]
```

The comprehension runs the inner list expression once per row. Each row is a new list. `plant_corner(3, 3)` then matches the expected grid, and the set of row ids has length 3.

`rows == 0` yields `[]`. `cols == 0` yields `rows` empty lists, which are still distinct objects.

---

## Exercises

### E1

Start: `a` and `b` are the same outer list. Two distinct inner lists, `[0, 0]` and `[0, 0]`.

1. `a.append([1, 1])`. Both names see `[[0, 0], [0, 0], [1, 1]]`.
2. `b[0][0] = 7`. Both see `[[7, 0], [0, 0], [1, 1]]`.
3. `a = a + [[9]]` builds a new outer list and rebinds `a` only. `a` is `[[7, 0], [0, 0], [1, 1], [9]]`. `b` is `[[7, 0], [0, 0], [1, 1]]`. The inner lists that already existed are still shared.
4. `b[0][1] = 8` mutates an inner list that `a` still references. `b[0]` becomes `[7, 8]`, and `a[0]` is that same list. `a` is `[[7, 8], [0, 0], [1, 1], [9]]`. `b` is `[[7, 8], [0, 0], [1, 1]]`.

`a is b` is false at the end. `a[0] is b[0]` is true.

### E2

`items = []` binds the local parameter to a new list. The caller’s binding, `data`, is a different name and still refers to `[1, 2, 3]`.

```python
def reset(items):
    items.clear()
```

`clear` mutates the object. The identity of `data` does not change. `items[:] = []` is another mutation of the same object (slice assignment). Rebinding is what does not work.

### E3

Sharing ints is acceptable because nothing the clone does can mutate an int; a later assignment into the clone replaces a slot in the clone’s row, not a slot in the original. If a cell were a list, storing the same reference would let `cloned[i][j].append(...)` change `original`.

```python
def clone_grid(grid):
    return [row[:] for row in grid]
```

For `r` rows and `c` columns: time O(r · c), auxiliary space O(r · c), because each reference is copied once. This is a shallow copy of the rows. It is enough exactly while the cells do not need their own copies.

### E4

First bug: the function rebound a local name (`matrix = [[0] * cols for ...]`) or returned a new matrix that the caller ignored. The caller’s name still refers to the old object. Repair if the contract is in-place: write into the existing cells, or replace each row’s contents with slice assignment. The caller sees the change without rebinding their own name. Repair if the contract is “return a new matrix”: return it, and the caller must bind the result. Those are different contracts. Say which one you are implementing.

Second bug: the rows alias each other, almost always from `[[0] * cols] * rows` or from appending the same row object in a loop. Setting one cell mutates the single shared row. Repair: build a new list per row.

The caller tells the cases apart with `is`. After an in-place zeroing, `before is after` if they kept the same reference. After a rebinding that the caller did not use, their object’s identity and contents are unchanged.
