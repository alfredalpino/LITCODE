# Solutions — module 05

## Debug

All lambdas close over the same `n` cell. Bind at definition: `lambda n=n: print("pressed", n)`.

## E1

```python
def make_avg():
    total = 0
    count = 0
    def avg(x):
        nonlocal total, count
        total += x
        count += 1
        return total / count
    return avg
```
