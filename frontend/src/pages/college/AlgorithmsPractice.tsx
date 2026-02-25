import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ProblemCard } from "@/components/practice/ProblemCard";
import { problemsApi } from "@/services/problemsApi";
import { Problem } from "@/types/problem";

export function AlgorithmsPractice() {
   const navigate = useNavigate();
   const [problems, setProblems] = useState<Problem[]>([]);
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      const fetchProblems = async () => {
         try {
            const data = await problemsApi.getCollegeProblems();
            // Filter locally for Algo category
            setProblems(data.filter(p => p.title.includes("Sort") || p.title.includes("Knapsack")));
         } catch (e) {
            console.error("Error fetching Algo problems:", e);
         } finally {
            setIsLoading(false);
         }
      };
      fetchProblems();
   }, []);

   return (
      <div className="space-y-6 container mx-auto py-8">
         <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Algorithms</h1>
            <p className="text-muted-foreground">Learn and implement essential competitive algorithms.</p>
         </div>

         {isLoading ? (
            <div className="text-center py-12">Loading problems...</div>
         ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
               {problems.map((problem) => (
                  <ProblemCard
                     key={problem.id}
                     problem={problem as any}
                     onClick={() => navigate(`/college/practice/${problem.id}`)}
                  />
               ))}
            </div>
         )}
      </div>
   );
}
