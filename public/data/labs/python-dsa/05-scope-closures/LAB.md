# Lab — Scope and closures

---

## 1. LEGB

Predict the printed values in `experiments/01_legb.py` before running.

## 2. `global` and `nonlocal`

`experiments/02_nonlocal.py` — when must you declare `nonlocal`?

## 3. Closure cells

`experiments/03_closure_cell.py` — nested function reads an enclosing name after the outer call returned.

## 4. Late binding in loops

`experiments/04_late_binding.py` — why do all lambdas see the final `i`? Fix with a default argument.

## Interview prompt

Draw the cells for:

```python
def make_counters():
    out = []
    for i in range(3):
        out.append(lambda: i)
    return out
```

Then fix it and explain the fix.
