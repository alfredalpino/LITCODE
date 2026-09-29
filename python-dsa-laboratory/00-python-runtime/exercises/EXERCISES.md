# Exercises — module 00

Write predictions and answers in the learning log. Open `../solutions/SOLUTIONS.md` only after that.

## E1 · Pipeline on a tiny program · ★

`hello.py` contains exactly:

```python
print(1 + 2)
```

Without running it, list the stages from “the file is bytes on disk” to “3 appears on the screen”. Mark each stage as language or CPython-specific. One paragraph is enough. A diagram is better.

## E2 · Classify the failure · ★★

For each snippet, write `SyntaxError`, `NameError`, `TypeError`, or `no error`, and the phase (`compile`, `call`, or `none`). Then check with a scratch file or with the pattern in `experiments/04_when_errors_happen.py`.

```python
def a():
    return 1 + "2"
```

```python
def b()
    return 1
```

```python
def c():
    return no_such_name
```

```python
def d():
    x = 1
    x = "a"
    return x
```

## E3 · Where the names live · ★★

For this function, fill the three tables before you print them:

```python
def mix(left, right):
    return left + right + 100 + extra
```

| Table | Contents you expect |
| --- | --- |
| `co_varnames` | |
| `co_consts` | |
| `co_names` | |

Defining `mix` must not raise. Calling it should. Say why both of those sentences can be true.

## E4 · Interview · ★★★

The interviewer says: “Walk me through what happens when I run a Python file.”

Answer in under two minutes. You must include:

- source as text
- a parse into a tree
- a compilation to something executable
- an evaluation loop
- one sentence that separates the Python language from CPython bytecode
- one sentence on when a bad name is detected

They follow up: “So is the GIL why my loop is slow?”

Answer in three sentences, then stop. Use Python fact F17. Do not give a talk.
