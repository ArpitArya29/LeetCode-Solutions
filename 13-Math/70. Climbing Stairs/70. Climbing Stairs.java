1class Solution {
2    public int climbStairs(int n) {
3
4        if(n < 2) return n;
5
6        int prev2 = 1;
7        int prev1 = 2;
8
9
10        for(int i=2; i<n; i++) {
11            int curr = prev2 + prev1;
12            prev2 = prev1;
13            prev1 = curr;
14        }
15
16        return prev1;
17
18        // DP method
19        // int[] dpArr = new int[n];
20
21        // dpArr[0] = 1;
22        // dpArr[1] = 2;
23
24        // for(int i=2; i<n; i++) {
25        //     // we can either jump 2 (prev of prev) or jump 1(from prev)
26        //     // current ways will be the sum of prev ways and prev of prev ways
27        //     dpArr[i] = dpArr[i-1] + dpArr[i-2];
28        // }
29
30        // return dpArr[n-1];
31    }
32}