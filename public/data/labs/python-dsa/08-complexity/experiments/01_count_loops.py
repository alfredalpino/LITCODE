def triangular(n):
    count = 0
    for i in range(n):
        for j in range(i, n):
            count += 1
    return count


def main():
    for n in (1, 2, 5, 10):
        print(n, triangular(n), "closed?", n * (n + 1) // 2)


if __name__ == "__main__":
    main()
