# Solutions — module 06

## Debug

Use `collections.deque` and `popleft`.

## E1

```python
from collections import Counter
def top_k(nums, k):
    return [x for x, _ in Counter(nums).most_common(k)]
```
