1class Solution {
2    public String maxSumOfSquares(int num, int sum) {
3
4        if(sum > num * 9) {
5            return ;
6        }
7
8        int nineCnt = sum / 9;
9        int rem = sum % 9;
10
11        StringBuilder sb = new StringBuilder();
12
13        for(int i=0; i<nineCnt; i++) {
14            sb.append(9);
15        }
16
17        if(rem > 0) {
18            sb.append(Integer.toString(rem));
19        }
20
21        while(sb.length() < num) sb.append(0);
22
23        return sb.toString();
24    }
25}