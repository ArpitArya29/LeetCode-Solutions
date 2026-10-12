1class Solution {
2    public int[] resultArray(int[] nums) {
3
4        int len = nums.length;
5        if(len <= 2) return nums;
6
7        List<Integer> arr1 = new ArrayList<>();
8        List<Integer> arr2 = new ArrayList<>();
9
10        arr1.add(nums[0]);
11        arr2.add(nums[1]);
12
13        int len1 = 1, len2 = 1;
14
15        for(int i=2; i<len; i++) {
16            if(arr1.get(len1-1) > arr2.get(len2-1)) {
17                arr1.add(nums[i]);
18                len1++;
19            } else {
20                arr2.add(nums[i]);
21                len2++;
22            }
23        }
24
25        int[] ans = new int[len];
26
27        for(int i=0; i<len1; i++) {
28            ans[i] = arr1.get(i);
29        }
30
31        for(int i=0; i<len2; i++) {
32            ans[len1+i] = arr2.get(i);
33        }
34
35        return ans;
36    }
37}