"""lambda for short throwaway callables — prefer def when naming helps."""

def main():
    pairs = [("b", 2), ("a", 3), ("c", 1)]
    print(sorted(pairs, key=lambda p: p[1]))


if __name__ == "__main__":
    main()
