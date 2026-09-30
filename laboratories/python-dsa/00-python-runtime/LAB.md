# Lab — What actually happens when Python runs?

Read `PYTHON_FACTS.md` F18, F19, and F20 after you have run the experiments, not before. Let the run teach you first.

There is a computer-science idea under this module. A program is data. A compiler is a function from one representation of that data to another. An interpreter is a loop that performs the operations in the later representation. Python is unusual only in that you can call those stages from inside the language (`ast`, `compile`, `dis`, `exec`).

---

## 1. Source code is text

This file is not a program until an implementation reads it:

```python
answer = 1 + 2
```

Those characters have no types and no addition. A human can see an assignment. The runtime has not seen anything yet.

**Predict, before any command.** Which of these failures can happen with no execution of your function body?

- a missing colon
- a name that does not exist
- adding a string to an integer

Write your answers. Then run:

```bash
python3 experiments/04_when_errors_happen.py
```

Compare. The experiment compiles three snippets. Record which ones compile and which ones fail only when called.

**Modify.** Add a fourth snippet that should be a `TypeError`, using the same `compile` then `exec` then call pattern. Predict the phase before you run your snippet.

---

## 2. The pipeline

For CPython, the implementation this lab was checked on (3.14.7), the path is:

```text
source text
    → tokens
    → parse tree / abstract syntax tree
    → code object (bytecode + tables of names and constants)
    → evaluation loop
    → objects, bindings, and side effects
```

Parsing asks: is this character sequence a legal program? Compilation asks: what operations should run, and where do names and constants live? Execution performs those operations.

`.pyc` files under `__pycache__` are a cache of code objects so CPython can skip recompiling an unchanged module. They are not the language, and you do not need one to run a script. Delete `__pycache__` and the script still runs. The next import recreates the cache.

Other implementations must follow the language reference. They do not have to use this bytecode, this cache, or this opcode set.

**Predict.** `dis.dis` on a function prints opcodes. If you upgrade Python and the printout changes but the function still returns the same values, which of these changed: the language, or one implementation’s instruction set?

You will check the printout in the next section. Answer the question first.

---

## 3. The abstract syntax tree

`ast.parse` turns source into objects you can walk. The tree records structure: an assignment, a name, an addition, constants. It does not record bytecode.

**Predict.** For `answer = 1 + 2`, the tree has one assignment. The value of that assignment is a binary operation. What are the two operands, and is the name `answer` a load or a store?

Run:

```bash
python3 experiments/01_ast_dump.py
```

**Modify.** Add the string `"answer = 1 + 2 * 3"` to the experiment’s list. Predict the shape (which operator is the parent) before you run it. Multiplication binds tighter than addition, and the tree is how you see that the parser, not the evaluator, already committed to that structure.

---

## 4. Bytecode and the code object

A function object holds a code object on `__code__`. Useful tables:

| Attribute | What it stores |
| --- | --- |
| `co_varnames` | Local variable names, including parameters |
| `co_consts` | Constants used by that code |
| `co_names` | Global and attribute names looked up at run time |

`dis.dis` prints the instructions that refer to those tables. Opcode names change between CPython versions. On 3.14 you will see names like `LOAD_FAST_BORROW` and `LOAD_SMALL_INT`. Learn what they are evidence of. Do not memorize them.

**Predict for this function:**

```python
def f(n):
    return n + 1
```

1. Is `n` in `co_varnames`, `co_names`, or both?
2. Is `1` in `co_consts`?
3. Is anything in `co_names`?

Run:

```bash
python3 experiments/03_code_object.py
python3 experiments/02_disassemble.py
```

**Modify.** In a scratch file, write `def g(a): return a + missing` but do not call it. Predict: does defining `g` raise, and which table holds `missing`? Then define it and print `g.__code__.co_names`.

---

## 5. The tree is data

Because the AST is objects, a program can rewrite a program and then compile the result. `experiments/05_rewrite_constant.py` parses `answer = 2 + 2` and replaces each constant `2` with `10` before compiling.

**Predict.** What value is bound to `answer` after that rewrite? Then run:

```bash
python3 experiments/05_rewrite_constant.py
```

**Modify.** Change the replacement from `10` to `7`. Predict the new sum. Run. This is the same pipeline as section 2, with your own pass inserted between parse and compile.

---

## 6. Dynamic, and still strict

Read these three lines as bindings, not as boxes:

```python
x = 1
x = "a"
y = x + 1
```

**Predict.** Which line, if any, raises, and what is the error type? Run them in a scratch file after you write the prediction.

The name `x` is not declared with a type. The object it is bound to has a type. Addition asks the objects whether they support the operation. Rebinding `x` from an int to a str is legal. Adding that str to an int is not. Both sentences are the type model. Facts F20 in `PYTHON_FACTS.md` should match what you just saw. If it does not, the fact file is wrong; trust the run and write down the disagreement.

---

## 7. Break it

Open `debug/same_object.py`. Read the author’s claim at the top. Run:

```bash
python3 debug/same_object.py
```

The checks fail for some integers and pass for others.

**Do not patch it yet.** Write answers to these:

1. Which values failed?
2. For a failing pair, was `==` true?
3. Is the author’s claim a language rule or a guess about CPython?
4. What would a correct check for “these integers have the same value” look like?
5. Why did some pairs pass? (If you do not know, say so, and read fact F18 only after you have listed the pairs.)

Then read `solutions/SOLUTIONS.md` section “same object”.

---

## 8. Exercises

Do `exercises/EXERCISES.md`. The interview prompt is the one that matters. The small tasks exist so you cannot answer the interview prompt with a diagram you do not understand.

---

## Checkpoint

Close the lab and say this out loud. If you stall, you are not done with the module.

- Source is text. `ast.parse` builds a tree. `compile` builds a code object. Execution runs that code object.
- `SyntaxError` and `NameError` happen in different phases.
- `co_varnames`, `co_consts`, and `co_names` are three different tables.
- Bytecode, `.pyc`, the small-integer cache, and the GIL are CPython facts. Equal integers comparing equal is a language fact.
