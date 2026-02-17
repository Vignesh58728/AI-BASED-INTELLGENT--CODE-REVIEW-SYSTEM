import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";
import { User, Cpu, Gauge, Sparkles } from "lucide-react";
import { AivisoLogo } from "./AivisoLogo";

const initialCode = [
   { text: "# Team: VIGNESH, VINITH, BAHADOORSHA, GOPAL", color: "text-neutral-400" },
   { text: "# Award: Team Vettukili - Best Program", color: "text-emerald-400" },
   { text: "", color: "text-neutral-400" },
   { text: "class ProjectAnalyzer:", color: "text-blue-400" },
   { text: "    def __init__(self, team, score):", color: "text-indigo-400" },
   { text: "        self.team = team", color: "text-neutral-300" },
   { text: "        self.score = score", color: "text-neutral-300" },
   { text: "        self.is_best = score > 90", color: "text-pink-400" },
   { text: "", color: "text-neutral-400" },
   { text: "    def evaluate(self):", color: "text-indigo-400" },
   { text: "        print(f\"Analyzing: {self.team}\")", color: "text-blue-400" },
   { text: "        if self.is_best:", color: "text-purple-400" },
   { text: "            return \"Verification Success: Team Vettukili Victory\"", color: "text-emerald-400" },
   { text: "        return \"Project exceeds standard\"", color: "text-emerald-400" },
   { text: "", color: "text-neutral-400" },
   { text: "# Initialize with winning team", color: "text-neutral-400" },
   { text: "team = \"VIGNESH, VINITH, BAHADOORSHA, GOPAL\"", color: "text-blue-400" },
   { text: "analyzer = ProjectAnalyzer(team, 95)", color: "text-neutral-300" },
   { text: "", color: "text-neutral-400" },
   { text: "# Run performance check", color: "text-neutral-400" },
   { text: "result = analyzer.evaluate()", color: "text-indigo-400" },
   { text: "print(f\"Result: {result}\")", color: "text-blue-400" },
   { text: "", color: "text-neutral-400" },
   { text: "# Project completion marked", color: "text-neutral-400" },
   { text: "AWARD", color: "text-pink-400" }
];

const reviews = [
   {
      line: 1,
      type: "info",
      message: "Verified Collaborators: VIGNESH, VINITH, BAHADOORSHA & GOPAL.",
      icon: <User className="w-4 h-4 text-blue-500" />,
   },
   {
      line: 4,
      type: "info",
      message: "Strong OOP structure: 'ProjectAnalyzer' class implemented.",
      icon: <Sparkles className="w-4 h-4 text-purple-500" />,
   },
   {
      line: 13,
      type: "success",
      message: "Logic confirmed: Team Vettukili officially takes the award.",
      icon: <Cpu className="w-4 h-4 text-yellow-500" />,
   },
   {
      line: 21,
      type: "perf",
      message: "High-efficiency execution: analyzer.evaluate() call optimized.",
      icon: <Gauge className="w-4 h-4 text-orange-500" />,
   },
];

export function CodePreviewCard() {
   const [activeLine, setActiveLine] = useState(-1);
   const [visibleReviews, setVisibleReviews] = useState<typeof reviews>([]);

   useEffect(() => {
      const interval = setInterval(() => {
         setActiveLine((prev) => {
            const next = (prev + 1) % (initialCode.length + 5); // Add buffer for reset
            if (next === 0) setVisibleReviews([]);

            const review = reviews.find(r => r.line === next);
            if (review) {
               setVisibleReviews(prevReviews => [...prevReviews, review]);
            }

            return next;
         });
      }, 1500);

      return () => clearInterval(interval);
   }, []);

   return (
      <div className="w-full max-w-[1440px] mx-auto my-20 p-4 md:p-8">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

            {/* Left Pane: Glassy Code Editor */}
            <div className="relative bg-black/90 backdrop-blur-2xl rounded-xl overflow-hidden shadow-[0_0_50px_-12px_rgba(233,53,193,0.2)] border border-white/10 group/editor">
               {/* Window Header */}
               <div className="h-12 bg-white/5 border-b border-white/10 flex items-center justify-between px-6">
                  <div className="flex gap-2">
                     <div className="w-3 h-3 rounded-full bg-red-500/50" />
                     <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                     <div className="w-3 h-3 rounded-full bg-green-500/50" />
                  </div>
                  <div className="text-[10px] text-white/30 font-black uppercase tracking-[0.3em] font-sans">
                     v1.0 // review_demo.py
                  </div>
                  <div className="w-12" />
               </div>

               <div className="p-8 font-mono text-sm leading-relaxed overflow-hidden relative min-h-[500px]">
                  {/* Branded Scanner Line */}
                  <motion.div
                     className="absolute left-0 right-0 h-8 z-10 pointer-events-none overflow-hidden"
                     animate={{ top: `${(activeLine % initialCode.length) * 1.6 + 2}rem` }}
                     transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  >
                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#E935C1]/10 to-transparent shadow-[inset_0_0_20px_rgba(233,53,193,0.1)]" />
                     <div className="absolute top-0 bottom-0 left-0 w-[2px] bg-gradient-to-b from-[#E935C1] to-[#FBFF3F]" />
                  </motion.div>

                  {initialCode.map((line, i) => (
                     <div key={i} className="flex gap-8 relative">
                        <span className="w-4 text-black/20 text-right select-none font-black text-[10px] mt-1 italic">{(i + 1).toString().padStart(2, '0')}</span>
                        <span className={cn(
                           line.color,
                           "relative z-0 transition-all duration-500",
                           activeLine === i + 1 ? "opacity-100 scale-[1.02] translate-x-1" : "opacity-40"
                        )}>
                           {line.text}
                        </span>
                     </div>
                  ))}
               </div>
            </div>

            {/* Right Pane: AI Review */}
            <div className="flex flex-col gap-4 min-h-[400px]">
               <div className="flex items-center gap-3 mb-4">
                  <div className="p-0 shrink-0">
                     <AivisoLogo className="w-8 h-8" />
                  </div>
                  <div>
                     <h3 className="text-xl font-bold text-white leading-none tracking-tight" style={{ fontFamily: "'Outfit', system-ui" }}>Aiviso AI</h3>
                     <p className="text-[10px] text-white/40 mt-1.5 uppercase tracking-[0.2em] font-black"></p>
                  </div>
               </div>

               <div className="space-y-4">
                  <AnimatePresence mode="popLayout">
                     {visibleReviews.map((review, i) => (
                        <motion.div
                           key={`${review.line}-${i}`}
                           initial={{ opacity: 0, x: 20, y: 10 }}
                           animate={{ opacity: 1, x: 0, y: 0 }}
                           exit={{ opacity: 0, scale: 0.95 }}
                           className="relative group cursor-default"
                        >
                           {/* Glass Background with Gradient Border Effect */}
                           <div className="absolute -inset-[1px] bg-gradient-to-r from-[#E935C1]/20 via-[#FBFF3F]/20 to-[#E935C1]/20 rounded-2xl blur-sm group-hover:blur-md transition-all duration-500 opacity-50 group-hover:opacity-100" />

                           <div className="relative p-5 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(233,53,191,0.05)] flex items-start gap-4 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                              <div className="mt-1.5 shrink-0">
                                 {review.icon}
                              </div>

                              <div className="flex-1 min-w-0">
                                 <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                       <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400" style={{ fontFamily: "'Outfit', system-ui" }}>Line {review.line}</span>
                                       <div className="h-1 w-1 rounded-full bg-neutral-200" />
                                       <span className={cn(
                                          "text-[9px] font-black uppercase tracking-[0.15em]",
                                          review.type === 'warning' ? 'text-orange-500' :
                                             review.type === 'perf' ? 'text-yellow-600' :
                                                review.type === 'success' ? 'text-green-600' : 'text-blue-500'
                                       )} style={{ fontFamily: "'Outfit', system-ui" }}>
                                          {review.type}
                                       </span>
                                    </div>
                                    <div className="h-1.5 w-1.5 rounded-full bg-[#E935C1] animate-pulse opacity-0 group-hover:opacity-100 transition-opacity" />
                                 </div>
                                 <p className="text-sm text-white font-semibold leading-snug line-clamp-2" style={{ fontFamily: "'Outfit', system-ui" }}>
                                    {review.message}
                                 </p>
                              </div>
                           </div>
                        </motion.div>
                     ))}
                  </AnimatePresence>

                  {visibleReviews.length === 0 && (
                     <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-white/5 rounded-2xl relative overflow-hidden min-h-[280px]">
                        {/* Scanning Beam Animation */}
                        <motion.div
                           initial={{ translateY: "-100%" }}
                           animate={{ translateY: "300%" }}
                           transition={{
                              duration: 3,
                              repeat: Infinity,
                              ease: "linear",
                           }}
                           className="absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-indigo-500/10 to-transparent z-0"
                        />

                        <div className="relative z-10 flex flex-col items-center">
                           {/* Multi-layered Rotating HUD */}
                           <div className="relative w-24 h-24 mb-6">
                              {/* Outer Dashed Ring */}
                              <motion.div
                                 animate={{ rotate: 360 }}
                                 transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                 className="absolute inset-0 rounded-full border-2 border-dashed border-indigo-500/20"
                              />
                              {/* Inner Solid Ring */}
                              <motion.div
                                 animate={{ rotate: -360 }}
                                 transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                 className="absolute inset-2 rounded-full border border-white/10 border-t-indigo-500/40"
                              />
                              {/* Center Pulsing Orb */}
                              <div className="absolute inset-6 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-sm animate-pulse flex items-center justify-center">
                                 <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.8)]" />
                              </div>
                           </div>

                           {/* Dynamic Scanning Text */}
                           <div className="flex flex-col items-center gap-2">
                              <motion.p
                                 animate={{ opacity: [0.4, 1, 0.4] }}
                                 transition={{ duration: 2, repeat: Infinity }}
                                 className="text-xs text-white uppercase tracking-[0.3em] font-black"
                                 style={{ fontFamily: "'Outfit', system-ui" }}
                              >
                                 Scanning Code
                              </motion.p>
                              <div className="flex gap-1">
                                 {[0, 1, 2].map((i) => (
                                    <motion.div
                                       key={i}
                                       animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                                       transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                                       className="w-1 h-1 rounded-full bg-indigo-500"
                                    />
                                 ))}
                              </div>
                           </div>
                        </div>
                     </div>
                  )}
               </div>
            </div>
         </div>
      </div>
   );
}
