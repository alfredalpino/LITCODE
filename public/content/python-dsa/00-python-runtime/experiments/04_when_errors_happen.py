"""Compile snippets and see which errors are which phase.

Predict, for each snippet, whether it fails at compile time,
at exec time, or only when the function is called.
"""

SNIPPETS = {
    "missing_colon": "def f()\n    return 1\n",
    "missing_name": "def f():\n    return missing\n",
    "runs_cleanly": "def f():\n    return 1 + 2\n",
}


def attempt(label, source):
    print("=" * 60)
    print(label)
    try:
        code = compile(source, label, "exec")
    except SyntaxError as exc:
        print(f"compile failed: {type(exc).__name__}: {exc.msg}")
        return

    print("compile succeeded")
    namespace = {}
    try:
        exec(code, namespace)
    except Exception as exc:
        print(f"exec failed: {type(exc).__name__}: {exc}")
        return

    print("exec succeeded")
    function = namespace.get("f")
    if function is None:
        return
    try:
        print("call returned:", function())
    except Exception as exc:
        print(f"call failed: {type(exc).__name__}: {exc}")


def main():
    for label, source in SNIPPETS.items():
        attempt(label, source)


if __name__ == "__main__":
    main()
