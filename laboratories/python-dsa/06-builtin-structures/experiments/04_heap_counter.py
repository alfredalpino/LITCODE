import heapq
from collections import Counter


def main():
    h = [5, 1, 3]
    heapq.heapify(h)
    print(heapq.heappop(h), h)
    print(Counter("banana").most_common(2))


if __name__ == "__main__":
    main()
