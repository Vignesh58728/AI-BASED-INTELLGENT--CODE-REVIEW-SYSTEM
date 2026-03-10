import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { SkillChart } from "@/components/SkillChart";
import { TrendingDown, Zap, Shield, Target } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { fetchAiBackground } from "@/services/unsplashService";

export function SkillAnalysis() {
   const [unsplashBg, setUnsplashBg] = useState<string | null>(null);

   useEffect(() => {
      const getBg = async () => {
         const bg = await fetchAiBackground();
         if (bg) setUnsplashBg(bg);
      };
      getBg();
   }, []);

   const skillGaps = [
      { name: 'Dynamic Programming', gap: -28, status: 'Critical', icon: Zap, color: 'text-rose-500' },
      { name: 'Memory Management', gap: -15, status: 'Moderate', icon: Shield, color: 'text-amber-500' },
      { name: 'System Design', gap: -12, status: 'Improving', icon: Target, color: 'text-emerald-500' },
   ];

   return (
      <div className="min-h-screen bg-white p-8 space-y-10 relative overflow-hidden">
         {/* Premium background layer (Unsplash) */}
         {unsplashBg && (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 0.12 }}
               className="absolute inset-0 z-0 pointer-events-none"
               style={{ 
                  backgroundImage: `url(${unsplashBg})`, 
                  backgroundSize: 'cover', 
                  backgroundPosition: 'center',
                  filter: 'grayscale(100%)'
               }}
            />
         )}
         
         <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/40 via-white/90 to-white z-[1] pointer-events-none" />

         <header className="relative z-10">
            <h1 className="text-4xl font-black text-black uppercase tracking-tight" style={{ fontFamily: "'Syncopate', sans-serif" }}>
               Intelligence <span className="text-primary">Audit</span>
            </h1>
            <p className="text-slate-400 font-medium mt-2">Precision analysis of your algorithmic proficiency and skill gaps.</p>
         </header>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 relative z-10">
            {/* Skill Radar Chart */}
            <div className="lg:col-span-2">
               <SkillChart />
            </div>

            {/* Gap Analysis Card */}
            <Card className="bg-zinc-900 border-zinc-800 shadow-2xl rounded-[32px] overflow-hidden">
               <CardHeader className="p-8 pb-4">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-2">
                     <TrendingDown size={14} className="text-rose-500" /> Improvement Vector
                  </div>
                  <CardTitle className="text-2xl font-black text-white uppercase tracking-tight">Skill Gaps</CardTitle>
               </CardHeader>
               <CardContent className="p-8 pt-0 space-y-6">
                  {skillGaps.map((skill: any, idx: number) => (
                     <motion.div 
                        key={idx}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-2xl border border-zinc-700/50 group hover:border-primary/30 transition-all"
                     >
                        <div className="flex items-center gap-4">
                           <div className={`p-3 rounded-xl bg-zinc-900 ${skill.color}`}>
                              <skill.icon size={18} />
                           </div>
                           <div>
                              <p className="text-sm font-bold text-white">{skill.name}</p>
                              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{skill.status}</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className={`text-lg font-black ${skill.color}`}>{skill.gap}%</p>
                        </div>
                     </motion.div>
                  ))}

                  <button className="w-full py-4 mt-4 bg-primary text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                     Generated Targeted Roadmap
                  </button>
               </CardContent>
            </Card>
         </div>
         
         {/* Bottom Insights */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            <Card className="bg-white border-zinc-100 p-8 rounded-3xl shadow-sm">
               <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Accuracy Rate</h4>
               <p className="text-3xl font-black text-black">88.4%</p>
               <div className="h-1 bg-slate-100 rounded-full mt-4 overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[88%]" />
               </div>
            </Card>
            <Card className="bg-white border-zinc-100 p-8 rounded-3xl shadow-sm">
               <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Review Velocity</h4>
               <p className="text-3xl font-black text-black">42 <span className="text-sm font-medium text-slate-400 font-sans tracking-normal">PR/wk</span></p>
               <div className="h-1 bg-slate-100 rounded-full mt-4 overflow-hidden">
                  <div className="h-full bg-blue-500 w-[65%]" />
               </div>
            </Card>
            <Card className="bg-white border-zinc-100 p-8 rounded-3xl shadow-sm">
               <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Consistency Index</h4>
               <p className="text-3xl font-black text-black">High</p>
               <div className="h-1 bg-slate-100 rounded-full mt-4 overflow-hidden">
                  <div className="h-full bg-orange-500 w-[92%]" />
               </div>
            </Card>
         </div>
      </div>
   );
}
