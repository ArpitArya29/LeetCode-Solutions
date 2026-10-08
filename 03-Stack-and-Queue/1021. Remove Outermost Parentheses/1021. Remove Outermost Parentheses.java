1class Solution {
2    public String removeOuterParentheses(String s) {
3
4        int open = 0;
5
6        StringBuilder sb = new StringBuilder();
7        for(char ch : s.toCharArray()) {
8            if(ch == ')') open--;
9
10            if(open != 0) sb.append(ch);
11
12            if(ch == '(') open++;
13        }
14
15        return sb.toString();
16    }
17}