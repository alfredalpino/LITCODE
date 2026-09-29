# Lab — Variables are bindings

The sentence this module exists to make unavoidable:

> A Python name is bound to an object. Assignment rebinds the name. It does not copy the object, and it does not pour a value into a box.

Computer-science point: names are entries in an environment (a namespace). The environment maps a name to a reference. Data structures store references in slots, the same way. Aliasing means two references, same object. Mutation follows every reference. Rebinding replaces one reference and leaves the others alone.

That single distinction explains shared lists, nested-copy bugs, “I cleared it inside the function”, and a large fraction of wrong in-place algorithms.

---

## 1. One list, two names

**Predict** the value of each expression.

```python
a = [1, 2, 3]
b = a
c = a.copy()
d = a[:]

a is b
a == b
a is c
a == c
a is d
a == d

a.append(4)
# then the values of a, b, c, d
```

Run:

```bash
python3 experiments/01_shared_list.py
```

`b = a` copies a reference. `list.copy` and a slice each allocate a new list and copy the references that were in the slots. The integers are immutable, so sharing those particular elements is invisible. The lists are the objects that differ.

**Modify.** Replace the integers with one-element lists: `a = [[1], [2], [3]]`, keep `c = a.copy()`, then `a[0].append(9)`. Predict `a` and `c` before you run the changed script.

---

## 2. Shallow and deep

`copy.copy` and `list.copy` are shallow. `copy.deepcopy` walks the graph and allocates new containers all the way down.

**Predict** after the inner append:

```python
import copy
nested = [[1], [2]]
shallow = copy.copy(nested)
deep = copy.deepcopy(nested)
nested[0].append(9)
```

What are `nested`, `shallow`, and `deep`? Is `nested[0] is shallow[0]`? Is `nested[0] is deep[0]`?

Run:

```bash
python3 experiments/02_nested_copy.py
```

**Modify.** Add a third level, `[[[1]]]`, and predict which levels a shallow copy shares. Draw it. The drawing is the exercise; the script is the check.

---

## 3. Mutation and rebinding are different statements

`append` changes the list object. `=` changes the binding of one name.

**Predict.**

```python
p = [1]
q = p
p += [2]
# p, q, and whether p is q

p = p + [3]
# p, q, and whether p is q

x = 10
y = x
x = x + 1
# x and y
```

`+=` on a list is an in-place extend. The name keeps its binding. `+` on a list builds a new list, and `=` binds `p` to that new list. `q` still refers to the old one.

`+=` on an int cannot mutate the int. It rebinds. `y` stays on `10`.

Run:

```bash
python3 experiments/03_rebind_versus_mutate.py
```

There is a function-shaped version of the same fact. A parameter is a local name. Assigning to the parameter rebinds the local name. Calling a mutating method follows the reference into the caller’s object.

**Predict** the value of `data` after each call.

```python
def replace(items):
    items = []

def clear(items):
    items.clear()

data = [1, 2, 3]
replace(data)
clear(data)
```

Same experiment file prints this second half.

---

## 4. The tuple does not save you

```python
holder = ([],)
holder[0].append(1)
```

**Predict.** Does this raise? What is `holder` afterward? Can you still use `holder` as a dict key?

Run:

```bash
python3 experiments/04_tuple_alias.py
```

The tuple’s slot did not change. It still refers to the same list. The list grew. Immutability was never deep. Hashability fails because of the list, which you already saw in module 01. This experiment is here so the binding picture and the hash picture become one picture.

---

## 5. Break it

`debug/zeros_grid.py` is supposed to build independent rows. Setting the corner cell to `1` should change one cell.

Run:

```bash
python3 debug/zeros_grid.py
```

Write answers before you edit:

1. How many distinct row objects does `[[0] * cols] * rows` create?
2. Why is `[0] * cols` safe for the integers, while repeating the row is not?
3. What expression builds `rows` independent lists?

A repair that special-cases `grid[0][0]` is not a repair.

---

## 6. Exercises

`exercises/EXERCISES.md`.

---

## Checkpoint

- Assignment binds a name to an existing object.
- Two names can refer to one object. That is aliasing.
- Methods such as `append`, `clear`, `sort`, and item assignment mutate.
- `+`, slicing, `list.copy`, and `copy.copy` build a new outer object and share the inner ones.
- `copy.deepcopy` builds new inners too.
- A function parameter is a new local binding to the same object. Rebinding it does not touch the caller. Mutating it does.
