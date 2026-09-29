# Python facts

Each fact is something you should be able to say without notes, and then demonstrate. Facts marked **CPython** are not laws of the language. If a later Python version changes an implementation fact, the language fact beside it should still stand.

Lab pointers say where you practice the fact. “Planned” means the module is on the curriculum and not built yet.

---

## F1 — A name is bound to an object

**Fact.** `x = 1` binds the name `x` to an int object. It does not put `1` inside a box called `x`.

**Explanation.** The namespace stores a reference under the string `"x"`. The integer object exists independently of the name. Another name can be bound to the same object. Rebinding `x` changes the namespace entry and leaves the object alone, unless nothing else refers to it.

**Example.**

```python
a = [1, 2]
b = a
a.append(3)
```

`b` sees `[1, 2, 3]` because `append` mutates the one list both names reference.

**Underlying mechanism.** In CPython, a module namespace is a dict from strings to objects (`globals()`). Function locals are stored more compactly, but the language meaning is the same: a binding, not a container that holds a copy.

**Why it matters.** Alias bugs, “I returned a copy but it wasn’t”, and every in-place algorithm you will write.

**Common misconception.** “Variables are boxes, and `b = a` copies the box.” That model cannot explain shared mutation.

**Interview relevance.** If you cannot say this, you will mis-debug list and dict problems and you will misuse default arguments. Lab: `02-variables-bindings`.

---

## F2 — `is` and `==` test different things

**Fact.** `is` tests identity. `==` tests equality.

**Explanation.** Two lists can contain the same values and still be different objects. Two names can refer to one object, in which case both tests are true, unless `__eq__` has been defined strangely.

**Example.**

```python
a = [1, 2, 3]
b = a
c = a.copy()
```

`a is b` is true. `a == b` is true. `a is c` is false. `a == c` is true.

**Underlying mechanism.** `==` invokes the equality path in the data model. `is` compares object identity and does not call your `__eq__`.

**Why it matters.** Use `is` for `None` and for genuine identity questions. Use `==` for values. Using `is` on integers or strings as a value test is a bug that sometimes passes.

**Common misconception.** “If `==` is true, `is` is true.” False for equal lists, and false for many equal integers outside CPython’s small-int cache.

**Interview relevance.** Singletons, interning traps, and “did this function return the same list I passed in?”. Lab: `01-values-types`, `02-variables-bindings`.

---

## F3 — Mutable default arguments live on the function object

**Fact.** A default argument expression runs once, when the `def` statement builds the function, not on each call.

**Explanation.** The function object stores the resulting object in `__defaults__`. Later calls that omit the argument reuse that same object. If it is a list and you `append`, the next call sees the append.

**Example.**

```python
def add_item(item, items=[]):
    items.append(item)
    return items
```

`add_item(1)` and `add_item(2)` share one list.

**Underlying mechanism.** `def` is an executable statement. It creates a function object. Default expressions are evaluated at that moment and the objects are kept.

**Why it matters.** This is the same machinery as F1: a name (`items`) bound to one long-lived object. The usual repair is `items=None` and a new list inside the body when the argument was omitted.

**Common misconception.** “The default is a fresh list every call, because the `def` line looks like it is inside the function.” The `def` line runs at definition time.

**Interview relevance.** Extremely common Python screen. Full experiment: module 04 (planned). Do not wait for that module to stop writing `def f(xs=[])`.

---

## F4 — Lists are mutable

**Fact.** `append`, `extend`, `pop`, item assignment, and `sort` change the existing list object.

**Explanation.** Other names bound to that list observe the change. Building a new list (`xs + [1]`, a slice, a comprehension) does not change the old object.

**Example.** `xs.append(1)` mutates. `ys = xs + [1]` binds `ys` to a new list.

**Underlying mechanism.** A CPython list is a resizable array of references. Mutation updates that array. The language guarantee is the mutation semantics, not the array layout.

**Why it matters.** In-place algorithms, accidental sharing, and the difference between `sorted(xs)` (new list) and `xs.sort()` (same list, returns `None`).

**Common misconception.** “`xs.sort()` returns the sorted list.” It returns `None`.

**Interview relevance.** Every array problem you solve in Python. Lab: `01`, `02`. Deeper list costs: module 06 (planned) and `COMPLEXITY_REFERENCE.md`.

---

## F5 — A tuple can contain a mutable object

**Fact.** A tuple’s slots cannot be rebound. The objects in those slots may still be mutable.

**Explanation.** Immutability of the container is not deep immutability. `t = ([],)` forbids `t[0] = something`. It does not forbid `t[0].append(1)`.

**Example.** After `t[0].append(1)`, `t` is `([1],)`.

**Underlying mechanism.** The tuple stores references. `append` follows the reference and mutates the list. The tuple’s own array of references is unchanged, so the tuple object was not mutated, and yet the structure you see has changed.

**Why it matters.** A tuple is hashable only if its contents are hashable. `([],)` cannot be a dict key, because the list can change and would corrupt the hash table.

**Common misconception.** “Tuples are deeply immutable, so they are always safe dict keys.”

**Interview relevance.** Hashability questions and “frozen” state that is not actually frozen. Lab: `01-values-types`.

---

## F6 — A dict key must be hashable

**Fact.** Dictionary keys and set elements must be hashable, and their equality must agree with their hash: if `a == b`, then `hash(a) == hash(b)` for as long as they are keys.

**Explanation.** The table uses the hash to choose a bucket, then equality to find the key. If either result can change while the key sits in the table, lookup breaks.

**Example.** `{[1, 2]: "no"}` raises `TypeError`. `{(1, 2): "yes"}` works. `{(1, [2]): "no"}` raises, because the inner list is unhashable.

**Underlying mechanism.** Hash table: hash function, hash value, bucket, collision handling, equality check. Average lookup is treated as O(1) under hashing assumptions. Worst-case chains or collision attacks are not O(1). CPython dicts are open-addressed and heavily engineered; that engineering is not a mathematical guarantee for every input.

**Why it matters.** Frequency maps, seen-sets, memoization keys. The wrong key type is a design bug, not a small syntax error.

**Common misconception.** “Dict lookup is always O(1), guaranteed.” It is the right default model for interviews when keys are well-behaved, and it is not a worst-case theorem.

**Interview relevance.** Central. Lab: `01`. Full hashing lab: module 13 (planned). See also `DSA_FACTS.md`.

---

## F7 — `bool` is a subclass of `int`

**Fact.** `True` and `False` are boolean objects, and `bool` subclasses `int`. `True == 1` and `False == 0`. `True + True == 2`. `True is 1` is false.

**Explanation.** This is a real language design choice, not an accident of one example. Hashes match too: `hash(True) == hash(1) == hash(1.0)`.

**Example.** `len({True, 1, 1.0})` is `1`.

**Underlying mechanism.** Equality and hashing are consistent across these values, so a set keeps one of them. Subclassing means `isinstance(True, int)` is true.

**Why it matters.** Deduping, counting, and using booleans as dict keys will silently merge flags with integers.

**Common misconception.** “`True` is just a different kind of value from `1`, so a set will keep both.”

**Interview relevance.** High, because it looks like a trick and is actually the data model. Lab: `01-values-types`, `debug/distinct_count.py`.

---

## F8 — Strings are immutable

**Fact.** You cannot change a character inside a `str`. Operations that “change” text build a new string.

**Explanation.** Index assignment on a string raises `TypeError`. Concatenation allocates a new string and copies characters.

**Example.** `"ab"[0] = "c"` fails. `s = "a"; s = s + "b"` rebinds `s` to a new object.

**Underlying mechanism.** Immutability is what makes strings hashable and shareable. Repeated `s += chunk` in a loop copies a growing string each time, which is quadratic. Collect pieces and `"".join` them.

**Why it matters.** Palindrome and anagram code that builds strings in a loop can be accidentally quadratic even when the algorithm looks linear.

**Common misconception.** “`+=` on a string mutates the buffer the way `append` mutates a list.” It does not. The name is rebound.

**Interview relevance.** String problems and complexity follow-ups. Module 07 (planned).

---

## F9 — Slicing a list, tuple, or string builds a new object

**Fact.** `xs[:]`, `xs[1:3]`, and `"hello"[:2]` produce a new sequence. For a list, the new list contains the same references as the slice of the old one (shallow).

**Example.**

```python
a = [1, 2, 3]
b = a[:]
```

`a == b` and `a is not b`. After `a.append(4)`, `b` is still `[1, 2, 3]`. If the elements are lists, both slices still share those inner lists.

**Underlying mechanism.** Slice syntax uses the sequence’s slicing path and, for these built-in types, allocates a new container. It is not a view. (A `memoryview` slice is a different tool and can be a view. Do not generalize “slice” to every type.)

**Why it matters.** People use `xs[:]` as a defensive copy and then mutate inner objects, thinking they copied deeply.

**Common misconception.** “A slice is a window onto the same list.” Not for `list` and `str`.

**Interview relevance.** Copy bugs, subarray extraction cost: slicing `k` elements is O(k) time and space. Lab: `02`.

---

## F10 — Generators produce values on demand

**Fact.** A generator function (one that uses `yield`) returns a generator object. It does not build the whole result list when you call it.

**Explanation.** Each `next` resumes the function until the next `yield`. Memory stays proportional to the state you actually keep, not to the length of the logical sequence.

**Example.** `(x for x in range(1000000))` is a generator expression. `list(range(1000000))` builds a million-element list. `range` itself is already lazy: it stores start, stop, and step, not a million ints.

**Underlying mechanism.** The generator object holds the frame and the instruction pointer. That is a form of suspended computation.

**Why it matters.** Streaming, infinite conceptual sequences, and not blowing memory on intermediate lists. It also means a generator is single-pass.

**Common misconception.** “Calling the generator function runs the body immediately and returns a list.” The call returns the generator. The body runs as you iterate.

**Interview relevance.** Iterators and generators are planned inside the Python-instrument block (see the curriculum note under modules 04–06). You can use a generator expression before that lab as long as you know it is lazy and single-pass.

---

## F11 — A comprehension does not leak its loop variable

**Fact.** In Python 3, the name bound by a comprehension’s `for` is not visible in the surrounding scope after the comprehension runs.

**Explanation.** `[i for i in range(3)]` does not leave `i` defined in the enclosing function. That is a language rule.

**Example.** After `xs = [i for i in range(3)]` at module level in a fresh namespace, `i` is not defined.

**Underlying mechanism.** CPython 3.12 and later often **inlines** the comprehension into the enclosing bytecode instead of creating a nested function. That is an implementation strategy. It does not bring back the Python 2 leak. Do not describe modern comprehensions as “always a separate function object” — that was the older CPython strategy, and the visible rule is still “no leak”.

**Why it matters.** Closures that capture a loop variable are a different bug (`lambda` inside a `for` loop). Do not confuse that with comprehensions.

**Common misconception.** “Comprehensions always create a nested function, so they have their own scope object you can inspect.” The scope behavior you can rely on is the non-leak. The nested-function implementation is historical.

**Interview relevance.** Output-prediction questions. Planned depth: scope module 05.

---

## F12 — Python does not promise tail-call elimination

**Fact.** A recursive call, even in tail position, still consumes a stack frame in CPython. Deep recursion raises `RecursionError` when the stack limit is hit.

**Explanation.** The language does not require tail-call optimization. Rewriting a tail call as a loop is a programmer’s job when depth can be large. An explicit stack is the other standard rewrite.

**Example.** A recursive depth-first walk of a chain of length 10_000 can fail even though the algorithm is “tail-ish”.

**Underlying mechanism.** Each call pushes a frame. CPython’s default limit is finite (`sys.getrecursionlimit()`). Raising the limit is not a repair for a linear recursion over a large input; it trades a crash for a bigger crash.

**Why it matters.** Tree and graph recursion in interviews is fine when depth is logarithmic or the constraint is small. It is the wrong shape for a linked list of length 10^5 unless the constraints say otherwise.

**Common misconception.** “Python optimizes tail recursion the way Scheme does.” It does not.

**Interview relevance.** Module 20 (planned). Mention the limit when you choose recursion in an interview and the depth can be n.

---

## F13 — `list.append` is amortized O(1) in CPython

**Fact.** CPython lists overallocate. A single append that triggers a resize copies the pointer array and is O(n). Across n appends onto an initially empty list, the total copying is O(n), so the average per append is O(1).

**Explanation.** This is amortized analysis of a specific representation: a dynamic array of pointers.

**Example.** Building a list by n appends is expected to be linear overall. Building a list by `xs = xs + [item]` in a loop is quadratic, because each concatenation copies the whole list and that pattern is not amortized away.

**Underlying mechanism.** Geometric overallocation. The constant factors and growth policy are CPython details and have changed historically. The language does not require a particular growth factor.

**Why it matters.** Interviewers accept “append is amortized O(1)”. You should be able to say the word amortized and to reject `xs = xs + [x]` in a loop.

**Common misconception.** “Append is always O(1), even in the worst single call, in every Python implementation, by the language spec.”

**Interview relevance.** Array construction, and any follow-up of “is that really O(n)?”. See `COMPLEXITY_REFERENCE.md` and `DSA_FACTS.md` on amortization.

---

## F14 — Dict and set lookup are average O(1), not a blanket guarantee

**Fact.** Under ordinary hashing assumptions, expected membership and key lookup are O(1). The worst case is O(n).

**Explanation.** Collisions put multiple keys in the same bucket or probe sequence. A pathological set of keys, or a broken hash, degenerates. CPython uses a randomized hash salt for str and bytes (and other protections) so an attacker cannot easily force collisions. That is a mitigation, not a change to the big-O worst case.

**Example.** `x in some_set` inside a loop over n items is expected O(n) total. `x in some_list` in that same loop is O(n²).

**Underlying mechanism.** See F6.

**Why it matters.** The most common optimization in interviews is “replace the linear scan with a set or dict”. You should say average O(1) and know what you are assuming.

**Common misconception.** “Hash maps are O(1) worst case.” Also the opposite mistake: “hash maps are O(n) so I should not use them.”

**Interview relevance.** Module 13 (planned). Use the average-case model in interviews, and mention worst case if asked.

---

## F15 — CPython’s built-in sort is stable and not a textbook quicksort

**Fact.** `list.sort` and `sorted` are stable: equal elements keep their original order. The algorithm is Timsort, a hybrid natural mergesort with insertion sort for short runs.

**Explanation.** Stability matters when you sort by one key and then another. Worst-case time is O(n log n). Extra memory is used; it is not an in-place quicksort.

**Example.** Sorting `[(1, "b"), (1, "a")]` by the first element only leaves `"b"` before `"a"`.

**Underlying mechanism.** Timsort finds already-ordered runs and merges them. Best case on many real inputs is better than a naive mergesort, still within O(n log n) worst case.

**Why it matters.** You should implement the textbook sorts in module 23 so you understand them, and you should call `sorted` in real code and in interviews unless the problem forbids it or asks you to implement a sort.

**Common misconception.** “Python sorts with quicksort, so it is unstable and O(n²) worst case.” That is not CPython’s sort.

**Interview relevance.** “Can I use the built-in sort?” Yes, unless the prompt is “implement merge sort”. Then say it is stable and O(n log n).

---

## F16 — Use `deque` when you need O(1) pops from the left

**Fact.** `list.pop()` and `list.append()` are amortized O(1) at the **end**. `list.pop(0)` and `list.insert(0, x)` move the other elements and are O(n). `collections.deque` supports append and pop at both ends in O(1).

**Explanation.** A list is a dynamic array. A deque is a block-linked structure designed for both ends. Indexing the middle of a deque is not the thing it is good at.

**Example.** A BFS that does `queue.pop(0)` on a list is accidentally quadratic.

**Underlying mechanism.** Representation follows the access pattern. This is a CPython cost fact that matches the usual interview cost model for these types.

**Why it matters.** Queue and sliding-window-maximum problems. Module 12 (planned).

**Common misconception.** “A list is fine as a queue because pop is O(1).” Pop from the end is. Pop from the front is not.

**Interview relevance.** Say “I’ll use a deque” when the structure is a queue.

---

## F17 — The GIL is a CPython implementation concern

**Fact.** The global interpreter lock, when it is present, is a lock inside CPython that allows only one thread to execute Python bytecode at a time. It is not part of the Python language definition. Other implementations do not have to provide it. CPython can be built free-threaded (no GIL); that work started shipping as an optional build in the 3.13 line and continues in 3.14.

**Explanation.** The GIL exists historically to protect CPython’s reference-counting interpreter. It does not mean “Python cannot use threads”. Threads can still overlap I/O. It does mean that several threads running pure Python bytecode do not give you several cores on a GIL-enabled build.

**Example.** On the CPython 3.14.7 build used to check this lab, `sys._is_gil_enabled()` returned true. A free-threaded build would answer differently. Do not hard-code that result as a language fact.

**Underlying mechanism.** One mutex around bytecode execution in the default build, plus a cyclic garbage collector because reference counting alone does not collect cycles. Both are CPython memory-management details. Module 39 (planned) is the place to inspect them.

**Why it matters.** Interviewers sometimes ask. The precise answer is: CPython implementation, protects the interpreter’s internal invariants, limits CPU-bound Python threads on GIL builds, not a property of `python` the language, and not a substitute for algorithmic complexity. A quadratic algorithm is still quadratic with threads.

**Common misconception.** “Python has a GIL, so threads are useless, and this is specified by Python.” Also: “the GIL makes programs slow” as a substitute for looking at the algorithm.

**Interview relevance.** Answer in three sentences, then go back to the algorithm. Do not volunteer a GIL monologue in a DSA round.

---

## F18 — CPython caches small integers

**Fact.** CPython keeps a single object for each integer in a fixed range, historically `-5` through `256` inclusive. `int("256") is 256` is true on that implementation. `int("257") is 257` is false when `257` is not the same already-created object.

**Explanation.** This is an optimization so tiny integers, which dominate real programs, are not allocated constantly. The language only requires that equal integers compare equal with `==`.

**Example.** Two separately compiled assignments `a = 257` and `b = 257` produced `a is b` equal to false when this lab was checked. The same source compiled once may place one constant in `co_consts` and reuse that object, so `257 is 257` inside one code object can be true. The experiment that teaches the fact must create the integers independently (`int("257")` or separate compilations).

**Underlying mechanism.** A preallocated array of int objects, plus constant folding inside a single code object. Both are CPython.

**Why it matters.** Identity checks on integers are not value checks. A test that uses `is` for numbers is wrong even when it passes for `1`.

**Common misconception.** “All equal integers are the same object.” Or: “`257 is 257` being true in the REPL proves 257 is interned.” The REPL compiled one statement.

**Interview relevance.** Output prediction. Lab: `00-python-runtime/debug/same_object.py`.

---

## F19 — Errors have a phase

**Fact.** `SyntaxError` is raised while the source is being parsed or compiled. `NameError` is raised when a load of a missing name actually executes. `TypeError` is raised when an operation’s objects do not support it.

**Explanation.** A function with a misspelled name in its body can be defined successfully. The error waits until the call reaches that load. A missing colon fails before any of the module runs.

**Example.** `def f(): return y` defines `f`. `f()` raises `NameError`. `def f(` raises `SyntaxError` and does not define `f`.

**Underlying mechanism.** The compiler resolves syntax and builds a code object. Name lookup for a global happens at runtime (the name is stored in `co_names` and loaded then). Local names are a different, compile-time slot allocation; a local that is never bound still fails when the load runs (`UnboundLocalError`), which is a runtime error with a compile-time clue. Full story: module 05.

**Why it matters.** Reading a traceback starts with “did this even compile?”

**Common misconception.** “Python checks all names before the program starts.” It does not.

**Interview relevance.** Debugging rounds. Lab: `00`, experiments on syntax versus names.

---

## F20 — Dynamic typing and strong typing are both true

**Fact.** Names are untyped. Objects are typed. The interpreter does not coerce arbitrary types to make an operation succeed.

**Explanation.** `x = 1; x = "a"` is legal because the name was rebound. `"a" + 1` is a `TypeError` because `str` and `int` do not define that addition. That second fact is strong typing in the usual Python sense of the phrase.

**Example.** `True + 1` works because `bool` is an `int` subclass (F7), not because Python silently turns every truthy value into 1. `"2" + 1` fails.

**Underlying mechanism.** Each operation looks up a slot on the type (`nb_add` and friends at the C level; `__add__` in the data model). Failure raises. There is no general “convert and retry” rule, aside from specific numeric coercions between numbers.

**Why it matters.** You can write generic algorithms over any objects that support the operations (duck typing) and you still get errors at the operation, not silent corruption.

**Common misconception.** “Python is weakly typed because it has no declarations.” Declarations are a separate axis from whether operations check types.

**Interview relevance.** “Is Python strongly typed?” The accurate short answer is: dynamically typed, and strongly typed in the sense that mismatched operations raise. Lab: `00` and `01`.

---

## F21 — `and` and `or` return operands, and they short-circuit

**Fact.** `a and b` evaluates `a`. If `a` is false, the result is `a` and `b` is not evaluated. If `a` is true, the result is `b`. `a or b` returns `a` when `a` is true and does not evaluate `b`; otherwise it returns `b`.

**Explanation.** The result is not automatically wrapped in `bool`. `[] or "default"` is `"default"`. `1 and 2` is `2`.

**Example.** `0 and print("no") or print("yes")` does not call the first `print`. The second `print` runs and returns `None`, so the expression’s value is `None`.

**Underlying mechanism.** These operators are control flow, not function calls. The skipped operand does not run, so its side effects do not happen.

**Why it matters.** Defaulting patterns (`name = user_name or "anon"`) treat any falsy value as missing, including `""` and `0`. That is sometimes what you want and often a bug.

**Common misconception.** “`and` returns `True` or `False`.” It returns one of the operands.

**Interview relevance.** Output prediction. Lab: `03-control-flow`.

---

## F22 — Annotations in 3.14 are not the same mechanism as defaults

**Fact.** Default argument values are evaluated when the function is defined (F3). Annotations, as of Python 3.14 (PEP 649 / PEP 749), are stored so they can be evaluated lazily. `annotationlib.get_annotations` can return them as values or as strings. Accessing `__annotations__` evaluates them.

**Explanation.** People lump “the stuff in the `def` header” into one bag. Defaults and annotations are different mechanisms. A default that builds a list still builds it at definition time. An annotation does not, by itself, check types at call time. Python does not do runtime type enforcement unless you add a tool that does.

**Example.** `def f(x: int = []) -> int: ...` still has the mutable-default bug. The annotation `int` will not stop a caller from passing a string.

**Underlying mechanism.** CPython 3.14 exposes `annotationlib`. The evaluated dict you see on `__annotations__` is the result of evaluation on access, which is why it can contain real classes like `int`. Format `STRING` gives the source form. This replaced the older “annotations are always evaluated immediately and stored” behavior. `from __future__ import annotations` remains a separate, stringifying behavior.

**Why it matters.** So you do not “fix” a default-argument bug by adding type annotations, and you do not describe 3.14 annotations with a pre-3.14 mental model.

**Common misconception.** “Annotations are evaluated exactly like defaults, at definition, and they type-check calls.”

**Interview relevance.** Low for a DSA round. High the moment someone asks you to explain a surprising `def` line. Module 04 will practice defaults; this fact is here so the model is not wrong in the meantime.

---

## Adding facts

When a later module teaches a fact you had to learn the hard way, add it in this shape:

```text
Fact
Explanation
Example
Underlying mechanism
Why it matters
Common misconception
Interview relevance
```

Keep the language / CPython split visible in the first line.
