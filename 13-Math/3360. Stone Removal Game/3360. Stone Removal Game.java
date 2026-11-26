1class Solution {
2    public boolean canAliceWin(int n) {
3        boolean aliceTurn = true;
4        int req = 10;
5
6        while(n >= req) {
7            if(req > n) return aliceTurn ? false : true;
8
9            n -= req;
10            req--;
11            aliceTurn = !aliceTurn;
12        }
13
14        return aliceTurn ? false : true;
15    }
16}