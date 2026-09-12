1class Solution {
2    private int cntVow(String str) {
3        int cnt = 0;
4
5        for(char ch : str.toCharArray()) {
6            if(ch=='a' || ch=='e' || ch=='i' || ch=='o' || ch=='u') cnt++;
7        }
8
9        return cnt;
10    }
11    public String reverseWords(String s) {
12        String strArr[] = s.split( );
13        StringBuilder sb = new StringBuilder();
14
15        int fCnt = cntVow(strArr[0]);
16        sb.append(strArr[0]).append( );
17
18        int len = strArr.length;
19
20        for(int i=1; i<len; i++) {
21            if(cntVow(strArr[i]) == fCnt) {
22                sb.append(new StringBuilder(strArr[i]).reverse().toString());
23            } else {
24                sb.append(strArr[i]);
25            }
26
27            sb.append( );
28        }
29
30        return sb.toString().substring(0, sb.length()-1);
31    }
32}