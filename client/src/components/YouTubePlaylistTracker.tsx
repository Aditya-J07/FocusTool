import { useState } from "react";
import { CheckCircle, Circle, Search } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Input } from "@/components/ui/input";
import { awardXP } from "@/lib/gamification";

const learningVideos = [
  "1. Introduction to DSA", "2. Arrays Basics", "3. Arrays Problems", "4. Strings Basics", "5. Strings Problems",
  "6. Linked List Basics", "7. Linked List Problems", "8. Stack Basics", "9. Stack Problems", "10. Queue Basics",
  "11. Queue Problems", "12. Recursion Basics", "13. Recursion Problems", "14. Binary Search Basics", "15. Binary Search Problems",
  "16. Hashing Basics", "17. Hashing Problems", "18. Two Pointers Technique", "19. Sliding Window Technique", "20. Greedy Algorithms Basics",
  "21. Greedy Problems", "22. Dynamic Programming Introduction", "23. DP Problems 1", "24. DP Problems 2", "25. Graph Basics",
  "26. Graph Problems 1", "27. Graph Problems 2", "28. BFS and DFS Basics", "29. BFS and DFS Problems", "30. Backtracking Basics",
  "31. Backtracking Problems", "32. Heap Basics", "33. Heap Problems", "34. Trie Basics", "35. Trie Problems",
  "36. Segment Tree Basics", "37. Segment Tree Problems", "38. Binary Indexed Tree Basics", "39. Binary Indexed Tree Problems", "40. Advanced Data Structures",
  "41. Bit Manipulation Basics", "42. Bit Manipulation Problems", "43. Math and Number Theory", "44. Math Problems", "45. Sorting Algorithms",
  "46. Sorting Problems", "47. Searching Algorithms", "48. Searching Problems", "49. Matrix Basics", "50. Matrix Problems",
  "51. Recursion Advanced", "52. Linked List Advanced", "53. Graph Advanced", "54. Dynamic Programming Advanced", "55. Advanced DP Problems",
  "56. String Matching Algorithms", "57. String Matching Problems", "58. Greedy Advanced", "59. Heaps Advanced", "60. Hashing Advanced",
  "61. Trie Advanced", "62. Segment Tree Advanced", "63. Binary Indexed Tree Advanced", "64. Divide and Conquer Basics", "65. Divide and Conquer Problems",
  "66. Sliding Window Advanced", "67. Two Pointers Advanced", "68. Queue Advanced", "69. Stack Advanced", "70. Recursion Optimization",
  "71. Dynamic Programming Optimization", "72. Graph Optimization", "73. Matrix Optimization", "74. Backtracking Optimization", "75. Advanced Bit Manipulation",
  "76. Number Theory Advanced", "77. Modular Arithmetic", "78. Combinatorics Basics", "79. Combinatorics Problems", "80. Probability Basics",
  "81. Probability Problems", "82. Geometry Basics", "83. Geometry Problems", "84. Advanced Graph Techniques", "85. Dijkstra and Shortest Paths",
  "86. Bellman-Ford Algorithm", "87. Floyd-Warshall Algorithm", "88. Minimum Spanning Tree", "89. Kruskal's Algorithm", "90. Prim's Algorithm",
  "91. Topological Sorting", "92. Strongly Connected Components", "93. Tarjan's Algorithm", "94. Bridges and Articulation Points", "95. Eulerian Graphs",
  "96. Hamiltonian Graphs", "97. Graph Coloring", "98. Bipartite Graphs", "99. Flow Networks", "100. Max Flow Min Cut",
  "101. Segment Tree Advanced Queries", "102. Lazy Propagation in Segment Trees", "103. Binary Indexed Tree Advanced Queries", "104. Mo's Algorithm Basics", "105. Mo's Algorithm Problems",
  "106. Disjoint Set Union Basics", "107. Disjoint Set Union Problems", "108. LCA Basics", "109. LCA Problems", "110. Sparse Table Basics",
  "111. Sparse Table Problems", "112. Advanced Sorting Problems", "113. Advanced Searching Problems", "114. Sliding Window Optimization", "115. Two Pointers Optimization",
  "116. Heap Optimization", "117. Stack Optimization", "118. Queue Optimization", "119. Matrix Advanced Problems", "120. String Advanced Problems",
  "121. Dynamic Programming on Trees", "122. DP on Graphs", "123. DP on Subsequences", "124. DP on Intervals", "125. Bitmask DP",
  "126. Advanced Backtracking", "127. Graph Traversal Optimization", "128. Advanced Greedy Techniques", "129. Convex Hull", "130. Line Sweep Algorithm",
  "131. Geometry Advanced Problems", "132. String Hashing", "133. KMP Algorithm", "134. Rabin-Karp Algorithm", "135. Z Algorithm",
  "136. Suffix Array Basics", "137. Suffix Array Problems", "138. Trie Optimization", "139. Fenwick Tree Optimization", "140. Segment Tree Lazy Propagation Advanced",
  "141. Heavy Light Decomposition", "142. Advanced DSU", "143. Tree Flattening Technique", "144. Persistent Segment Tree", "145. Persistent Data Structures",
  "146. Advanced Bit Manipulation Techniques", "147. Fast Fourier Transform Basics", "148. FFT Problems", "149. String Pattern Matching Advanced", "150. Rolling Hash",
  "151. Hash Map Optimization", "152. Randomized Algorithms", "153. Monte Carlo Method", "154. Las Vegas Method", "155. Online Algorithms",
  "156. Offline Algorithms", "157. Complexity Analysis", "158. Amortized Analysis", "159. Competitive Programming Tricks", "160. Problem Solving Techniques",
  "161. Codeforces Problems 1", "162. Codeforces Problems 2", "163. Codeforces Problems 3", "164. Leetcode Easy Problems", "165. Leetcode Medium Problems",
  "166. Leetcode Hard Problems", "167. AtCoder Problems", "168. HackerRank Problems", "169. HackerEarth Problems", "170. GeeksforGeeks Problems",
  "171. TopCoder Problems", "172. SPOJ Problems", "173. USACO Problems", "174. ICPC Practice Problems", "175. KickStart Problems",
  "176. CodeChef Problems", "177. Advanced Problem Solving", "178. Competitive Programming Strategies", "179. Debugging Techniques", "180. Optimization Techniques",
  "181. Time Complexity Analysis", "182. Space Complexity Analysis", "183. Recursion Tricks", "184. Memoization Techniques", "185. Tabulation Techniques",
  "186. Graph Tricks", "187. Tree Tricks", "188. Geometry Tricks", "189. Math Tricks", "190. Number Theory Tricks",
  "191. Combinatorics Tricks", "192. Probability Tricks", "193. Greedy Tricks", "194. Backtracking Tricks", "195. Dynamic Programming Tricks",
  "196. Sliding Window Tricks", "197. Two Pointers Tricks", "198. Bitmask Tricks", "199. Binary Search Tricks", "200. Advanced Sorting Tricks",
  "201. Divide and Conquer Tricks", "202. Advanced Graph Tricks", "203. Heap Tricks", "204. Stack Tricks", "205. Queue Tricks",
  "206. Matrix Tricks", "207. String Tricks", "208. Trie Tricks", "209. Segment Tree Tricks", "210. Fenwick Tree Tricks",
  "211. LCA Tricks", "212. Sparse Table Tricks", "213. DSU Tricks", "214. FFT Tricks", "215. Randomized Tricks",
  "216. Online/Offline Techniques", "217. Coding Practice 1", "218. Coding Practice 2", "219. Coding Practice 3", "220. Mock Contest 1",
  "221. Mock Contest 2", "222. Mock Contest 3", "223. CP Contest Analysis 1", "224. CP Contest Analysis 2", "225. CP Contest Analysis 3",
  "226. Problem Solving Patterns 1", "227. Problem Solving Patterns 2", "228. Problem Solving Patterns 3", "229. Optimization Patterns 1", "230. Optimization Patterns 2",
  "231. Optimization Patterns 3", "232. Advanced DSA Concepts 1", "233. Advanced DSA Concepts 2", "234. Advanced DSA Concepts 3", "235. Algorithm Design Techniques 1",
  "236. Algorithm Design Techniques 2", "237. Algorithm Design Techniques 3", "238. Recap 1", "239. Recap 2", "240. Recap 3",
  "241. Problem Solving Session 1", "242. Problem Solving Session 2", "243. Problem Solving Session 3", "244. Graph Deep Dive 1", "245. Graph Deep Dive 2",
  "246. Graph Deep Dive 3", "247. DP Deep Dive 1", "248. DP Deep Dive 2", "249. DP Deep Dive 3", "250. String Deep Dive 1",
  "251. String Deep Dive 2", "252. String Deep Dive 3", "253. Matrix Deep Dive 1", "254. Matrix Deep Dive 2", "255. Matrix Deep Dive 3",
  "256. Backtracking Deep Dive 1", "257. Backtracking Deep Dive 2", "258. Backtracking Deep Dive 3", "259. Bit Manipulation Deep Dive 1", "260. Bit Manipulation Deep Dive 2",
  "261. Bit Manipulation Deep Dive 3", "262. Geometry Deep Dive 1", "263. Geometry Deep Dive 2", "264. Geometry Deep Dive 3", "265. Math Deep Dive 1",
  "266. Math Deep Dive 2", "267. Math Deep Dive 3", "268. Greedy Deep Dive 1", "269. Greedy Deep Dive 2", "270. Greedy Deep Dive 3",
  "271. Heap Deep Dive 1", "272. Heap Deep Dive 2", "273. Heap Deep Dive 3", "274. Trie Deep Dive 1", "275. Trie Deep Dive 2",
  "276. Trie Deep Dive 3", "277. Segment Tree Deep Dive 1", "278. Segment Tree Deep Dive 2", "279. Segment Tree Deep Dive 3", "280. Fenwick Tree Deep Dive 1",
  "281. Fenwick Tree Deep Dive 2", "282. Fenwick Tree Deep Dive 3", "283. DP on Trees Deep Dive", "284. Advanced Graph Algorithms Deep Dive", "285. Competitive Strategy Deep Dive",
  "286. Mock Contest Analysis", "287. Codeforces Problem Analysis", "288. Leetcode Problem Analysis", "289. AtCoder Problem Analysis", "290. CodeChef Problem Analysis",
  "291. HackerRank Problem Analysis", "292. Advanced Recursion Patterns", "293. Advanced DP Patterns", "294. Advanced Graph Patterns", "295. Advanced String Patterns",
  "296. Advanced Matrix Patterns", "297. Advanced Backtracking Patterns", "298. CP Patterns Recap", "299. CP Tips & Tricks", "300. Final Contest Strategy",
  "301. Revision Session 1", "302. Revision Session 2", "303. Revision Session 3", "304. Advanced Problem Solving Recap 1", "305. Advanced Problem Solving Recap 2",
  "306. Advanced Problem Solving Recap 3", "307. Ultimate DSA Recap 1", "308. Ultimate DSA Recap 2", "309. Ultimate DSA Recap 3", "310. Final Mock Contest",
  "311. Mock Contest Solutions 1", "312. Mock Contest Solutions 2", "313. Mock Contest Solutions 3", "314. Preparation Checklist 1", "315. Preparation Checklist 2",
  "316. Preparation Checklist 3"
];

interface YouTubePlaylistTrackerProps {
  playlistId: string;
}

export default function YouTubePlaylistTracker({ playlistId }: YouTubePlaylistTrackerProps) {
  const [completedVideosList, setCompletedVideosList] = useLocalStorage<string[]>('completed-videos', []);
  // Create a Set from the array for efficient lookups
  const completedVideos = new Set(completedVideosList);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [userProgress, setUserProgress] = useLocalStorage('user-progress', {
    id: 'user1',
    level: 1,
    xp: 0,
    streak: 0,
    todayXP: 0
  });

  const toggleVideoCompleted = (videoTitle: string) => {
    const isCompleted = completedVideos.has(videoTitle);
    
    if (isCompleted) {
      // Remove from list
      const newList = completedVideosList.filter(video => video !== videoTitle);
      setCompletedVideosList(newList);
    } else {
      // Add to list
      const newList = [...completedVideosList, videoTitle];
      setCompletedVideosList(newList);
      // Award XP for completing video
      awardXP(setUserProgress, 5, `Completed: ${videoTitle}`);
    }
  };

  const filteredVideos = learningVideos.filter(video =>
    video.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const videosToShow = showAll ? filteredVideos : filteredVideos.slice(0, 20);
  const completedCount = learningVideos.filter(video => completedVideos.has(video)).length;
  const totalCount = learningVideos.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="p-6">
      {/* Progress Overview */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium text-muted-foreground">Learning Progress</span>
          <span className="text-sm font-semibold text-primary">
            {completedCount}/{totalCount} videos
          </span>
        </div>
        
        <div className="w-full bg-secondary/30 rounded-full h-3 mb-2">
          <div 
            className="bg-gradient-to-r from-primary via-accent to-primary h-3 rounded-full transition-all duration-500 ease-out shadow-sm"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        
        <div className="text-center">
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {Math.round(progressPercentage)}%
          </span>
          <p className="text-xs text-muted-foreground mt-1">Complete</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search videos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-background/50 border-border/50"
          />
        </div>
      </div>

      {/* Video Checklist */}
      <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
        {videosToShow.map((video) => (
          <div
            key={video}
            className={`group flex items-center p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
              completedVideos.has(video)
                ? 'bg-primary/10 border-primary/20 shadow-sm'
                : 'bg-card/50 border-border/30 hover:bg-secondary/60 hover:border-border/50'
            }`}
            onClick={() => toggleVideoCompleted(video)}
          >
            <div className="flex items-center space-x-3 w-full">
              <div className="flex-shrink-0">
                {completedVideos.has(video) ? (
                  <CheckCircle className="w-5 h-5 text-primary drop-shadow-sm" />
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className={`font-medium text-sm transition-all duration-200 ${
                  completedVideos.has(video) 
                    ? 'line-through text-muted-foreground' 
                    : 'text-foreground'
                }`}>
                  {video}
                </p>
              </div>
              
              {completedVideos.has(video) && (
                <div className="flex-shrink-0">
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                    +5 XP
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {filteredVideos.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No videos match your search</p>
          </div>
        )}
      </div>

      {/* Show More/Less Toggle */}
      {searchTerm === "" && (
        <div className="mt-6 text-center">
          {!showAll ? (
            <button
              onClick={() => setShowAll(true)}
              className="text-sm text-primary hover:text-primary/80 font-medium underline underline-offset-2"
            >
              Show all {learningVideos.length} videos →
            </button>
          ) : (
            <button
              onClick={() => setShowAll(false)}
              className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-2"
            >
              Show less ↑
            </button>
          )}
        </div>
      )}
    </div>
  );
}
