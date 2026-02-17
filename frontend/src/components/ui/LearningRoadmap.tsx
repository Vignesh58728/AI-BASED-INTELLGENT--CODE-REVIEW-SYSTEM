"use client";

import { motion } from "framer-motion";
import { Brain, Zap, ShieldCheck, User, Cpu } from "lucide-react";
import { cn } from "../../lib/utils";

const levels = [
   {
      id: 1,
      title: "Level 1: Basics of Logic",
      desc: "Master foundational rules, syntax consistency, and structural integrity.",
      icon: <Brain className="w-6 h-6" />,
      color: "from-blue-500 to-cyan-400",
      shadow: "shadow-blue-500/20"
   },
   {
      id: 2,
      title: "Level 2: Optimization",
      desc: "Learn to write high-performance, efficient, and scalable code structures.",
      icon: <Zap className="w-6 h-6" />,
      color: "from-purple-500 to-pink-500",
      shadow: "shadow-purple-500/20"
   },
   {
      id: 3,
      title: "Level 3: Security Review",
      desc: "Deep dive into modern security patterns and vulnerability prevention.",
      icon: <ShieldCheck className="w-6 h-6" />,
      color: "from-orange-500 to-red-500",
      shadow: "shadow-orange-500/20"
   },
];

export function LearningRoadmap() {
   return (
      <div className="w-full max-w-4xl mx-auto my-32 px-4 relative">
         <div className="text-center mb-20">
            <h3 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter" style={{ fontFamily: "'Outfit', system-ui" }}>
               The Learning Journey
            </h3>
            <p className="text-white/50 font-bold max-w-lg mx-auto" style={{ fontFamily: "'Outfit', system-ui" }}>
               Follow our curated path to become an Elite Developer.
            </p>
         </div>

         <div className="relative space-y-24">
            {/* Connection Line */}
            <div className="absolute left-[27px] md:left-1/2 top-4 bottom-4 w-px bg-gradient-to-b from-blue-200 via-purple-200 to-orange-200 -translate-x-1/2 hidden md:block" />

            {levels.map((level, i) => (
               <motion.div
                  key={level.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: i * 0.2 }}
                  className={cn(
                     "flex flex-col md:flex-row items-center gap-8 md:gap-16",
                     i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  )}
               >
                  {/* Content Card */}
                  <div className={cn(
                     "flex-1 p-8 rounded-[2rem] bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl transition-all duration-500 hover:scale-[1.02]",
                     level.shadow
                  )}>
                     <div className={cn(
                        "w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white mb-6",
                        level.color
                     )}>
                        {level.icon}
                     </div>
                     <h4 className="text-xl font-black text-white mb-3 uppercase tracking-tight">{level.title}</h4>
                     <p className="text-white/60 font-medium leading-relaxed" style={{ fontFamily: "'Outfit', system-ui" }}>
                        {level.desc}
                     </p>
                  </div>

                  {/* Center Dot */}
                  <div className="relative z-10">
                     <div className={cn(
                        "w-16 h-16 rounded-2xl bg-[#0F0F1A] border-2 border-white/5 flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-all duration-500 hover:scale-110 group",
                        i % 2 === 0 ? "border-blue-500/30" : "border-purple-500/30"
                     )}>
                        <div className={cn(
                           "p-3 rounded-xl bg-white/5",
                           i % 2 === 0 ? "text-blue-500" : "text-purple-500"
                        )}>
                           {i % 2 === 0 ? <User className="w-6 h-6" /> : <Cpu className="w-6 h-6" />}
                        </div>
                     </div>
                  </div>

                  {/* Spacer for reverse layout alignment */}
                  <div className="flex-1 hidden md:block" />
               </motion.div>
            ))}
         </div>
      </div>
   );
}
