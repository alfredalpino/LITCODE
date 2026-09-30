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
import { appendEvent } from "../lib/events";
import { SplitPane } from "./SplitPane";
import { PredictGate } from "./PredictGate";
import type { CodeFile, ConsoleLine, LabLanguage, LabModule } from "../types";

interface CodeWorkbenchProps {
  module: LabModule | null;
  labId?: string;
  defaultLanguage: LabLanguage;
  onMarkComplete?: () => void;
  completed?: boolean;
  editorTheme?: "vs-dark" | "light" | "hc-black";
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
  ruby: `# Everything is an object. Predict before you run.
puts "ready"
`,
  rust: `// Predict what the borrow checker allows, then run.
fn main() {
    println!("ready");
}
`,
  cpp: `// Predict lifetimes and output, then run.
#include <iostream>

int main() {
    std::cout << "ready" << std::endl;
    return 0;
}
`,
  c: `/* Predict the output, then run. */
#include <stdio.h>

int main(void) {
    printf("ready\\n");
    return 0;
}
`,
  java: `// Compiles to bytecode, runs on the JVM. Predict, then run.
public class Main {
    public static void main(String[] args) {
        System.out.println("ready");
    }
}
`,
  go: `// Predict zero values and output before you run.
package main

import "fmt"

func main() {
    fmt.Println("ready")
}
`,
  kotlin: `// Null-safe on the JVM. Predict before you run.
fun main() {
    println("ready")
}
`,
  swift: `// Value types and optionals. Predict before you run.
print("ready")
`,
  php: `<?php
// Predict type juggling and output before you run.
echo "ready\\n";
`,
  csharp: `// C# on .NET. Predict before you run.
using System;

class Program {
    static void Main() {
        Console.WriteLine("ready");
    }
}
`,
};

export function CodeWorkbench({
  module,
  labId,
  defaultLanguage,
  onMarkComplete,
  completed,
  editorTheme = "vs-dark",
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
  const [consoleCollapsed, setConsoleCollapsed] = useState(false);
  const [predictUnlocked, setPredictUnlocked] = useState(
    () => !(module?.hasPredictions)
  );

  const hardPredict = module?.loop?.includes("predict") && module.status === "ready"
    ? false // soft default (DEC-014); hard reserved for future module meta flag
    : false;

  useEffect(() => {
    setLanguage(defaultLanguage);
    setPredictUnlocked(!(module?.hasPredictions));
    if (codeFiles.length > 0) {
      setActiveFile(codeFiles[0]);
    } else {
      setActiveFile(null);
      setCode(STARTER[defaultLanguage]);
      setLines([]);
    }
  }, [module?.id, defaultLanguage, codeFiles, module?.hasPredictions]);

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
    if (module?.hasPredictions && !predictUnlocked) return;
    setRunning(true);
    setConsoleCollapsed(false);
    try {
      if (labId && module) {
        appendEvent({
          type: "run",
          labId,
          moduleId: module.id,
          meta: { language, file: activeFile?.relative ?? "playground" },
        });
      }
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

  const MONACO_LANG: Record<LabLanguage, string> = {
    python: "python",
    typescript: "typescript",
    javascript: "javascript",
    ruby: "ruby",
    rust: "rust",
    cpp: "cpp",
    c: "c",
    java: "java",
    go: "go",
    kotlin: "kotlin",
    swift: "swift",
    php: "php",
    csharp: "csharp",
  };
  const monacoLang = MONACO_LANG[language] ?? "javascript";

  const editorPane = (
    <div className="workbench__editor">
      <Editor
        height="100%"
        language={monacoLang}
        value={code}
        onChange={(v) => setCode(v ?? "")}
        theme={editorTheme}
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
  );

  const consolePane = (
    <div className={clsx("console", !consoleCollapsed && "is-open")}>
      <div className="console__bar">
        <button
          type="button"
          className="console__toggle"
          onClick={() => setConsoleCollapsed((v) => !v)}
        >
          <Terminal size={14} />
          Console
          {lines.length > 0 && (
            <span className="console__count">{lines.length}</span>
          )}
        </button>
        <div className="console__bar-actions">
          <button
            type="button"
            className="tool-btn"
            onClick={() => setLines([])}
            title="Clear console"
          >
            <Eraser size={14} />
          </button>
          <button
            type="button"
            className="run-btn run-btn--compact"
            onClick={handleRun}
            disabled={running || (Boolean(module?.hasPredictions) && !predictUnlocked)}
          >
            <Play size={14} fill="currentColor" />
            {running ? "Running…" : "Run"}
          </button>
        </div>
      </div>
      {!consoleCollapsed && (
        <div className="console__output" role="log">
          {lines.length === 0 ? (
            <p className="console__empty">
              Output appears here. Press Run or ⌘/Ctrl+Enter. Drag the gutter
              above to resize.
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
  );

  return (
    <section className="workbench" aria-label="Code workbench">
      {labId && module?.hasPredictions && (
        <PredictGate
          labId={labId}
          moduleId={module.id}
          hard={hardPredict}
          hasPredictions={!!module.hasPredictions}
          onUnlocked={() => setPredictUnlocked(true)}
        />
      )}
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
            disabled={running || (Boolean(module?.hasPredictions) && !predictUnlocked)}
            title={
              module?.hasPredictions && !predictUnlocked
                ? "Write or skip your prediction first"
                : "Run code in the browser"
            }
          >
            <Play size={15} fill="currentColor" />
            {running ? "Running…" : "Run"}
          </button>
        </div>
      </div>

      {consoleCollapsed ? (
        <div className="workbench__stack">
          {editorPane}
          {consolePane}
        </div>
      ) : (
        <SplitPane
          className="workbench__split"
          orientation="vertical"
          first={editorPane}
          second={consolePane}
          initialRatio={0.68}
          minFirst={140}
          minSecond={110}
          storageKey="sde-editor-console-ratio"
        />
      )}
    </section>
  );
}
