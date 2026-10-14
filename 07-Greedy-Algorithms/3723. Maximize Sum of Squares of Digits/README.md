# 3723. Maximize Sum of Squares of Digits

## Problem Overview

You are given two positive integers num and sum. A positive integer n is good if it satisfies both of the following:

## Examples

### Example 1

**Input:**
```text
num = 2, sum = 3
```

**Output:**
```text
"30"
```

**Explanation:**

There are 3 good integers: 12, 21, and 30.

The score of 12 is 12 + 22 = 5.

The score of 21 is 22 + 12 = 5.

The score of 30 is 32 + 02 = 9.

The maximum score is 9, which is achieved by the good integer 30. Therefore, the answer is "30".

### Example 2

**Input:**
```text
num = 2, sum = 17
```

**Output:**
```text
"98"
```

**Explanation:**

There are 2 good integers: 89 and 98.

The score of 89 is 82 + 92 = 145.

The score of 98 is 92 + 82 = 145.

The maximum score is 145. The maximum good integer that achieves this score is 98. Therefore, the answer is "98".

### Example 3

**Input:**
```text
num = 1, sum = 10
```

**Output:**
```text
""
```

**Explanation:**

There are no integers that have exactly 1 digit and whose digits sum to 10. Therefore, the answer is "".

## Solution

This directory contains my submitted solution for this problem.

- `3723. Maximize Sum of Squares of Digits.java`

## LeetCode

[View Problem on LeetCode](https://leetcode.com/problems/maximize-sum-of-squares-of-digits/)
