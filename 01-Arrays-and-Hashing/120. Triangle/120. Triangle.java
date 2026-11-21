1class Solution {
2    private int calculate(int r, int c, int rows, List<List<Integer>> tri, int[][] dpArr) {
3        if(r == rows-1) return tri.get(r).get(c);
4
5        if(dpArr[r][c] != 0) return dpArr[r][c];
6
7        int down = tri.get(r).get(c) + calculate(r+1, c, rows, tri, dpArr);
8        int diag = tri.get(r).get(c) + calculate(r+1, c+1, rows, tri, dpArr);
9
10        int min = Math.min(down, diag);
11        dpArr[r][c] = min;
12
13        return min;
14    }
15
16    public int minimumTotal(List<List<Integer>> triangle) {
17        int rows = triangle.size();
18
19        int[][] dpArr = new int[rows][rows];
20
21        // return calculate(0, 0, rows, triangle, dpArr); // results TLE
22
23
24        // Tabulation Method
25        for(int j=0; j<rows; j++) {
26            // create the DP Array for the last row
27            dpArr[rows-1][j] = triangle.get(rows-1).get(j);
28        }
29
30        // In this pattern, we would move from the bottom to up in tabulation
31        for(int i=rows-2; i>=0; i--) {
32            for(int j=i; j>=0; j--) {
33                int down = triangle.get(i).get(j) + dpArr[i+1][j];
34                int diag = triangle.get(i).get(j) + dpArr[i+1][j+1];
35
36                dpArr[i][j] = Math.min(down, diag);
37            }
38        }
39
40        return dpArr[0][0];
41    }
42}