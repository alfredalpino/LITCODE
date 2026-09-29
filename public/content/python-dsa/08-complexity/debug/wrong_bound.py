"""Someone claimed this is O(n). It is not. Why?"""

def find_dup_pairs(nums):
    pairs = []
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] == nums[j]:
                pairs.append((i, j))
    return pairs


def main():
    print(find_dup_pairs([1, 2, 1, 3, 2]))


if __name__ == "__main__":
    main()
