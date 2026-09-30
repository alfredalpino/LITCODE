import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const LAB = path.resolve(__dirname, "..");

export function write(rel, text) {
  const abs = path.join(LAB, rel);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  const body = String(text).replace(/^\n+/, "");
  fs.writeFileSync(abs, body.endsWith("\n") ? body : body + "\n");
  console.log(" ", rel);
}

export function expHeader(mod, title) {
  return `/**
 * ${mod} — ${title}
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx ${mod}/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */\n`;
}

export function makePred(mod, id, title, diff, expFile, code, prompts) {
  return `# ${id} — ${title}

**Difficulty:** ${diff}  
**File:** \`experiments/${expFile}\`

## DO NOT RUN YET

\`\`\`ts
${code.trim()}
\`\`\`

### 1. Predicted output / type

\`\`\`text

\`\`\`

### 2. Reasoning (compile-time vs runtime)

${prompts}

\`\`\`text

\`\`\`

### 3. Run / type-check

Studio Run, or: \`npx tsx ${mod}/experiments/${expFile}\`

### 4–7. Actual · discrepancy · deeper why · what-if

\`\`\`text

\`\`\`
`;
}

export function knowledgeBox({ deep, why, misconception, interview, production }) {
  return `### Deep Fact

${deep}

### Why This Works

${why}

### Common Misconception

${misconception}

### Interview Insight

${interview}

### Production Insight

${production}`;
}

export function moduleKit({
  id,
  slug,
  title,
  difficulty,
  prereq,
  nextModule,
  outcomes,
  coreQuestion,
  lessons,
  experiments,
  predictions,
  broken,
  challenges,
  solutions,
  review,
  knowledge,
  workOrder,
}) {
  const dir = `${id}-${slug}`;
  const readme = `# ${id} — ${title}

**Difficulty baseline:** ${difficulty}  
**Prerequisites:** [\`${prereq}\`](../${prereq}/)  
**Core loop:** Predict → Type-check → Run → Break → Explain  
**Core question:** ${coreQuestion}

---

## Learning outcomes

After this lab you can:

${outcomes.map((o, i) => `${i + 1}. ${o}`).join("\n")}

---

${lessons}

---

## Deliberate bugs

| File | Task |
|---|---|
${broken.map((b) => `| \`challenges/broken/${b.file}\` | ${b.task} |`).join("\n")}

---

## Challenges

| ID | File | Difficulty |
|---|---|---|
${challenges.map((c) => `| ${c.id} | [\`challenges/${c.file}\`](./challenges/${c.file}) | ${c.diff} |`).join("\n")}

---

## Developer Knowledge boxes

${knowledge}

---

## How to work this module (order)

${workOrder}

**Do not rush.** Depth beats speed. Types that never survive to runtime still shape design — prove both sides.

---

## When you are done

1. Update [\`PROGRESS.md\`](../PROGRESS.md) — mark \`${dir}\`
2. Complete \`review.md\` Day 1 prompts cold
3. Proceed to [\`${nextModule}/README.md\`](../${nextModule}/README.md)
`;

  write(`${dir}/README.md`, readme);
  for (const [name, body] of Object.entries(experiments)) write(`${dir}/experiments/${name}`, body);
  for (const [name, body] of Object.entries(predictions)) write(`${dir}/predictions/${name}`, body);
  for (const b of broken) write(`${dir}/challenges/broken/${b.file}`, b.code);
  for (const c of challenges) write(`${dir}/challenges/${c.file}`, c.body);
  for (const [name, body] of Object.entries(solutions)) write(`${dir}/solutions/${name}`, body);
  write(`${dir}/review.md`, review);
}

export function scaffoldModule({ id, slug, title, idea, prereq, until }) {
  const dir = `${id}-${slug}`;
  write(
    `${dir}/README.md`,
    `# ${id} — ${title}

**Status:** scaffold

This module is planned in \`CURRICULUM.md\` but not filled to laboratory depth yet.
Do not treat the sidebar entry as a finished LITCODE lab.

**Idea to land later:** ${idea}

**Prerequisites:** ${prereq}

Until expanded: ${until}
`
  );
  write(`${dir}/STATUS.md`, `status: scaffold\n`);
}
