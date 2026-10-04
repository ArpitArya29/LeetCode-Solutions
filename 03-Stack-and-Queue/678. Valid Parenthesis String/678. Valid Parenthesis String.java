1class Solution {
2    private boolean check(String str, int idx, int cnt) {
3        if(idx == str.length()) return cnt==0;
4
5        char ch = str.charAt(idx);
6
7        if(ch == '(') return check(str, idx+1, cnt+1);
8        else if(ch == ')') {
9            if(cnt == 0) return false;
10
11            return check(str, idx+1, cnt-1);
12        }
13        else {
14            // # use * as either ( or ) or nothing[neither ( or )]
15            // if (cnt == 0) {
16            //     return check(str, idx + 1, cnt + 1)   // '*'
17            //         || check(str, idx + 1, cnt);      // empty
18            // }
19
20            return check(str, idx+1, cnt+1) || (cnt > 0 && check(str, idx+1, cnt-1)) || check(str, idx+1, cnt);
21        }
22    }
23    public boolean checkValidString(String s) {
24
25        return check(s, 0, 0);
26
27        // some test-cases doesn't pass, not the accurate approach
28        // int stars = 0;
29        // int openCnt = 0;
30
31        // for(char ch : s.toCharArray()) {
32        //     if(ch == '(') openCnt++;
33        //     else if(ch == ')') {
34        //         if(openCnt == 0 && stars == 0) return false;
35
36        //         if(openCnt > 0) openCnt--;
37        //         else stars--;
38        //     } else stars++;
39        // }
40
41        // return openCnt == 0 || stars == openCnt;
42
43        // Stack<Character> st = new Stack<>();
44
45        // for(char ch : s.toCharArray()) {
46        //     switch(ch) {
47        //         case '(':
48        //             st.push(ch);
49        //             break;
50        //         case ')':
51        //             if(!st.isEmpty() && st.peek()=='(') {
52        //                 st.pop();
53        //             } else {
54        //                 oddCnt++;
55        //             }
56
57        //             break;
58        //         case '*':
59        //             stars++;
60        //             break;
61        //     }
62        // }
63
64        // return st.isEmpty() || (stars > 0 && stars == oddCnt);
65
66    }
67}