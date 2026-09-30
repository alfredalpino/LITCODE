def main():
    data = list(range(10_000))
    as_set = set(data)
    print(9999 in data, 9999 in as_set)


if __name__ == "__main__":
    main()
