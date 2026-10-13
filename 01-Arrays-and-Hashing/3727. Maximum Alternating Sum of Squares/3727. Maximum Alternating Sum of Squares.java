1class Solution {
2    public long maxAlternatingSum(int[] nums) {
3        int len = nums.length;
4
5        for(int i=0; i<len; i++) {
6            nums[i] = nums[i] * nums[i];
7        }
8
9        Arrays.sort(nums);
10
11        int mid = len/2;
12
13        long larSum = 0;
14        for(int i=mid; i<len; i++) {
15            larSum += nums[i];
16        }
17
18        long smSum = 0;
19        for(int i=0; i<mid; i++) {
20            smSum += nums[i];
21        }
22
23        return larSum - smSum;
24    }
25}