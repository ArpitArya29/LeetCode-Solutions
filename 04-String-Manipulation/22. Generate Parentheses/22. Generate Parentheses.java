1class Solution {
2    List<String> ans = new ArrayList<>();
3    private void generate(String str, int open, int close, int n) {
4        if(str.length() == 2*n) {
5            ans.add(str);
6            return;
7        }
8
9        if(open < n) generate(str+'(', open+1, close, n);
10
11        if(close < open) generate(str+')', open, close+1, n);
12    }
13    public List<String> generateParenthesis(int n) {
14        generate(, 0, 0, n);
15
16        return ans;
17    }
18}