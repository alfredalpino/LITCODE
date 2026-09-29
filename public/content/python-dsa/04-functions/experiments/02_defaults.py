"""Defaults bind once — at definition time."""

def append_item(item, bucket=[]):
    bucket.append(item)
    return bucket


def append_safe(item, bucket=None):
    if bucket is None:
        bucket = []
    bucket.append(item)
    return bucket


def main():
    print("shared:", append_item(1), append_item(2))
    print("safe:", append_safe(1), append_safe(2))


if __name__ == "__main__":
    main()
