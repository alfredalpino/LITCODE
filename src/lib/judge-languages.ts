/**
 * Language catalog for the studio editor.
 * Run/Submit: JS/TS/Python (+ Ruby/PHP WASM) in-browser; compiled langs via Judge0 `/api/execute`.
 * See `browser-runners.ts` for runnable vs planned vs unsupported.
 */

import {
  getRunnerAvailability,
  isBrowserRunnable,
  runnableLanguageLabels,
} from "./browser-runners";
import { remoteExecutable } from "./remote-execute";

export type JudgeLanguageId =
  | "cpp"
  | "java"
  | "python3"
  | "python"
  | "javascript"
  | "typescript"
  | "csharp"
  | "c"
  | "golang"
  | "kotlin"
  | "swift"
  | "rust"
  | "ruby"
  | "php"
  | "dart"
  | "scala"
  | "elixir"
  | "erlang"
  | "racket";

export type JudgeLanguage = {
  id: JudgeLanguageId;
  label: string;
  /** Monaco editor language id */
  monaco: string;
  /** Can execute in-browser today */
  runnable: boolean;
  /** planned | unsupported when not runnable */
  availability: "ready" | "planned" | "unsupported";
  column: 1 | 2 | 3;
};

function canRun(id: JudgeLanguageId): boolean {
  return isBrowserRunnable(id) || remoteExecutable(id);
}

/** Three-column language picker order. */
export const JUDGE_LANGUAGES: JudgeLanguage[] = (
  [
    { id: "cpp", label: "C++", monaco: "cpp", column: 1 },
    { id: "java", label: "Java", monaco: "java", column: 1 },
    { id: "python3", label: "Python3", monaco: "python", column: 1 },
    { id: "python", label: "Python", monaco: "python", column: 1 },
    { id: "javascript", label: "JavaScript", monaco: "javascript", column: 1 },
    { id: "typescript", label: "TypeScript", monaco: "typescript", column: 1 },
    { id: "csharp", label: "C#", monaco: "csharp", column: 1 },
    { id: "c", label: "C", monaco: "c", column: 1 },
    { id: "golang", label: "Go", monaco: "go", column: 2 },
    { id: "kotlin", label: "Kotlin", monaco: "kotlin", column: 2 },
    { id: "swift", label: "Swift", monaco: "swift", column: 2 },
    { id: "rust", label: "Rust", monaco: "rust", column: 2 },
    { id: "ruby", label: "Ruby", monaco: "ruby", column: 2 },
    { id: "php", label: "PHP", monaco: "php", column: 2 },
    { id: "dart", label: "Dart", monaco: "dart", column: 2 },
    { id: "scala", label: "Scala", monaco: "scala", column: 2 },
    { id: "elixir", label: "Elixir", monaco: "elixir", column: 3 },
    { id: "erlang", label: "Erlang", monaco: "erlang", column: 3 },
    { id: "racket", label: "Racket", monaco: "scheme", column: 3 },
  ] as const
).map((l) => {
  const avail = getRunnerAvailability(l.id);
  return {
    ...l,
    runnable: canRun(l.id),
    availability: avail.status,
  };
});

export function getJudgeLanguage(id: string): JudgeLanguage | undefined {
  return JUDGE_LANGUAGES.find((l) => l.id === id);
}

export type RunnerLanguageId =
  | "javascript"
  | "typescript"
  | "python"
  | "ruby"
  | "php";

/**
 * Map UI lang → local browser runner id when browser-executable.
 */
export function toRunnerLanguage(id: JudgeLanguageId): RunnerLanguageId | null {
  if (id === "javascript") return "javascript";
  if (id === "typescript") return "typescript";
  if (id === "python" || id === "python3") return "python";
  if (id === "ruby") return "ruby";
  if (id === "php") return "php";
  return null;
}

export { runnableLanguageLabels };

export function starterForLanguage(
  lang: JudgeLanguageId,
  functionName: string,
  existing?: Partial<Record<"javascript" | "typescript" | "python", string>>
): string {
  if (lang === "javascript" && existing?.javascript) return existing.javascript;
  if (lang === "typescript" && existing?.typescript) return existing.typescript;
  if ((lang === "python" || lang === "python3") && existing?.python) return existing.python;

  const fn = functionName || "solve";
  switch (lang) {
    case "javascript":
      return `/**\n * @param {...*} args\n * @return {*}\n */\nfunction ${fn}(...args) {\n  \n}\n`;
    case "typescript":
      return `function ${fn}(...args: unknown[]): unknown {\n  \n}\n`;
    case "python":
    case "python3":
      return `class Solution:\n    def ${fn}(self, *args):\n        \n`;
    case "cpp":
      return `class Solution {\npublic:\n    // Implement ${fn}\n    auto ${fn}(/* args */) {\n        \n    }\n};\n`;
    case "java":
      return `class Solution {\n    public Object ${fn}(/* args */) {\n        \n    }\n}\n`;
    case "csharp":
      return `public class Solution {\n    public object ${fn}(/* args */) {\n        \n    }\n}\n`;
    case "c":
      return `/* Implement ${fn} */\nvoid ${fn}(void) {\n    \n}\n`;
    case "golang":
      return `func ${fn}(/* args */) /* return */ {\n    \n}\n`;
    case "kotlin":
      return `class Solution {\n    fun ${fn}(/* args */): Any {\n        TODO()\n    }\n}\n`;
    case "swift":
      return `class Solution {\n    func ${fn}(/* args */) {\n        \n    }\n}\n`;
    case "rust":
      return `struct Solution;\n\nimpl Solution {\n    pub fn ${fn}(/* args */) {\n        \n    }\n}\n`;
    case "ruby":
      return `# @param args\n# @return\ndef ${fn}(*args)\n  \nend\n`;
    case "php":
      return `class Solution {\n    /**\n     * @param mixed ...$args\n     */\n    function ${fn}(...$args) {\n        \n    }\n}\n`;
    case "dart":
      return `class Solution {\n  dynamic ${fn}(/* args */) {\n    \n  }\n}\n`;
    case "scala":
      return `object Solution {\n  def ${fn}(/* args */) = {\n    \n  }\n}\n`;
    case "elixir":
      return `defmodule Solution do\n  @spec ${fn}(any) :: any\n  def ${fn}(args) do\n    \n  end\nend\n`;
    case "erlang":
      return `-module(solution).\n-export([${fn}/1]).\n${fn}(Args) ->\n  ok.\n`;
    case "racket":
      return `(define/contract (${fn} args)\n  (-> any/c any/c)\n  )\n`;
    default:
      return `// ${fn}\n`;
  }
}
