"""A tuple slot holds a reference. The list at the end of it is still mutable.

Predict whether this raises, what `holder` becomes, and whether it can be hashed.
"""


def main():
    holder = ([],)
    print("before", holder)
    holder[0].append(1)
    print("after ", holder)
    try:
        print("hash", hash(holder))
    except TypeError as exc:
        print("hash rejected:", exc)
    try:
        holder[0] = ["replaced"]
    except TypeError as exc:
        print("slot replacement rejected:", type(exc).__name__)


if __name__ == "__main__":
    main()
