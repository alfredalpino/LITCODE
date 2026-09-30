def demo():
    n = 0
    def bump():
        nonlocal n
        n += 1
        return n
    return bump


def main():
    f = demo()
    print(f(), f(), f())


if __name__ == "__main__":
    main()
