#!/usr/bin/env node
/**
 * Phase 6 — fill Python DSA Foundations (04–08) to ready standard;
 * create honest scaffolds for Core DS entry (09–13).
 * Source of truth: python-dsa-laboratory/ (synced into studio).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

function write(rel, content) {
  const full = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content.trimStart());
  console.log(" ", rel);
}

function readyModule({ id, title, question, readme, lab, experiments, debug, exercises, solutions }) {
  const base = `${id}`;
  write(`${base}/README.md`, readme);
  write(`${base}/LAB.md`, lab);
  for (const [name, body] of experiments) {
    write(`${base}/experiments/${name}`, body);
  }
  for (const [name, body] of debug) {
    write(`${base}/debug/${name}`, body);
  }
  write(`${base}/exercises/EXERCISES.md`, exercises);
  write(`${base}/solutions/SOLUTIONS.md`, solutions);
}

function scaffoldModule({ id, title, idea, prereq }) {
  const base = `${id}`;
  write(
    `${base}/README.md`,
    `# ${title}

**Status:** scaffold

This module is planned in \`CURRICULUM.md\` but not filled to laboratory depth yet.
Do not treat the sidebar entry as a finished LITCODE lab.

**Idea to land later:** ${idea}

**Prerequisites:** ${prereq}

Until expanded: use the Foundations path (\`00\`–\`08\`) and the curated auto-judged Challenges bank for interview pattern practice.
`
  );
  write(
    `${base}/STATUS.md`,
    `status: scaffold
`
  );
}

console.log("Phase 6 Python modules…");

// ─── 04 Functions ────────────────────────────────────────────────────
readyModule({
  id: "04-functions",
  title: "04 — Functions",
  question: "What is a function object, and what happens at call time?",
  readme: `# 04 — Functions

★ to ★★★

## Question

What is a function object, and what happens to arguments, defaults, and return values at call time?

## Working rules

Predict before you run. Mutable defaults are evaluated **once**, when the function object is built — not on every call.

\`\`\`bash
cd 04-functions
python3 experiments/01_first_class.py
\`\`\`

## Files

| File | Role |
| --- | --- |
| \`LAB.md\` | The laboratory |
| \`experiments/\` | First-class, defaults, *args/**kwargs, HOF, lambda |
| \`debug/mutable_default.py\` | Shared list default bug |
| \`exercises/EXERCISES.md\` | |
| \`solutions/SOLUTIONS.md\` | After a written attempt |

## Done when

You can explain mutable defaults, write a small higher-order function, and the module 04 boxes in \`../PROGRESS.md\` are honest.
`,
  lab: `# Lab — Functions

A function is an object. Defining it builds that object. Calling it creates a frame, binds parameters, runs the body, and returns a value (or \`None\`).

---

## 1. First-class

**Predict** what prints. Then run \`experiments/01_first_class.py\`.

\`\`\`python
def double(x):
    return x * 2

ops = [double, abs]
print(ops[0](5), ops[1](-3))

def apply(fn, value):
    return fn(value)

print(apply(double, 10))
\`\`\`

**Modify.** Pass \`str.upper\` (or a one-argument helper) into \`apply\`.

---

## 2. Defaults are evaluated once

**Predict** the two printed lists before running \`experiments/02_defaults.py\`.

\`\`\`python
def append_item(item, bucket=[]):
    bucket.append(item)
    return bucket
\`\`\`

Call it twice with different items and no second argument. Why do the lists share memory?

The fix is \`bucket=None\` and \`if bucket is None: bucket = []\` inside the body.

---

## 3. \`*args\` and \`**kwargs\`

Run \`experiments/03_args_kwargs.py\` after predicting the printed tuples/dicts.

---

## 4. Higher-order

\`experiments/04_hof.py\` — compose two functions; map a predicate.

---

## 5. \`lambda\`

\`experiments/05_lambda.py\` — sort a list of pairs by the second element with a key.

---

## Interview prompt

Explain, out loud, why \`def f(x, items=[])\` is dangerous in interviews and production. Give the corrected pattern and one case where a mutable default is intentional (rare).
`,
  experiments: [
    [
      "01_first_class.py",
      `"""Functions are objects you can store and pass."""

def double(x):
    return x * 2


def apply(fn, value):
    return fn(value)


def main():
    ops = [double, abs]
    print("ops:", ops[0](5), ops[1](-3))
    print("apply:", apply(double, 10))
    print("name:", double.__name__)


if __name__ == "__main__":
    main()
`,
    ],
    [
      "02_defaults.py",
      `"""Defaults bind once — at definition time."""

def append_item(item, bucket=[]):
    bucket.append(item)
    return bucket


def append_safe(item, bucket=None):
    if bucket is None:
        bucket = []
    bucket.append(item)
    return bucket


def main():
    print("shared:", append_item(1), append_item(2))
    print("safe:", append_safe(1), append_safe(2))


if __name__ == "__main__":
    main()
`,
    ],
    [
      "03_args_kwargs.py",
      `"""*args packs extras; **kwargs packs named extras."""

def show(a, b, *args, **kwargs):
    print("a,b:", a, b)
    print("args:", args)
    print("kwargs:", kwargs)


def main():
    show(1, 2, 3, 4, x=5, y=6)


if __name__ == "__main__":
    main()
`,
    ],
    [
      "04_hof.py",
      `"""Higher-order: functions that take/return functions."""

def compose(f, g):
    return lambda x: f(g(x))


def main():
    pipe = compose(str, abs)
    print(pipe(-42))
    nums = [1, 2, 3, 4, 5]
    print([n for n in nums if (lambda x: x % 2 == 0)(n)])


if __name__ == "__main__":
    main()
`,
    ],
    [
      "05_lambda.py",
      `"""lambda for short throwaway callables — prefer def when naming helps."""

def main():
    pairs = [("b", 2), ("a", 3), ("c", 1)]
    print(sorted(pairs, key=lambda p: p[1]))


if __name__ == "__main__":
    main()
`,
    ],
  ],
  debug: [
    [
      "mutable_default.py",
      `"""Bug: accumulator persists across calls. Diagnose before opening solutions."""

def collect(word, seen=[]):
    seen.append(word)
    return seen


def main():
    print(collect("alpha"))
    print(collect("beta"))
    # Expected independent lists per call if the API is "start empty".


if __name__ == "__main__":
    main()
`,
    ],
  ],
  exercises: `# Exercises — module 04

## E1 · Clamp · ★

Write \`clamp(x, lo, hi)\` returning \`x\` limited to \`[lo, hi]\`.

## E2 · Once · ★★

Write \`once(fn)\` returning a function that calls \`fn\` only on the first call and returns that result forever after (ignore later args).

## E3 · Interview · ★★★

Implement \`group_by(items, key_fn)\` → \`dict\` mapping key → list of items. Preserve encounter order within each group.
`,
  solutions: `# Solutions — module 04

Open only after a written attempt.

## Debug — mutable_default

\`seen=[]\` is one list object shared by all calls. Fix with \`seen=None\` and create a new list inside.

## E1

\`\`\`python
def clamp(x, lo, hi):
    return max(lo, min(hi, x))
\`\`\`

## E2

\`\`\`python
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
\`\`\`

## E3

\`\`\`python
def group_by(items, key_fn):
    out = {}
    for item in items:
        k = key_fn(item)
        out.setdefault(k, []).append(item)
    return out
\`\`\`
`,
});

// ─── 05 Scope ────────────────────────────────────────────────────────
readyModule({
  id: "05-scope-closures",
  title: "05 — Scope and closures",
  question: "Which binding does a name resolve to?",
  readme: `# 05 — Scope and closures

★★ to ★★★

## Question

Which object does a name refer to — and what does a nested function capture?

## Working rules

LEGB: Local → Enclosing → Global → Built-in. Closures keep cells, not snapshots of integers, unless you bind carefully in a loop.

\`\`\`bash
cd 05-scope-closures
python3 experiments/01_legb.py
\`\`\`

## Done when

You can predict \`nonlocal\` vs rebind, fix the classic late-binding loop, and explain a closure cell in one sentence.
`,
  lab: `# Lab — Scope and closures

---

## 1. LEGB

Predict the printed values in \`experiments/01_legb.py\` before running.

## 2. \`global\` and \`nonlocal\`

\`experiments/02_nonlocal.py\` — when must you declare \`nonlocal\`?

## 3. Closure cells

\`experiments/03_closure_cell.py\` — nested function reads an enclosing name after the outer call returned.

## 4. Late binding in loops

\`experiments/04_late_binding.py\` — why do all lambdas see the final \`i\`? Fix with a default argument.

## Interview prompt

Draw the cells for:

\`\`\`python
def make_counters():
    out = []
    for i in range(3):
        out.append(lambda: i)
    return out
\`\`\`

Then fix it and explain the fix.
`,
  experiments: [
    [
      "01_legb.py",
      `x = "global"

def outer():
    x = "enclosing"
    def inner():
        print("inner sees:", x)
    inner()
    print("outer sees:", x)


def main():
    outer()
    print("module sees:", x)


if __name__ == "__main__":
    main()
`,
    ],
    [
      "02_nonlocal.py",
      `def demo():
    n = 0
    def bump():
        nonlocal n
        n += 1
        return n
    return bump


def main():
    f = demo()
    print(f(), f(), f())


if __name__ == "__main__":
    main()
`,
    ],
    [
      "03_closure_cell.py",
      `def maker(msg):
    def greeter():
        return f"hello {msg}"
    return greeter


def main():
    g = maker("lab")
    print(g())
    print(g.__closure__[0].cell_contents)


if __name__ == "__main__":
    main()
`,
    ],
    [
      "04_late_binding.py",
      `def broken():
    return [lambda: i for i in range(3)]


def fixed():
    return [lambda i=i: i for i in range(3)]


def main():
    print("broken:", [f() for f in broken()])
    print("fixed:", [f() for f in fixed()])


if __name__ == "__main__":
    main()
`,
    ],
  ],
  debug: [
    [
      "accumulators.py",
      `"""Each button should remember its own n. They do not. Why?"""

def make_buttons():
    buttons = []
    for n in range(3):
        buttons.append(lambda: print("pressed", n))
    return buttons


def main():
    for b in make_buttons():
        b()


if __name__ == "__main__":
    main()
`,
    ],
  ],
  exercises: `# Exercises — module 05

## E1 · Running average · ★★

\`make_avg()\` returns a function that accepts a number and returns the mean of all numbers seen so far.

## E2 · Bind · ★★

Fix \`debug/accumulators.py\` without using a class.

## E3 · Interview · ★★★

Explain the difference between capturing a mutable list vs an integer, and why \`nonlocal\` appears for integers.
`,
  solutions: `# Solutions — module 05

## Debug

All lambdas close over the same \`n\` cell. Bind at definition: \`lambda n=n: print("pressed", n)\`.

## E1

\`\`\`python
def make_avg():
    total = 0
    count = 0
    def avg(x):
        nonlocal total, count
        total += x
        count += 1
        return total / count
    return avg
\`\`\`
`,
});

// ─── 06 Builtins ─────────────────────────────────────────────────────
readyModule({
  id: "06-builtin-structures",
  title: "06 — Built-in data structures in use",
  question: "Which built-in matches the access pattern?",
  readme: `# 06 — Built-in data structures in use

★★ to ★★★

## Question

Which built-in matches the access pattern — and what does it cost?

Implementation from scratch is modules 09+. Here you choose and use \`list\`, \`dict\`, \`set\`, \`deque\`, \`heapq\`, \`Counter\`, \`defaultdict\`.

\`\`\`bash
cd 06-builtin-structures
python3 experiments/01_list_costs.py
\`\`\`
`,
  lab: `# Lab — Built-ins in use

---

## 1. List costs

\`experiments/01_list_costs.py\` — append vs insert(0). Feel the difference; do not memorize magic constants.

## 2. Dict / set membership

\`experiments/02_membership.py\`

## 3. \`deque\`

\`experiments/03_deque.py\` — why \`list.pop(0)\` is the wrong queue.

## 4. \`heapq\` and \`Counter\`

\`experiments/04_heap_counter.py\`

## Interview prompt

Given a stream of integers, maintain the median. Which structures? Why not sort every time?
`,
  experiments: [
    [
      "01_list_costs.py",
      `import time


def timed(label, fn):
    t0 = time.perf_counter()
    fn()
    print(f"{label}: {time.perf_counter() - t0:.4f}s")


def main():
    n = 40_000
    timed("append", lambda: [0 for _ in range(n)] or None)
    def inserts():
        a = []
        for i in range(n):
            a.insert(0, i)
    timed("insert(0)", inserts)


if __name__ == "__main__":
    main()
`,
    ],
    [
      "02_membership.py",
      `def main():
    data = list(range(10_000))
    as_set = set(data)
    print(9999 in data, 9999 in as_set)


if __name__ == "__main__":
    main()
`,
    ],
    [
      "03_deque.py",
      `from collections import deque


def main():
    q = deque()
    q.append(1)
    q.append(2)
    print(q.popleft(), list(q))


if __name__ == "__main__":
    main()
`,
    ],
    [
      "04_heap_counter.py",
      `import heapq
from collections import Counter


def main():
    h = [5, 1, 3]
    heapq.heapify(h)
    print(heapq.heappop(h), h)
    print(Counter("banana").most_common(2))


if __name__ == "__main__":
    main()
`,
    ],
  ],
  debug: [
    [
      "bad_queue.py",
      `"""This 'queue' gets slower as it grows. Replace the structure."""

def drain(n):
    q = list(range(n))
    out = []
    while q:
        out.append(q.pop(0))
    return out[-1]


def main():
    print(drain(5))


if __name__ == "__main__":
    main()
`,
    ],
  ],
  exercises: `# Exercises — module 06

## E1 · Top-k · ★★

Using \`Counter\` + \`heapq\` or \`most_common\`, return the k most common elements of a list.

## E2 · BFS skeleton · ★★

Write \`neighbors\` BFS using \`deque\` that returns visit order from \`start\` on an adjacency dict.

## E3 · Interview · ★★★

When is a \`list\` the right stack? When must you reach for \`deque\`?
`,
  solutions: `# Solutions — module 06

## Debug

Use \`collections.deque\` and \`popleft\`.

## E1

\`\`\`python
from collections import Counter
def top_k(nums, k):
    return [x for x, _ in Counter(nums).most_common(k)]
\`\`\`
`,
});

// ─── 07 Strings ──────────────────────────────────────────────────────
readyModule({
  id: "07-strings",
  title: "07 — Strings",
  question: "What does immutability force you to do?",
  readme: `# 07 — Strings

★ to ★★★

## Question

What does string immutability force in loops, and which algorithmic patterns show up on text?

\`\`\`bash
cd 07-strings
python3 experiments/01_immutability.py
\`\`\`
`,
  lab: `# Lab — Strings

---

## 1. Immutability and building

\`experiments/01_immutability.py\` — \`+=\` in a loop vs \`join\`.

## 2. Slicing and indexing

\`experiments/02_slices.py\`

## 3. Frequency / anagram signature

\`experiments/03_signature.py\`

## 4. Bytes vs text

\`experiments/04_bytes.py\` — encode/decode; why algorithms usually stay on \`str\` until I/O.

## Interview prompt

Implement anagram check without sorting. State complexity.
`,
  experiments: [
    [
      "01_immutability.py",
      `def build_plus(n):
    s = ""
    for i in range(n):
        s += "a"
    return len(s)


def build_join(n):
    return len("".join("a" for _ in range(n)))


def main():
    print(build_plus(1000), build_join(1000))


if __name__ == "__main__":
    main()
`,
    ],
    [
      "02_slices.py",
      `def main():
    s = "algorithm"
    print(s[0], s[-1], s[2:5], s[::-1])


if __name__ == "__main__":
    main()
`,
    ],
    [
      "03_signature.py",
      `from collections import Counter


def signature(word):
    return tuple(sorted(Counter(word).items()))


def main():
    print(signature("listen") == signature("silent"))


if __name__ == "__main__":
    main()
`,
    ],
    [
      "04_bytes.py",
      `def main():
    text = "café"
    raw = text.encode("utf-8")
    print(raw, raw.decode("utf-8"))


if __name__ == "__main__":
    main()
`,
    ],
  ],
  debug: [
    [
      "slow_builder.py",
      `"""Quadratic string builder used like a buffer. Fix it."""

def report(lines):
    out = ""
    for line in lines:
        out += line + "\\n"
    return out


def main():
    print(report(["a", "b", "c"]))


if __name__ == "__main__":
    main()
`,
    ],
  ],
  exercises: `# Exercises — module 07

## E1 · Palindrome letters · ★

Return whether a string is a palindrome ignoring non-letters and case.

## E2 · First unique · ★★

Return the first non-repeating character index, or -1.

## E3 · Interview · ★★★

Longest substring without repeating characters — state the sliding-window invariant before coding.
`,
  solutions: `# Solutions — module 07

## Debug

\`return "\\n".join(lines) + ("\\n" if lines else "")\` or append to a list then join.

## E1

Two pointers skipping non-letters; compare \`.lower()\`.
`,
});

// ─── 08 Complexity ───────────────────────────────────────────────────
readyModule({
  id: "08-complexity",
  title: "08 — Complexity",
  question: "How do you derive a bound from code?",
  readme: `# 08 — Complexity

★★ to ★★★★

## Question

How do you derive Big-O from code — including Python operations that are not O(1)?

Keep \`../COMPLEXITY_REFERENCE.md\` open.

\`\`\`bash
cd 08-complexity
python3 experiments/01_count_loops.py
\`\`\`
`,
  lab: `# Lab — Complexity

Computer-science point: Big O is an asymptotic upper bound on growth. You derive it from loops, recursion trees, and the cost of each primitive.

---

## 1. Count iterations

\`experiments/01_count_loops.py\`

## 2. Amortized append vs insert

\`experiments/02_amortized.py\` — discuss; measure roughly.

## 3. Hash average vs worst

\`experiments/03_hash_story.py\` — what average O(1) assumes.

## 4. Recursion tree

\`experiments/04_recursion_tree.py\` — fib exponential vs memoized.

## Interview prompt

Give Θ for nested \`for i in range(n): for j in range(i, n)\`. Then for \`for i in range(n): for j in range(n): ...\` with an early \`break\` on a hit — best vs worst.
`,
  experiments: [
    [
      "01_count_loops.py",
      `def triangular(n):
    count = 0
    for i in range(n):
        for j in range(i, n):
            count += 1
    return count


def main():
    for n in (1, 2, 5, 10):
        print(n, triangular(n), "closed?", n * (n + 1) // 2)


if __name__ == "__main__":
    main()
`,
    ],
    [
      "02_amortized.py",
      `"""CPython list append is amortized O(1); insert(0) is O(n)."""

def main():
    print("See COMPLEXITY_REFERENCE.md — list row.")


if __name__ == "__main__":
    main()
`,
    ],
    [
      "03_hash_story.py",
      `def main():
    d = {i: i for i in range(1000)}
    print(500 in d)
    print("Average dict get is O(1); adversarial hashing is a different lecture.")


if __name__ == "__main__":
    main()
`,
    ],
    [
      "04_recursion_tree.py",
      `def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)


def fib_memo(n, memo=None):
    if memo is None:
        memo = {}
    if n in memo:
        return memo[n]
    if n < 2:
        return n
    memo[n] = fib_memo(n - 1, memo) + fib_memo(n - 2, memo)
    return memo[n]


def main():
    print(fib(10), fib_memo(10))


if __name__ == "__main__":
    main()
`,
    ],
  ],
  debug: [
    [
      "wrong_bound.py",
      `"""Someone claimed this is O(n). It is not. Why?"""

def find_dup_pairs(nums):
    pairs = []
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] == nums[j]:
                pairs.append((i, j))
    return pairs


def main():
    print(find_dup_pairs([1, 2, 1, 3, 2]))


if __name__ == "__main__":
    main()
`,
    ],
  ],
  exercises: `# Exercises — module 08

## E1 · Bound · ★★

State tight Big-O for \`while n > 1: n //= 2\`.

## E2 · Python cost · ★★

Cost of \`s += c\` in a loop of length n building a string? Cost of \`"".join\`?

## E3 · Interview · ★★★★

Derive time and auxiliary space for DFS on an adjacency list with V, E.
`,
  solutions: `# Solutions — module 08

## Debug

Two nested loops over pairs → Θ(n²) time regardless of how many duplicates exist.

## E1

Θ(log n) iterations.

## E2

Naïve \`+=\` can be Θ(n²) character copies; \`join\` is Θ(n).
`,
});

// ─── Scaffolds 09–13 ─────────────────────────────────────────────────
const scaffolds = [
  {
    id: "09-arrays-patterns",
    title: "09 — Arrays and array patterns",
    idea: "Two pointers, sliding window, prefix sums, in-place edits — implement and cost each.",
    prereq: "08-complexity, 06-builtin-structures",
  },
  {
    id: "10-linked-lists",
    title: "10 — Linked lists",
    idea: "Singly/doubly lists; reverse, merge, Floyd cycle — pointer diagrams required.",
    prereq: "09-arrays-patterns",
  },
  {
    id: "11-stacks",
    title: "11 — Stacks",
    idea: "LIFO; monotonic stack; parentheses; next greater element.",
    prereq: "09-arrays-patterns",
  },
  {
    id: "12-queues",
    title: "12 — Queues",
    idea: "FIFO; deque; BFS as the primary client.",
    prereq: "11-stacks",
  },
  {
    id: "13-hash-tables",
    title: "13 — Hash tables",
    idea: "Hash, buckets, load factor; implement a tiny map; two-sum / anagrams as clients.",
    prereq: "01-values-types, 06-builtin-structures",
  },
];

for (const s of scaffolds) scaffoldModule(s);

console.log("Done. Ready: 04–08. Scaffold: 09–13.");
