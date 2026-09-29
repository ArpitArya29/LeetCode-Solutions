# 2267. Check if There Is a Valid Parentheses String Path

## Problem Overview

A parentheses string is a non-empty string consisting only of '(' and ')'. It is valid if any of the following conditions is true: You are given an m x n matrix of parentheses grid. A valid parentheses string path in the grid is a path satisfying all of the following conditions:

## Examples

### Example 1

**Input:**
```text
grid = [["(","(","("],[")","(",")"],["(","(",")"],["(","(",")"]]
```

**Output:**
```text
true
```

**Explanation:**

The above diagram shows two possible paths that form valid parentheses strings.
The first path shown results in the valid parentheses string "()(())".
The second path shown results in the valid parentheses string "((()))".
Note that there may be other valid parentheses string paths.

### Example 2

**Input:**
```text
grid = [[")",")"],["(","("]]
```

**Output:**
```text
false
```

**Explanation:**

The two possible paths form the parentheses strings "))(" and ")((". Since neither of them are valid parentheses strings, we return false.

## Solution

This directory contains my submitted solution for this problem.

- `2267. Check if There Is a Valid Parentheses String Path.java`

## LeetCode

[View Problem on LeetCode](https://leetcode.com/problems/check-if-there-is-a-valid-parentheses-string-path/)
