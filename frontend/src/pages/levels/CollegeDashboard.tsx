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
         stats: progress?.scores?.college?.beginner !== undefined ? `${progress.scores.college.beginner}% Done` : "Ready",
         isLocked: false,
         reqText: ""
      },
      {
         title: "Algorithms",
         description: "Sorting, Searching, DP, and Greedy algorithms.",
         icon: Terminal,
         color: "text-green-500",
         path: "/college/algorithms",
         stats: progress?.scores?.college?.intermediate !== undefined ? `${progress.scores.college.intermediate}% Done` : "Level 2",
         isLocked: (progress?.scores?.college?.beginner || 0) < 100,
         reqText: "Finish Data Structures (100%) to unlock"
      },
      {
         title: "CS Core Subjects",
         description: "OS, DBMS, CN, and System Design basics.",
         icon: BookOpen,
         color: "text-purple-500",
         path: "/college/core",
         stats: progress?.scores?.college?.advanced !== undefined ? `${progress.scores.college.advanced}% Done` : "Level 3",
         isLocked: (progress?.scores?.college?.intermediate || 0) < 100,
         reqText: "Finish Algorithms (100%) to unlock"
      },
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
               margin: 1rem 0 auto;
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
               display: flex;
               items-center: center;
               justify-content: center;
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
            .author-name-prefix {
               font-weight: 700;
               color: #7a7a8c;
            }
         `}</style>
         <div className="flex justify-between items-center">
            <div>
               <h1 className="text-3xl font-bold tracking-[0.2em] uppercase mb-2 text-black" style={{ fontFamily: "'Syncopate', sans-serif" }}>College <span className="text-black">Module</span></h1>
               <p className="text-black text-sm font-medium">Build strong computer science fundamentals.</p>
            </div>
            <div className="bg-white px-4 py-2 rounded-none border-2 border-black">
               <span className="text-xs font-bold uppercase tracking-widest text-black">Overall Progress: </span>
               <span className="text-black font-bold">{(progress?.scores?.college?.beginner || 0)}%</span>
            </div>
         </div>

         <div className="card-list px-0 group/cards">
            {tracks.map((track) => (
               <article
                  key={track.title}
                  className={`card group/card 
                     ${track.isLocked ? 'cursor-not-allowed opacity-60 ' : 'cursor-pointer'}
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

                  <header className="card-header">
                     <h2 className="font-['Syncopate'] text-xl font-bold text-black uppercase tracking-wider group-hover/card:bg-gradient-to-r from-[#ff8a00] to-[#e52e71] group-hover/card:bg-clip-text group-hover/card:text-transparent transition-all">
                        {track.title}
                     </h2>
                     <p className="font-['Outfit'] text-[11px] text-black font-medium mt-4 line-clamp-2">{track.description}</p>
                  </header>

                  <div className="card-author">
                     <div className="author-avatar">
                        <track.icon className={`h-6 w-6 ${track.color}`} />
                     </div>
                     <svg className="half-circle" viewBox="0 0 106 57">
                        <path d="M102 4c0 27.1-21.9 49-49 49S4 31.1 4 4"></path>
                     </svg>
                     <div className="author-name font-['Outfit'] px-4">
                        <div className="author-name-prefix text-[10px] font-black uppercase tracking-widest mb-1">Status</div>
                        <div className="flex items-center gap-4">
                           <div className="h-1 flex-1 bg-zinc-100 border border-black/5 min-w-[60px]">
                              <div
                                 className="h-full bg-black transition-all duration-1000"
                                 style={{ width: `${track.stats.includes('%') ? track.stats.split('%')[0] : 0}%` }}
                              />
                           </div>
                           <span className="text-[10px] font-black text-black uppercase">{track.stats}</span>
                        </div>
                     </div>
                  </div>
               </article>
            ))}
         </div>

         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
            <Card className="border-2 border-black p-1 shadow-sm hover:shadow-xl bg-white rounded-none">
               <CardHeader>
                  <CardTitle className="text-sm font-bold uppercase tracking-widest mb-4">Top Resources</CardTitle>
                  <div className="grid md:grid-cols-3 gap-4">
                     <div className="flex items-center gap-3 p-3 rounded-none border border-black/10 bg-zinc-50 hover:bg-zinc-100 transition-colors cursor-pointer">
                        <div className="h-10 w-10 flex items-center justify-center rounded-none overflow-hidden border border-black/5">
                           <img src="/resource-pdf.jpeg" alt="PDF" className="h-full w-full object-cover" />
                        </div>
                        <div className="flex-1">
                           <div className="text-[11px] font-bold uppercase">DSA Cheat Sheet</div>
                           <div className="text-[9px] text-black uppercase">Interactive Master Sheet</div>
                        </div>
                     </div>
                     <div className="flex items-center gap-3 p-3 rounded-none border border-black/10 bg-zinc-50 hover:bg-zinc-100 transition-colors cursor-pointer">
                        <div className="h-10 w-10 flex items-center justify-center rounded-none overflow-hidden border border-black/5">
                           <img src="/resource-web.jpeg" alt="WEB" className="h-full w-full object-cover" />
                        </div>
                        <div className="flex-1">
                           <div className="text-[11px] font-bold uppercase">System Design</div>
                           <div className="text-[9px] text-black uppercase">Hiring Prep Resources</div>
                        </div>
                     </div>
                     <div className="flex items-center gap-3 p-3 rounded-none border border-black/10 bg-zinc-50 hover:bg-zinc-100 transition-colors cursor-pointer">
                        <div className="h-10 w-10 flex items-center justify-center rounded-none overflow-hidden border border-black/5">
                           <img src="/resource-leetcode.jpeg" alt="EXT" className="h-full w-full object-cover" />
                        </div>
                        <div className="flex-1">
                           <div className="text-[11px] font-bold uppercase">LeetCode Top 75</div>
                           <div className="text-[9px] text-black uppercase">Coded Practice Sets</div>
                        </div>
                     </div>
                  </div>
               </CardHeader>
            </Card>
         </div>
      </div>
   );
}
