
import { ProblemCard } from "@/components/practice/ProblemCard";

const algoProblems = [
   { id: "algo1", title: "Merge Sort Implementation", difficulty: "Medium", completed: false },
   { id: "algo2", title: "Knapsack Problem (0/1)", difficulty: "Hard", completed: false },
   { id: "algo3", title: "Dijkstra's Shortest Path", difficulty: "Hard", completed: false },
   { id: "algo4", title: "Longest Common Subsequence", difficulty: "Medium", completed: false },
   { id: "algo5", title: "Binary Search", difficulty: "Easy", completed: true },
   { id: "algo6", title: "Quicksort Implementation", difficulty: "Medium", completed: false },
];

export function AlgorithmsPractice() {
   return (
      <div className="space-y-6 container mx-auto py-8">
         <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Algorithms</h1>
            <p className="text-muted-foreground">Learn and implement essential competitive algorithms.</p>
         </div>

         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {algoProblems.map((problem) => (
               <ProblemCard key={problem.id} problem={problem as any} />
            ))}
         </div>
      </div>
   );
}
