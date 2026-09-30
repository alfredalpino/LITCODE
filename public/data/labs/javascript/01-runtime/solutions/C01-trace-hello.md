# Solution — C01 Trace Hello

Sample trace (yours may be finer-grained):

1. You invoke Node with a path to the file (**host** CLI).
2. Node reads source text from disk (**host**).
3. Engine prepares to treat it as a script and **parses** source → structural representation / AST **(engine detail for exact form)**.
4. If parsing fails → SyntaxError; stop. Here it succeeds.
5. Engine begins **evaluating** the script (**language** semantics).
6. Evaluates the `console.log("Hello")` call expression.
7. Resolves the reference for `console` on the global environment.
8. Gets the `log` property.
9. Performs [[Call]] with argument `"Hello"` (**language** callable semantics).
10. The function body is a **host-provided** logging implementation that writes to stdout (**host**).
11. Script evaluation completes; process may exit (**host**).

**Not required:** JIT compiling this one-liner to optimized machine code.
