"""Functions are objects you can store and pass."""

def double(x):
    return x * 2


def apply(fn, value):
    return fn(value)


def main():
    ops = [double, abs]
    print("ops:", ops[0](5), ops[1](-3))
    print("apply:", apply(double, 10))
    print("name:", double.__name__)


if __name__ == "__main__":
    main()
