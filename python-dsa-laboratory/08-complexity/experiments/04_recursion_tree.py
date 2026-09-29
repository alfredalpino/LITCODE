def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)


def fib_memo(n, memo=None):
    if memo is None:
        memo = {}
    if n in memo:
        return memo[n]
    if n < 2:
        return n
    memo[n] = fib_memo(n - 1, memo) + fib_memo(n - 2, memo)
    return memo[n]


def main():
    print(fib(10), fib_memo(10))


if __name__ == "__main__":
    main()
