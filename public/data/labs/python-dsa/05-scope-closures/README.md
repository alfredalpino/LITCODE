# 05 — Scope and closures

★★ to ★★★

## Question

Which object does a name refer to — and what does a nested function capture?

## Working rules

LEGB: Local → Enclosing → Global → Built-in. Closures keep cells, not snapshots of integers, unless you bind carefully in a loop.

```bash
cd 05-scope-closures
python3 experiments/01_legb.py
```

## Done when

You can predict `nonlocal` vs rebind, fix the classic late-binding loop, and explain a closure cell in one sentence.
