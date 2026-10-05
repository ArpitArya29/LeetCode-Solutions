1class Solution {
2    public int scoreOfParentheses(String s) {
3        Stack<Integer> st = new Stack<>();
4
5        int score = 0;
6
7        int len = s.length();
8
9        for(int i=0; i<len; i++) {
10            char ch = s.charAt(i);
11
12            if(ch == '(') { // opening paranthesis
13                // push the score into the stack, and resets the score
14                st.push(score);
15                score = 0;
16            } else { // closing parenthesis
17                if(s.charAt(i-1) == '(') score = st.pop() + 1; // simple case, add 1 to prev score
18                else {
19                    // nested condition
20                    // multiply the current score with 2 and add the previously obtained score
21                    score = st.pop() + score * 2;
22                }
23            }
24        }
25
26        return score;
27    }
28}