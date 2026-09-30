def main():
    text = "café"
    raw = text.encode("utf-8")
    print(raw, raw.decode("utf-8"))


if __name__ == "__main__":
    main()
