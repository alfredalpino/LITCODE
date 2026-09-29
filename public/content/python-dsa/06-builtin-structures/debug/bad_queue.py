"""This 'queue' gets slower as it grows. Replace the structure."""

def drain(n):
    q = list(range(n))
    out = []
    while q:
        out.append(q.pop(0))
    return out[-1]


def main():
    print(drain(5))


if __name__ == "__main__":
    main()
