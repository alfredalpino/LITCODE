"""Probe built-in samples for type, hash, and item assignment.

Predict each row before you run this. Then add one sample of your own.
"""

SAMPLES = [
    ("int", 1),
    ("float", 1.5),
    ("complex", 1 + 2j),
    ("bool", True),
    ("str", "a"),
    ("bytes", b"a"),
    ("bytearray", bytearray(b"a")),
    ("None", None),
    ("list", [1]),
    ("tuple", (1, 2)),
    ("tuple_with_list", (1, [2])),
    ("set", {1}),
    ("frozenset", frozenset({1})),
    ("dict", {"k": 1}),
    ("range", range(3)),
]


def hash_status(value):
    try:
        return hash(value)
    except TypeError as exc:
        return f"TypeError: {exc}"


def mutation_status(value):
    """Try a reversible mutation. Report whether the type allows one."""
    try:
        if isinstance(value, list):
            value.append(None)
            value.pop()
            return "mutable (append)"
        if isinstance(value, bytearray):
            value[0] = value[0]
            return "mutable (item assignment)"
        if isinstance(value, set):
            sentinel = object()
            value.add(sentinel)
            value.remove(sentinel)
            return "mutable (add)"
        if isinstance(value, dict):
            value["__probe__"] = 0
            del value["__probe__"]
            return "mutable (item assignment)"
        value[0] = value[0]
    except TypeError as exc:
        return f"rejected ({type(exc).__name__})"
    except Exception as exc:
        return f"{type(exc).__name__}: {exc}"
    return "item assignment did not raise"


def main():
    for label, value in SAMPLES:
        print("=" * 60)
        print(label, "->", repr(value), "type", type(value).__name__)
        print("  hash:", hash_status(value))
        print("  mutate:", mutation_status(value))


if __name__ == "__main__":
    main()
