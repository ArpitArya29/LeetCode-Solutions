1class Solution {
2    public int maxProfit(int[] prices) {
3        int minPrice = prices[0];
4        int maxProfit = Integer.MIN_VALUE;
5
6        for(int pr : prices) {
7            int currProfit = pr - minPrice;
8            maxProfit = Math.max(maxProfit, currProfit);
9
10            minPrice = Math.min(minPrice, pr);
11        }
12
13        return maxProfit;
14    }
15}