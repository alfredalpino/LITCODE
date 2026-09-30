# Lab — Values and types

An object has an identity, a type, and a value. Names come in module 02. Here the object is the subject.

Computer-science point: a type describes a set of values and the operations that are meaningful on them. Python does not make you declare the type of a name. It still checks the operation. A dict key is not “any object”; it is an object that can be hashed and compared in a stable way, because that is what the hash-table algorithm requires.

---

## 1. The catalog

These are the built-in types you need for algorithms. You are not memorizing a poster. You are going to prod each one.

| Type | Role in algorithms | Mutable? | Can it be a dict key? |
| --- | --- | --- | --- |
| `int` | counters, indexes, bit sets, modular arithmetic | | |
| `float` | rare in exact algorithms; binary fractions surprise people | | |
| `complex` | almost never in interviews | | |
| `bool` | flags; also an `int` | | |
| `str` | text problems | | |
| `bytes` | raw octets | | |
| `bytearray` | mutable octets | | |
| `None` | one object meaning “no value” | | |
| `list` | dynamic array of references | | |
| `tuple` | fixed record of references | | |
| `set` | uniqueness, membership | | |
| `frozenset` | uniqueness that must be a key | | |
| `dict` | hash map | | |
| `range` | arithmetic progression, not a list | | |

Fill the two blank columns before you run anything. Then run:

```bash
python3 experiments/01_catalog.py
```

The script prints `type`, a sample value, whether `hash` succeeds, and whether item assignment succeeds. Your table should match the run. Where it does not, the run wins; write the correction.

**Modify.** Add one object of your own to `SAMPLES` in that file. Predict hashability and mutability before you run.

---

## 2. Identity and equality

`is` asks whether two expressions refer to the same object. `==` asks whether they are equal as values.

**Predict** for each line: `True` or `False`.

```python
a = [1, 2, 3]
b = a
c = a.copy()

a is b
a == b
a is c
a == c

None is None
[] is []
() is ()
int("256") is int("256")
int("257") is int("257")
```

The last two are the module 00 result coming back as a type question. Run:

```bash
python3 experiments/02_identity.py
```

**Modify.** Build two equal strings with `"".join(["hel", "lo"])` and `"hello"`. Predict `==` and `is`. Equal strings are not required to be the same object. A literal that looks the same may be interned by CPython. `is` is still the wrong tool for “same text”.

---

## 3. `bool` is an integer

**Predict.**

```python
isinstance(True, int)
True == 1
True is 1
True + True
False * 10
len({True, 1, 1.0})
bool("")
bool("False")
bool([0])
```

`bool("False")` is the one people miss. A non-empty string is true. The characters `F-a-l-s-e` do not get parsed as a boolean.

Run:

```bash
python3 experiments/03_bool_and_none.py
```

Truthiness as control flow is module 03. Here you only need the values.

---

## 4. Hashability

A hash table places a key by its hash, then confirms with `==`. If `a == b`, the hashes must match, and neither the hash nor the equality may change while the key is in the table. Mutable containers can change, so they refuse to be hashed.

**Predict** which of these raise `TypeError` on `hash(...)`:

```python
hash(1)
hash("a")
hash((1, 2))
hash([1, 2])
hash((1, [2]))
hash(frozenset({1, 2}))
hash({1, 2})
hash(bytearray(b"a"))
hash(None)
```

Run:

```bash
python3 experiments/04_hashability.py
```

**The tuple case is the whole lesson.** `(1, [2])` is immutable in the shallow sense: you cannot replace slot 1. Slot 1 refers to a list, and the list can change. Hashing it would let you break the table. So the hash is rejected up front.

**Modify.** After a successful `hash((1, 2))`, think about whether you could change the tuple so the hash would have to change. You cannot. That is why the tuple of ints is a legal key.

---

## 5. Iterable and callable

These are capabilities, not extra types.

- Iterable: `iter(obj)` returns an iterator. `for` uses this. Lists, tuples, sets, dicts, strings, ranges, and files are iterable. An `int` is not.
- Callable: `callable(obj)` is true for functions, classes, and objects that define `__call__`. The data-model module later will open that up. Here, notice that `len` is callable and `1` is not.

**Predict.**

```python
list(range(3))
range(3) == [0, 1, 2]
range(3) == range(0, 3)
b"ab" == "ab"
list(b"ab")
```

`range` stores a start, a stop, and a step. It compares equal to another range with the same meaning. It does not compare equal to the list of its values. `bytes` and `str` are different types; they do not compare equal just because the characters look similar.

Run:

```bash
python3 experiments/05_protocols.py
```

**Floats, briefly.** `0.1 + 0.2 == 0.3` is false. Binary floating point cannot represent those decimals exactly. Algorithm problems that ask for exact answers should stay on `int` unless the problem is about floats. Predict, then let the experiment print the comparison.

---

## 6. Break it

`debug/distinct_count.py` documents an intended result:

```text
distinct_count([True, 1, 2]) == 3
distinct_count([1, 1, 2]) == 2
```

Run it. It fails.

Write, before you patch anything:

1. What does `set` actually do with `True` and `1`?
2. Is that a bug in `set`?
3. What would you ask the interviewer if a problem said “unique values” and the input might contain booleans and integers?
4. If the spec really wants `True` and `1` to count as different, what are you forbidden from using?

Then read the solution section for this debug file.

---

## 7. Exercises

`exercises/EXERCISES.md`.

---

## Checkpoint

- `==` is value, `is` is identity.
- Mutability and hashability are linked because hash tables assume stable hashes.
- A tuple of mutable objects is not a dict key.
- `bool` subclasses `int`, so `True` and `1` are equal and share a hash.
- `range` is not a list. `bytes` is not a `str`. `None` is not `False`.
