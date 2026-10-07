1class Pair {
2    int value, idx;
3    Pair(int v, int i) {
4        this.value = v;
5        this.idx = i;
6    }
7}
8class Solution {
9    public int firstStableIndex(int[] nums, int k) {
10        // Using Array (the same concept of using the stack)
11        int len = nums.length;
12
13        int[] maxArr = new int[len];
14        int[] minArr = new int[len];
15
16        maxArr[0] = nums[0];
17        minArr[len-1] = nums[len-1];
18
19        for(int i=1; i<len; i++) {
20            maxArr[i] = Math.max(maxArr[i-1], nums[i]);
21            minArr[len-1-i] = Math.min(minArr[len-i], nums[len-1-i]);
22        }
23
24        for(int i=0; i<len; i++) {
25            if(maxArr[i] - minArr[i] <= k) return i;
26        }
27
28        return -1;
29
30        // Using Stack (min-stack)
31        // Stack<Pair> st = new Stack<>();
32
33        // int len = nums.length;
34
35        // st.push(new Pair(nums[len-1], len-1));
36
37        // for(int i=len-2; i>=0; i--) {
38        //     Pair t = st.peek();
39
40        //     if(nums[i] < t.value) st.push(new Pair(nums[i], i));
41        // }
42
43        // int prevLargest = Integer.MIN_VALUE;
44
45        // for(int i=0; i<len; i++) {
46        //     prevLargest = Math.max(prevLargest, nums[i]);
47
48        //     Pair minPtr = st.peek();
49
50        //     if(prevLargest - minPtr.value <= k) return i;
51
52        //     if(minPtr.idx == i) st.pop();
53        // }
54
55        // return -1;
56    }
57}