# Curriculum

Status of this repository:

| Status | Meaning |
| --- | --- |
| **Built** | Lab, experiments, a debug program, exercises, and hidden solutions exist |
| **Planned** | Specified here. Not created yet. Do not invent the lessons from this page |

Built now: `00` through `08` (Foundations continuum). Core DS entry folders `09`–`13` exist as **honest scaffolds** (STATUS.md). Algorithm modules `14`–`48` remain planned in this map only — do not invent lessons from this page alone.

Primary target: startup coding interviews, using Python as the algorithmic language. The development-interview language elsewhere may be JavaScript or TypeScript. This curriculum does not teach a web stack.

**Phase 6 product bridge:** curated auto-judged Challenges (~52) in LITCODE Interview mode map to patterns taught after Foundations. Labs teach; Challenges prove.

The standard for every algorithm module, once it exists:

> What problem does this solve? Why does the naive approach fail? What observation enables the optimization? What invariant does the algorithm maintain? Why is it correct? What are the time and space costs? What assumptions does it depend on? Which edge cases break a naive implementation? Can you derive it? Can you implement it without looking?

---

## Built

### 00 — Python runtime · Built

**Question:** what actually happens between a `.py` file and a running program?

Source text is parsed into an abstract syntax tree, compiled to a code object (bytecode, in CPython), and executed by the runtime. You will use `ast` and `dis` as instruments. You will separate Python-the-language from CPython-the-implementation.

You will be able to:

- draw the pipeline from source to execution
- say which errors happen at compile time and which happen at run time
- read a code object's names, constants, and local variables
- refuse to treat bytecode, `.pyc`, or the GIL as language laws

### 01 — Values and types · Built

**Question:** what kinds of objects exist, and which operations are even meaningful?

`int`, `float`, `complex`, `bool`, `str`, `bytes`, `bytearray`, `None`, `list`, `tuple`, `set`, `frozenset`, `dict`, `range`, plus identity, equality, mutability, hashability, iterability, and callability.

You will be able to:

- predict `type`, `isinstance`, `==`, `is`, and `hash` for the core built-ins
- explain why `True` and `1` collide in a set
- decide whether an object can be a dict key before you try

### 02 — Variables, bindings, and mutability · Built

**Question:** what does `a = b` actually do?

Python names are bindings to objects. They are not boxes that contain values. This module is also the mutability laboratory: aliasing, shallow copy, deep copy, nested structures, rebinding versus in-place change.

You will be able to:

- predict `a is b` and `a == b` after assignment, `copy`, slice, and `deepcopy`
- explain why `[[0] * cols] * rows` is one row repeated
- tell mutation of an object from rebinding of a name

### 03 — Control flow · Built

**Question:** in what order do expressions and statements run, and which values count as true?

Conditionals, truthiness, short-circuit `and`/`or`, loops, `break`, `continue`, loop `else`, `range`, and a first look at structural pattern matching. Nested loops are used to start counting work. The full complexity theory is module 08 and `COMPLEXITY_REFERENCE.md`.

You will be able to:

- evaluate a boolean expression without running it, including short-circuit side effects
- find off-by-one errors and a misplaced `else`
- count how many times a nested loop body runs

### 04 — Functions · Built

Definitions, parameters, defaults, `*args` / `**kwargs`, first-class functions, higher-order functions, `lambda`. Mutable-default laboratory included.

### 05 — Scope and closures · Built

LEGB, `global` / `nonlocal`, closure cells, late-binding loop trap and the default-argument fix.

### 06 — Built-in data structures in use · Built

Fluent selection of `list`, `dict`, `set`, `deque`, `heapq`, `Counter` with honest costs. From-scratch implementations remain modules 09+.

### 07 — Strings · Built

Immutability, building with `join`, slicing, anagram signatures, bytes versus text.

### 08 — Complexity · Built

Derive Big-O from loops and recursion; Python primitive costs; amortized intuition. Handbook: `COMPLEXITY_REFERENCE.md`.

---

## Scaffold — Core DS entry (Phase 6 honesty)

Folders exist with `STATUS.md: scaffold` only. Expand in a later pass:

| Module | Structure |
| --- | --- |
| 09 | Arrays and array patterns |
| 10 | Linked lists |
| 11 | Stacks |
| 12 | Queues |
| 13 | Hash tables |

---

## Planned — Python as an instrument (remaining topics)

The requested tree has no separate numbers for iterators, generators, decorators, exceptions, classes, or the data model. Those topics are still in scope. They will be built as labs inside the Python-instrument block, before or beside the data-structure implementations, without renumbering 09–48:

| Topic | Will live with |
| --- | --- |
| Iterators, `yield`, generators, lazy `range` versus materialized lists | a lab beside 04–06 when filled |
| Exceptions, tracebacks, `try` / `else` / `finally`, custom exceptions | the debugging thread, practiced from 43 backward |
| Classes, `self`, composition, dataclasses, and the data-model methods | after functions and before hash-table implementation depth |

~~### 04 — Functions · Planned~~ → **Built** (see above)

~~### 05 — Scope and closures · Planned~~ → **Built**

~~### 06 — Built-in data structures in use · Planned~~ → **Built**

~~### 07 — Strings · Planned~~ → **Built**

~~### 08 — Complexity · Planned~~ → **Built**

---

## Planned — Data structures you implement

Each of these will follow the same shape: concept, representation, operations, complexity, implementation, tests, common bugs, where it shows up, interview problems. You implement it, then compare with the built-in.

| Module | Structure | The idea you must be able to say |
| --- | --- | --- |
| 09 | Arrays and array patterns | Contiguous indexable storage; traversal, in-place edits, two pointers, sliding window, prefix sums, difference arrays, frequency arrays |
| 10 | Linked lists | Singly, doubly, and circular; reversal, merge, Floyd cycle detection |
| 11 | Stacks | LIFO; list versus `deque`; parentheses, evaluation, monotonic stack, next greater element |
| 12 | Queues | FIFO; circular queue; why a list is a bad queue from the front; BFS as the client |
| 13 | Hash tables | Hash, bucket, collision, load factor; average versus worst case; two sum, anagrams, consecutive sequence |
| 14 | Sets | Membership, union, intersection, difference, symmetric difference; uniqueness as a problem, not a method |
| 15 | Heaps | Heap property is not sorted order; push, pop, heapify; `heapq` and a hand-rolled heap |
| 16 | Trees | Terminology; preorder, inorder, postorder, level order; each one recursive and iterative |
| 17 | Binary search trees | Search property, insertion, deletion, and what breaks if the tree is a line |
| 18 | Tries | Prefix sharing; autocomplete and dictionary lookup |
| 19 | Graphs | Directed, undirected, weighted; matrix, adjacency list, edge list; cost of each representation |

---

## Planned — Algorithmic patterns

| Module | Topic | What “understanding” means |
| --- | --- | --- |
| 20 | Recursion | Base case, recursive case, call stack, recursion tree, depth, the fact that CPython does not promise tail-call elimination, memoization |
| 21 | Backtracking | Decision tree, choose, constrain, undo; permutations, combinations, subsets, N-Queens |
| 22 | Searching | Linear search; binary search with an explicit meaning for `lo` and `hi`; lower and upper bound; search on the answer |
| 23 | Sorting | Bubble, selection, insertion, merge, quick, heap. Stability, in-place, worst and average. Why CPython’s sort is not “one of these with better constants” only: it is a different, highly engineered stable algorithm (Timsort) |
| 24 | Two pointers | Opposite direction, same direction, partition, sorted arrays, linked lists |
| 25 | Sliding window | Fixed and variable windows; the invariant that makes the window valid |
| 26 | Prefix sums | Range sums in O(1) after O(n) prep; when a prefix is the wrong tool |
| 27 | Monotonic stack | What the stack stores, and why the monotonicity lets you discard elements forever |
| 28 | Greedy | A local choice that can be proved, plus a counterexample where the obvious greedy fails |
| 29 | Divide and conquer | Divide, solve, combine; tied back to merge sort, quicksort, and binary search |
| 30 | Dynamic programming | Overlapping subproblems and a state that is actually sufficient. Recursion to memoization to tabulation. For every problem: state, transition, base case, answer, order, complexity. Includes 1D, 2D, grid, subsequence, knapsack, partition, interval, state machine, tree, and the idea of bitmask state |
| 31 | Bit manipulation | AND, OR, XOR, NOT, shifts, masks; why XOR is its own inverse and cancels duplicates |
| 32 | Math for algorithms | Modular arithmetic, GCD, LCM, Euclid, primes, sieve, combinations, logs, fast exponentiation. Only the math that changes an algorithm |

---

## Planned — Graph algorithms and proof

| Module | Topic |
| --- | --- |
| 33 | Graph algorithms as a set: BFS, DFS, components, cycle detection. Each one written as problem, idea, invariant, algorithm, implementation, correctness intuition, complexity, edge cases, alternatives |
| 34 | Advanced trees: balanced-tree consequences, tree DP setup |
| 35 | Union-find / disjoint set |
| 36 | Shortest paths: Dijkstra, Bellman-Ford, Floyd-Warshall, and the assumption each one needs |
| 37 | Minimum spanning tree: Kruskal, Prim |
| 38 | Topological sort and the DAG requirement |

Module 54’s standard (invariants, induction sketch, termination) is woven into 22, 23, 33, and 36. It is not a separate folder of prose.

---

## Planned — Python underneath the algorithms

| Module | Topic |
| --- | --- |
| 39 | Internals, optional and advanced: bytecode with `dis`, reference counting, cyclic GC, the eval loop, the GIL as a CPython concern, free-threaded builds as a reminder that the GIL is not the language |
| 40 | Memory: references, cycles, weak references, generators versus giant lists |
| 41 | Performance: `timeit` and `cProfile`. You measure membership, sorting, queues, string building, and duplicate detection. Intuition does not close the lab |
| 42 | Testing algorithmic code: examples, boundaries, property checks |
| 43 | Debugging lab: off-by-one, non-termination, bad recursion, mutation, wrong base cases, bad pointer motion, bad hash logic, bad DP transitions, broken graph walks, broken heap invariants. The bug is not named in the file |

---

## Planned — Interview performance

| Module | Topic |
| --- | --- |
| 44 | Interview lab: the 15-step process in `INTERVIEW_PLAYBOOK.md`, practiced on new problems |
| 45 | Pattern library: hash map, two pointers, sliding window, binary search, stack, monotonic stack, queue, heap, DFS, BFS, backtracking, greedy, DP, union-find, prefix sum, difference array, trie, divide and conquer — and a section on refusing a pattern that does not fit |
| 46 | Mixed problems that do not announce their pattern |
| 47 | Mock interviews: interviewer / candidate script, follow-ups, edge cases. The answer is not on the page. Timed sets at 15, 30, 45, and 60 minutes |
| 48 | Capstone: a small interview-algorithm engine — problem records, difficulty, category, pattern, hidden tests, expected complexity, validation, progress. Building it is itself a data-structures project |

Implementations required before the capstone, each compared with the built-in or the library version: stack, queue, deque, linked list, hash table, heap, BST, trie, graph, union-find, LRU cache (hash map plus doubly linked list, `get` and `put` O(1)), min stack, priority queue.

The problem bank (arrays, strings, hashing, lists, stacks, queues, trees, graphs, heaps, recursion, backtracking, greedy, DP, bits, math, mixed) is part of 44–46. Each problem ships with constraints, examples, a four-step hint ladder, hidden tests, and a solution file you do not open first.

---

## Suggested order

Do not skip 00–03. Later modules assume you can talk about objects, names, and evaluation order without using a “box of values” story.

```text
00 → 01 → 02 → 03 → 04 → 05 → 08
                 ↘ 06 → 07 ↗
08 → 09 → 10 → 11 → 12 → 13 → 14
13 → 15 → 16 → 17 → 18 → 19
20 → 21 → 22 → 23
09 → 24 → 25 → 26 → 27
23 → 29
20 → 30
31 and 32 can sit beside 30
19 → 33 → 35 → 36 → 37 → 38
16 → 34
39 → 40 → 41, with 42 and 43 used continuously
44 → 45 → 46 → 47 → 48
```

Spaced review is part of the order. `PROGRESS.md` starts that schedule for the built modules.
