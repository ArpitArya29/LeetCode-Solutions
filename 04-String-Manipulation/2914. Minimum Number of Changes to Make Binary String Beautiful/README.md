# 2914. Minimum Number of Changes to Make Binary String Beautiful

## Problem Overview

You are given a 0-indexed binary string s having an even length. A string is beautiful if it's possible to partition it into one or more substrings such that:

## Examples

### Example 1

**Input:**
```text
s = "1001"
```

**Output:**
```text
2
```

**Explanation:**

We change s[1] to 1 and s[3] to 0 to get string "1100".
It can be seen that the string "1100" is beautiful because we can partition it into "11|00".
It can be proven that 2 is the minimum number of changes needed to make the string beautiful.

### Example 2

**Input:**
```text
s = "10"
```

**Output:**
```text
1
```

**Explanation:**

We change s[1] to 1 to get string "11".
It can be seen that the string "11" is beautiful because we can partition it into "11".
It can be proven that 1 is the minimum number of changes needed to make the string beautiful.

### Example 3

**Input:**
```text
s = "0000"
```

**Output:**
```text
0
```

**Explanation:**

We don't need to make any changes as the string "0000" is beautiful already.

## Solution

This directory contains my submitted solution for this problem.

- `2914. Minimum Number of Changes to Make Binary String Beautiful.java`

## LeetCode

[View Problem on LeetCode](https://leetcode.com/problems/minimum-number-of-changes-to-make-binary-string-beautiful/)
