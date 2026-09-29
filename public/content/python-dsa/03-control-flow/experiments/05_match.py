"""Structural pattern matching is ordered conditionals.

Predict the label for each sample before you run this.
"""


def classify(value):
    match value:
        case 0:
            return "zero"
        case [x, y]:
            return "pair"
        case _:
            return "other"


def main():
    samples = [0, [1, 2], [1, 2, 3], "0", False]
    for value in samples:
        print(repr(value), "->", classify(value))


if __name__ == "__main__":
    main()
