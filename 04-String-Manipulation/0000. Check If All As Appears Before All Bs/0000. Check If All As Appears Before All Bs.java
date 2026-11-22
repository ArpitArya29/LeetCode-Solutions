1class Solution {
2    public boolean checkString(String s) {
3        boolean isBFound = false;
4
5        for(char ch : s.toCharArray()) {
6            if(ch == 'a') {
7                if(isBFound) return false;
8            } else {
9                isBFound = true;
10            }
11        }
12
13        return true;
14    }
15}