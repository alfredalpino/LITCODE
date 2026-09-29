#!/usr/bin/env node
/**
 * Builds real company → problem packs from
 * https://github.com/liquidslr/leetcode-company-wise-problems
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "public", "dsa", "company-packs.json");
const CACHE = path.join(ROOT, ".cache", "leetcode-company-wise-problems");
const REPO = "https://github.com/liquidslr/leetcode-company-wise-problems.git";
const SOURCE =
  "https://github.com/liquidslr/leetcode-company-wise-problems";

const WINDOW_FILES = [
  { key: "thirty", match: /^1\.\s*Thirty Days\.csv$/i },
  { key: "threeMonths", match: /^2\.\s*Three Months\.csv$/i },
  { key: "sixMonths", match: /^3\.\s*Six Months\.csv$/i },
  { key: "moreThanSix", match: /^4\.\s*More Than Six Months\.csv$/i },
  { key: "all", match: /^5\.\s*All\.csv$/i },
];

function ensureRepo() {
  if (fs.existsSync(path.join(CACHE, ".git"))) {
    try {
      execSync("git pull --ff-only", { cwd: CACHE, stdio: "ignore" });
    } catch {
      /* offline / dirty cache is fine */
    }
    return CACHE;
  }
  const tmp = "/tmp/lc-companies";
  if (fs.existsSync(tmp) && fs.existsSync(path.join(tmp, "Amazon"))) {
    return tmp;
  }
  fs.mkdirSync(path.dirname(CACHE), { recursive: true });
  console.log("Cloning liquidslr/leetcode-company-wise-problems …");
  try {
    execSync(
      `git clone --depth 1 --filter=blob:none --sparse ${REPO} "${CACHE}"`,
      { stdio: "inherit" }
    );
    execSync(`git sparse-checkout set --no-cone '/*/*.csv'`, {
      cwd: CACHE,
      stdio: "inherit",
    });
    return CACHE;
  } catch (err) {
    if (fs.existsSync(OUT)) {
      console.warn(
        "Could not clone company repo; keeping existing public/dsa/company-packs.json"
      );
      process.exit(0);
    }
    throw err;
  }
}

function parseCsv(text) {
  const lines = text.replace(/^\uFEFF/, "").split(/\r?\n/).filter(Boolean);
  if (!lines.length) return [];
  const headers = splitCsvLine(lines[0]).map((h) => h.trim());
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = splitCsvLine(lines[i]);
    if (cols.length < 2) continue;
    const row = {};
    headers.forEach((h, idx) => {
      row[h] = (cols[idx] ?? "").trim();
    });
    rows.push(row);
  }
  return rows;
}

function splitCsvLine(line) {
  const out = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQ && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else inQ = !inQ;
      continue;
    }
    if (ch === "," && !inQ) {
      out.push(cur);
      cur = "";
      continue;
    }
    cur += ch;
  }
  out.push(cur);
  return out;
}

function normDiff(d) {
  const x = (d || "").toUpperCase();
  if (x.startsWith("E")) return "Easy";
  if (x.startsWith("H")) return "Hard";
  return "Medium";
}

function slugFromLink(link) {
  if (!link) return "";
  try {
    const u = new URL(link);
    const parts = u.pathname.split("/").filter(Boolean);
    const i = parts.indexOf("problems");
    if (i >= 0 && parts[i + 1]) return parts[i + 1].toLowerCase();
    return (parts[parts.length - 1] || "").toLowerCase();
  } catch {
    return (link.replace(/\/$/, "").split("/").pop() || "").toLowerCase();
  }
}

function titleKey(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function findFile(files, match) {
  return files.find((f) => match.test(f));
}

function readWindow(dir, files, match) {
  const file = findFile(files, match);
  if (!file) return [];
  return parseCsv(fs.readFileSync(path.join(dir, file), "utf8"));
}

const repoRoot = ensureRepo();
/** @type {Map<string, any>} */
const problems = new Map();
/** @type {Map<string, any>} */
const companyMeta = new Map();

for (const dirEnt of fs.readdirSync(repoRoot, { withFileTypes: true })) {
  if (!dirEnt.isDirectory() || dirEnt.name.startsWith(".")) continue;
  const company = dirEnt.name;
  const dir = path.join(repoRoot, company);
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".csv"));
  if (!files.length) continue;

  const windows = {
    thirty: 0,
    threeMonths: 0,
    sixMonths: 0,
    moreThanSix: 0,
    all: 0,
  };

  for (const { key, match } of WINDOW_FILES) {
    const rows = readWindow(dir, files, match);
    windows[key] = rows.length;

    // Stamp problem membership primarily from All; also allow other windows
    // so problems only listed in recent windows still appear.
    const stamp = key === "all" || key === "thirty" || key === "threeMonths";
    if (!stamp) continue;

    for (const row of rows) {
      const title = row.Title || row.title || "";
      const link = row.Link || row.link || "";
      const slug = slugFromLink(link);
      if (!slug || !title) continue;
      const freq = Number(row.Frequency || row.frequency || 0) || 0;
      const topics = String(row.Topics || row.topics || "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      const difficulty = normDiff(row.Difficulty || row.difficulty);

      if (!problems.has(slug)) {
        problems.set(slug, {
          slug,
          title,
          difficulty,
          topics,
          link: link || `https://leetcode.com/problems/${slug}/`,
          companies: {},
        });
      } else {
        const p = problems.get(slug);
        if ((!p.topics || !p.topics.length) && topics.length) p.topics = topics;
      }

      const p = problems.get(slug);
      const prev = p.companies[company];
      if (key === "all") {
        p.companies[company] = freq;
      } else if (prev == null) {
        p.companies[company] = freq;
      } else if (freq > prev) {
        p.companies[company] = freq;
      }
    }
  }

  companyMeta.set(company, {
    name: company,
    ...windows,
    count: windows.all || Math.max(0, ...Object.values(windows)),
  });
}

const companies = [...companyMeta.values()].sort(
  (a, b) => b.count - a.count || a.name.localeCompare(b.name)
);

const problemsOut = {};
for (const [slug, p] of [...problems.entries()].sort((a, b) =>
  a[0].localeCompare(b[0])
)) {
  problemsOut[slug] = {
    title: p.title,
    difficulty: p.difficulty,
    topics: p.topics,
    link: p.link,
    companies: Object.entries(p.companies)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([name, frequency]) => ({ name, frequency })),
  };
}

const titleIndex = {};
for (const [slug, p] of Object.entries(problemsOut)) {
  titleIndex[titleKey(p.title)] = slug;
}

const payload = {
  source: SOURCE,
  generatedAt: new Date().toISOString(),
  companyCount: companies.length,
  problemCount: Object.keys(problemsOut).length,
  companies,
  problems: problemsOut,
  titleIndex,
};

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(payload));
console.log(
  `Company packs: ${companies.length} companies · ${Object.keys(problemsOut).length} problems → public/dsa/company-packs.json`
);
console.log(
  `Top: ${companies
    .slice(0, 8)
    .map((c) => `${c.name}(${c.count})`)
    .join(", ")}`
);
