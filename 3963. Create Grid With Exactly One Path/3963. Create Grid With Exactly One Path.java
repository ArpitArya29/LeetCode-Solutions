1class Solution {
2    public String[] createGrid(int m, int n) {
3        String[] ans = new String[m];
4
5        // Approach:-
6        // We would follow the approach of possible path of
7        // move right as far as we can, then from the right boundary, move down to reach final pt
8        for(int i=0; i<m; i++) {
9            StringBuilder sb = new StringBuilder();
10            for(int j=0; j<n; j++) {
11                if(i==0 || j==(n-1)) {
12                    // check if it is first row or last column : valid path(as we assume)
13                    // give only this path
14                    sb.append(.);
15                }
16                else sb.append(#); // block any other path
17            }
18
19            ans[i] = sb.toString();
20        }
21
22        return ans;
23    }
24}