# Solutions — module 04

Open only after a written attempt.

## Debug — mutable_default

`seen=[]` is one list object shared by all calls. Fix with `seen=None` and create a new list inside.

## E1

```python
def clamp(x, lo, hi):
    return max(lo, min(hi, x))
```

## E2

```python
def once(fn):
    called = False
    result = None
    def wrapper(*args, **kwargs):
        nonlocal called, result
        if not called:
            result = fn(*args, **kwargs)
            called = True
        return result
    return wrapper
```

## E3

```python
def group_by(items, key_fn):
    out = {}
    for item in items:
        k = key_fn(item)
        out.setdefault(k, []).append(item)
    return out
```
