# 03 — Control flow

★ to ★★★

## Question

In what order do subexpressions run, which values count as true, and what is still true about a loop after each iteration?

## Working rules

Predict prints and values before you run. A control-flow bug is usually an off-by-one or an `else` attached to the wrong statement. Both show up here.

```bash
cd 03-control-flow
python3 experiments/01_truthiness.py
```

Complexity in this module is counting iterations. The handbook is `../COMPLEXITY_REFERENCE.md`. The full theory is module 08, which is not built yet.

## Files

| File | Role |
| --- | --- |
| `LAB.md` | The laboratory |
| `experiments/` | Truthiness, short-circuit, loops, a count |
| `debug/contains.py` | An `else` on the wrong statement |
| `exercises/EXERCISES.md` | |
| `solutions/SOLUTIONS.md` | After a written attempt |

## Done when

You can evaluate a short-circuit expression on paper, count a triangular loop, and the module 03 boxes in `../PROGRESS.md` are honest.
