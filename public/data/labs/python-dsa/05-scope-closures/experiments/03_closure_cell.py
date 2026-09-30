def maker(msg):
    def greeter():
        return f"hello {msg}"
    return greeter


def main():
    g = maker("lab")
    print(g())
    print(g.__closure__[0].cell_contents)


if __name__ == "__main__":
    main()
