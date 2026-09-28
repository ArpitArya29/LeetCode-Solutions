1class Solution {
2    public int maxDepth(String s) {
3        // Stack<Character> st = new Stack<>();
4
5        int openCnt = 0; // just used a variable rather than maintaining a stack
6
7        int len = s.length();
8        int maxDepth = 0;
9
10        for(int i=0; i<len; i++) {
11            char ch = s.charAt(i);
12
13            if(ch == '(') openCnt++;
14            else if(ch == ')') {
15                maxDepth = Math.max(maxDepth, openCnt);
16
17                openCnt--;
18
19                // st.pop();
20            }
21        }
22
23        return maxDepth;
24    }
25}