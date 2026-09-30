# Python + DSA Laboratory

This is a programming laboratory for Python as an algorithmic instrument: data structures, algorithms, complexity, debugging, and interview reasoning.

It is not a web-development course, not a syntax tour, and not a pile of unsolved LeetCode links. JavaScript and TypeScript stay outside this repository.

Checked against **CPython 3.14.7**. Language rules below are Python rules. Anything about bytecode, the small-integer cache, the GIL, or `list.append` cost is labeled as a **CPython implementation characteristic**, because those are not promises of the language.

## The loop

Every serious concept in this lab follows the same loop:

> Learn → Predict → Code → Run → Observe → Break → Debug → Optimize → Explain → Reimplement → Solve

You should spend more time writing and running code than reading. Explanations are short on purpose. The work is the prediction, the modification, the broken program, and the explanation you write afterward.

## How a module is laid out

```text
NN-topic/
├── README.md          how to work this module
├── LAB.md             concepts, predictions, exercises — no answers
├── experiments/       scripts you run after predicting
├── exercises/         problems without solutions
├── debug/             programs that fail on purpose
└── solutions/         open only after a written attempt
```

Notebooks are not used in the early modules. A notebook would show the output before you predict it. Use `.py` files and write predictions in `LEARNING_LOG.md`.

## Rules of the lab

1. Write the prediction before you run the script. A prediction you did not write down does not count.
2. Do not open `solutions/` until you have an attempt or a written diagnosis.
3. When an experiment surprises you, change one line and run it again. Record what changed.
4. Separate two questions that people mix up:
   - What does the **language** guarantee?
   - What does **this CPython build** happen to do?
5. For every algorithm, later modules will force the same questions: what problem, why the naive version fails, what observation enables the faster version, what invariant holds, why it is correct, what it costs, what it assumes, what breaks it, and whether you can rebuild it without looking.

## Start here

| Order | Read | Then do |
| --- | --- | --- |
| 1 | This file | — |
| 2 | `CURRICULUM.md` | See the full map. Foundations `00`–`08` are built; `09`–`13` are scaffolds; later modules planned. |
| 3 | `PROGRESS.md` | Use it as the checklist. |
| 4 | `00-python-runtime/README.md` | First laboratory. |

Keep these next to you while you work. Do not try to memorize them first.

- `PYTHON_FACTS.md` — language and CPython facts, each with the misconception it kills
- `DSA_FACTS.md` — algorithm facts you will keep re-deriving
- `GLOSSARY.md` — shared words
- `COMPLEXITY_REFERENCE.md` — how to cost code, including Python operations that are not O(1)
- `INTERVIEW_PLAYBOOK.md` — the reasoning sequence used before any code
- `LEARNING_LOG.md` — what you learned, what you got wrong, what to review

## What “done” means for a module

A module is done when you can, without notes:

- state the idea in a few sentences
- predict a new example before running it
- find the bug in the debug program and say why the fix works
- solve the small exercise and the harder variation
- answer the interview prompt out loud, including complexity and one alternative

Checking the box because you read `LAB.md` is not done.

## Session shape

Until the daily engine exists, use this shape for each study session:

1. One concept from the current lab, re-explained from memory
2. Two prediction questions (Python mechanics)
3. Two “what does this cost?” questions
4. Two short coding tasks from the module
5. One harder problem
6. One debug program
7. One written explanation in `LEARNING_LOG.md`

Review by doing, on day 1, day 3, day 7, day 14, and day 30. `PROGRESS.md` lists the review tasks for modules 00–03. Rereading is not a review.

## Difficulty

| Mark | Meaning |
| --- | --- |
| ★ | You can do it once the definition is clear |
| ★★ | You must track state carefully |
| ★★★ | You must choose a representation or an invariant |
| ★★★★ | The hard part is the reasoning, not the length |
| ★★★★★ | Several interacting ideas, easy to “solve” wrongly |

A seven-line algorithm can be ★★★★★.

## Scope boundary

In scope: Python’s object and execution model, data structures, algorithms, complexity, debugging, and startup-interview problem solving.

Out of scope for this repository: web frameworks, ORMs, TypeScript, and the JavaScript laboratory. Competitive-programming tricks with no interview payoff are included only when they teach a real invariant.
