1class Solution {
2    public int maxScore(int[] cardPoints, int k) {
3        int len = cardPoints.length;
4
5        int leftSum = 0, rightSum = 0;
6        int maxSum = Integer.MIN_VALUE;
7
8        // first collect all the points from the left end
9        for(int i=0; i<k; i++) {
10            leftSum += cardPoints[i];
11        }
12
13        maxSum = Math.max(maxSum, leftSum); // store for maxSum
14
15        for(int i=1; i<=k; i++) {
16            leftSum -= cardPoints[k-i]; // shrink the leftSum window by 1, from its rightmost
17            rightSum += cardPoints[len-i]; // expand the right window by 1
18
19            maxSum = Math.max(maxSum, leftSum + rightSum);
20        }
21
22        return maxSum;
23    }
24}