# 3159. Find Occurrences of an Element in an Array

## Problem Overview

You are given an integer array nums, an integer array queries, and an integer x. For each queries[i], you need to find the index of the queries[i]th occurrence of x in the nums array. If there are fewer than queries[i] occurrences of x, the answer should be -1 for that query.

## Examples

### Example 1

**Input:**
```text
nums = [1,3,1,7], queries = [1,3,2,4], x = 1
```

**Output:**
```text
[0,-1,2,-1]
```

**Explanation:**

For the 1st query, the first occurrence of 1 is at index 0.

For the 2nd query, there are only two occurrences of 1 in nums, so the answer is -1.

For the 3rd query, the second occurrence of 1 is at index 2.

For the 4th query, there are only two occurrences of 1 in nums, so the answer is -1.

### Example 2

**Input:**
```text
nums = [1,2,3], queries = [10], x = 5
```

**Output:**
```text
[-1]
```

**Explanation:**

For the 1st query, 5 doesn't exist in nums, so the answer is -1.

## Solution

This directory contains my submitted solution for this problem.

- `3159. Find Occurrences of an Element in an Array.java`

## LeetCode

[View Problem on LeetCode](https://leetcode.com/problems/find-occurrences-of-an-element-in-an-array/)
