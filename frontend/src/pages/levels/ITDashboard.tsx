import {
   Card,
   CardHeader,
   CardTitle,
   CardDescription
} from "@/components/ui/Card";
import { Lock, Cloud, Shield, Layout, Terminal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { progressApi } from "@/services/skillService";

export function ITDashboard() {
   const navigate = useNavigate();
   const [progress, setProgress] = useState<any>(null);
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      const fetchProgress = async () => {
         try {
            const data = await progressApi.getUserProgress();
            setProgress(data);
         } catch (error) {
            console.error("Error fetching IT progress:", error);
         } finally {
            setIsLoading(false);
         }
      };
      fetchProgress();
   }, []);

   const tracks = [
      {
         title: "Full Stack Development",
         description: "React, Node.js, and Modern Web Architecture.",
         icon: Layout,
         color: "text-blue-500",
         path: "/it/fullstack",
         stats: progress?.scores?.it?.beginner !== undefined ? `${progress.scores.it.beginner}% Done` : "Level 1",
         isLocked: false,
         reqText: ""
      },
      {
         title: "Cloud Computing",
         description: "AWS, Azure, and Google Cloud Platform.",
         icon: Cloud,
         color: "text-sky-500",
         path: "/it/cloud",
         stats: progress?.scores?.it?.intermediate !== undefined ? `${progress.scores.it.intermediate}% Done` : "Level 2",
         isLocked: (progress?.scores?.it?.beginner || 0) < 100,
         reqText: "Finish Full Stack (100%) to unlock"
      },
      {
         title: "Cyber Security",
         description: "Network security, ethical hacking, and defense.",
         icon: Shield,
         color: "text-red-500",
         path: "/it/security",
         stats: progress?.scores?.it?.advanced !== undefined ? `${progress.scores.it.advanced}% Done` : "Level 3",
         isLocked: (progress?.scores?.it?.intermediate || 0) < 100,
         reqText: "Finish Cloud Computing (100%) to unlock"
      },
      {
         title: "DevOps & SRE",
         description: "Docker, Kubernetes, CI/CD, and Monitoring.",
         icon: Terminal,
         color: "text-green-500",
         path: "/it/devops",
         stats: "Assessment",
         isLocked: (progress?.scores?.it?.advanced || 0) < 100,
         reqText: "Finish Cyber Security (100%) to unlock"
      }
   ];

   if (isLoading) {
      return (
         <div className="min-h-screen bg-white text-black flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-white text-black space-y-8 p-8">
         <div className="flex justify-between items-center">
            <div>
               <h1 className="text-3xl font-bold tracking-[0.2em] uppercase mb-2 text-black" style={{ fontFamily: "'Syncopate', sans-serif" }}>IT <span className="text-black">Module</span></h1>
               <p className="text-black text-sm font-medium">Equip yourself for the modern tech industry.</p>
            </div>
            <div className="bg-white px-4 py-2 rounded-xl border border-zinc-200">
               <span className="text-xs font-bold uppercase tracking-widest text-black">Industry Readiness: </span>
               <span className="text-black font-bold">{(progress?.scores?.it?.beginner || 0)}%</span>
            </div>
         </div>

         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 group/cards">
            {tracks.map((track) => (
               <Card
                  key={track.title}
                  className={`w-full border-zinc-200 p-1 shadow-sm hover:shadow-xl relative overflow-hidden transition-all duration-500 
                     bg-white 
                     ${track.isLocked ? 'cursor-not-allowed opacity-60 ' : 'cursor-pointer hover:bg-zinc-50 hover:border-zinc-200 group-hover/cards:scale-[0.98] hover:!scale-[1.02] hover:z-10'}
                  `}
                  onClick={() => !track.isLocked && navigate(track.path)}
               >
                  {track.isLocked && (
                     <div className="absolute inset-0 z-20 bg-white/40 backdrop-blur-[1px] flex flex-col items-center justify-center gap-3">
                        <div className="bg-zinc-100 border border-zinc-200 p-3 rounded-2xl shadow-xl">
                           <Lock size={18} className="text-black" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black text-center px-4">{track.reqText}</span>
                     </div>
                  )}

                  <CardHeader className="pb-4">
                     <div className="flex flex-row items-center justify-between pb-3">
                        <CardTitle className="text-sm font-bold uppercase tracking-wider text-black">{track.title}</CardTitle>
                        <track.icon className={`h-5 w-5 ${track.color} opacity-80`} />
                     </div>
                     <div>
                        <CardDescription className="text-[11px] text-black font-medium mb-4">{track.description}</CardDescription>
                        <div className="flex items-center gap-2">
                           <div className="h-1 flex-1 bg-zinc-100 rounded-full overflow-hidden border border-zinc-200">
                              <div
                                 className="h-full bg-black transition-all duration-1000"
                                 style={{ width: `${track.stats.includes('%') ? track.stats.split('%')[0] : 0}%` }}
                              />
                           </div>
                           <div className="text-[10px] font-black text-black uppercase">{track.stats}</div>
                        </div>
                     </div>
                  </CardHeader>
               </Card>
            ))}
         </div>
      </div>
   );
}
