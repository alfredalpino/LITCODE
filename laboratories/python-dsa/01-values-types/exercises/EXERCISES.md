# Exercises — module 01

## E1 · Key or not · ★

For each object, write `yes` or `no`: can it be a dict key? One sentence each, naming the rule, not the error message.

1. `(1, 2, 3)`
2. `(1, 2, [3])`
3. `frozenset({1, 2})`
4. `bytearray(b"xy")`
5. `range(10)`
6. `None`
7. `True`

Then check with `{obj: "ok"}` in a scratch file.

## E2 · What the set keeps · ★★

Predict `len` and the remaining contents. Sets are unordered; predict the length exactly and the members up to order.

```python
{0, False, 0.0}
{1, True}
{"a", "a"}
{b"a", "a"}
{(1, 2), (1, 2)}
```

## E3 · A record that must be a key · ★★

You are grouping words by a signature of `(length, first character)`. Example: `"apple"` → `(5, "a")`.

Write `signature(word) -> tuple` and `group(words) -> dict` that maps a signature to the list of words with that signature. Preserve the order of words within each list.

```python
group(["apple", "ape", "ant", "bear"])
```

should group `"apple"` alone, `"ape"` and `"ant"` together, and `"bear"` alone.

Why is a tuple the right key, and a list the wrong key? Answer in two sentences before you code. This is the hash-table move you will use constantly. Brute force is a list of pairs; say why you are not using it once `words` is long.

## E4 · Interview · ★★★

Interviewer: “Are `True` and `1` the same object? Does a set keep both? Why can I use a tuple as a key and not a list? What about a tuple that contains a list?”

Four short answers. No code on the board until they ask for the grouping function from E3.
