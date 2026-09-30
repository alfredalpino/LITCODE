# 04 — Functions

★ to ★★★

## Question

What is a function object, and what happens to arguments, defaults, and return values at call time?

## Working rules

Predict before you run. Mutable defaults are evaluated **once**, when the function object is built — not on every call.

```bash
cd 04-functions
python3 experiments/01_first_class.py
```

## Files

| File | Role |
| --- | --- |
| `LAB.md` | The laboratory |
| `experiments/` | First-class, defaults, *args/**kwargs, HOF, lambda |
| `debug/mutable_default.py` | Shared list default bug |
| `exercises/EXERCISES.md` | |
| `solutions/SOLUTIONS.md` | After a written attempt |

## Done when

You can explain mutable defaults, write a small higher-order function, and the module 04 boxes in `../PROGRESS.md` are honest.
