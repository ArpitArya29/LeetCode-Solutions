# 2116. Check if a Parentheses String Can Be Valid

## Problem Overview

A parentheses string is a non-empty string consisting only of '(' and ')'. It is valid if any of the following conditions is true: You are given a parentheses string s and a string locked, both of length n. locked is a binary string consisting only of '0's and '1's. For each index i of locked,

## Examples

### Example 1

**Input:**
```text
s = "))()))", locked = "010100"
```

**Output:**
```text
true
```

**Explanation:**

locked[1] == '1' and locked[3] == '1', so we cannot change s[1] or s[3].
We change s[0] and s[4] to '(' while leaving s[2] and s[5] unchanged to make s valid.

### Example 2

**Input:**
```text
s = "()()", locked = "0000"
```

**Output:**
```text
true
```

**Explanation:**

We do not need to make any changes because s is already valid.

### Example 3

**Input:**
```text
s = ")", locked = "0"
```

**Output:**
```text
false
```

**Explanation:**

locked permits us to change s[0].
Changing s[0] to either '(' or ')' will not make s valid.

### Example 4

**Input:**
```text
s = "(((())(((())", locked = "111111010111"
```

**Output:**
```text
true
```

**Explanation:**

locked permits us to change s[6] and s[8].
We change s[6] and s[8] to ')' to make s valid.

## Solution

This directory contains my submitted solution for this problem.

- `2116. Check if a Parentheses String Can Be Valid.java`

## LeetCode

[View Problem on LeetCode](https://leetcode.com/problems/check-if-a-parentheses-string-can-be-valid/)
