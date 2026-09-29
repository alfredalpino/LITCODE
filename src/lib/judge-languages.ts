/**
 * Judge language catalog aligned with LeetCode’s public language list.
 * Browser LITCODE runners execute JS / TS / Python only; others get Monaco
 * editing + starters and an honest “not runnable in-browser” result.
 */

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
  /** Can execute via LITCODE browser runners today */
  runnable: boolean;
  column: 1 | 2 | 3;
};

/** Display order matches LeetCode’s three-column language picker. */
export const JUDGE_LANGUAGES: JudgeLanguage[] = [
  { id: "cpp", label: "C++", monaco: "cpp", runnable: false, column: 1 },
  { id: "java", label: "Java", monaco: "java", runnable: false, column: 1 },
  { id: "python3", label: "Python3", monaco: "python", runnable: true, column: 1 },
  { id: "python", label: "Python", monaco: "python", runnable: true, column: 1 },
  { id: "javascript", label: "JavaScript", monaco: "javascript", runnable: true, column: 1 },
  { id: "typescript", label: "TypeScript", monaco: "typescript", runnable: true, column: 1 },
  { id: "csharp", label: "C#", monaco: "csharp", runnable: false, column: 1 },
  { id: "c", label: "C", monaco: "c", runnable: false, column: 1 },
  { id: "golang", label: "Go", monaco: "go", runnable: false, column: 2 },
  { id: "kotlin", label: "Kotlin", monaco: "kotlin", runnable: false, column: 2 },
  { id: "swift", label: "Swift", monaco: "swift", runnable: false, column: 2 },
  { id: "rust", label: "Rust", monaco: "rust", runnable: false, column: 2 },
  { id: "ruby", label: "Ruby", monaco: "ruby", runnable: false, column: 2 },
  { id: "php", label: "PHP", monaco: "php", runnable: false, column: 2 },
  { id: "dart", label: "Dart", monaco: "dart", runnable: false, column: 2 },
  { id: "scala", label: "Scala", monaco: "scala", runnable: false, column: 2 },
  { id: "elixir", label: "Elixir", monaco: "elixir", runnable: false, column: 3 },
  { id: "erlang", label: "Erlang", monaco: "erlang", runnable: false, column: 3 },
  { id: "racket", label: "Racket", monaco: "scheme", runnable: false, column: 3 },
];

export function getJudgeLanguage(id: string): JudgeLanguage | undefined {
  return JUDGE_LANGUAGES.find((l) => l.id === id);
}

/** Map UI lang → runner id (python3 → python). */
export function toRunnerLanguage(id: JudgeLanguageId): "javascript" | "typescript" | "python" | null {
  if (id === "javascript") return "javascript";
  if (id === "typescript") return "typescript";
  if (id === "python" || id === "python3") return "python";
  return null;
}

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
      return `impl Solution {\n    pub fn ${fn}(/* args */) {\n        \n    }\n}\n`;
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
