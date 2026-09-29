# Lab — Complexity

Computer-science point: Big O is an asymptotic upper bound on growth. You derive it from loops, recursion trees, and the cost of each primitive.

---

## 1. Count iterations

`experiments/01_count_loops.py`

## 2. Amortized append vs insert

`experiments/02_amortized.py` — discuss; measure roughly.

## 3. Hash average vs worst

`experiments/03_hash_story.py` — what average O(1) assumes.

## 4. Recursion tree

`experiments/04_recursion_tree.py` — fib exponential vs memoized.

## Interview prompt

Give Θ for nested `for i in range(n): for j in range(i, n)`. Then for `for i in range(n): for j in range(n): ...` with an early `break` on a hit — best vs worst.
