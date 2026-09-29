# 00 — What actually happens when Python runs?

★ to ★★★

## Question

You press enter on `python3 program.py`. What has to happen before any of your functions run, and which of those steps are Python rules rather than CPython habits?

## Working rules

1. Read a section of `LAB.md`.
2. Write the predictions for that section in `../LEARNING_LOG.md`.
3. Run the named experiment.
4. Change one thing. Predict again. Run again.
5. The debug program comes after the experiments. Diagnose it in writing before `solutions/`.

```bash
cd 00-python-runtime
python3 experiments/01_ast_dump.py
```

Run the experiments from this directory so the tracebacks mention these files.

## Files

| File | Role |
| --- | --- |
| `LAB.md` | The laboratory. No answers. |
| `experiments/` | Instruments. They print what CPython did. |
| `debug/same_object.py` | A false claim, encoded as checks. |
| `exercises/EXERCISES.md` | Small, harder, interview. |
| `solutions/SOLUTIONS.md` | After a written attempt. |

## Done when

The checklist in `../PROGRESS.md` for module 00 is honest.
