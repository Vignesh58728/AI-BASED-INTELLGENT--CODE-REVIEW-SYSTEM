import { ProblemCard } from "@/components/practice/ProblemCard";
import { Problem } from "@/types/problem";
import { useNavigate } from "react-router-dom";

// Mock data
const mockProblems: Problem[] = [
   {
      id: "1",
      title: "Hello World",
      description: "Write a function that returns 'Hello, World!'",
      difficulty: "easy",
      tags: ["basics", "strings"],
      initialCode: "function hello() {\n  // your code here\n}",
      testCases: []
   },
   {
      id: "2",
      title: "Sum of Two Numbers",
      description: "Write a function that adds two numbers.",
      difficulty: "easy",
      tags: ["math", "basics"],
      initialCode: "function add(a, b) {\n  return a + b;\n}",
      testCases: []
   },
   {
      id: "3",
      title: "Find Max",
      description: "Find the maximum number in an array.",
      difficulty: "medium",
      tags: ["arrays"],
      initialCode: "function findMax(arr) {\n  // your code here\n}",
      testCases: []
   }
];

export function BeginnerPractice() {
   const navigate = useNavigate();

   return (
      <div className="space-y-6 container mx-auto py-8">
         <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Beginner Practice</h1>
            <p className="text-muted-foreground">Start with these foundational problems.</p>
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
