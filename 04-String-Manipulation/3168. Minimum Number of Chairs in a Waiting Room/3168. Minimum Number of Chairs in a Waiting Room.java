1class Solution {
2    public int minimumChairs(String s) {
3        int cnt = 0;
4
5        int len = s.length();
6
7        int reqChair = 0;
8
9        for(int i=0; i<len; i++) {
10            if(s.charAt(i) == 'E') cnt++;
11            else cnt--;
12
13            reqChair = Math.max(reqChair, cnt);
14        }
15
16        return reqChair;
17    }
18}