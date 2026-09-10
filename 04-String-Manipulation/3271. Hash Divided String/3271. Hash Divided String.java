1class Solution {
2    public String stringHash(String s, int k) {
3        //Adding comment to check github workflow
4         
5        StringBuilder sb = new StringBuilder();
6
7        int len = s.length();
8
9        for(int i=0; i<len; i+=k) {
10            int hashVal = 0;
11            
12            for(int j=i; j<i+k; j++) {
13                hashVal += s.charAt(j) - 'a';
14            }
15
16            hashVal %= 26;
17
18            sb.append((char)(hashVal + 'a'));
19        }
20
21        return sb.toString();
22    }
23}