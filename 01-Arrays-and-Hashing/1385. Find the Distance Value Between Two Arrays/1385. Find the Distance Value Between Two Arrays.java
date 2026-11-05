1class Solution {
2    private int lowerBound(int el, int[] arr) {
3        int len = arr.length;
4
5        int st = 0, end = len-1;
6        int ans = len;
7
8        while(st <= end) {
9            int mid = st + (end - st) / 2;
10
11            if(arr[mid] >= el) {
12                ans = mid;
13                end = mid-1;
14            } else {
15                st = mid+1;
16            }
17        }
18
19        return ans;
20    }
21
22
23    public int findTheDistanceValue(int[] arr1, int[] arr2, int d) {
24        int validCnts = 0;
25
26        Arrays.sort(arr2);
27
28        for(int a1 : arr1) {
29            int lb = lowerBound(a1, arr2);
30
31            boolean valid = true;
32
33            if (lb < arr2.length &&
34                Math.abs(a1 - arr2[lb]) <= d) {
35                valid = false;
36            }
37
38            if (lb > 0 &&
39                Math.abs(a1 - arr2[lb - 1]) <= d) {
40                valid = false;
41            }
42
43            if (valid) validCnts++;
44        }
45        
46        // for(int a1 : arr1) {
47        //     boolean allValid = true;
48
49        //     for(int a2 : arr2) {
50        //         if(Math.abs(a1 - a2) <= d) {
51        //             allValid = false;
52        //             break;
53        //         }
54        //     }
55
56        //     if(allValid) validCnts++;
57        // }
58
59        return validCnts;
60    }
61}