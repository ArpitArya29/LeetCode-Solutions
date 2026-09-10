# 3271. Hash Divided String

## Problem Overview

You are given a string s of length n and an integer k, where n is a multiple of k. Your task is to hash the string s into a new string called result, which has a length of n / k. First, divide s into n / k substrings, each with a length of k. Then, initialize result as an empty string.

## Examples

### Example 1

**Input:**
```text
s = "abcd", k = 2
```

**Output:**
```text
"bf"
```

**Explanation:**

First substring: "ab", 0 + 1 = 1, 1 % 26 = 1, result[0] = 'b'.

Second substring: "cd", 2 + 3 = 5, 5 % 26 = 5, result[1] = 'f'.

### Example 2

**Input:**
```text
s = "mxz", k = 3
```

**Output:**
```text
"i"
```

**Explanation:**

The only substring: "mxz", 12 + 23 + 25 = 60, 60 % 26 = 8, result[0] = 'i'.

## Solution

This directory contains my submitted solution for this problem.

- `3271. Hash Divided String.java`

## LeetCode

[View Problem on LeetCode](https://leetcode.com/problems/hash-divided-string/)
