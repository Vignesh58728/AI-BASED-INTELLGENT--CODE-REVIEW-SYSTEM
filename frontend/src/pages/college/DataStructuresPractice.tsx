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
         <style>{`
            .card-list {
               display: flex;
               padding: 3rem;
               overflow-x: scroll;
               scrollbar-width: none;
            }
            .card-list::-webkit-scrollbar {
               display: none;
            }
            .card {
               height: 350px;
               width: 400px;
               min-width: 250px;
               padding: 2.5rem;
               border-radius: 0;
               background: #ffffff;
               border: 2px solid #000000;
               box-shadow: -1rem 0 3rem rgba(0,0,0,0.12);
               display: flex;
               flex-direction: column;
               transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
               margin: 0;
               scroll-snap-align: start;
               position: relative;
            }
            .card:hover {
               transform: translateY(-1.5rem);
            }
            .card:hover ~ .card {
               transform: translateX(180px);
            }
            .card:not(:first-child) {
               margin-inline-start: -130px;
            }
            .card-header {
               margin-bottom: auto;
            }
            .card-header h2 {
               font-size: 20px;
               margin: 1.5rem 0 auto;
               cursor: pointer;
            }
            .card-author {
               position: relative;
               display: grid;
               grid-template-columns: 75px 1fr;
               align-items: center;
               margin: 3rem 0 0;
            }
            .author-avatar {
               width: 50px;
               height: 50px;
               border-radius: 0;
               overflow: hidden;
               border: 1px solid #000;
               background: #f8f8f8;
            }
            .author-avatar img {
               width: 100%;
               height: 100%;
               object-fit: cover;
            }
            .half-circle {
               position: absolute;
               inset-inline-start: -8px;
               inset-block-end: -8px;
               width: 60px;
               height: 48px;
               fill: none;
               stroke: #ff8a00;
               stroke-width: 8;
               stroke-linecap: round;
            }
            .tags {
               margin: 1rem 0 2rem;
               padding: 0.5rem 0 1rem;
               line-height: 2;
               display: flex;
               gap: 0.5rem;
            }
            .tags .badge {
               font-weight: 700;
               font-size: 0.66rem;
               color: #7a7a8c;
               text-transform: uppercase;
               border: 2px solid #000;
               padding: 0.2rem 0.85rem 0.25rem;
            }
         `}</style>
         <div className="flex justify-between items-end border-b border-zinc-100 pb-8">
            <div>
               <h1 className="text-4xl font-bold tracking-[0.2em] text-black mb-3 uppercase" style={{ fontFamily: "'Syncopate', sans-serif" }}>Data Structures</h1>
               <p className="text-black text-lg max-w-2xl font-light" style={{ fontFamily: "'Outfit', sans-serif" }}>Master core data structures with curated problems and AI code reviews.</p>
            </div>
            <div className="bg-white px-6 py-3 rounded-none border-2 border-black">
               <span className="text-[10px] font-black text-black uppercase tracking-widest">Compiler API Active</span>
            </div>
         </div>

         {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 text-zinc-600">
               <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
               <p className="font-medium">Curating your workspace...</p>
            </div>
         ) : (
            <div className="card-list px-0">
               {problems.map((problem) => (
                  <ProblemCard
                     key={problem.id}
                     problem={problem as any}
                     onClick={() => navigate(`/practice/${problem.id}`)}
                  />
               ))}
            </div>
         )}
      </div>
   );
}
