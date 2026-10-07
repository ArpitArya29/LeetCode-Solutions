1class Pair {
2    int value, idx;
3    Pair(int v, int i) {
4        this.value = v;
5        this.idx = i;
6    }
7}
8class Solution {
9    public int firstStableIndex(int[] nums, int k) {
10        Stack<Pair> st = new Stack<>();
11
12        int len = nums.length;
13
14        st.push(new Pair(nums[len-1], len-1));
15
16        for(int i=len-2; i>=0; i--) {
17            Pair t = st.peek();
18
19            if(nums[i] < t.value) st.push(new Pair(nums[i], i));
20        }
21
22        int prevLargest = Integer.MIN_VALUE;
23
24        for(int i=0; i<len; i++) {
25            prevLargest = Math.max(prevLargest, nums[i]);
26
27            Pair minPtr = st.peek();
28
29            if(prevLargest - minPtr.value <= k) return i;
30
31            if(minPtr.idx == i) st.pop();
32        }
33
34        return -1;
35    }
36}