1class Solution {
2    private int numSize(int num) {
3        int digit = 0;
4
5        while(num > 0) {
6            digit++;
7            num /= 10;
8        }
9
10        return digit;
11    }
12
13    public int longestCommonPrefix(int[] arr1, int[] arr2) {
14        Set<Integer> hs = new HashSet<>();
15
16        // Simplified using number
17        for(int num : arr1) {
18            while(num > 0) {
19                hs.add(num);
20                num /= 10;
21            }
22        }
23
24        int longPrefix = 0;
25
26        for(int num : arr2) {
27            int len = numSize(num);
28
29            while(num > 0) {
30                if(hs.contains(num)) longPrefix = Math.max(longPrefix, len);
31
32                len--;
33                num /= 10;
34            }
35        }
36
37        return longPrefix;
38
39        // Using String concept
40        // Set<String> hs = new HashSet<>();
41        // for(int n : arr1) {
42        //     String str = Integer.toString(n);
43
44        //     int s = str.length();
45        //     for(int i=0; i<=s; i++) {
46        //         hs.add(str.substring(0, i));
47        //     }
48        // }
49
50        // int longPrefix = 0;
51
52        // for(int n : arr2) {
53        //     String str = Integer.toString(n);
54
55        //     int s = str.length();
56
57        //     for(int i=0; i<=s; i++) {
58        //         String subStr = str.substring(0, i);
59
60        //         if(hs.contains(subStr)) {
61        //             longPrefix = Math.max(longPrefix, subStr.length());
62        //         }
63        //     }
64        // }
65
66        // return longPrefix;
67    }
68}