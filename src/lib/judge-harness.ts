/**
 * Generate a full runnable program that executes DSA tests for remote languages.
 * Prints lines: `CASE <id>: Accepted` or `CASE <id>: Wrong Answer` / `Runtime Error`.
 */

import type { JudgeLanguageId } from "./judge-languages";

type Test = { id: string; input: unknown[]; expected: unknown };

function j(v: unknown): string {
  return JSON.stringify(v);
}

/** Best-effort literal for languages that accept JSON-like values. */
function phpLit(v: unknown): string {
  if (v === null) return "null";
  if (typeof v === "boolean") return v ? "true" : "false";
  if (typeof v === "number") return String(v);
  if (typeof v === "string") return JSON.stringify(v);
  if (Array.isArray(v)) return "[" + v.map(phpLit).join(", ") + "]";
  if (v && typeof v === "object") {
    return "[" +
      Object.entries(v as Record<string, unknown>)
        .map(([k, val]) => `${JSON.stringify(k)} => ${phpLit(val)}`)
        .join(", ") +
      "]";
  }
  return "null";
}

function rbLit(v: unknown): string {
  if (v === null) return "nil";
  if (typeof v === "boolean") return v ? "true" : "false";
  if (typeof v === "number") return String(v);
  if (typeof v === "string") return JSON.stringify(v);
  if (Array.isArray(v)) return "[" + v.map(rbLit).join(", ") + "]";
  if (v && typeof v === "object") {
    return "{" +
      Object.entries(v as Record<string, unknown>)
        .map(([k, val]) => `${JSON.stringify(k)} => ${rbLit(val)}`)
        .join(", ") +
      "}";
  }
  return "nil";
}

function pyLit(v: unknown): string {
  if (v === null) return "None";
  if (typeof v === "boolean") return v ? "True" : "False";
  if (typeof v === "number") return String(v);
  if (typeof v === "string") return JSON.stringify(v);
  if (Array.isArray(v)) return "[" + v.map(pyLit).join(", ") + "]";
  if (v && typeof v === "object") {
    return "{" +
      Object.entries(v as Record<string, unknown>)
        .map(([k, val]) => `${JSON.stringify(k)}: ${pyLit(val)}`)
        .join(", ") +
      "}";
  }
  return "None";
}

function jsLit(v: unknown): string {
  return JSON.stringify(v);
}

export function buildRemoteJudgeProgram(
  language: JudgeLanguageId | string,
  userCode: string,
  functionName: string,
  tests: Test[]
): string | null {
  const fn = functionName || "solve";
  const cases = tests.filter((t) => t.expected !== undefined);
  if (!cases.length) return null;

  switch (language) {
    case "php": {
      const calls = cases
        .map((t, i) => {
          const args = t.input.map(phpLit).join(", ");
          return `
$__t${i}_id = ${JSON.stringify(t.id)};
$__t${i}_exp = ${phpLit(t.expected)};
try {
  $__got = (new Solution())->${fn}(${args});
  $__pass = json_encode($__got) === json_encode($__t${i}_exp);
  echo "CASE ".$__t${i}_id.": ".($__pass ? "Accepted" : "Wrong Answer")."\\n";
  if (!$__pass) {
    echo "  expected ".json_encode($__t${i}_exp)."\\n";
    echo "  got      ".json_encode($__got)."\\n";
  }
} catch (Throwable $e) {
  echo "CASE ".$__t${i}_id.": Runtime Error\\n";
  echo $e->getMessage()."\\n";
}
`;
        })
        .join("\n");
      const body = userCode.includes("<?php") ? userCode : `<?php\n${userCode}`;
      return `${body}\n${calls}\n`;
    }
    case "ruby": {
      const calls = cases
        .map((t) => {
          const args = t.input.map(rbLit).join(", ");
          return `
begin
  got = ${fn}(${args})
  exp = ${rbLit(t.expected)}
  pass = got == exp
  puts "CASE ${t.id}: #{pass ? 'Accepted' : 'Wrong Answer'}"
  unless pass
    puts "  expected #{exp.inspect}"
    puts "  got      #{got.inspect}"
  end
rescue => e
  puts "CASE ${t.id}: Runtime Error"
  puts e.message
end
`;
        })
        .join("\n");
      return `${userCode}\n${calls}\n`;
    }
    case "python":
    case "python3": {
      const clean = cases
        .map((t) => {
          const args = t.input.map(pyLit).join(", ");
          return `
try:
    _sol = Solution()
    got = _sol.${fn}(${args})
    exp = ${pyLit(t.expected)}
    ok = got == exp
    print("CASE ${t.id}: " + ("Accepted" if ok else "Wrong Answer"))
    if not ok:
        print("  expected", exp)
        print("  got     ", got)
except Exception as e:
    print("CASE ${t.id}: Runtime Error")
    print(e)
`;
        })
        .join("\n");
      return `${userCode}\n${clean}\n`;
    }
    case "javascript":
    case "typescript": {
      const isTs = language === "typescript";
      const calls = cases
        .map((t) => {
          const args = t.input.map(jsLit).join(", ");
          return `
(function(){
  var id = ${JSON.stringify(t.id)};
  var exp = ${jsLit(t.expected)};
  try {
    var got = ${fn}(${args});
    var pass = JSON.stringify(got) === JSON.stringify(exp);
    console.log("CASE " + id + ": " + (pass ? "Accepted" : "Wrong Answer"));
    if (!pass) {
      console.log("  expected " + JSON.stringify(exp));
      console.log("  got      " + JSON.stringify(got));
    }
  } catch (e) {
    console.log("CASE " + id + ": Runtime Error");
    console.log(String(e && e.stack || e));
  }
})();
`;
        })
        .join("\n");
      return `${userCode}\n${calls}\n`;
    }
    case "java": {
      const calls = cases
        .map((t, i) => {
          // Limited: only support primitive-ish JSON via manual for common array/int cases
          // Use a simple approach - compare string forms via Arrays.deepToString where possible
          return `
    try {
      Object got = new Solution().${fn}(/* LITCODE: wire tests via JSON driver */);
    } catch (Throwable ignored) {}
`;
        })
        .join("");
      // Java typed harness is fragile without signatures — fall back to null (run-only)
      void calls;
      return null;
    }
    default:
      void j;
      return null;
  }
}

/** Parse CASE lines from remote judge stdout. */
export function parseRemoteCaseResults(
  stdout: string,
  tests: Test[]
): Array<{ id: string; pass: boolean; expected: unknown; error?: string }> {
  const results: Array<{
    id: string;
    pass: boolean;
    expected: unknown;
    error?: string;
  }> = [];
  const lines = stdout.split(/\r?\n/);
  for (const t of tests) {
    const hit = lines.find((l) => l.startsWith(`CASE ${t.id}:`));
    if (!hit) {
      results.push({
        id: t.id,
        pass: false,
        expected: t.expected,
        error: "No result from remote judge",
      });
      continue;
    }
    const pass = /:\s*Accepted\b/.test(hit);
    const err = /Runtime Error/.test(hit) ? "Runtime Error" : undefined;
    results.push({ id: t.id, pass, expected: t.expected, error: err });
  }
  return results;
}
