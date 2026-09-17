1class Solution {
2    public int[] decompressRLElist(int[] nums) {
3        List<Integer> li = new ArrayList<>();
4
5        int len = nums.length;
6
7        for(int i=0; i<len-1; i+=2) {
8            int freq = nums[i];
9            int val = nums[i+1];
10
11            while(freq > 0) {
12                li.add(val);
13                freq--;
14            }
15        }
16
17        int size = li.size();
18
19        int[] ans = new int[size];
20
21        for(int i=0; i<size; i++) {
22            ans[i] = li.get(i);
23        }
24
25        return ans;
26    }
27}