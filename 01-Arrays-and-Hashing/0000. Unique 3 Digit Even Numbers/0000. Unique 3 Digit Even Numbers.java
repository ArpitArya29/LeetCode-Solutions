1class Solution {
2    public int totalNumbers(int[] digits) {
3        int len = digits.length;
4
5        Set<Integer> hs = new HashSet<>();
6
7        for(int i=0; i<len; i++) {
8            for(int j=0; j<len; j++) {
9                for(int k=0; k<len; k++) {
10                    if(digits[i]==0 || digits[k]%2!=0 || i==j || j==k || k==i) continue;
11
12                    hs.add(digits[i]*100 + digits[j]*10 + digits[k]);
13                }
14            }
15        }
16
17        return hs.size();
18    }
19}