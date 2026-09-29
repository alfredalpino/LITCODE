# DSA facts

These are the claims you should be able to defend, not recite. Each one names the assumption it depends on. Modules that train the fact are marked planned until they exist. `COMPLEXITY_REFERENCE.md` is the costing handbook.

---

## D1 — Binary search needs a monotonic predicate

**Fact.** Binary search is valid when the search space is ordered so that once the predicate becomes true, it stays true (or once it becomes false, it stays false).

**Explanation.** Each step throws away a half. Throwing away a half is only safe if you know the answer cannot be in that half. A sorted array plus “find this value” is the common case: everything left of a too-small element is also too small. The more general case is binary search on the answer: “is capacity `x` enough?” must be false for all `x` below some threshold and true above it, or the mirror image.

**Example.** Searching for `5` in `[1, 4, 5, 5, 9]` is monotonic in the index. Searching an unsorted array is not. “Minimum ship capacity to finish in `D` days” is monotonic in the capacity.

**Underlying mechanism.** The invariant is about the remaining range. You should be able to say what `lo` means and what `hi` means after every update. If you cannot, you have a template, not an algorithm.

**Why it matters.** Off-by-one bugs in binary search are invariant bugs. They are not fixed by memorizing `mid + 1`.

**Common misconception.** “Binary search means the array is sorted, and the loop is always `while lo <= hi` with `mid = (lo + hi) // 2`.” Sorted input is one source of monotonicity. The loop shape depends on whether `hi` is inclusive and on what you are returning.

**Interview relevance.** Module 22 (planned). In every binary search you write: state the invariant before the code.

---

## D2 — Hash table lookup is expected O(1), worst case O(n)

**Fact.** A hash table computes a hash, maps it to a bucket, and resolves collisions. With a decent hash and a controlled load factor, the expected number of keys you inspect is constant. Nothing in that story makes the worst case constant.

**Explanation.** Load factor is the number of keys divided by the number of buckets. If it grows without rehashing, chains or probe sequences grow. Rehashing costs time occasionally and is amortized across insertions. Equality still has to confirm the key, so a key comparison that is itself expensive is not free.

**Example.** Two-sum with a dict is expected linear time. Two-sum with a pair of nested loops is quadratic. Both are correct. Only one fits typical constraints of n = 10^5.

**Underlying mechanism.** Hash → bucket → collision policy (chaining or open addressing) → equality. CPython dicts are open-addressed. Your hand-rolled table in module 13 can be chaining. The complexity story is the same shape.

**Why it matters.** Most “optimize this brute force” interview moves are “store what you have seen”.

**Common misconception.** “O(1) lookup is a law, like integer addition.” Addition of Python `int` is not even O(1) once integers are huge. Hash lookup is a model with assumptions. State the assumptions in one clause and move on.

**Interview relevance.** Module 13 (planned). Python fact F6 and F14.

---

## D3 — A heap is not a sorted array

**Fact.** A binary heap guarantees a parent-child inequality (parent ≤ children in a min-heap), not a fully sorted order. The minimum is at the root. The array layout is an indexing trick: children of `i` live at `2i + 1` and `2i + 2` in the usual 0-based layout. Neighbors in the array are not in sorted order.

**Explanation.** Push and pop repair the heap along one path, which is O(log n) because the tree is complete and its height is logarithmic. Heapify of n elements is O(n), which surprises people who expect O(n log n). The O(n) bound comes from the fact that most nodes are near the leaves and sift a short distance.

**Example.** `[1, 3, 2, 7, 4]` can be a min-heap. It is not sorted. `4` sits after `7`.

**Underlying mechanism.** Complete binary tree in an array, sift up, sift down.

**Why it matters.** Use a heap for “current best” (priority queue), not for “give me the fully sorted list” unless you are doing heapsort, which is a different bill: n extractions, O(n log n), and not stable.

**Common misconception.** “I’ll heapify and then scan the array as if it were sorted.”

**Interview relevance.** Top-k, merge k lists, median maintenance. Module 15 (planned).

---

## D4 — BFS finds shortest paths in an unweighted graph

**Fact.** In a graph where every edge has the same cost (usually 1), the first time breadth-first search reaches a node, it has reached it by a minimum number of edges.

**Explanation.** BFS visits nodes in order of distance from the source: all nodes at distance 0, then 1, then 2. When you first dequeue a node, every closer node has already been processed. An edge from a closer node is how this node was discovered, so its distance is one more than a minimum distance.

**Example.** In an unweighted grid, BFS from the start gives the minimum number of steps to each cell. DFS can reach the same cell by a long detour first.

**Underlying mechanism.** A queue enforces the layer order. A visited set stops you from reprocessing a node. The invariant: nodes still in the queue have distances that differ by at most 1, and everything at a smaller distance is already finished.

**Why it matters.** “Shortest path” in an interview, with no weights mentioned, is usually BFS. Reaching for Dijkstra is not wrong, but you should know it is unnecessary.

**Common misconception.** “Any graph search finds the shortest path.” DFS does not. BFS does not, once edge weights differ.

**Interview relevance.** Modules 12, 19, 33 (planned).

---

## D5 — DFS does not generally find shortest paths

**Fact.** Depth-first search explores one branch to the end before siblings. The first time it sees a node depends on adjacency order, not on distance.

**Explanation.** DFS is the right tool for topology of the graph: components, cycle detection in directed graphs (with colors), topological sort, maze existence, tree traversals. “First time seen” is not “closest”.

**Example.** From node `A` with edges `A→B`, `A→C`, `B→C`, DFS that takes `A→B→C` first records a 2-edge path to `C` and may ignore the direct edge if `C` is already visited.

**Underlying mechanism.** A stack, implicit in recursion or explicit. Color or visit state is part of the algorithm, not a decoration.

**Why it matters.** Choosing DFS because “graphs mean DFS” is how shortest-path answers go wrong.

**Common misconception.** “I’ll DFS and keep the minimum distance I ever see, and that is as good as BFS.” You can compute distances with a correct relaxation scheme. Plain DFS-with-a-visited-set does not do that.

**Interview relevance.** Be able to say which question you are answering: reachability, or distance.

---

## D6 — Dijkstra requires non-negative edge weights

**Fact.** Dijkstra’s algorithm finalizes a node when it is the unsettled node with the smallest tentative distance. That step is correct only if no later path can undercut that distance. A negative edge can undercut it. A negative cycle makes “shortest path” undefined for nodes that can reach the cycle.

**Explanation.** The proof is an exchange argument: if a finalized distance were not optimal, the first node where the true shortest path leaves the finalized set would have been a better choice to finalize. A negative edge breaks the “leaving the set cannot get cheaper” step.

**Example.** Edges `A→B` weight 2, `A→C` weight 3, `B→C` weight -2. Greedy finalization can lock in a worse distance for `C` depending on the implementation’s settle rule. Bellman-Ford handles negative edges (and reports negative cycles) in O(VE). Floyd-Warshall handles all pairs in O(V³), still with a negative-cycle problem.

**Underlying mechanism.** A priority queue of tentative distances, plus a settled set. Decrease-key versus “push duplicate and ignore stale pops” are implementation choices with the same correctness story if stale entries are skipped.

**Why it matters.** Interviewers ask “what if an edge is negative?” The answer is the assumption, not a code tweak.

**Common misconception.** “Dijkstra is the shortest-path algorithm.” It is the non-negative one with a heap, typically O((V + E) log V) with a binary heap.

**Interview relevance.** Module 36 (planned). State the assumption before you code.

---

## D7 — Union-find answers connectivity, cheaply

**Fact.** A disjoint-set structure tracks components under unions. With union by rank and path compression, a sequence of m operations on n elements is almost O(m), specifically O(m α(n)) where α is the inverse Ackermann function, which is ≤ 4 for any n you will ever see.

**Explanation.** It does not store paths, distances, or cycle structure beyond “are these in the same component, after these merges?” Kruskal’s MST uses it for exactly that question: “would this edge connect different components?”

**Example.** Dynamic “are a and b connected?” under edge additions. You do not rerun BFS from scratch each time.

**Underlying mechanism.** Parent pointers, compression on find, link-the-shorter-tree on union. The inverse Ackermann bound is the reason people say “effectively constant”.

**Why it matters.** It is the wrong tool for shortest paths and the right tool for merging components. Using BFS after every union is correct and too slow when the query count is high.

**Common misconception.** “Union-find finds the shortest path between two nodes.” It finds whether a path exists in the graph formed by the unions, not the path length.

**Interview relevance.** Module 35 (planned). Number of provinces, accounts merge, Kruskal.

---

## D8 — Balanced search trees give logarithmic path lengths

**Fact.** A binary search tree’s search, insert, and delete walk a path from the root. If the tree can degenerate, that path is O(n). If the tree stays balanced (AVL, red-black, or a policy that keeps height O(log n)), the path is O(log n).

**Explanation.** The BST property (left subtree keys less, right subtree keys greater, in the usual formulation) gives correctness of search. Balance gives the bound. The property without balance is not an algorithmic improvement over a sorted list plus patience; a sorted list is honest about being a line.

**Example.** Inserting 1, 2, 3, 4, 5 in order into a plain BST builds a linked list.

**Underlying mechanism.** Rotations or color rules repair height after updates. Python’s built-ins do not include a public balanced BST; `dict` is a hash table, not a tree. Sorted containers in interviews are usually “I’ll use a balanced tree” said out loud, then a library if one is allowed, or a different structure (heap, sorted list with bisect) if it fits.

**Why it matters.** So you do not claim “tree means log n” for a tree you never balanced.

**Common misconception.** “All binary search trees are O(log n).”

**Interview relevance.** Module 17 and 34 (planned). If you use a plain BST in an interview, say the worst case.

---

## D9 — Comparison sorting is Ω(n log n) in the comparison model

**Fact.** Any sort that decides order only by comparing pairs of elements needs Ω(n log n) comparisons in the worst case, for distinct keys.

**Explanation.** There are n! possible orders. Each comparison has two outcomes, so the decision tree must have at least n! leaves. The height of that tree is Ω(log(n!)) which is Ω(n log n) by Stirling. Merge sort meets O(n log n), so the bound is tight for that model.

**Example.** Counting sort and radix sort can be linear in n for integers in a restricted range because they are not comparison sorts. They use the structure of the keys. They also use memory related to the range or the digit alphabet.

**Underlying mechanism.** Information / decision-tree lower bound. It does not apply to algorithms that branch on key digits or hashes rather than on `<`.

**Why it matters.** You cannot invent a general comparison sort that is O(n) for arbitrary ordered keys. You can beat n log n when the key domain gives you a different operation.

**Common misconception.** “O(n log n) is the best any sort can ever do.” The model is part of the theorem.

**Interview relevance.** Module 23 (planned). One sentence is enough unless they push.

---

## D10 — Dynamic programming needs a sufficient state

**Fact.** DP applies when a problem has overlapping subproblems and optimal substructure, and only if the state you store contains everything future choices need.

**Explanation.** If two histories lead to the same state, they must be interchangeable from there. If they are not, the state is missing a dimension (remaining capacity, previous choice, mask of used items, interval endpoints). Memoizing a wrong state returns a confident wrong answer.

**Example.** 0/1 knapsack state is `(index, remaining capacity)`, not just `index`. Fibonacci’s state is just `n`, which is why the naive recursion repeats work and the memoized version is linear.

**Underlying mechanism.** Recursion tree with repeated nodes → cache keyed by state → or a table filled in an order that computes dependencies first. Top-down and bottom-up are the same recurrence. The order is the obligation you take on when you leave recursion.

**Why it matters.** Pattern-matching “this looks like knapsack” without writing the state is how DP solutions collapse in interviews.

**Common misconception.** “DP means a 2D table.” The table is one way to store a recurrence. Also: “DP is just caching.” Caching a state that is not sufficient is still wrong.

**Interview relevance.** Module 30 (planned). The required lines before code: state, transition, base case, answer, iteration order, complexity.

---

## D11 — A greedy algorithm is a proof obligation

**Fact.** A greedy algorithm commits to a local choice and never reconsiders it. That is correct only when some argument shows a local choice can be extended to a global optimum.

**Explanation.** Typical arguments: exchange (any optimal solution can be rewritten to include your choice without getting worse) or greedy-stays-ahead (after k steps your partial solution is at least as good as any other). A matroid structure is the clean abstract setting; you do not need the word matroid to solve interview problems, and you do need one of the arguments.

**Example.** Interval scheduling by earliest finish time is greedy and correct. Interval scheduling by shortest duration is a plausible greedy and wrong. Coin systems that are not canonical break the “always take the largest coin” story, even though it works for US coins.

**Underlying mechanism.** One-way commitment. If you need to undo, you are in backtracking or search, not greedy.

**Why it matters.** “Take the max” is not an algorithm. It is a guess. Interviews reward the guess only when you can say why no counterexample exists.

**Common misconception.** “Greedy means sort and scan.” Sorting is often the setup. The algorithm is the choice rule plus the reason it is safe.

**Interview relevance.** Module 28 (planned). Always bring one counterexample attempt. If you cannot break it, say why the exchange works.

---

## D12 — Recursion and iteration can represent the same control

**Fact.** A recursive procedure’s pending work lives on the call stack. The same information can live on an explicit stack you control. Tail-position recursion can often become a loop that reuses the current frame’s variables, which is a programmer transformation, not something CPython will do for you (Python fact F12).

**Explanation.** Conversion does not change the branching. A recursion tree that is exponential stays exponential if you only remove the call stack and keep the same number of calls. Memoization or a different state is what cuts the work. Iteration is about control and stack safety, not automatically about complexity.

**Example.** Recursive DFS versus an explicit stack. Recursive Fibonacci versus a loop that keeps the last two values. Those are different transformations: the first preserves the recursion tree’s size; the second changes the algorithm.

**Underlying mechanism.** A frame holds parameters, locals, and a return address. An explicit stack holds the subset of that you still need.

**Why it matters.** “Can you do it iteratively?” means “put the stack in the heap” or “find a recurrence that needs only a few previous values”. Ask which one they mean.

**Common misconception.** “Iterative means faster.” A loop with the same recurrence as the naive recursion is the same complexity. It may avoid `RecursionError`.

**Interview relevance.** Tree traversals, module 16 and 20 (planned).

---

## D13 — Amortized cost is about a sequence

**Fact.** An operation is amortized O(1) when any sequence of n such operations costs O(n), even if a few individual operations cost more.

**Explanation.** The accounting method stores credit on cheap operations to pay for the rare expensive one. The aggregate method sums the whole sequence and divides. Both are proofs. “It seems fast” is not.

**Example.** Dynamic-array append. Incrementing a binary counter: n increments flip O(n) bits total, not O(n log n), because low bits flip often and high bits rarely. That second example is the clean whiteboard version of amortization.

**Underlying mechanism.** See Python fact F13 for lists. The DSA point is the definition, which you can apply to union-find, splay trees, and hash-table resizing.

**Why it matters.** Interviewers who know the term will ask it the moment you say “append is O(1)”.

**Common misconception.** “Amortized O(1) means usually O(1), hopefully.” It means a proved bound on the sequence.

**Interview relevance.** Say it precisely once. Then give the resizing example.

---

## D14 — Constraints pick the acceptable complexity

**Fact.** A correct algorithm that is too slow fails the problem. A fast algorithm that is wrong also fails. You choose the target bound from the constraint, then you search for an algorithm inside that bound.

**Explanation.** Rough interview scale, assuming a Python loop budget on the order of 10^7 to 10^8 simple operations in a second or two (this is a rule of thumb, not a law; measure when it matters, module 41):

| n | Acceptable shapes |
| --- | --- |
| ≤ 20 | O(2^n · n) or O(n!) only if the constant work is tiny; often bit DP or backtracking with pruning |
| ≤ 500 | O(n³) is the edge; O(n²) is comfortable |
| ≤ 10^4 | O(n²) is the edge |
| ≤ 10^5 | O(n log n) or expected O(n) |
| ≤ 10^6 | O(n log n) is tight in Python; expected O(n) is safer |

**Example.** n = 10^5 and an O(n²) double loop is the bottleneck, not your coding style. The optimization has to remove a factor of n, usually with a hash map, a sort plus two pointers, a heap, or a better state.

**Underlying mechanism.** Operation counts, plus the fact that Python’s constant factors are larger than C++. The complexity class still dominates constants once n is big enough. Do not micro-optimize an O(n²) algorithm and call it done.

**Why it matters.** This is the bridge from “I have a correct brute force” to “I know why it cannot ship”.

**Common misconception.** “I’ll code the elegant solution immediately.” First a correct approach, then the bottleneck, then the observation. The playbook is `INTERVIEW_PLAYBOOK.md`.

**Interview relevance.** Every problem. Use this table as a first filter, then justify the specific algorithm.

---

## Adding facts

Add a fact only after you can state its assumption and a counterexample to the version that drops the assumption. A fact with no assumption is probably missing one.
