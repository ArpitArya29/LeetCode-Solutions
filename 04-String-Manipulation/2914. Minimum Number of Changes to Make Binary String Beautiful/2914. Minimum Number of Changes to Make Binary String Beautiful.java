1class Solution {
2    public int minChanges(String s) {
3        int len = s.length();
4
5        int possChanges = 0;
6
7        for(int i=0; i<len; i+=2) {
8            if(s.charAt(i) != s.charAt(i+1)) possChanges++;
9        }
10
11        return possChanges;
12    }
13}