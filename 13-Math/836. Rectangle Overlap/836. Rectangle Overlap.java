1class Solution {
2    public boolean isRectangleOverlap(int[] rec1, int[] rec2) {
3        // calculate common width (comparing x-axis)
4        int cWidth = Math.min(rec1[2], rec2[2]) - Math.max(rec1[0], rec2[0]);
5
6        // calculate common height (comparing y-axis)
7        int cHeight = Math.min(rec1[3], rec2[3]) - Math.max(rec1[1], rec2[1]);
8
9        // if any of value is -ve -> no overlapping case
10        if(cWidth <= 0 || cHeight <= 0) return false;
11
12        return true;
13    }
14}