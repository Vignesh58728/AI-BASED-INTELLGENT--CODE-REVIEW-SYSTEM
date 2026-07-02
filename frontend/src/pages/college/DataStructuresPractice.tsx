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
            setIsLoading(true);

            // 1. Fetch any database problems for college module
            const collegeData = await problemsApi.getCollegeProblems();

            // 2. Fetch LeetCode problems
            const lcData = await problemsApi.getLeetCodeProblems(0, 100);

            // 3. Combine and Format
            const dbFormatted = collegeData.map(p => ({
               ...p,
               isStatic: true
            }));

            const lcFormatted = lcData.map(p => ({
               id: `lc-${p.titleSlug}`,
               title: p.title,
               difficulty: p.difficulty.toLowerCase(),
               points: p.difficulty === 'Easy' ? 20 : p.difficulty === 'Medium' ? 40 : 60,
               module: 'college'
            }));

            setProblems([...dbFormatted, ...lcFormatted] as any);
         } catch (e) {
            console.error("Error fetching DS problems:", e);
         } finally {
            setIsLoading(false);
         }
      };
      fetchProblems();
   }, []);

   return (
      <div className="space-y-8 container mx-auto py-12 px-6">
         <div className="flex justify-between items-end border-b border-zinc-100 pb-8">
            <div>
               <h1 className="text-4xl font-bold tracking-tight mb-2 text-black" style={{ fontFamily: "'Satisfy', cursive" }}>Data Structures</h1>
               <p className="text-zinc-500 text-lg font-medium leading-relaxed max-w-2xl" style={{ fontFamily: "'Outfit', sans-serif" }}>Master core data structures with curated problems and AI code reviews.</p>
            </div>
         </div>

         {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 text-zinc-600">
               <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
               <p className="font-medium">Curating your workspace...</p>
            </div>
         ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
               {problems.map((problem, idx) => (
                  <ProblemCard
                     key={problem.id}
                     problem={problem as any}
                     index={idx + 1}
                     onClick={() => navigate(`/practice/${problem.id}`)}
                  />
               ))}
            </div>
         )}
      </div>
   );
}
