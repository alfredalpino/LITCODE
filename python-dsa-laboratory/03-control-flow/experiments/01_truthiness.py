"""Truth values.

Predict True or False for every line before you run this.
"""

SAMPLES = [
    None,
    False,
    0,
    0.0,
    "",
    [],
    {},
    set(),
    "0",
    "False",
    [0],
    [False],
    1,
    " ",
]


def main():
    for value in SAMPLES:
        print(f"{bool(value)!s:5}  {value!r}")


if __name__ == "__main__":
    main()
