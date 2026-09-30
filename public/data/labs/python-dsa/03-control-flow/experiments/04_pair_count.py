"""How many times does the inner body run?

Predict pair_count(0), pair_count(1), pair_count(4), and a formula in n.
"""


def pair_count(n):
    count = 0
    for i in range(n):
        for j in range(i):
            count += 1
    return count


def main():
    for n in (0, 1, 4, 5, 10):
        print(n, pair_count(n))


if __name__ == "__main__":
    main()
