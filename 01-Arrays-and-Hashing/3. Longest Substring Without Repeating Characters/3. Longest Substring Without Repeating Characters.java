1class Solution {
2    public int lengthOfLongestSubstring(String s) {
3        Set<Character> hs = new HashSet<>();
4
5        int len = s.length();
6        int maxLen = 0;
7
8        int lp = 0;
9
10        for(int rp=0; rp<len; rp++) {
11            char ch = s.charAt(rp);
12
13            while(lp < rp && hs.contains(ch)) {
14                hs.remove(s.charAt(lp++));
15            }
16
17            hs.add(ch);
18
19            maxLen = Math.max(maxLen, rp-lp+1);
20        }
21
22        return maxLen;
23    }
24}