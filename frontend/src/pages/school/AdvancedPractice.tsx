import { ProblemCard } from "@/components/practice/ProblemCard";
import { Problem } from "@/types/problem";
import { useNavigate } from "react-router-dom";

// Mock data for Advanced Problems
const mockProblems: Problem[] = [
   {
      id: "adv-1",
      title: "Lowest Common Ancestor",
      description: "Find the lowest common ancestor of two nodes in a binary tree.",
      difficulty: "hard",
      tags: ["tree", "recursion"],
      initialCode: "function lowestCommonAncestor(root, p, q) {\n  // your code here\n}",
      testCases: []
   },
   {
      id: "adv-2",
      title: "Merge K Sorted Lists",
      description: "Merge k sorted linked lists and return it as one sorted list.",
      difficulty: "hard",
      tags: ["linked-list", "heap"],
      initialCode: "function mergeKLists(lists) {\n  // your code here\n}",
      testCases: []
   },
   {
      id: "adv-3",
      title: "Median of Two Sorted Arrays",
      description: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.",
      difficulty: "hard",
      tags: ["array", "binary-search"],
      initialCode: "function findMedianSortedArrays(nums1, nums2) {\n  // your code here\n}",
      testCases: []
   }
];

export function AdvancedPractice() {
   const navigate = useNavigate();

   return (
      <div className="space-y-6 container mx-auto py-8">
         <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Advanced Practice</h1>
            <p className="text-muted-foreground">Master System Design and Optimization.</p>
         </div>

         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mockProblems.map((problem) => (
               <ProblemCard
                  key={problem.id}
                  problem={problem}
                  onClick={() => navigate(`/problem/${problem.id}`)}
               />
            ))}
         </div>
      </div>
   );
}
