"""Bug: accumulator persists across calls. Diagnose before opening solutions."""

def collect(word, seen=[]):
    seen.append(word)
    return seen


def main():
    print(collect("alpha"))
    print(collect("beta"))
    # Expected independent lists per call if the API is "start empty".


if __name__ == "__main__":
    main()
