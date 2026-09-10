1class Solution {
2    public int countKeyChanges(String s) {
3        // Adding some comments to verify github workflow
4        int len = s.length();
5
6        String lcStr = s.toLowerCase();
7
8        char prev = lcStr.charAt(0);
9
10        int cnt = 0;
11
12        for(int i=1; i<len; i++) {
13            char curr = lcStr.charAt(i);
14
15            if(prev != curr) cnt++;
16
17            prev = curr;
18        }
19
20        return cnt;
21    }
22}