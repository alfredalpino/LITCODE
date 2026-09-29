# Solutions — module 01

Checked on CPython 3.14.7. Identity results for integers and for `()` are CPython characteristics. Equality results are language behavior.

---

## LAB predictions

### Identity

| Expression | Result | Why |
| --- | --- | --- |
| `a is b` | True | Same list object |
| `a == b` | True | Same contents, and in this case the same object |
| `a is c` | False | `list.copy` allocates a new list |
| `a == c` | True | Same contents |
| `None is None` | True | One `None` object |
| `[] is []` | False | Each literal builds a new list |
| `() is ()` | True on CPython | Empty tuple is cached. Do not depend on this for a correctness test |
| `int("256") is int("256")` | True on CPython | Small-int cache, `-5` through `256` |
| `int("257") is int("257")` | False | Outside the cache |
| `"".join(["hel", "lo"]) == "hello"` | True | Same characters |
| `"".join(["hel", "lo"]) is "hello"` | False | The joined string is a new object. Interning of the literal does not apply to the join |

### Bool

| Expression | Result |
| --- | --- |
| `isinstance(True, int)` | True |
| `True == 1` | True |
| `True is 1` | False |
| `True + True` | 2 |
| `False * 10` | 0 |
| `len({True, 1, 1.0})` | 1 |
| `bool("")` | False |
| `bool("False")` | True |
| `bool([0])` | True |
| `None == False` | False |
| `None == 0` | False |

The set displays one element. Which one is kept is an implementation detail of insertion; the length is the fact that matters.

### Hash

`hash` raises `TypeError` for a list, a tuple that contains a list, a set, a dict, and a bytearray. It succeeds for an int, a str, a tuple of ints, a frozenset, `None`, bytes, and a `range`.

`range` is immutable and hashable. Equal ranges are the same dict key. Immutability still does not mean “every immutable object is hashable”: a tuple that contains a list is immutable as a container and unhashable because of the list. Hashability is the property to test, not a vibe about whether the object “looks frozen”.

### Protocols

`list(range(3))` is `[0, 1, 2]`. `range(3) == [0, 1, 2]` is false. `range(3) == range(0, 3)` is true. `b"ab" == "ab"` is false. `list(b"ab")` is `[97, 98]`, the integer octet values, not characters. `0.1 + 0.2 == 0.3` is false. `callable(len)` is true. `callable(1)` is false. The third `next` raises `StopIteration`.

---

## Debug — `distinct_count`

`set` is behaving correctly. `True == 1 == 1.0` and the hashes match, so they are one set element. `distinct_count([True, 1, 2])` returns `2`. `distinct_count([1, 1, 2])` returns `2`. The empty list returns `0`.

In an interview, the first move is to ask whether booleans and integers are distinct values. If the problem means “unique under `==`”, the set is the right tool and the spec’s expected `3` is the bug in the spec. If the problem really means “different Python values even when they compare equal”, a set of the values cannot express that.

A repair that matches the written spec distinguishes by type as well as equality:

```python
def distinct_count(values):
    seen = []
    for value in values:
        if not any(type(value) is type(kept) and value == kept for kept in seen):
            seen.append(value)
    return len(seen)
```

That is O(n²) and exists to satisfy a spec that fights the data model. The algorithmic lesson is the question, not this loop. Do not ship it as your default uniqueness test.

---

## Exercises

### E1

1. `(1, 2, 3)` yes. Tuple of hashables.
2. `(1, 2, [3])` no. Contains an unhashable list.
3. `frozenset({1, 2})` yes.
4. `bytearray(b"xy")` no. Mutable, unhashable.
5. `range(10)` yes. A range is immutable and hashable. Equal ranges collide as the same key.
6. `None` yes.
7. `True` yes. It is also equal to `1`, so it collides with the integer key `1`.

### E2

| Expression | Length | Members |
| --- | --- | --- |
| `{0, False, 0.0}` | 1 | one of `0`, `False`, `0.0` |
| `{1, True}` | 1 | one of `1`, `True` |
| `{"a", "a"}` | 1 | `"a"` |
| `{b"a", "a"}` | 2 | both, because they are not equal |
| `{(1, 2), (1, 2)}` | 1 | `(1, 2)` |

### E3

A tuple of a length and a one-character string is hashable and stable, so it can be a dict key. A list cannot.

Brute force compares each word’s signature to a growing list of groups: quadratic comparisons. A dict jumps to the group in expected O(1) per word, O(n) overall for n words of bounded length. The bottleneck a dict removes is the repeated scan of groups.

```python
def signature(word):
    return (len(word), word[0])


def group(words):
    groups = {}
    for word in words:
        groups.setdefault(signature(word), []).append(word)
    return groups
```

`group(["apple", "ape", "ant", "bear"])` yields:

```python
{
    (5, "a"): ["apple"],
    (3, "a"): ["ape", "ant"],
    (4, "b"): ["bear"],
}
```

Empty `words` yields `{}`. This version assumes every word is non-empty, because `word[0]` is part of the stated signature. An empty string is the edge case to mention out loud.

Time: expected O(n) for n words if hashing a short tuple is treated as O(1). Space: O(n) for the groups.

### E4

“`True` and `1` are not the same object: `True is 1` is false. They are equal, and `bool` subclasses `int`, so a set keeps only one of them. A tuple can be a key when its elements can. A list cannot, because it is mutable and unhashable. A tuple that contains a list is unhashable for the same reason: the inner list could change, and the key’s hash would no longer describe the bucket it was stored in.”
