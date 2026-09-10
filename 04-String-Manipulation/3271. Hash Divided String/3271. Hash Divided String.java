1class Solution {
2    public String stringHash(String s, int k) {
3        
4        StringBuilder sb = new StringBuilder();
5
6        int len = s.length();
7
8        for(int i=0; i<len; i+=k) {
9            int hashVal = 0;
10            
11            for(int j=i; j<i+k; j++) {
12                hashVal += s.charAt(j) - 'a';
13            }
14
15            hashVal %= 26;
16
17            sb.append((char)(hashVal + 'a'));
18        }
19
20        return sb.toString();
21    }
22}