import {
   Card,
   CardHeader,
   CardTitle,
   CardDescription
} from "@/components/ui/Card";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { progressApi } from "@/services/skillService";
import { Lock } from "lucide-react";

import pythonIcon from "@/assets/images/python.png";
import intermediateIcon from "@/assets/images/intermediate-level.png";
import advancedIcon from "@/assets/images/it.png";
import careerIcon from "@/assets/images/career-path.png";

export function SchoolDashboard() {
   const navigate = useNavigate();
   const [progress, setProgress] = useState<any>(null);

   useEffect(() => {
      const fetchProgress = async () => {
         try {
            const data = await progressApi.getUserProgress();
            setProgress(data);
         } catch (error) {
            console.error("Error fetching school progress:", error);
         }
      };
      fetchProgress();
   }, []);

   const modules = [
      {
         title: "Beginner Practice",
         desc: "35 Foundational Programs",
         icon: pythonIcon,
         path: "/school/beginner",
         stats: progress?.scores?.school?.beginner !== undefined ? `${progress.scores.school.beginner}% Done` : "Level 1",
         isLocked: false,
         reqText: ""
      },
      {
         title: "Intermediate",
         desc: "Level Up your Skills",
         icon: intermediateIcon,
         path: "/school/intermediate",
         stats: progress?.scores?.school?.intermediate !== undefined ? `${progress.scores.school.intermediate}% Done` : "Level 2",
         isLocked: (progress?.scores?.school?.beginner || 0) < 100,
         reqText: "Complete Beginner to Unlock"
      },
      {
         title: "Advanced",
         desc: "Master Complex Logic",
         icon: advancedIcon,
         path: "/school/advanced",
         stats: progress?.scores?.school?.advanced !== undefined ? `${progress.scores.school.advanced}% Done` : "Level 3",
         isLocked: (progress?.scores?.school?.intermediate || 0) < 100,
         reqText: "Complete Intermediate to Unlock"
      },
      {
         title: "Mock Exams",
         desc: "3hr Full Simulation",
         icon: careerIcon,
         path: "/school/exams",
         stats: "Assessment",
         isLocked: (progress?.scores?.school?.advanced || 0) < 100,
         reqText: "Complete Advanced to Unlock"
      }
   ];

   return (
      <div className="min-h-screen bg-white text-black space-y-8 p-8">
         <div className="flex items-center justify-between">
            <div>
               <h1 className="text-3xl font-bold tracking-[0.2em] uppercase mb-2 text-black" style={{ fontFamily: "'Syncopate', sans-serif" }}>School <span className="text-black">Dashboard</span></h1>
               <p className="text-black text-sm font-medium">Solve all Beginner problems to unlock the next level.</p>
            </div>
            <div className="bg-white px-4 py-2 rounded-xl border border-zinc-200">
               <span className="text-xs font-bold uppercase tracking-widest text-black">Global Progress: </span>
               <span className="text-black font-bold">{(progress?.scores?.school?.beginner || 0)}%</span>
            </div>
         </div>

         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 group/cards">
            {modules.map((item, i) => (
               <Card
                  key={i}
                  className={`w-full border-zinc-200 p-1 shadow-sm hover:shadow-xl relative overflow-hidden transition-all duration-500 
                     bg-white 
                     ${item.isLocked ? 'cursor-not-allowed opacity-60 ' : 'cursor-pointer hover:bg-zinc-50 hover:border-zinc-200 group-hover/cards:scale-[0.98] hover:!scale-[1.02] hover:z-10'}
                  `}
                  onClick={() => !item.isLocked && navigate(item.path)}
               >
                  {item.isLocked && (
                     <div className="absolute inset-0 z-20 bg-white/40 backdrop-blur-[1px] flex flex-col items-center justify-center gap-3">
                        <div className="bg-zinc-100 border border-zinc-200 p-3 rounded-2xl shadow-xl">
                           <Lock size={18} className="text-black" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black">{item.reqText}</span>
                     </div>
                  )}

                  <CardHeader className="pb-4">
                     <div className="flex flex-row items-center justify-between pb-3">
                        <CardTitle className="text-sm font-bold uppercase tracking-wider text-black">{item.title}</CardTitle>
                        <img src={item.icon} alt={item.title} className="h-5 w-5 opacity-80" />
                     </div>
                     <div>
                        <CardDescription className="text-[11px] text-black font-medium mb-4">{item.desc}</CardDescription>
                        <div className="flex items-center gap-2">
                           <div className="h-1 flex-1 bg-zinc-100 rounded-full overflow-hidden border border-zinc-200">
                              <div
                                 className="h-full bg-black transition-all duration-1000"
                                 style={{ width: `${item.stats.includes('%') ? item.stats.split('%')[0] : (item.isLocked ? 0 : 0)}%` }}
                              />
                           </div>
                           <div className="text-[10px] font-black text-black uppercase">{item.stats}</div>
                        </div>
                     </div>
                  </CardHeader>
               </Card>
            ))}
         </div>
      </div>
   );
}
