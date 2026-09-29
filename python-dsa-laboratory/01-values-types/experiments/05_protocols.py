"""Ranges, bytes, floats, iteration, callability.

Predict before you run this.
"""


def main():
    print("list(range(3))", list(range(3)))
    print("range == list", range(3) == [0, 1, 2])
    print("range == range", range(3) == range(0, 3))
    print("bytes == str", b"ab" == "ab")
    print("list of bytes", list(b"ab"))
    print("0.1 + 0.2 == 0.3", 0.1 + 0.2 == 0.3)
    print("callable len", callable(len))
    print("callable 1", callable(1))

    iterator = iter([10, 20])
    print("next", next(iterator))
    print("next", next(iterator))
    try:
        next(iterator)
    except StopIteration:
        print("third next: StopIteration")


if __name__ == "__main__":
    main()
