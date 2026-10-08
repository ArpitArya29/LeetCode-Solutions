# 1021. Remove Outermost Parentheses

## Problem Overview

A valid parentheses string is either empty "", "(" + A + ")", or A + B, where A and B are valid parentheses strings, and + represents string concatenation. A valid parentheses string s is primitive if it is nonempty, and there does not exist a way to split it into s = A + B, with A and B nonempty valid parentheses strings.

## Examples

### Example 1

**Input:**
```text
s = "(()())(())"
```

**Output:**
```text
"()()()"
```

**Explanation:**

The input string is "(()())(())", with primitive decomposition "(()())" + "(())".
After removing outer parentheses of each part, this is "()()" + "()" = "()()()".

### Example 2

**Input:**
```text
s = "(()())(())(()(()))"
```

**Output:**
```text
"()()()()(())"
```

**Explanation:**

The input string is "(()())(())(()(()))", with primitive decomposition "(()())" + "(())" + "(()(()))".
After removing outer parentheses of each part, this is "()()" + "()" + "()(())" = "()()()()(())".

### Example 3

**Input:**
```text
s = "()()"
```

**Output:**
```text
""
```

**Explanation:**

The input string is "()()", with primitive decomposition "()" + "()".
After removing outer parentheses of each part, this is "" + "" = "".

## Solution

This directory contains my submitted solution for this problem.

- `1021. Remove Outermost Parentheses.java`

## LeetCode

[View Problem on LeetCode](https://leetcode.com/problems/remove-outermost-parentheses/)
