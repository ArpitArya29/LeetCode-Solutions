1class Solution {
2    public int[] findEvenNumbers(int[] digits) {
3        List<Integer> li = new ArrayList<>();
4        Set<Integer> hs = new HashSet<>();
5
6        int len = digits.length;
7
8        for(int i=0; i<len; i++) {
9            for(int j=0; j<len; j++) {
10                for(int k=0; k<len; k++) {
11                    if(digits[i]==0 || digits[k]%2!=0 || i==j || j==k || k==i) continue;
12
13                    int num = digits[i]*100 + digits[j]*10 + digits[k];
14                    if(!hs.contains(num)) {
15                        li.add(num);
16                        hs.add(num);
17                    }
18                }
19            }
20        }
21
22        Collections.sort(li);
23
24        int s = li.size();
25
26        int[] ans = new int[s];
27
28        for(int i=0; i<s; i++) {
29            ans[i] = li.get(i);
30        }
31
32        return ans;
33    }
34}