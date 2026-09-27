1class Solution {
2    public String reverseParentheses(String s) {
3
4        // Another Approach
5        // # Map each opening and closing bracket pairs
6        // # Use the direction concept, LTR and RTL (LTR -> i=i+1, RTL -> i=i-1)
7        // # If finds any pair of brackets, move the i to its pair, and change the direction
8        Stack<Integer> opIdx = new Stack<>();
9        Map<Integer, Integer> pair = new HashMap<>();
10
11        int len = s.length();
12        char[] chArr = s.toCharArray();
13
14        for(int i=0; i<len; i++) {
15            if(chArr[i] == '(') opIdx.push(i);
16            else if(chArr[i] == ')') {
17                int p = opIdx.pop();
18                pair.put(p, i);
19                pair.put(i, p);
20            }
21        }
22
23        boolean LTRDir = true;
24        StringBuilder sb = new StringBuilder();
25        int i=0;
26        while(i<len) {
27            if(chArr[i] == '(' || chArr[i] == ')') {
28                i = pair.get(i);
29                LTRDir = !LTRDir;
30            } else sb.append(chArr[i]);
31
32            i = LTRDir ? i+1 : i-1;
33        }
34
35        return sb.toString();
36
37
38        // Stack<Integer> st = new Stack<>();
39
40        // StringBuilder sb = new StringBuilder();
41
42        // for(char ch : s.toCharArray()) {
43        //     if(ch == '(') st.push(sb.length());
44        //     else if(ch == ')') {
45        //         int leftOp = st.pop();
46        //         String prev = sb.toString();
47        //         sb.setLength(0);
48        //         sb.append(prev.substring(0, leftOp));
49        //         sb.append(new StringBuilder(prev.substring(leftOp, prev.length())).reverse().toString());
50        //     } else sb.append(ch);
51        // }
52
53        // return sb.toString();
54    }
55}