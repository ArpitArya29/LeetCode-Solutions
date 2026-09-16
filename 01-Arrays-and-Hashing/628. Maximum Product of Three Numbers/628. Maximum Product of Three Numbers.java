1class Solution {
2    public int maximumProduct(int[] nums) {
3        Arrays.sort(nums);
4
5        int len = nums.length;
6
7        int prod1 = nums[len-1] * nums[len-2] * nums[len-3];
8        int prod2 = nums[0] * nums[1] * nums[len-1];
9
10        return Math.max(prod1, prod2);
11    }
12}