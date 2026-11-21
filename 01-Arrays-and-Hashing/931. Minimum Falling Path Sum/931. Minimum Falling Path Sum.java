1class Solution {
2    public int minFallingPathSum(int[][] matrix) {
3        int rows = matrix.length;
4        int cols = matrix[0].length;
5
6        int[][] dpArr = new int[rows][cols];
7
8        for(int j=0; j<cols; j++) {
9            dpArr[rows-1][j] = matrix[rows-1][j];
10        }
11
12        for(int i=rows-2; i>=0; i--) {
13            for(int j=0; j<cols; j++) {
14                int leftBottom = Integer.MAX_VALUE;
15                int Bottom = dpArr[i+1][j];
16                int rightBottom = Integer.MAX_VALUE;
17
18                if(j > 0) leftBottom = dpArr[i+1][j-1];
19                if(j < cols-1) rightBottom = dpArr[i+1][j+1];
20
21                dpArr[i][j] = matrix[i][j] + Math.min(Bottom, Math.min(leftBottom, rightBottom));
22            }
23        }
24
25        int minSum = Integer.MAX_VALUE;
26
27        for(int j=0; j<cols; j++) {
28            minSum = Math.min(minSum, dpArr[0][j]);
29        }
30
31        return minSum;
32    }
33}