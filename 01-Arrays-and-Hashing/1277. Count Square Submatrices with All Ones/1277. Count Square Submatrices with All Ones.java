1class Solution {
2    public int countSquares(int[][] matrix) {
3        int rows = matrix.length;
4        int cols = matrix[0].length;
5
6        int[][] dpArr = new int[rows][cols];
7
8        for(int i=0; i<rows; i++) {
9            for(int j=0; j<cols; j++) {
10                if(i == 0 || j == 0) {
11                    // copy the matrix if it is 1st row or 1st column
12                    dpArr[i][j] = matrix[i][j];
13                }
14                else if(matrix[i][j] == 1){ // if it is a valid square
15                    int topVal = dpArr[i-1][j];
16                    int topLeftVal = dpArr[i-1][j-1];
17                    int leftVal = dpArr[i][j-1];
18
19                    // check for all its adjacent squares, 
20                    // the larger square will be 1 more than the min of squares found
21                    dpArr[i][j] = Math.min(topVal, Math.min(leftVal, topLeftVal)) + 1;
22                } else {
23                    dpArr[i][j] = 0; // else store the dp as 0 of the index
24                }
25            }
26        }
27
28        int total = 0;
29
30        for(int i=0; i<rows; i++) {
31            for(int j=0; j<cols; j++) {
32                total += dpArr[i][j]; // count all the valid squares found
33            }
34        }
35
36        return total;
37    }
38}