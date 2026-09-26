1class Solution {
2    public String evaluate(String s, List<List<String>> knowledge) {
3        Map<String,String> hmp = new HashMap<>();
4
5        for(List<String> li : knowledge) {
6            hmp.put(li.get(0), li.get(1));
7        }
8
9        StringBuilder sb = new StringBuilder();
10
11        int len = s.length();
12
13        for(int i=0; i<len; i++) {
14            if(s.charAt(i) == '('){
15                int lPt = i;
16                while(s.charAt(lPt) != ')') lPt++;
17
18                String key = s.substring(i+1, lPt);
19
20                if(hmp.containsKey(key)) sb.append(hmp.get(key));
21                else sb.append(?);
22                i = lPt;
23            } else sb.append(s.charAt(i));
24        }
25
26        return sb.toString();
27    }
28}