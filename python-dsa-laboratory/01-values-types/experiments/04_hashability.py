"""Which objects can be hashed?

Predict TypeError or a numeric hash before you run this.
"""

CANDIDATES = [
    ("int", 1),
    ("str", "a"),
    ("tuple", (1, 2)),
    ("list", [1, 2]),
    ("tuple_of_list", (1, [2])),
    ("frozenset", frozenset({1, 2})),
    ("set", {1, 2}),
    ("bytearray", bytearray(b"a")),
    ("None", None),
    ("bytes", b"a"),
]


def main():
    for label, value in CANDIDATES:
        try:
            print(f"{label:16} {hash(value)}")
        except TypeError as exc:
            print(f"{label:16} TypeError: {exc}")


if __name__ == "__main__":
    main()
