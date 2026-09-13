1class Solution {
2    public boolean isPossibleToSplit(int[] nums) {
3        Map<Integer, Integer> hmp = new HashMap<>();
4
5        for(int n : nums) {
6            hmp.put(n, hmp.getOrDefault(n, 0) + 1);
7        }
8
9        for(Map.Entry<Integer, Integer> ent : hmp.entrySet()) {
10            if(ent.getValue() > 2) return false;
11        }
12
13        return true;
14    }
15}