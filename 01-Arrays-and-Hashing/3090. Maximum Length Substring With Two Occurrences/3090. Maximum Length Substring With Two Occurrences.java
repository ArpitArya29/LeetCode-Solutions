1class Solution {
2    public int maximumLengthSubstring(String s) {
3        Map<Character, Integer> hmp = new HashMap<>();
4
5        int maxLen = Integer.MIN_VALUE;
6
7        int len = s.length();
8        int lp = 0;
9        hmp.put(s.charAt(0), 1);
10
11        for(int rp=1; rp<len; rp++) {
12            while(hmp.getOrDefault(s.charAt(rp), 0) >= 2) {
13
14                char ch = s.charAt(lp);
15
16                hmp.put(ch, hmp.get(ch) - 1);
17
18                if(hmp.get(ch) == 0) hmp.remove(ch);
19
20                lp++;
21            }
22
23            hmp.put(s.charAt(rp), hmp.getOrDefault(s.charAt(rp), 0) + 1);
24
25            maxLen = Math.max(maxLen, rp-lp+1);
26        }
27
28        return Math.max(maxLen, 1);
29    }
30}