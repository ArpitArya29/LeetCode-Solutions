1class Solution {
2    public long countCommas(long n) {
3        if(n < 1000) return 0;
4
5        long lower = 1000;
6        long res = 0;
7        int commas = 1;
8
9        while(lower <= n) {
10            long upper = Math.min(lower * 1000 - 1, n);
11            res += commas * (upper - lower + 1);
12            lower = lower * 1000;
13            // upper = lower * 1000 - 1;
14
15            commas++;
16        }
17
18        // res += (Math.min(upper, n) - lower + 1);
19
20        return res;
21    }
22}