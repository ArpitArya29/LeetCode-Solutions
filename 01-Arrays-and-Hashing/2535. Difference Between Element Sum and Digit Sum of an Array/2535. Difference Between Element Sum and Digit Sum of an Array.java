1class Solution {
2    private int digitSum(int n) {
3        int s = 0;
4        while(n > 0) {
5            s += n % 10;
6            n /= 10;
7        }
8
9        return s;
10    }
11    public int differenceOfSum(int[] nums) {
12        int elSum = 0;
13        int digSum = 0;
14
15        for(int n : nums) {
16            elSum += n;
17            digSum += digitSum(n);
18        }
19
20        return Math.abs(elSum - digSum);
21    }
22}