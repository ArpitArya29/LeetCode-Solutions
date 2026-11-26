1class Solution {
2    public int maxSubArray(int[] nums) {
3        int maxSum = Integer.MIN_VALUE;
4        int currSum = 0;
5
6        for(int n : nums) {
7            currSum += n;
8
9            maxSum = Math.max(currSum, maxSum); // store the incremented sum
10
11            // whenever it goes -ve, we not consider that subarray and re-initiliaze the currSum
12            if(currSum < 0) currSum = 0;
13        }
14
15        return maxSum;
16
17    }
18}