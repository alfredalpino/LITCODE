"""Higher-order: functions that take/return functions."""

def compose(f, g):
    return lambda x: f(g(x))


def main():
    pipe = compose(str, abs)
    print(pipe(-42))
    nums = [1, 2, 3, 4, 5]
    print([n for n in nums if (lambda x: x % 2 == 0)(n)])


if __name__ == "__main__":
    main()
