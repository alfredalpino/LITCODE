# 02 — Names, bindings, and the mutability laboratory

★★ to ★★★

## Question

When you write `b = a`, what did you copy? When you write `a.append(1)` or `a = a + [1]`, which of those changes the object that other names already see?

## Working rules

This is the dedicated mutability lab. Module 01 established identity, equality, and hashability. Here those ideas get pointed at names.

```bash
cd 02-variables-bindings
python3 experiments/01_shared_list.py
```

Write every prediction in `../LEARNING_LOG.md` before the command.

## Files

| File | Role |
| --- | --- |
| `LAB.md` | The laboratory |
| `experiments/` | Aliasing, copies, rebinding |
| `debug/zeros_grid.py` | A grid whose rows are one list |
| `exercises/EXERCISES.md` | |
| `solutions/SOLUTIONS.md` | After a written attempt |

## Done when

You can draw the objects for a shared nested list without running it, and the module 02 boxes in `../PROGRESS.md` are honest.
