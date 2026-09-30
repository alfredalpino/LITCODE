from collections import deque


def main():
    q = deque()
    q.append(1)
    q.append(2)
    print(q.popleft(), list(q))


if __name__ == "__main__":
    main()
