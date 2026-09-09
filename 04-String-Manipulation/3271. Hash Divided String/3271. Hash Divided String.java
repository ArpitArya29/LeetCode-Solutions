1class Solution {
2    public String stringHash(String s, int k) {
3        StringBuilder sb = new StringBuilder();
4
5        int len = s.length();
6
7        for(int i=0; i<len; i+=k) {
8            int hashVal = 0;
9            
10            for(int j=i; j<i+k; j++) {
11                hashVal += s.charAt(j) - 'a';
12            }
13
14            hashVal %= 26;
15
16            sb.append((char)(hashVal + 'a'));
17        }
18
19        return sb.toString();
20    }
21}