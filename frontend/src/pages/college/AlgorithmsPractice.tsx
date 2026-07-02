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
            setIsLoading(true);

            // 1. Fetch any database problems for college module (can filter by tags later)
            const collegeData = await problemsApi.getCollegeProblems();

            // 2. Fetch LeetCode problems (e.g., from 100 onwards for algorithms)
            const lcData = await problemsApi.getLeetCodeProblems(100, 100);

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
            console.error("Error fetching Algo problems:", e);
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
               <h1 className="text-4xl font-bold tracking-tight mb-2 text-black" style={{ fontFamily: "'Satisfy', cursive" }}>Algorithms</h1>
               <p className="text-zinc-500 text-lg font-medium leading-relaxed max-w-2xl" style={{ fontFamily: "'Outfit', sans-serif" }}>Learn and implement essential competitive algorithms with AI assistance.</p>
            </div>
         </div>

         {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 text-zinc-600">
               <div className="animate-spin w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full mb-4"></div>
               <p className="font-medium text-emerald-600/60 uppercase text-xs tracking-widest">Scanning Algorithm Bank...</p>
            </div>
         ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
               {/* Fixed Compile Card at the top */}
               <div
                  onClick={() => navigate('/ai/practice')}
                  className="group relative h-full rounded-3xl overflow-hidden cursor-pointer border border-emerald-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col items-center justify-center gap-6 bg-white p-8 hover:!scale-[1.02] group"
               >
                  <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-emerald-500/10">
                     <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                     </svg>
                  </div>
                  <div className="text-center font-['Outfit']">
                     <p className="text-sm font-black uppercase tracking-[0.2em] text-black mb-1 font-sans">Algorithm Playground</p>
                     <p className="text-[11px] text-zinc-400 font-medium italic font-sans">General Compile API Mode</p>
                  </div>
               </div>

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
