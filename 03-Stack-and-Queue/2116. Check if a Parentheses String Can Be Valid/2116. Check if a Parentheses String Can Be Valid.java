1class Solution {
2    public boolean canBeValid(String s, String locked) {
3        Stack<Integer> open = new Stack<>(); // for storing opening paranthesis
4        Stack<Integer> wild = new Stack<>(); // for stroring wildcard parenthesis(unlocked)
5
6        int len = s.length();
7
8        if(len % 2 != 0) return false;
9
10        for(int i=0; i<len; i++) {
11            char ch = s.charAt(i);
12
13            if(locked.charAt(i) == '0') wild.push(i);
14            else if(ch == '(') open.push(i);
15            else {
16                // closing parenthesis
17                if(!open.isEmpty()) open.pop();
18                else if(!wild.isEmpty()) wild.pop(); // use unlocked parenthisis as '('
19                else return false;
20            }
21        }
22
23        while(!open.isEmpty() && !wild.isEmpty()) {
24            if(open.peek() < wild.peek()) {
25                // open parenthesis must me present before closing parenthesis
26                open.pop();
27                wild.pop();
28            } else return false;
29        }
30
31        return open.isEmpty();
32    }
33}