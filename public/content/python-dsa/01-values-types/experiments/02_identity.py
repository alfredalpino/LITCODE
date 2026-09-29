"""Identity versus equality.

Write True/False for every printed line before you run this.
"""


def main():
    a = [1, 2, 3]
    b = a
    c = a.copy()
    print("a is b", a is b)
    print("a == b", a == b)
    print("a is c", a is c)
    print("a == c", a == c)

    print("None is None", None is None)
    empty_list_a = []
    empty_list_b = []
    empty_tuple_a = ()
    empty_tuple_b = ()
    print("[] is []", empty_list_a is empty_list_b)
    print("() is ()", empty_tuple_a is empty_tuple_b)
    print("256 independently", int("256") is int("256"))
    print("257 independently", int("257") is int("257"))

    joined = "".join(["hel", "lo"])
    literal = "hello"
    print("joined == literal", joined == literal)
    print("joined is literal", joined is literal)


if __name__ == "__main__":
    main()
