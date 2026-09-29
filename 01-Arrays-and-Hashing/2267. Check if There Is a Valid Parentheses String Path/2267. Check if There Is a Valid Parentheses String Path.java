1class Solution {
2    public int[][][] memArr;
3    private boolean check(int i, int j, int openCnt, char[][] g, int rows, int cols) {
4
5        if(i>=rows || j>=cols) {
6            return false;
7        }
8
9        if(g[i][j] == '(') openCnt++;
10        else openCnt--;
11
12        if(openCnt < 0) return false;
13
14        if(memArr[i][j][openCnt] != -1) return memArr[i][j][openCnt] == 1;
15
16        if(i==rows-1 && j>=cols-1) {
17            boolean r = openCnt == 0;
18            memArr[i][j][openCnt] = r ? 1 : 0;
19
20            return r;
21        }
22
23        boolean res = check(i, j+1, openCnt, g, rows, cols) || check(i+1, j, openCnt, g, rows, cols);
24
25        memArr[i][j][openCnt] = res ? 1 : 0;
26
27        return res;
28
29    }
30    public boolean hasValidPath(char[][] grid) {
31        int rows = grid.length;
32        int cols = grid[0].length;
33        memArr = new int[rows][cols][rows + cols];
34
35        for(int[][] block : memArr) {
36            for(int[] row : block) {
37                Arrays.fill(row, -1);
38            }
39        }
40
41        return check(0, 0, 0, grid, rows, cols);
42    }
43}