1class Solution {
2    public String reverseParentheses(String s) {
3        Stack<Integer> st = new Stack<>();
4
5        StringBuilder sb = new StringBuilder();
6
7        for(char ch : s.toCharArray()) {
8            if(ch == '(') st.push(sb.length());
9            else if(ch == ')') {
10                int leftOp = st.pop();
11                String prev = sb.toString();
12                sb.setLength(0);
13                sb.append(prev.substring(0, leftOp));
14                sb.append(new StringBuilder(prev.substring(leftOp, prev.length())).reverse().toString());
15            } else sb.append(ch);
16        }
17
18        return sb.toString();
19    }
20}