import { useState, useEffect } from "react";
import { ProblemCard } from "@/components/practice/ProblemCard";
import { problemsApi } from "@/services/problemsApi";
import { Problem } from "@/types/problem";

export function CSCoreSubjects() {
   const [problems, setProblems] = useState<Problem[]>([]);
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      const fetchProblems = async () => {
         try {
            const data = await problemsApi.getCollegeProblems();
            // Filter locally for CS Core category
            setProblems(data.filter(p => p.title.includes("OS") || p.title.includes("DBMS") || p.title.includes("Networks")));
         } catch (e) {
            console.error("Error fetching CS Core problems:", e);
         } finally {
            setIsLoading(false);
         }
      };
      fetchProblems();
   }, []);

   return (
      <div className="space-y-6 container mx-auto py-8 px-6">
         <div className="flex justify-between items-end border-b border-zinc-100 pb-8">
            <div>
               <h1 className="text-4xl font-bold tracking-tight mb-2 text-black" style={{ fontFamily: "'Satisfy', cursive" }}>CS Core Subjects</h1>
               <p className="text-zinc-500 text-lg font-medium leading-relaxed max-w-2xl" style={{ fontFamily: "'Outfit', sans-serif" }}>Master Operating Systems, DBMS, and Computer Networks.</p>
            </div>
         </div>

         {isLoading ? (
            <div className="text-center py-32 text-zinc-400 font-bold uppercase tracking-widest text-xs animate-pulse">Syncing Subject Bank...</div>
         ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 pt-8">
               {problems.map((problem, idx) => (
                  <ProblemCard key={problem.id} problem={problem as any} index={idx + 1} />
               ))}
            </div>
         )}
      </div>
   );
}
