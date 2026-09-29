# Complexity reference

Use this while you read code. Module 08 (planned) is the full training. This file is the handbook those labs will assume.

A bound is a claim about growth as the input size goes to infinity, inside a model of what counts as one step. It is not a measurement. Module 41 will measure. Both are required; neither replaces the other.

## The model you are using

For interview work in Python, a step is a simple operation: arithmetic on small numbers, a binding, a comparison, an index load, a hash of a small immutable key. Say so when the cost is not a simple step.

These are **not** O(1) in Python, even though the syntax looks small:

| Operation | Usual cost | Why |
| --- | --- | --- |
| `xs[i]` on a list | O(1) | Index into a pointer array |
| `xs.append(x)` | Amortized O(1) in CPython | Occasional resize copies the pointer array. See Python fact F13 |
| `xs.pop()` | Amortized O(1) | End of the array |
| `xs.pop(0)`, `xs.insert(0, x)` | O(n) | Shifts the other pointers |
| `x in xs` on a list | O(n) | Scan |
| `x in s` on a set, `k in d` on a dict | Expected O(1), worst O(n) | Hash table. Facts F14, D2 |
| `xs[a:b]` | O(b − a) | New list, copies references |
| `s + t` on strings | O(len(s) + len(t)) | New string |
| `s += t` in a loop, n times, growing | O(n²) total | Each step copies the whole string. Fact F8 |
| `sorted(xs)`, `xs.sort()` | O(n log n) | Timsort, stable. Fact F15 |
| `xs.copy()` on a list | O(n) | Shallow |
| `copy.deepcopy(xs)` | Proportional to the whole object graph | Visits every reachable object |
| `len(xs)`, `len(s)`, `len(d)` | O(1) | Stored on the object |
| Integer `+` on huge ints | Grows with the number of digits | Python `int` is arbitrary precision |
| Recursion depth n | O(n) stack frames | No tail-call elimination. Fact F12 |

If you ignore this table, you will call a quadratic Python program O(n).

## Definitions

Let T(n) be a non-negative cost function. n is the size you chose: elements, bits, nodes, edges. Name it.

**Big O (upper bound).** T(n) is O(f(n)) when there exist constants c > 0 and n0 such that for all n ≥ n0, T(n) ≤ c · f(n). Past some point, T never grows faster than a constant times f.

**Big Omega (lower bound).** T(n) is Ω(f(n)) when T(n) ≥ c · f(n) for large n. The algorithm does at least this much on the inputs you are talking about. Say whether you mean worst-case inputs or all inputs.

**Big Theta (tight bound).** Both O and Omega for the same f. This is what people usually mean by “it’s n log n”, and they write O anyway. When you know the bound is tight, you may say Theta. When you only proved an upper bound, say O.

O is not a worst-case synonym. You can write O for a best case, an average case, or an amortized sequence. The case is a separate word. Always say which.

## Cases

**Worst case.** The maximum of T over inputs of size n. This is the default in interviews.

**Best case.** The minimum. Usually a distraction unless the problem is about already-sorted inputs or early exit.

**Average case.** The mean under a distribution you must name. “Random input” is not a distribution until you say how the input is drawn. Hash-table average case is an assumption about hashes and keys, not about the user’s mood.

**Amortized.** Cost of a sequence divided by the number of operations. Fact D13. A single operation may be expensive.

## Time and space

**Time.** How T grows. Count dominant work. Drop lower-order terms and constant factors after you have the leading term. Do not drop them before you know the leading term: an O(n) hash inside an O(n) loop is O(n²) if the hash is over a string of length n. Be careful what n is.

**Space.** All memory that grows with the input, including the call stack and the output if the problem counts it.

**Auxiliary space.** Memory beyond the input. An in-place partition that only uses a few indices is O(1) auxiliary space, even though the input array is O(n). Recursion of depth n is O(n) auxiliary space because of the frames, even when you allocate nothing with `new`.

## The usual functions, and where they come from

Do not memorize these as shapes on a chart. Derive them.

**O(1).** Work does not depend on n. `xs[i]`, `len`, a hash lookup under the average-case model, swapping two variables.

**O(log n).** The input shrinks by a constant fraction each step. Binary search: n, n/2, n/4, … down to 1 is about log2(n) steps. Balanced BST height. Heap sift. One step must actually discard a fraction. A loop that does `i += 1` is not logarithmic. A loop that does `i *= 2` until `i` exceeds n is logarithmic in n.

**O(n).** One pass. Or log n phases that together still touch each element a constant number of times (heapify, the linear work inside some string algorithms).

**O(n log n).** n times a logarithmic step (heap sort’s extractions, building a heap by n inserts), or log n passes over the data (merge sort’s merge depth). Comparison-sort lower bound: fact D9.

**O(n²).** Nested loops over the same collection, or a linear scan repeated n times. The triangular loop is the one people undercount:

```python
for i in range(n):
    for j in range(i):
        ...
```

The inner body runs 0 + 1 + … + (n − 1) = n(n − 1) / 2 times, which is Theta(n²), not O(n) and not O(n² / 2) as a different class. The 1/2 is a constant. You will count this by hand in module 03.

**O(n³).** Three nested linear loops, or an n² algorithm called n times. Floyd-Warshall.

**O(2^n).** A recursion that branches into two calls and does not reuse work: subsets of an n-element set, naive Fibonacci. If you memoize Fibonacci it becomes O(n). The branching is not the complexity; the number of distinct subproblems you actually solve is.

**O(n!).** Permutations. You cannot enumerate them past tiny n. Backtracking that prunes may be better on typical inputs and still n! in the worst case. Say which.

## How to derive a bound from code

1. Name n. If there are two dimensions, say n and m and do not pretend they are one variable.
2. Mark every loop and every recursive call.
3. Count how many times the most nested expensive operation runs.
4. Cost that operation honestly using the table above. A “constant” body that contains `in` on a list is not constant.
5. Add the pieces. Keep the largest.
6. Name the case: worst, average, amortized.
7. State space the same way, including the stack.

### Recursion

Write the recurrence, then solve it. Do not stare at the code and guess.

- One call on n − 1, plus O(1) work: T(n) = T(n − 1) + O(1) = O(n).
- One call on n/2, plus O(1): T(n) = T(n/2) + O(1) = O(log n).
- One call on n/2, plus O(n): T(n) = T(n/2) + O(n) = O(n).
- Two calls on n/2, plus O(n): T(n) = 2T(n/2) + O(n) = O(n log n). Merge sort.
- Two calls on n − 1 with no cache: T(n) = 2T(n − 1) + O(1) = O(2^n).

Drawing the tree is part of the work in module 20. Leaves, depth, and cost per level.

### Hash operations inside loops

```python
for x in a:          # n
    if x in seen:    # expected O(1) if seen is a set
        ...
    seen.add(x)
```

Expected O(n) time, O(n) extra space. If `seen` is a list, the `in` is O(n) and the total is O(n²). The punctuation did not change. The type did.

### Hidden quadratic patterns in Python

- String concatenation in a loop.
- `list.pop(0)` in a loop.
- `x in list` in a loop.
- Slicing a new array of length n on every recursive call (`nums[1:]`), which turns an O(n) recursion into O(n²) before you count anything else.
- Building a new list with `xs = xs + [x]` in a loop.

These are the patterns module 03 and the early data-structure modules exist to make visible.

## What to say out loud

Use this shape. It is short enough for an interview.

```text
Time:  O(...) worst case, because <which loops or recurrence>.
       Expected O(...) if a hash table is involved.
Space: O(...) auxiliary, including <stack or table or neither>.
Note:  <the Python operation that would change the bound if I used the wrong type>.
```

If you cannot fill the “because” clause, you do not have the bound yet.
