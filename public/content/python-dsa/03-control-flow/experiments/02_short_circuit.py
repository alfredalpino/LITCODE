"""`and` and `or` return operands and skip work.

Predict the prints and the values before you run this.
`print` returns None. That matters.
"""


def main():
    print("first ", 0 and print("left") or print("right"))
    print("second", 1 and print("left") or print("right"))
    print("name  ", "" or "anon")
    print("count ", 0 or 5)


if __name__ == "__main__":
    main()
