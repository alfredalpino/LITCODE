"""Show the tables on a code object.

Predict where `n` and `1` live before you run this file.
"""


def add_one(n):
    return n + 1


def add_ten(a, b):
    return a + b + 10


def uses_global(a):
    return a + missing


def show(fn):
    code = fn.__code__
    print(f"--- {fn.__name__} ---")
    print("co_varnames:", code.co_varnames)
    print("co_consts:  ", code.co_consts)
    print("co_names:   ", code.co_names)


def main():
    show(add_one)
    show(add_ten)
    show(uses_global)


if __name__ == "__main__":
    main()
