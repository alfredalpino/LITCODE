def build_plus(n):
    s = ""
    for i in range(n):
        s += "a"
    return len(s)


def build_join(n):
    return len("".join("a" for _ in range(n)))


def main():
    print(build_plus(1000), build_join(1000))


if __name__ == "__main__":
    main()
