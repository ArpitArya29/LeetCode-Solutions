1class Solution {
2    public int rob(int[] nums) {
3        int len = nums.length;
4
5        if(len == 1) return nums[0];
6
7        int[] dpArr = new int[len];
8        dpArr[0] = nums[0];
9        dpArr[1] = Math.max(nums[0], nums[1]); // check whether it is optimal to pick 1st or 2nd house
10
11        for(int i=2; i<len; i++) {
12            // current will be
13            // either choose the current in addition with the collected money with prev of prev
14            // or we can choose to go with the previously collected amount
15            dpArr[i] = Math.max(dpArr[i-2] + nums[i], dpArr[i-1]);
16        }
17
18        return dpArr[len-1];
19    }
20}