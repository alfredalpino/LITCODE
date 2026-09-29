from collections import Counter


def signature(word):
    return tuple(sorted(Counter(word).items()))


def main():
    print(signature("listen") == signature("silent"))


if __name__ == "__main__":
    main()
