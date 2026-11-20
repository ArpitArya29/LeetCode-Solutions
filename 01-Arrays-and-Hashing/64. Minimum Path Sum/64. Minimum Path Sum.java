1class Solution {
2    private int minSum(int r, int c, int rows, int cols, int[][] grid, int[][] dp) {
3        if(r == rows-1 && c == cols-1) return grid[r][c]; // reached to the destination
4
5        if(r >= rows || c >= cols) return Integer.MAX_VALUE; // invalid grid cell
6
7        if(dp[r][c] != 0) return dp[r][c];
8
9        int right = minSum(r, c+1, rows, cols, grid, dp);
10        int bottom = minSum(r+1, c, rows, cols, grid, dp);
11
12        int min = Math.min(right, bottom);
13
14        // handled the integer overflow case
15        if(min == Integer.MAX_VALUE) return dp[r][c] = Integer.MAX_VALUE;
16
17        return dp[r][c] = grid[r][c] + min;
18    }
19    public int minPathSum(int[][] grid) {
20        int rows = grid.length;
21        int cols = grid[0].length;
22
23        int[][] dpArr = new int[rows][cols];
24
25        // return minSum(0, 0, rows, cols, grid, dpArr);
26
27        // tabulation method
28        for(int i=0; i<rows; i++) {
29            for(int j=0; j<cols; j++) {
30                if(i==0 && j==0) dpArr[i][j] = grid[i][j];
31                else {
32                    int left = Integer.MAX_VALUE;
33                    int up = Integer.MAX_VALUE;
34
35                    if(i > 0) up = dpArr[i-1][j];
36                    if(j > 0) left = dpArr[i][j-1];
37
38                    dpArr[i][j] = grid[i][j] + Math.min(up, left);
39                }
40            }
41        }
42
43        return dpArr[rows-1][cols-1];
44    }
45}