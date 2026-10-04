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
15
16            return check(str, idx+1, cnt+1) || (cnt > 0 && check(str, idx+1, cnt-1)) || check(str, idx+1, cnt);
17        }
18    }
19    public boolean checkValidString(String s) {
20
21        // return check(s, 0, 0); // TLE for recursion
22
23        // A O(N) solution, the approach is maintaining the possible range from min to max
24        // if (, increment both min and max
25        // if ), decrement both min and max
26        // if *, use it as either (, ) or   -> decrement min, and increment max
27            // min = 2 -> range is (2-1, 2, 2+1)
28            // max = 3 -> range is (3-1, 3, 3+1)
29            // the overall range could be (min-1, max+1)
30
31        int min = 0;
32        int max = 0;
33
34        for(char ch : s.toCharArray()) {
35            if(ch == '(') {
36                min++;
37                max++;
38            } else if (ch == ')') {
39                min--;
40                max--;
41            } else {
42                min--;
43                max++;
44            }
45
46            // if min is -ve, discard that
47            if(min < 0) min = 0;
48
49            // at any point, the max range is -ve, it could never be a valid paranthesis
50            if(max < 0) return false;
51        }
52
53        // the paranthesis is only valid if minimum value in the range is 0 (balanced)
54        return min == 0;
55
56        // some test-cases doesn't pass, not the accurate approach
57        // int stars = 0;
58        // int openCnt = 0;
59
60        // for(char ch : s.toCharArray()) {
61        //     if(ch == '(') openCnt++;
62        //     else if(ch == ')') {
63        //         if(openCnt == 0 && stars == 0) return false;
64
65        //         if(openCnt > 0) openCnt--;
66        //         else stars--;
67        //     } else stars++;
68        // }
69
70        // return openCnt == 0 || stars == openCnt;
71
72        // Stack<Character> st = new Stack<>();
73
74        // for(char ch : s.toCharArray()) {
75        //     switch(ch) {
76        //         case '(':
77        //             st.push(ch);
78        //             break;
79        //         case ')':
80        //             if(!st.isEmpty() && st.peek()=='(') {
81        //                 st.pop();
82        //             } else {
83        //                 oddCnt++;
84        //             }
85
86        //             break;
87        //         case '*':
88        //             stars++;
89        //             break;
90        //     }
91        // }
92
93        // return st.isEmpty() || (stars > 0 && stars == oddCnt);
94
95    }
96}