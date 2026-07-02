import {
   Card,
   CardHeader,
   CardTitle,
   CardDescription
} from "@/components/ui/Card";
import { Code, Terminal, BookOpen, Lock, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { progressApi } from "@/services/skillService";
import { motion } from "framer-motion";

export function CollegeDashboard() {
   const navigate = useNavigate();
   const [progress, setProgress] = useState<any>(null);
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      const fetchProgress = async () => {
         try {
            const data = await progressApi.getUserProgress();
            setProgress(data);
         } catch (error) {
            console.error("Error fetching college progress:", error);
         } finally {
            setIsLoading(false);
         }
      };
      fetchProgress();
   }, []);

   const tracks = [
      {
         title: "Data Structures",
         description: "Master Arrays, Linked Lists, Trees, and Graphs.",
         icon: Code,
         color: "text-blue-500",
         path: "/college/ds",
         stats: "0% Done",
         isLocked: false,
         reqText: ""
      },
      {
         title: "Algorithms",
         description: "Sorting, Searching, DP, and Greedy algorithms.",
         icon: Terminal,
         color: "text-green-500",
         path: "/college/algorithms",
         stats: "0% Done",
         isLocked: true,
         reqText: "Finish Data Structures (100%) to unlock"
      },
      {
         title: "CS Core Subjects",
         description: "OS, DBMS, CN, and System Design basics.",
         icon: BookOpen,
         color: "text-purple-500",
         path: "/college/core",
         stats: "0% Done",
         isLocked: true,
         reqText: "Finish Algorithms (100%) to unlock"
      },
   ];

   const semesterPath = [
      { week: "Phase 1", topic: "Data Structures", detail: "Arrays, Linked Lists, Stacks, and Queues." },
      { week: "Phase 2", topic: "Advanced DS", detail: "Trees, Graphs, and Hash Tables." },
      { week: "Phase 3", topic: "Basic Algorithms", detail: "Sorting, Searching, and Recursion." },
      { week: "Phase 4", topic: "Advanced Algorithms", detail: "Dynamic Programming and Greedy algorithms." },
      { week: "Phase 5", topic: "Operating Systems", detail: "Processes, Threads, and Memory Management." },
      { week: "Phase 6", topic: "Databases", detail: "SQL basics, Normalization, and Transactions." },
      { week: "Phase 7", topic: "Computer Networks", detail: "OSI Model, TCP/IP, and basic Routing." },
      { week: "Phase 8", topic: "System Design", detail: "Scalability, Microservices, and API structure." },
   ];

   if (isLoading) {
      return (
         <div className="min-h-screen bg-white text-black flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-white text-black space-y-8 p-8" style={{ fontFamily: "'Outfit', sans-serif" }}>
         <div className="flex justify-between items-center">
            <div>
               <h1 className="text-4xl font-bold tracking-tight mb-2 text-black" style={{ fontFamily: "'Satisfy', cursive" }}>College Module</h1>
               <p className="text-black text-sm font-medium">Build strong computer science fundamentals.</p>
            </div>
         </div>

         <div className="grid gap-8 md:grid-cols-3 group/cards">
            {tracks.map((track) => (
               <Card
                  key={track.title}
                  className={`w-full border-zinc-100 p-1 shadow-sm hover:shadow-2xl relative overflow-hidden transition-all duration-500 
                     bg-white rounded-3xl
                     ${track.isLocked ? 'cursor-not-allowed opacity-60 ' : 'cursor-pointer hover:bg-zinc-50 hover:border-black/5 group-hover/cards:scale-[0.98] hover:!scale-[1.02] hover:z-10'}
                  `}
                  onClick={() => {
                     if (!track.isLocked) {
                        if (track.path.startsWith('http')) {
                           window.open(track.path, '_blank');
                        } else {
                           navigate(track.path);
                        }
                     }
                  }}
               >
                  {track.isLocked && (
                     <div className="absolute inset-0 z-20 bg-white/40 backdrop-blur-[1px] flex flex-col items-center justify-center gap-3">
                        <div className="bg-zinc-100 border border-zinc-200 p-3 rounded-2xl shadow-xl">
                           <Lock size={18} className="text-black" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black text-center px-4">{track.reqText}</span>
                     </div>
                  )}

                  <CardHeader className="pb-8">
                     <div className="flex flex-row items-center justify-between pb-6">
                        <CardTitle className="text-xl font-bold text-black tracking-tight group-hover/card:bg-gradient-to-r from-[#ff8a00] to-[#e52e71] group-hover/card:bg-clip-text group-hover/card:text-transparent transition-all">
                           {track.title}
                        </CardTitle>
                        <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-100">
                           <track.icon className={`h-6 w-6 ${track.color} opacity-80`} />
                        </div>
                     </div>
                     <div>
                        <CardDescription className="text-[11px] text-black font-medium mb-6 leading-relaxed opacity-70">{track.description}</CardDescription>
                        
                        <div className="author-name font-['Outfit']">
                           <div className="author-name-prefix text-[10px] font-black uppercase tracking-widest mb-2 text-zinc-400">Readiness Status</div>
                           <div className="flex items-center gap-4">
                              <div className="h-1 flex-1 bg-zinc-100 rounded-full overflow-hidden border border-zinc-200">
                                 <div
                                    className="h-full bg-black transition-all duration-1000"
                                    style={{ width: `${track.stats.includes('%') ? track.stats.split('%')[0] : 0}%` }}
                                 />
                              </div>
                              <span className="text-[10px] font-black text-black uppercase">{track.stats}</span>
                           </div>
                        </div>
                     </div>
                  </CardHeader>
               </Card>
            ))}
         </div>

         {/* Semester Roadmap Section */}
         <div className="pt-12 pb-24">
            <div className="mb-8">
               <h2 className="text-4xl font-bold tracking-tight mb-2 text-black" style={{ fontFamily: "'Satisfy', cursive" }}>CS Mastery Path</h2>
               <p className="text-zinc-400 text-sm font-bold uppercase tracking-widest leading-relaxed">A sequence of 8 milestones for deep CS fundamental mastery</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
               {semesterPath.map((item, i) => (
                  <motion.div
                     key={i}
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: i * 0.1 }}
                     className="group relative bg-white border border-zinc-100 p-6 rounded-3xl hover:border-black/10 hover:shadow-2xl transition-all duration-500 overflow-hidden"
                  >
                     {/* Decorative subtle numbering */}
                     <div className="absolute -right-4 -bottom-4 text-8xl font-black text-black/[0.02] select-none group-hover:text-black/[0.05] transition-all">
                        {i + 1}
                     </div>

                     <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                           <span className="text-[10px] font-black uppercase tracking-[0.3em] text-black bg-zinc-50 px-3 py-1 rounded-full group-hover:bg-black group-hover:text-white transition-all">
                              {item.week}
                           </span>
                           <div className="w-1.5 h-1.5 rounded-full bg-zinc-200 group-hover:bg-black transition-all" />
                        </div>
                        <h3 className="text-sm font-bold text-black mb-2 tracking-tight">{item.topic}</h3>
                        <p className="text-[11px] text-zinc-500 font-medium leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                           {item.detail}
                        </p>
                     </div>
                  </motion.div>
               ))}
            </div>
         </div>

      </div>
   );
}
