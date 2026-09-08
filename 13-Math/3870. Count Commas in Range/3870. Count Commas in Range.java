1class Solution {
2    public int countCommas(int n) {
3        if(n < 1000) return 0;
4
5        return (n - 1000) + 1;
6    }
7}