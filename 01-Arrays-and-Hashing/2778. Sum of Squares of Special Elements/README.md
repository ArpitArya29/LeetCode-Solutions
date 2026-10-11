# 2778. Sum of Squares of Special Elements

## Problem Overview

You are given a 1-indexed integer array nums of length n. An element nums[i] of nums is called special if i divides n, i.e. n % i == 0.

## Examples

### Example 1

**Input:**
```text
nums = [1,2,3,4]
```

**Output:**
```text
21
```

**Explanation:**

There are exactly 3 special elements in nums: nums[1] since 1 divides 4, nums[2] since 2 divides 4, and nums[4] since 4 divides 4.
Hence, the sum of the squares of all special elements of nums is nums[1] * nums[1] + nums[2] * nums[2] + nums[4] * nums[4] = 1 * 1 + 2 * 2 + 4 * 4 = 21.

### Example 2

**Input:**
```text
nums = [2,7,1,19,18,3]
```

**Output:**
```text
63
```

**Explanation:**

There are exactly 4 special elements in nums: nums[1] since 1 divides 6, nums[2] since 2 divides 6, nums[3] since 3 divides 6, and nums[6] since 6 divides 6.
Hence, the sum of the squares of all special elements of nums is nums[1] * nums[1] + nums[2] * nums[2] + nums[3] * nums[3] + nums[6] * nums[6] = 2 * 2 + 7 * 7 + 1 * 1 + 3 * 3 = 63.

## Solution

This directory contains my submitted solution for this problem.

- `2778. Sum of Squares of Special Elements.java`

## LeetCode

[View Problem on LeetCode](https://leetcode.com/problems/sum-of-squares-of-special-elements/)
