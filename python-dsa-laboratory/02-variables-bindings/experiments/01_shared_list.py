"""One list, several names.

Predict `is`, `==`, and the lists after append, before you run this.
"""


def main():
    a = [1, 2, 3]
    b = a
    c = a.copy()
    d = a[:]

    print("before append")
    print("a is b", a is b, "a == b", a == b)
    print("a is c", a is c, "a == c", a == c)
    print("a is d", a is d, "a == d", a == d)

    a.append(4)
    print("after append")
    print("a", a)
    print("b", b)
    print("c", c)
    print("d", d)


if __name__ == "__main__":
    main()
