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
import { motion } from "framer-motion";

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
         stats: "0% Done",
         isLocked: false,
         reqText: ""
      },
      {
         title: "Intermediate",
         desc: "Level Up your Skills",
         icon: intermediateIcon,
         path: "/school/intermediate",
         stats: "0% Done",
         isLocked: false,
         reqText: "Complete Beginner to Unlock"
      },
      {
         title: "Advanced",
         desc: "Master Complex Logic",
         icon: advancedIcon,
         path: "/school/advanced",
         stats: "0% Done",
         isLocked: false,
         reqText: "Complete Intermediate to Unlock"
      },
      {
         title: "Mock Exams",
         desc: "3hr Full Simulation",
         icon: careerIcon,
         path: "/school/exams",
         stats: "Assessment",
         isLocked: false,
         reqText: "Complete Advanced to Unlock"
      }
   ];
   
   const weeklyPath = [
      { week: "Week 1", topic: "Intro to Python Syntax", detail: "Variables, Comments, and Print statements." },
      { week: "Week 2", topic: "Numbers & Logic", detail: "Integers, Floats, and Comparison Operators." },
      { week: "Week 3", topic: "Strings & Lists", detail: "String methods and Basic List operations." },
      { week: "Week 4", topic: "Control Flow", detail: "If, Elif, Else statements and Boolean Logic." },
      { week: "Week 5", topic: "Loops & Iteration", detail: "For loops, While loops, and breaking logic." },
      { week: "Week 6", topic: "Functions & Scope", detail: "Defining functions and passing arguments." },
      { week: "Week 7", topic: "Data Structures", detail: "Deep dive into Tuples, Sets, and Dictionaries." },
      { week: "Week 8", topic: "File I/O", detail: "Reading from and writing to external files." },
   ];

   return (
      <div className="min-h-screen bg-white text-black space-y-8 p-8" style={{ fontFamily: "'Satisfy', cursive" }}>
         <div className="flex items-center justify-between">
            <div>
               <h1 className="text-5xl font-bold tracking-tight mb-2 text-black" style={{ fontFamily: "'Satisfy', cursive" }}>School Dashboard</h1>
               <p className="text-black text-sm font-medium">Solve all Beginner problems to unlock the next level.</p>
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
                        <CardTitle className="text-sm font-bold tracking-wider text-black">{item.title}</CardTitle>
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

         {/* Weekly Roadmap Section */}
         <div className="pt-12 pb-24">
            <div className="mb-8">
               <h2 className="text-4xl font-bold tracking-tight mb-2 text-black" style={{ fontFamily: "'Satisfy', cursive" }}>Python Mastery Path</h2>
               <p className="text-zinc-400 text-sm font-bold uppercase tracking-widest leading-relaxed">A sequence of 8-week milestones for deep maste</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
               {weeklyPath.map((item, i) => (
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
