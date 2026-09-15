1class NumInfo implements Comparable<NumInfo> {
2    int value, index;
3
4    public NumInfo(int v, int i) {
5        this.value = v;
6        this.index = i;
7    }
8
9    public int compareTo(NumInfo other) {
10
11        if (this.value != other.value) {
12            return Integer.compare(this.value, other.value);
13        }
14
15        return Integer.compare(this.index, other.index);
16    }
17}
18class Solution {
19    public int[] getFinalState(int[] nums, int k, int multiplier) {
20        int len = nums.length;
21
22        PriorityQueue<NumInfo> pq = new PriorityQueue<>();
23
24        for(int i=0; i<len; i++) {
25            pq.add(new NumInfo(nums[i], i));
26        }
27
28        int ans[] = new int[len];
29        
30        while(k > 0) {
31            NumInfo min = pq.poll();
32
33            ans[min.index] = min.value * multiplier;
34            pq.add(new NumInfo(min.value * multiplier, min.index));
35
36            k--;
37        }
38
39        for(int i=0; i<len; i++) {
40            if(ans[i] == 0) {
41                ans[i] = nums[i];
42            }
43        }
44
45        return ans;
46    }
47}