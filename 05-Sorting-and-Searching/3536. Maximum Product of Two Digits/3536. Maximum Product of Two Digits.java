1class Solution {
2    public int maxProduct(int n) {
3        int lar = Integer.MIN_VALUE;
4        int sLar = Integer.MIN_VALUE;
5
6        while(n > 0) {
7            int dig = n % 10;
8
9            if(dig >= lar) {
10                sLar = lar;
11                lar = dig;
12            } else if(dig >= sLar) sLar = dig;
13
14            n /= 10;
15        }
16
17        return lar * sLar;
18    }
19}