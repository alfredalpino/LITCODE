"""In-place update versus rebinding, including through a parameter.

Predict every printed group before you run this.
"""


def replace(items):
    items = []
    return items


def clear(items):
    items.clear()
    return items


def main():
    p = [1]
    q = p
    print("start", p, q, "same", p is q)

    p += [2]
    print("after +=" , p, q, "same", p is q)

    p = p + [3]
    print("after + ", p, q, "same", p is q)

    x = 10
    y = x
    x = x + 1
    print("ints", x, y, "same", x is y)

    data = [1, 2, 3]
    replace(data)
    print("after replace", data)
    clear(data)
    print("after clear", data)


if __name__ == "__main__":
    main()
