import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ProblemCard } from "@/components/practice/ProblemCard";
import { problemsApi } from "@/services/problemsApi";
import { Problem } from "@/types/problem";

export function DataStructuresPractice() {
   const navigate = useNavigate();
   const [problems, setProblems] = useState<Problem[]>([]);
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      const fetchProblems = async () => {
         try {
            const data = await problemsApi.getCollegeProblems();
            // Filter locally for DS category if backend doesn't support sub-categories yet
            // For now, we seed a few DS problems.
            setProblems(data.filter(p => p.title.includes("Linked List") || p.title.includes("Tree")));
         } catch (e) {
            console.error("Error fetching DS problems:", e);
         } finally {
            setIsLoading(false);
         }
      };
      fetchProblems();
   }, []);

   return (
      <div className="space-y-6 container mx-auto py-8">
         <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Data Structures</h1>
            <p className="text-muted-foreground">Master core data structures with these curated problems.</p>
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
