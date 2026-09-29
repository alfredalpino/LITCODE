# Lab — Functions

A function is an object. Defining it builds that object. Calling it creates a frame, binds parameters, runs the body, and returns a value (or `None`).

---

## 1. First-class

**Predict** what prints. Then run `experiments/01_first_class.py`.

```python
def double(x):
    return x * 2

ops = [double, abs]
print(ops[0](5), ops[1](-3))

def apply(fn, value):
    return fn(value)

print(apply(double, 10))
```

**Modify.** Pass `str.upper` (or a one-argument helper) into `apply`.

---

## 2. Defaults are evaluated once

**Predict** the two printed lists before running `experiments/02_defaults.py`.

```python
def append_item(item, bucket=[]):
    bucket.append(item)
    return bucket
```

Call it twice with different items and no second argument. Why do the lists share memory?

The fix is `bucket=None` and `if bucket is None: bucket = []` inside the body.

---

## 3. `*args` and `**kwargs`

Run `experiments/03_args_kwargs.py` after predicting the printed tuples/dicts.

---

## 4. Higher-order

`experiments/04_hof.py` — compose two functions; map a predicate.

---

## 5. `lambda`

`experiments/05_lambda.py` — sort a list of pairs by the second element with a key.

---

## Interview prompt

Explain, out loud, why `def f(x, items=[])` is dangerous in interviews and production. Give the corrected pattern and one case where a mutable default is intentional (rare).
