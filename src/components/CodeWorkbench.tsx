import Editor from "@monaco-editor/react";
import {
  Check,
  ChevronDown,
  Eraser,
  Play,
  RotateCcw,
  Terminal,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { loadText } from "../lib/content";
import { runCode } from "../lib/runner";
import type { CodeFile, ConsoleLine, LabLanguage, LabModule } from "../types";

interface CodeWorkbenchProps {
  module: LabModule | null;
  defaultLanguage: LabLanguage;
  onMarkComplete?: () => void;
  completed?: boolean;
}

const STARTER: Record<LabLanguage, string> = {
  javascript: `// Try something. Predict the output before you run.
console.log("ready");
`,
  typescript: `// Types erase at runtime — what does the compiler know?
const message: string = "ready";
console.log(message);
`,
  python: `# Predict before you run.
print("ready")
`,
};

export function CodeWorkbench({
  module,
  defaultLanguage,
  onMarkComplete,
  completed,
}: CodeWorkbenchProps) {
  const codeFiles = useMemo(
    () =>
      (module?.codeFiles ?? []).filter(
        (f) => f.category !== "solutions" && f.language !== "plaintext"
      ),
    [module]
  );

  const [activeFile, setActiveFile] = useState<CodeFile | null>(null);
  const [code, setCode] = useState(STARTER[defaultLanguage]);
  const [language, setLanguage] = useState<LabLanguage>(defaultLanguage);
  const [lines, setLines] = useState<ConsoleLine[]>([]);
  const [running, setRunning] = useState(false);
  const [fileMenuOpen, setFileMenuOpen] = useState(false);
  const [consoleOpen, setConsoleOpen] = useState(true);
  const [consoleHeight, setConsoleHeight] = useState(180);

  useEffect(() => {
    setLanguage(defaultLanguage);
    if (codeFiles.length > 0) {
      setActiveFile(codeFiles[0]);
    } else {
      setActiveFile(null);
      setCode(STARTER[defaultLanguage]);
      setLines([]);
    }
  }, [module?.id, defaultLanguage, codeFiles]);

  useEffect(() => {
    if (!activeFile) return;
    let cancelled = false;
    loadText(activeFile.path).then((text) => {
      if (!cancelled) {
        setCode(text);
        setLanguage(
          (activeFile.language === "plaintext"
            ? defaultLanguage
            : activeFile.language) as LabLanguage
        );
        setLines([]);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [activeFile, defaultLanguage]);

  async function handleRun() {
    setRunning(true);
    setConsoleOpen(true);
    try {
      const result = await runCode(language, code);
      setLines(result.lines);
    } finally {
      setRunning(false);
    }
  }

  function handleReset() {
    if (activeFile) {
      loadText(activeFile.path).then(setCode);
    } else {
      setCode(STARTER[language]);
    }
    setLines([]);
  }

  const monacoLang =
    language === "python"
      ? "python"
      : language === "typescript"
        ? "typescript"
        : "javascript";

  return (
    <section className="workbench" aria-label="Code workbench">
      <div className="workbench__toolbar">
        <div className="workbench__file">
          <button
            type="button"
            className="workbench__file-btn"
            onClick={() => setFileMenuOpen((v) => !v)}
            disabled={codeFiles.length === 0}
          >
            <span className="workbench__file-name">
              {activeFile?.relative ?? "playground"}
            </span>
            {codeFiles.length > 0 && <ChevronDown size={14} />}
          </button>
          {fileMenuOpen && codeFiles.length > 0 && (
            <div className="workbench__file-menu" role="listbox">
              {codeFiles.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  role="option"
                  className={clsx(
                    "workbench__file-option",
                    activeFile?.id === f.id && "is-active"
                  )}
                  onClick={() => {
                    setActiveFile(f);
                    setFileMenuOpen(false);
                  }}
                >
                  <span className="tag">{f.category}</span>
                  {f.relative}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="workbench__actions">
          <select
            className="lang-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value as LabLanguage)}
            aria-label="Language"
          >
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
          </select>

          <button
            type="button"
            className="tool-btn"
            onClick={handleReset}
            title="Reset"
          >
            <RotateCcw size={15} />
          </button>
          <button
            type="button"
            className="tool-btn"
            onClick={() => setLines([])}
            title="Clear console"
          >
            <Eraser size={15} />
          </button>
          {onMarkComplete && (
            <button
              type="button"
              className={clsx("tool-btn", completed && "is-success")}
              onClick={onMarkComplete}
              title="Mark module complete"
            >
              <Check size={15} />
            </button>
          )}
          <button
            type="button"
            className="run-btn"
            onClick={handleRun}
            disabled={running}
          >
            <Play size={15} fill="currentColor" />
            {running ? "Running…" : "Run"}
          </button>
        </div>
      </div>

      <div className="workbench__editor">
        <Editor
          height="100%"
          language={monacoLang}
          value={code}
          onChange={(v) => setCode(v ?? "")}
          theme="vs-dark"
          options={{
            fontSize: 13.5,
            fontFamily: '"JetBrains Mono", "SF Mono", Menlo, monospace',
            fontLigatures: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on",
            padding: { top: 14, bottom: 14 },
            automaticLayout: true,
            tabSize: 2,
            wordWrap: "on",
            renderLineHighlight: "line",
            bracketPairColorization: { enabled: true },
          }}
          loading={<div className="editor-loading">Loading editor…</div>}
        />
      </div>

      <div
        className={clsx("console", consoleOpen && "is-open")}
        style={{ height: consoleOpen ? consoleHeight : 36 }}
      >
        <div className="console__bar">
          <button
            type="button"
            className="console__toggle"
            onClick={() => setConsoleOpen((v) => !v)}
          >
            <Terminal size={14} />
            Console
            {lines.length > 0 && (
              <span className="console__count">{lines.length}</span>
            )}
          </button>
          {consoleOpen && (
            <input
              type="range"
              min={120}
              max={360}
              value={consoleHeight}
              onChange={(e) => setConsoleHeight(Number(e.target.value))}
              aria-label="Console height"
              className="console__resize"
            />
          )}
        </div>
        {consoleOpen && (
          <div className="console__output" role="log">
            {lines.length === 0 ? (
              <p className="console__empty">
                Output appears here. Press Run or ⌘/Ctrl+Enter.
              </p>
            ) : (
              lines.map((l) => (
                <pre key={l.id} className={clsx("console__line", `is-${l.kind}`)}>
                  {l.text}
                </pre>
              ))
            )}
          </div>
        )}
      </div>
    </section>
  );
}
