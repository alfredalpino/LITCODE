#!/usr/bin/env node
/**
 * Walks laboratories/ and emits the runtime tanker:
 * - public/data/catalog.json
 * - public/data/labs/{labId}/... (mirrored markdown + code)
 * - preserves public/data/skill-graph.json when already present
 *
 * Layout:
 *   LITCODE/
 *     package.json · app/ · src/ · public/ · scripts/
 *     laboratories/{javascript,typescript,python-dsa,...}/
 *     companies/
 *     public/data/   ← tanker
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { deriveModuleMeta } from "./lib/module-status.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const WORKSPACE = ROOT;
const OUT = path.join(ROOT, "public", "data");
const LABS_OUT = path.join(OUT, "labs");

function labSource(id) {
  return path.join(WORKSPACE, "laboratories", id);
}

const LABS = [
  {
    id: "javascript",
    title: "JavaScript Laboratory",
    short: "JS",
    language: "javascript",
    accent: "#e8a317",
    source: labSource("javascript"),
    excludeDirs: new Set(["node_modules", ".git", "dist", ".netlify"]),
  },
  {
    id: "python-dsa",
    title: "Python + DSA Laboratory",
    short: "Python",
    language: "python",
    accent: "#3b82f6",
    source: labSource("python-dsa"),
    excludeDirs: new Set(["node_modules", ".git", "dist", "__pycache__", ".venv"]),
  },
  {
    id: "typescript",
    title: "TypeScript Laboratory",
    short: "TS",
    language: "typescript",
    accent: "#3178c6",
    source: labSource("typescript"),
    excludeDirs: new Set([
      "node_modules",
      ".git",
      "dist",
      "lib",
      "templates",
      "fix-without-assertion",
      "predict-the-type",
      "spaced-review",
      "what-exists-at-runtime",
      "will-it-compile",
    ]),
  },
  {
    id: "ruby",
    title: "Ruby Laboratory",
    short: "Ruby",
    language: "ruby",
    accent: "#cc342d",
    source: labSource("ruby"),
    excludeDirs: new Set(["node_modules", ".git", "dist"]),
  },
  {
    id: "rust",
    title: "Rust Laboratory",
    short: "Rust",
    language: "rust",
    accent: "#f74c00",
    source: labSource("rust"),
    excludeDirs: new Set(["node_modules", ".git", "dist", "target"]),
  },
  {
    id: "cpp",
    title: "C / C++ Laboratory",
    short: "C/C++",
    language: "cpp",
    accent: "#00599c",
    source: labSource("cpp"),
    excludeDirs: new Set(["node_modules", ".git", "dist", "build"]),
  },
  {
    id: "java",
    title: "Java Laboratory",
    short: "Java",
    language: "java",
    accent: "#f89820",
    source: labSource("java"),
    excludeDirs: new Set(["node_modules", ".git", "dist", "target", "build"]),
  },
  {
    id: "go",
    title: "Go Laboratory",
    short: "Go",
    language: "go",
    accent: "#00add8",
    source: labSource("go"),
    excludeDirs: new Set(["node_modules", ".git", "dist", "bin", "vendor"]),
  },
  {
    id: "kotlin",
    title: "Kotlin Laboratory",
    short: "Kotlin",
    language: "kotlin",
    accent: "#7f52ff",
    source: labSource("kotlin"),
    excludeDirs: new Set(["node_modules", ".git", "dist", "build", ".gradle"]),
  },
  {
    id: "swift",
    title: "Swift Laboratory",
    short: "Swift",
    language: "swift",
    accent: "#f05138",
    source: labSource("swift"),
    excludeDirs: new Set(["node_modules", ".git", "dist", ".build"]),
  },
  {
    id: "php",
    title: "PHP Laboratory",
    short: "PHP",
    language: "php",
    accent: "#777bb4",
    source: labSource("php"),
    excludeDirs: new Set(["node_modules", ".git", "dist", "vendor"]),
  },
  {
    id: "csharp",
    title: "C# Laboratory",
    short: "C#",
    language: "csharp",
    accent: "#512bd4",
    source: labSource("csharp"),
    excludeDirs: new Set(["node_modules", ".git", "dist", "bin", "obj"]),
  },
];

const TEXT_EXT = new Set([
  ".md",
  ".js",
  ".mjs",
  ".cjs",
  ".ts",
  ".tsx",
  ".py",
  ".rb",
  ".rs",
  ".c",
  ".h",
  ".cc",
  ".cpp",
  ".hpp",
  ".java",
  ".go",
  ".kt",
  ".kts",
  ".swift",
  ".php",
  ".cs",
  ".json",
  ".txt",
]);

const CODE_EXT = new Set([
  ".js",
  ".mjs",
  ".cjs",
  ".ts",
  ".tsx",
  ".py",
  ".rb",
  ".rs",
  ".c",
  ".h",
  ".cc",
  ".cpp",
  ".hpp",
  ".java",
  ".go",
  ".kt",
  ".kts",
  ".swift",
  ".php",
  ".cs",
]);

function shouldSkipDir(name, exclude) {
  return exclude.has(name) || name.startsWith(".") || name === "scripts";
}

function titleFromSlug(slug) {
  return slug
    .replace(/^\d+-/, "")
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function langFromExt(ext) {
  if (ext === ".py") return "python";
  if (ext === ".ts" || ext === ".tsx") return "typescript";
  if (ext === ".js" || ext === ".mjs" || ext === ".cjs") return "javascript";
  if (ext === ".rb") return "ruby";
  if (ext === ".rs") return "rust";
  if (ext === ".java") return "java";
  if (ext === ".c" || ext === ".h") return "c";
  if (ext === ".cc" || ext === ".cpp" || ext === ".hpp") return "cpp";
  if (ext === ".go") return "go";
  if (ext === ".kt" || ext === ".kts") return "kotlin";
  if (ext === ".swift") return "swift";
  if (ext === ".php") return "php";
  if (ext === ".cs") return "csharp";
  return "plaintext";
}

function walkFiles(dir, exclude, base = dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (shouldSkipDir(entry.name, exclude)) continue;
      walkFiles(path.join(dir, entry.name), exclude, base, acc);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (!TEXT_EXT.has(ext)) continue;
      if (entry.name === "package-lock.json" || entry.name === "package.json")
        continue;
      if (entry.name.endsWith(".tsbuildinfo")) continue;
      acc.push(path.relative(base, path.join(dir, entry.name)));
    }
  }
  return acc;
}

function copyFile(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

function categorize(relPath) {
  const parts = relPath.split(path.sep);
  if (parts.length === 1 && parts[0].endsWith(".md")) return "reference";
  const folder = parts[1] || "";
  if (folder === "experiments") return "experiments";
  if (folder === "exercises") return "exercises";
  if (folder === "challenges") return "challenges";
  if (folder === "predictions") return "predictions";
  if (folder === "solutions") return "solutions";
  if (folder === "debug") return "debug";
  if (folder === "review.md" || parts.at(-1) === "review.md") return "review";
  return "docs";
}

/** Catalog web path relative to /data */
function webPath(labId, rel) {
  return `labs/${labId}/${rel.replace(/\\/g, "/")}`;
}

function buildLab(lab) {
  if (!fs.existsSync(lab.source)) {
    console.warn(`Missing lab source: ${lab.source}`);
    return null;
  }

  const outRoot = path.join(LABS_OUT, lab.id);
  fs.rmSync(outRoot, { recursive: true, force: true });
  fs.mkdirSync(outRoot, { recursive: true });

  const allRel = walkFiles(lab.source, lab.excludeDirs);
  const modules = new Map();
  const references = [];

  for (const rel of allRel) {
    const src = path.join(lab.source, rel);
    const dest = path.join(outRoot, rel);
    copyFile(src, dest);

    const parts = rel.split(path.sep);
    const top = parts[0];
    const isModule = /^\d{2}-/.test(top);

    if (!isModule && parts.length === 1 && top.endsWith(".md")) {
      references.push({
        id: top.replace(/\.md$/i, ""),
        title: top.replace(/\.md$/i, "").replace(/_/g, " "),
        path: webPath(lab.id, rel),
        kind: "reference",
      });
      continue;
    }

    if (!isModule) continue;

    if (!modules.has(top)) {
      modules.set(top, {
        id: top,
        slug: top,
        title: titleFromSlug(top),
        order: Number(top.slice(0, 2)),
        docs: [],
        codeFiles: [],
        solutions: [],
      });
    }

    const mod = modules.get(top);
    const fileWebPath = webPath(lab.id, rel);
    const ext = path.extname(rel).toLowerCase();
    const base = path.basename(rel);
    const cat = categorize(rel);

    if (ext === ".md") {
      const doc = {
        id: fileWebPath,
        name: base,
        title:
          base === "README.md"
            ? "Lesson"
            : base === "LAB.md"
              ? "Lab Guide"
              : base.replace(/\.md$/i, ""),
        path: fileWebPath,
        category: cat,
        isPrimary: base === "README.md" || base === "LAB.md",
      };
      if (cat === "solutions") mod.solutions.push(doc);
      else mod.docs.push(doc);
    } else if (CODE_EXT.has(ext)) {
      const code = {
        id: fileWebPath,
        name: base,
        path: fileWebPath,
        category: cat,
        language: langFromExt(ext),
        relative: parts.slice(1).join("/"),
      };
      if (cat === "solutions") mod.solutions.push(code);
      else mod.codeFiles.push(code);
    }
  }

  const moduleList = [...modules.values()].sort((a, b) => a.order - b.order);
  for (const m of moduleList) {
    m.docs.sort((a, b) => {
      if (a.isPrimary && !b.isPrimary) return -1;
      if (!a.isPrimary && b.isPrimary) return 1;
      return a.name.localeCompare(b.name);
    });
    m.codeFiles.sort((a, b) => a.relative.localeCompare(b.relative));

    const primaryDoc = m.docs.find((d) => d.isPrimary);
    let readmeText = "";
    let overrideText = null;
    if (primaryDoc) {
      const primarySrc = path.join(lab.source, m.id, path.basename(primaryDoc.path));
      const relFromLab = primaryDoc.path.replace(`labs/${lab.id}/`, "");
      const primaryAbs = path.join(lab.source, relFromLab);
      if (fs.existsSync(primaryAbs)) {
        readmeText = fs.readFileSync(primaryAbs, "utf8");
      } else if (fs.existsSync(primarySrc)) {
        readmeText = fs.readFileSync(primarySrc, "utf8");
      }
    }
    const statusFile = path.join(lab.source, m.id, "STATUS.md");
    if (fs.existsSync(statusFile)) {
      overrideText = fs.readFileSync(statusFile, "utf8");
    }
    const meta = deriveModuleMeta(m, { readmeText, overrideText });
    m.status = meta.status;
    m.hasPredictions = meta.hasPredictions;
    m.hasChallenges = meta.hasChallenges;
    m.loop = meta.loop;
  }

  references.sort((a, b) => a.title.localeCompare(b.title));

  const readyCount = moduleList.filter((m) => m.status === "ready").length;
  const scaffoldCount = moduleList.filter((m) => m.status === "scaffold").length;

  return {
    id: lab.id,
    title: lab.title,
    short: lab.short,
    language: lab.language,
    accent: lab.accent,
    modules: moduleList,
    references,
    stats: {
      modules: moduleList.length,
      ready: readyCount,
      scaffold: scaffoldCount,
      docs: moduleList.reduce((n, m) => n + m.docs.length, 0) + references.length,
      codeFiles: moduleList.reduce((n, m) => n + m.codeFiles.length, 0),
    },
  };
}

function ensureSkillGraph() {
  const dest = path.join(OUT, "skill-graph.json");
  if (fs.existsSync(dest)) return;
  const legacy = path.join(ROOT, "public", "content", "skill-graph.json");
  if (fs.existsSync(legacy)) {
    fs.mkdirSync(OUT, { recursive: true });
    fs.copyFileSync(legacy, dest);
    console.log("Migrated skill-graph.json → public/data/");
  }
}

const available = LABS.filter((lab) => fs.existsSync(lab.source));
if (available.length === 0) {
  const existing = path.join(OUT, "catalog.json");
  if (fs.existsSync(existing)) {
    console.log(
      "No laboratory folders found — keeping existing public/data (CI/deploy mode)."
    );
    process.exit(0);
  }
  console.error(
    "No lab sources found and no existing catalog. Place labs under laboratories/ or commit public/data."
  );
  process.exit(1);
}

fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(LABS_OUT, { recursive: true });
ensureSkillGraph();

const labs = available.map(buildLab).filter(Boolean);

const catalog = {
  generatedAt: new Date().toISOString(),
  labs,
};

fs.writeFileSync(path.join(OUT, "catalog.json"), JSON.stringify(catalog, null, 2));

const totalMods = labs.reduce((n, l) => n + l.modules.length, 0);
const totalReady = labs.reduce((n, l) => n + (l.stats.ready ?? 0), 0);
const totalScaffold = labs.reduce((n, l) => n + (l.stats.scaffold ?? 0), 0);
const totalCode = labs.reduce((n, l) => n + l.stats.codeFiles, 0);
console.log(
  `Synced ${labs.length} labs · ${totalMods} modules (${totalReady} ready / ${totalScaffold} scaffold) · ${totalCode} code files → public/data/`
);
