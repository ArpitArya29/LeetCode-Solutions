1class Solution {
2    public int[] occurrencesOfElement(int[] nums, int[] queries, int x) {
3        int occ = 0;
4
5        int len = nums.length;
6
7        int occArr[] = new int[len];
8
9        for(int i=0; i<len; i++) {
10            if(nums[i] == x) {
11                occ++;
12                occArr[occ-1] = i;
13            }
14        }
15
16        int qLen = queries.length;
17
18        int ans[] = new int[qLen];
19
20        for(int i=0; i<qLen; i++) {
21            if(queries[i] > occ) {
22                ans[i] = -1;
23            } else {
24                ans[i] = occArr[queries[i]-1];
25            }
26        }
27
28        return ans;
29    }
30}