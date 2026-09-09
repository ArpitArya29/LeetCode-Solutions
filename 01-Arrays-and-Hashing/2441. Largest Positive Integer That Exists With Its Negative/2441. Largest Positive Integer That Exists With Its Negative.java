1class Solution {
2    public int findMaxK(int[] nums) {
3        Arrays.sort(nums);
4
5        Set<Integer> hs = new HashSet<>();
6
7        for(int n : nums) {
8            if(n < 0) hs.add(n);
9
10            else break;
11        }
12
13        int lIdx = nums.length - 1;
14
15        while(lIdx >= 0 && !hs.contains(-1 * nums[lIdx])) lIdx--;
16
17        // if(nums[lIdx] > 0) return nums[lIdx];
18        // else return -1;
19
20        return (lIdx >= 0 && nums[lIdx] > 0) ? nums[lIdx] : -1;
21    }
22}