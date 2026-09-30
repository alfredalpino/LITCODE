x = "global"

def outer():
    x = "enclosing"
    def inner():
        print("inner sees:", x)
    inner()
    print("outer sees:", x)


def main():
    outer()
    print("module sees:", x)


if __name__ == "__main__":
    main()
