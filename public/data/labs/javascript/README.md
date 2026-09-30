# JavaScript Laboratory

A **learn-by-doing programming laboratory** for becoming an unusually strong JavaScript programmer.

This is not a conventional course. This is not tutorial notes. This is not a project-only curriculum.

You will spend most of your time **writing, predicting, breaking, debugging, and explaining** JavaScript — not passively reading.

---

## The question this lab answers

> **What is REALLY happening?**

For every feature you encounter:

| Question | Goal |
|---|---|
| What is it? | Precise definition |
| Why does it exist? | Problem it solves |
| What happens at runtime? | Mental model |
| What does the specification say? | ECMAScript truth |
| What does the engine generally do? | Implementation insight (labeled) |
| What mistakes do developers make? | Misconceptions |
| How can I prove it experimentally? | Lab method |
| Where does this appear in production? | Real systems |
| How would an interviewer test understanding? | Depth check |

---

## Core philosophy

Every major concept follows this cycle:

```text
Learn → Predict → Code → Execute → Observe → Break → Debug → Explain → Apply → Challenge → Review
```

You should spend significantly more time **coding and modifying** than reading explanations.

---

## Distinctions you must keep forever

| Layer | What it is | Example |
|---|---|---|
| **ECMAScript (language)** | The standardized language semantics | `===`, closures, promises |
| **Host / runtime** | Environment that embeds the engine | Browser, Node.js, Deno |
| **Engine** | Implementation of ECMAScript | V8, SpiderMonkey, JavaScriptCore |
| **Host APIs** | Not part of the language itself | `fetch`, `fs`, `document`, `setTimeout` |

Implementation details (V8 hidden classes, JIT, etc.) are **never** presented as guaranteed language behavior.

---

## Prerequisites

- A computer with a terminal
- **Node.js 18+** (`node --version`)
- A code editor (Cursor / VS Code recommended)
- Willingness to predict before running
- Willingness to be wrong and investigate why

Optional later: a modern browser for DOM / Web API labs.

---

## How to use this laboratory

### 1. Start here

1. Read this `README.md`
2. Skim [`CURRICULUM.md`](./CURRICULUM.md)
3. Complete [`00-orientation/`](./00-orientation/)
4. Begin [`01-runtime/`](./01-runtime/) — **What Actually Happens When JavaScript Runs?**

### 2. For every lesson

1. Read the **concise** explanation
2. Read the **mechanism** section
3. Open the experiment file
4. **Predict** the output (write it down — do not peek)
5. Run: `node path/to/experiment.js`
6. Compare prediction vs reality
7. Explain the discrepancy in your own words
8. Modify the code (experiments ask you to)
9. Attempt challenges **before** opening `solutions/`
10. Log progress in [`PROGRESS.md`](./PROGRESS.md)

### 3. Difficulty stars

| Stars | Meaning |
|---|---|
| ★ | Beginner — direct reasoning |
| ★★ | Developing — one non-obvious step |
| ★★★ | Intermediate — multi-step mental model |
| ★★★★ | Advanced — deep semantics / async / objects |
| ★★★★★ | Expert — mixed concepts, specification-level |

Difficulty measures **reasoning required**, not line count.

### 4. Hints policy

Challenges use progressive hints:

```text
Hint 1 — conceptual
Hint 2 — directional
Hint 3 — implementation
Final solution — only after a serious attempt
```

Do not open solutions first. That destroys the laboratory.

---

## Repository map

```text
javascript-laboratory/
├── README.md
├── CURRICULUM.md
├── PROGRESS.md
├── ADVANCED_JAVASCRIPT_FACTS.md
├── GLOSSARY.md
├── CHEAT_SHEET.md
├── package.json
├── templates/                 # lesson & exercise templates
├── lib/                       # shared helpers (minimal)
├── 00-orientation/            # how to learn in this lab
├── 01-runtime/                # source → parse → execute → host
├── 02-values-types/ … 40-capstone/
├── predict-the-output/        # cross-module prediction bank
├── break-the-code/            # deliberately break & repair
├── implement-yourself/        # educational reimplementations
├── debugging-lab/             # broken programs curriculum
└── spaced-review/             # Day 1/3/7/14/30 reviews
```

---

## Running experiments

From the `javascript-laboratory/` directory:

```bash
node 01-runtime/experiments/01-hello.js
node 01-runtime/experiments/02-call-stack-intro.js
```

Or:

```bash
npm run lab:01
```

Most early labs are plain scripts — no build step, no bundler, no framework.

---

## Knowledge systems

| File / folder | Purpose |
|---|---|
| [`ADVANCED_JAVASCRIPT_FACTS.md`](./ADVANCED_JAVASCRIPT_FACTS.md) | Facts many developers never learn deeply |
| [`GLOSSARY.md`](./GLOSSARY.md) | Precise terminology |
| [`CHEAT_SHEET.md`](./CHEAT_SHEET.md) | Fast reference (grows with you) |
| [`PROGRESS.md`](./PROGRESS.md) | Tracking, weak areas, review dates |
| `predict-the-output/` | Hundreds of prediction drills (grows) |
| `spaced-review/` | Active recall schedules |

---

## Developer Knowledge boxes

Lessons include labeled boxes:

- **Deep Fact** — under-taught truth
- **Why This Works** — mechanism
- **Common Misconception** — frequent wrong model
- **Engine Insight** — typical engine behavior (labeled as such)
- **Specification Insight** — ECMAScript concepts
- **Performance Insight** — when it matters
- **Security Insight** — when it matters
- **Interview Insight** — how depth is tested
- **Production Insight** — real systems
- **Historical Context** — why the feature exists
- **Weird JavaScript** — legitimate surprising behavior

---

## What “done” looks like

By completing this laboratory you should be able to:

- Write JavaScript fluently
- Explain **why** JavaScript behaves as it does
- Debug unfamiliar code
- Reason about async execution and the event loop
- Understand closures, prototypes, and `this`
- Separate language / host / engine concerns
- Reason about memory, performance, and security conceptually
- Implement simplified core abstractions yourself
- Learn new language features independently

The goal is a **strong mental model**, not memorizing every API.

---

## Current status

| Area | Status |
|---|---|
| Core structure | ✅ Built |
| Orientation (`00`) | ✅ Ready |
| Runtime lab (`01`) | ✅ Ready |
| Foundations (`02`–`05`) | ✅ Ready (Phase 5) |
| Functions / scope / closures (`06`–`08`) | ✅ Ready (Phase 5) |
| Objects / prototypes / classes / arrays (`09`–`12`) | ✅ Ready (Phase 5) |
| Modules `13`–`40` | 🧱 Scaffolded (content expands progressively) |
| Cross-labs (predict / break / implement) | 🧱 Seeded |

**Your next action:** open [`00-orientation/README.md`](./00-orientation/README.md). After `12-arrays`, continue with scaffolds (`13+`) or deepen review — Phase 6 targets Python DSA judged growth; later phases fill remaining JS.

---

## License

Personal learning laboratory — `UNLICENSED`.
