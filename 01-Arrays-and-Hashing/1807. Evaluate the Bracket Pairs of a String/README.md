# 1807. Evaluate the Bracket Pairs of a String

## Problem Overview

You are given a string s that contains some bracket pairs, with each pair containing a non-empty key. You know the values of a wide range of keys. This is represented by a 2D string array knowledge where each knowledge[i] = [keyi, valuei] indicates that key keyi has a value of valuei.

## Examples

### Example 1

**Input:**
```text
s = "(name)is(age)yearsold", knowledge = [["name","bob"],["age","two"]]
```

**Output:**
```text
"bobistwoyearsold"
```

**Explanation:**

The key "name" has a value of "bob", so replace "(name)" with "bob".
The key "age" has a value of "two", so replace "(age)" with "two".

### Example 2

**Input:**
```text
s = "hi(name)", knowledge = [["a","b"]]
```

**Output:**
```text
"hi?"
```

**Explanation:**

As you do not know the value of the key "name", replace "(name)" with "?".

### Example 3

**Input:**
```text
s = "(a)(a)(a)aaa", knowledge = [["a","yes"]]
```

**Output:**
```text
"yesyesyesaaa"
```

**Explanation:**

The same key can appear multiple times.
The key "a" has a value of "yes", so replace all occurrences of "(a)" with "yes".
Notice that the "a"s not in a bracket pair are not evaluated.

## Solution

This directory contains my submitted solution for this problem.

- `1807. Evaluate the Bracket Pairs of a String.java`

## LeetCode

[View Problem on LeetCode](https://leetcode.com/problems/evaluate-the-bracket-pairs-of-a-string/)
