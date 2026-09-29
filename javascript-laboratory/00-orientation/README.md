# 00 — Orientation: How This Laboratory Works

**Difficulty:** ★☆☆☆☆  
**Prerequisites:** Node.js 18+ installed  
**Goal:** Learn the lab method before learning JavaScript depth.

---

## Concise explanation

This is a **laboratory**, not a textbook.

You will repeatedly:

1. Learn a small idea  
2. **Predict** what code does  
3. Run it  
4. Observe  
5. Modify / break / debug  
6. Explain **why**  
7. Challenge yourself  
8. Review later with active recall  

Reading without predicting and coding will not build the mental model this lab targets.

---

## Underlying mechanism (of learning here)

Your brain builds durable models when you:

- Struggle briefly before seeing answers  
- Compare expected vs actual behavior  
- Articulate mechanisms in your own words  
- Revisit with spaced retrieval  

Passive highlighting creates familiarity, not skill.

---

## Setup checklist

1. Open a terminal in `javascript-laboratory/`
2. Confirm Node:

```bash
node --version
```

You want `v18` or higher (you may have newer — fine).

3. Run the environment verifier:

```bash
node 00-orientation/experiments/01-verify-environment.js
```

4. Open [`PROGRESS.md`](../PROGRESS.md) and start Session 1.

---

## The Learn Cycle (memorize this)

```text
Learn → Predict → Code → Execute → Observe → Break → Debug → Explain → Apply → Challenge → Review
```

### Rules

| Rule | Why |
|---|---|
| Predict **before** running | Forces a model; reveals gaps |
| Write predictions down | Vague “I think I know” is cheating |
| Prefer 10 deep lines over 300 shallow lines | Conceptual density |
| Open solutions last | Struggle is the point |
| Ask “why?” three times | Blocks memorization |
| Separate language / host / engine | Prevents false certainty |

---

## Tiny example of the method

You will see code like:

```js
console.log("Hello, laboratory");
```

Before running, you answer:

1. What prints?  
2. What is `console`? (language keyword? host API?)  
3. What does the engine do with this source text?

Then you run. Then you explain.

---

## Predict (do this now)

Open [`predictions/P01-first-prediction.md`](./predictions/P01-first-prediction.md).

**Do not run the linked file until you write your prediction.**

---

## Execute

After writing your prediction:

```bash
node 00-orientation/experiments/02-first-prediction.js
```

---

## Experiment — modify

1. Change the string. Predict. Run.  
2. Add a second `console.log`. Predict order. Run.  
3. Introduce a deliberate syntax error (e.g., missing quote). Run.  
4. Observe: does **anything** print before the error?

Write answers in your session notes.

---

## Deliberate bug

Open [`challenges/broken/01-broken-log.js`](./challenges/broken/01-broken-log.js).

Fix it **without** opening the solution first.

Validate:

```bash
node 00-orientation/challenges/broken/01-broken-log.js
```

It should print exactly:

```text
environment ok
```

---

## Challenge ★★☆☆☆

See [`challenges/C01-explain-layers.md`](./challenges/C01-explain-layers.md).

---

## Developer Knowledge boxes

### Deep Fact

Familiarity with seeing code is not the same as being able to **predict** it. Prediction is the diagnostic for understanding.

### Why This Works

Failed predictions create a specific error signal. Your brain updates the model. Successful predictions without mechanism still count as weak — always write the **why**.

### Common Misconception

“I’ll just read all the notes first, then code later.”  
That inverts the lab. Code early; theory in thin slices.

### Interview Insight

Interviewers often ask you to predict output or explain why. The lab method is interview preparation without trick culture.

### Production Insight

Senior debugging is the same loop: form a hypothesis, run a minimal experiment, update the model.

---

## Files in this module

| Path | Purpose |
|---|---|
| `experiments/01-verify-environment.js` | Confirm Node + basic execution |
| `experiments/02-first-prediction.js` | First predict-then-run drill |
| `predictions/P01-first-prediction.md` | Prediction card |
| `challenges/broken/01-broken-log.js` | First debug |
| `challenges/C01-explain-layers.md` | Explain language/host/engine |
| `solutions/` | Only after attempts |
| `review.md` | Spaced review prompts |

---

## When you are done

1. Update [`PROGRESS.md`](../PROGRESS.md) — mark `00-orientation`  
2. Skim [`GLOSSARY.md`](../GLOSSARY.md) entries: Engine, Host, AST, Call stack  
3. Proceed to [`01-runtime/README.md`](../01-runtime/README.md)

Do **not** skip `01-runtime`. It is the foundation of every later “why.”
