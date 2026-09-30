import time


def timed(label, fn):
    t0 = time.perf_counter()
    fn()
    print(f"{label}: {time.perf_counter() - t0:.4f}s")


def main():
    n = 40_000
    timed("append", lambda: [0 for _ in range(n)] or None)
    def inserts():
        a = []
        for i in range(n):
            a.insert(0, i)
    timed("insert(0)", inserts)


if __name__ == "__main__":
    main()
