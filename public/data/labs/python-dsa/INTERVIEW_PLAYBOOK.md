# Interview playbook

This is the procedure for every problem in the later labs, and you can already use it on the exercises in modules 00–03. The goal is a startup interview: a correct approach, explained clearly, with honest complexity, clean enough code, and the edge cases you thought of yourself.

Obscure contest tricks are out of scope unless they are the natural algorithm for a normal interview problem.

## Before any code

Do this on paper or out loud. Do not open a solution file. Do not start typing because the silence feels bad. A minute of silence while you read is part of the interview.

1. **Understand the problem.** Restate it in one sentence. If you cannot, you do not understand it yet. Ask what is missing.
2. **Identify inputs.** Types, sizes, and whether they are sorted, unique, mutable, or shared.
3. **Identify outputs.** Type, and whether you return a new object or mutate the input. Say which.
4. **Identify constraints.** They pick the acceptable complexity. Use the table in `DSA_FACTS.md` D14 and the operation costs in `COMPLEXITY_REFERENCE.md`.
5. **Identify edge cases.** Empty input, one element, all equal, duplicates, negatives, overflow of the *idea* (Python ints do not overflow; the algorithm’s index still can), already sorted, reverse sorted, cycles, disconnected graphs, `None` versus empty.
6. **Develop a brute force.** A correct slow solution. Nested loops are allowed here.
7. **Analyze the brute force.** Time and space, with the “because” clause.
8. **Find the bottleneck.** The factor of n you cannot afford. Name the line.
9. **Identify a pattern, if one fits.** Hash map, two pointers, sliding window, binary search, stack, monotonic stack, queue, heap, DFS, BFS, backtracking, greedy, dynamic programming, union-find, prefix sum, difference array, trie, divide and conquer. Also decide when **not** to force one. A pattern is a hypothesis.
10. **Optimize.** One observation that removes the bottleneck. If you do not have the observation, stay with brute force and say so, then keep looking. Do not narrate a fantasy O(n) you cannot justify.
11. **Justify.** Invariant, exchange argument, or “this state is sufficient”. A hand-wave is not step 11.
12. **Code.** Only now.
13. **Test.** The examples, then the edge cases from step 5, then one you invent. Trace them by hand before you trust a run.
14. **Analyze complexity** of the code you actually wrote, not of the algorithm you meant to write. Look for the Python traps in the complexity reference (string `+=`, `pop(0)`, `in` on a list, slices in recursion).
15. **Look for improvements.** A simpler data structure, a bug in the bound, a case you skipped. Stop when further changes are cosmetic.

## Brute force first

The required story on any problem that has a slow obvious solution:

```text
Brute-force approach
↓
Complexity
↓
Why it fails at the given constraints
↓
Observation
↓
Optimized approach
↓
Complexity improvement
```

Skipping to the optimized code feels faster and produces answers you cannot repair when the interviewer changes a constraint. The observation is the part you are practicing. The code is the receipt.

## What to say while you code

Keep a running thread the interviewer can interrupt:

- “I’ll use a dict from value to index, because I need expected O(1) membership.”
- “`lo` is the first index that might still hold the answer. `hi` is one past the last.”
- “This mutates the input. I’ll say that.”
- “Empty input returns an empty list, not `None`.”

If you are stuck, say what you know and what is missing. “I can do it in n² by checking every pair. I need a way to avoid rescanning the prefix. A set of values seen so far would do that if the problem only asks for existence.” That is a good interview minute. Silent thrashing is not.

## Hint ladder

Later problem files will use this order. Use it on yourself before you open anything.

| Hint | What it may contain | What it must not contain |
| --- | --- | --- |
| 1 | An observation about the input or the bottleneck | The data structure |
| 2 | The pattern name | The recurrence or the code shape |
| 3 | The algorithm in words | Code |
| 4 | The implementation outline: variables and loop structure | The finished function |
| Solution | Code, complexity, alternative | — |

If hint 1 is enough, stop.

## Evaluation, after a timed attempt

Score yourself honestly. The timed sets in module 47 will use the same headings.

```text
Correctness:        did the examples and edges pass?
Complexity:         does the bound match the code?
Code quality:       names, dead state, mutation made explicit
Reasoning:          was the observation real?
Missed edge cases:
Improvement:        one change that would have mattered
```

Time boxes, when you want them: 15, 30, 45, 60 minutes. A 15-minute block is one small problem plus the complexity sentence. A 60-minute block is one hard problem with the full 15 steps, or two medium ones. Do not extend the clock and then score it as a pass.

## Mock-interview script

Module 47 will expand this. The shape, so you can practice now with a peer or by writing both columns:

```text
Interviewer:
Problem:

Candidate:
Reasoning:

Interviewer:
Follow-up:

Candidate:
Optimization:

Interviewer:
Edge case:

Candidate:
```

The interviewer column does not contain the solution. If you are playing both roles, write the interviewer lines before you solve the problem, or the follow-up will be a softball.

## Communication failures that cost offers

- Coding during the restatement.
- Saying “O(n)” for a nested loop.
- Saying “O(1) lookup” with a list.
- Mutating the caller’s list without saying so.
- Handling the happy path and never tracing `[]`.
- Describing a greedy rule with no reason and no attempted counterexample.
- Reciting a binary-search template without the meanings of `lo` and `hi`.

## What “good” sounds like at the end

“The brute force checks every pair, which is n² and too slow at n = 10^5. The observation is that each value needs the complement, and order of the pair does not matter, so a dict from value to index answers in one pass, expected linear time, linear extra memory. I return the indices. An empty input and a single element return an empty result because no pair exists. I did not sort, so the original indices stay intact. Sorting would be n log n and would also work for a two-sum that only asks for values, with less extra memory, but it is worse than expected linear and it complicates indices.”

That paragraph is the standard. The specific problem will change. The shape will not.
