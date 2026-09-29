def broken():
    return [lambda: i for i in range(3)]


def fixed():
    return [lambda i=i: i for i in range(3)]


def main():
    print("broken:", [f() for f in broken()])
    print("fixed:", [f() for f in fixed()])


if __name__ == "__main__":
    main()
