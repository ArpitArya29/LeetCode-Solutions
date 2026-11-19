1class Solution {
2    private int findPaths(int r, int c, int[][] obs, int[][] grid, int rows, int cols) {
3        
4        if(r >= rows || c >= cols || obs[r][c] == 1) return 0;
5
6        if(r == rows-1 && c == cols-1) return 1;
7
8        if(grid[r][c] != 0) return grid[r][c];
9
10        int left = findPaths(r, c+1, obs, grid, rows, cols);
11        int down = findPaths(r+1, c, obs, grid, rows, cols);
12
13        return grid[r][c] = left + down;
14
15    }
16    public int uniquePathsWithObstacles(int[][] obstacleGrid) {
17        int rows = obstacleGrid.length;
18        int cols = obstacleGrid[0].length;
19
20        // int[][] grid = new int[rows][cols];
21        // recursion and memoization method
22        // return findPaths(0, 0, obstacleGrid, grid, rows, cols); 
23
24        // tabulation method
25        // for(int i=0; i<rows; i++) {
26        //     for(int j=0; j<cols; j++) {
27        //         if(i == 0 && j == 0 && obstacleGrid[i][j] != 1) grid[i][j] = 1;
28        //         else if(obstacleGrid[i][j] == 1) grid[i][j] = 0;
29        //         else {
30        //             int left = 0, up = 0;
31
32        //             if(i > 0) up = grid[i-1][j];
33        //             if(j > 0) left = grid[i][j-1];
34
35        //             grid[i][j] = up + left;
36        //         }
37        //     }
38        // }
39
40        // return grid[rows-1][cols-1];
41
42
43        // space optimized tabulation method
44        int[] prev = new int[cols]; // using two single arrays, instead of the complete matrix
45
46        for(int i=0; i<rows; i++) {
47            int[] curr = new int[cols];
48            for(int j=0; j<cols; j++) {
49                if(i == 0 && j == 0 && obstacleGrid[i][j] != 1) curr[j] = 1;
50                else if(obstacleGrid[i][j] == 1) curr[j] = 0;
51                else {
52                    int left = 0, up = 0;
53
54                    if(i > 0) up = prev[j];
55                    if(j > 0) left = curr[j-1];
56
57                    curr[j] = up + left;
58                }
59            }
60            prev = curr;
61        }
62
63        return prev[cols-1];
64    }
65}