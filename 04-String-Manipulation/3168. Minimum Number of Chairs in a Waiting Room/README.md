# 3168. Minimum Number of Chairs in a Waiting Room

## Problem Overview

You are given a string s. Simulate events at each second i: Return the minimum number of chairs needed so that a chair is available for every person who enters the waiting room given that it is initially empty.

## Examples

### Example 1

**Input:**
```text
s = "EEEEEEE"
```

**Output:**
```text
7
```

**Explanation:**

After each second, a person enters the waiting room and no person leaves it. Therefore, a minimum of 7 chairs is needed.

### Example 2

**Input:**
```text
s = "ELELEEL"
```

**Output:**
```text
2
```

**Explanation:**

Let's consider that there are 2 chairs in the waiting room. The table below shows the state of the waiting room at each second.

Second
Event
People in the Waiting Room
Available Chairs

0
Enter
1
1

1
Leave
0
2

2
Enter
1
1

3
Leave
0
2

4
Enter
1
1

5
Enter
2
0

6
Leave
1
1

### Example 3

**Input:**
```text
s = "ELEELEELLL"
```

**Output:**
```text
3
```

**Explanation:**

Let's consider that there are 3 chairs in the waiting room. The table below shows the state of the waiting room at each second.

Second
Event
People in the Waiting Room
Available Chairs

0
Enter
1
2

1
Leave
0
3

2
Enter
1
2

3
Enter
2
1

4
Leave
1
2

5
Enter
2
1

6
Enter
3
0

7
Leave
2
1

8
Leave
1
2

9
Leave
0
3

## Solution

This directory contains my submitted solution for this problem.

- `3168. Minimum Number of Chairs in a Waiting Room.java`

## LeetCode

[View Problem on LeetCode](https://leetcode.com/problems/minimum-number-of-chairs-in-a-waiting-room/)
