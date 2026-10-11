1class Solution {
2    public int sumOfSquares(int[] nums) {
3        int len = nums.length;
4
5        int tSum = 0;
6
7        for(int i=0; i<len; i++) {
8            if(len % (i+1) == 0) {
9                tSum += nums[i] * nums[i];
10            }
11        }
12
13        return tSum;
14    }
15}