import { ProblemCard } from "@/components/practice/ProblemCard";
import { Problem } from "@/types/problem";
import { useNavigate } from "react-router-dom";

// Mock data for Intermediate Problems
const mockProblems: Problem[] = [
   {
      id: "int-1",
      title: "Valid Parentheses",
      description: "Given a string containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
      difficulty: "medium",
      tags: ["stack", "strings"],
      initialCode: "function isValid(s) {\n  // your code here\n}",
      testCases: []
   },
   {
      id: "int-2",
      title: "Reverse Linked List",
      description: "Reverse a singly linked list.",
      difficulty: "medium",
      tags: ["linked-list"],
      initialCode: "function reverseList(head) {\n  // your code here\n}",
      testCases: []
   },
   {
      id: "int-3",
      title: "Binary Tree Inorder Traversal",
      description: "Given the root of a binary tree, return the inorder traversal of its nodes' values.",
      difficulty: "medium",
      tags: ["tree", "dfs"],
      initialCode: "function inorderTraversal(root) {\n  // your code here\n}",
      testCases: []
   }
];

export function IntermediatePractice() {
   const navigate = useNavigate();

   return (
      <div className="space-y-6 container mx-auto py-8">
         <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Intermediate Practice</h1>
            <p className="text-muted-foreground">Level up with Data Structures and Algorithms.</p>
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
