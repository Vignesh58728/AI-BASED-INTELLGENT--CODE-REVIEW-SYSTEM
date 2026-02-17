
import { ProblemCard } from "@/components/practice/ProblemCard";

const dsProblems = [
   { id: "ds1", title: "Reverse a Linked List", difficulty: "Medium", completed: true },
   { id: "ds2", title: "Check for Balanced Brackets", difficulty: "Easy", completed: false },
   { id: "ds3", title: "Implement a Queue using Stacks", difficulty: "Medium", completed: false },
   { id: "ds4", title: "Find the Middle element of a Linked List", difficulty: "Easy", completed: true },
   { id: "ds5", title: "Binary Tree Level Order Traversal", difficulty: "Medium", completed: false },
   { id: "ds6", title: "Lowest Common Ancestor in a BST", difficulty: "Medium", completed: false },
];

export function DataStructuresPractice() {
   return (
      <div className="space-y-6 container mx-auto py-8">
         <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Data Structures</h1>
            <p className="text-muted-foreground">Master core data structures with these curated problems.</p>
         </div>

         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {dsProblems.map((problem) => (
               <ProblemCard key={problem.id} problem={problem as any} />
            ))}
         </div>
      </div>
   );
}
