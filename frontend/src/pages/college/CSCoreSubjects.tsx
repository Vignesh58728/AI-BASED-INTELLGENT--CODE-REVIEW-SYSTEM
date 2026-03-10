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
      <div className="space-y-6 container mx-auto py-8">
         <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">CS Core Subjects</h1>
            <p className="text-black">Master Operating Systems, DBMS, and Computer Networks.</p>
         </div>

         {isLoading ? (
            <div className="text-center py-12">Loading subjects...</div>
         ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
               {problems.map((problem) => (
                  <ProblemCard key={problem.id} problem={problem as any} />
               ))}
            </div>
         )}
      </div>
   );
}
