1class Solution {
2    public boolean isMiddleElementUnique(int[] nums) {
3        int len = nums.length;
4
5        int midEl = nums[len/2];
6
7        int cnt = 0;
8
9        for(int n : nums) {
10            if(n == midEl) cnt++;
11
12            if(cnt == 2) return false;
13        }
14
15        return true;
16    }
17}