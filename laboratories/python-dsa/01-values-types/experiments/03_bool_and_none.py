"""bool, None, and a few values people misread.

Predict every print before you run this.
"""


def main():
    print("isinstance True int", isinstance(True, int))
    one = 1
    print("True == 1", True == one)
    print("True is 1", True is one)
    print("True + True", True + True)
    print("False * 10", False * 10)
    print("set length", len({True, 1, 1.0}))
    print("the set itself", {True, 1, 1.0})
    print('bool ""', bool(""))
    print('bool "False"', bool("False"))
    print("bool [0]", bool([0]))
    print("None == False", None == False)
    print("None == 0", None == 0)


if __name__ == "__main__":
    main()
