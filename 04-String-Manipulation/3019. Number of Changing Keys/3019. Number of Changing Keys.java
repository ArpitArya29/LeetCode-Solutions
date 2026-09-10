1class Solution {
2    public int countKeyChanges(String s) {
3        int len = s.length();
4
5        String lcStr = s.toLowerCase();
6
7        char prev = lcStr.charAt(0);
8
9        int cnt = 0;
10
11        for(int i=1; i<len; i++) {
12            char curr = lcStr.charAt(i);
13
14            if(prev != curr) cnt++;
15
16            prev = curr;
17        }
18
19        return cnt;
20    }
21}