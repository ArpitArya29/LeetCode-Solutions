1class Solution {
2    public int findTheDistanceValue(int[] arr1, int[] arr2, int d) {
3        int validCnts = 0;
4
5        for(int a1 : arr1) {
6            boolean allValid = true;
7
8            for(int a2 : arr2) {
9                if(Math.abs(a1 - a2) <= d) {
10                    allValid = false;
11                    break;
12                }
13            }
14
15            if(allValid) validCnts++;
16        }
17
18        return validCnts;
19    }
20}