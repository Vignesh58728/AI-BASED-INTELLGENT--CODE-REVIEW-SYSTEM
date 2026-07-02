import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { codeforcesApi, CFProblem } from "@/services/codeforcesService";
import {
   Card,
   CardHeader,
   CardTitle,
   CardDescription
} from "@/components/ui/Card";
import {
   Search,
   Filter,
   ExternalLink,
   Loader2,
   Trophy,
   Code,
   TrendingUp
} from "lucide-react";

export function CodeforcesChallenges() {
   const navigate = useNavigate();
   const [problems, setProblems] = useState<CFProblem[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [searchTerm, setSearchTerm] = useState("");
   const [filter, setFilter] = useState("all");

   useEffect(() => {
      const fetchCFData = async () => {
         setIsLoading(true);
         const data = await codeforcesApi.getProblems(['implementation', 'data structures', 'algorithms', 'greedy', 'dp']);
         if (data) {
            setProblems(data.problems);
         }
         setIsLoading(false);
      };
      fetchCFData();
   }, []);

   const filteredProblems = problems.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      if (filter === "all") return matchesSearch;
      if (filter === "easy") return (p.rating || 0) < 1200 && matchesSearch;
      if (filter === "medium") return (p.rating || 0) >= 1200 && (p.rating || 0) < 1800 && matchesSearch;
      if (filter === "hard") return (p.rating || 0) >= 1800 && matchesSearch;
      return matchesSearch;
   });

   return (
      <div className="min-h-screen bg-white text-black p-8 space-y-8">
         {/* Header */}
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
               <h1 className="text-3xl font-bold tracking-[0.2em] uppercase mb-2 flex items-center gap-3" style={{ fontFamily: "'Syncopate', sans-serif" }}>
                  <TrendingUp className="text-primary w-8 h-8" />
                  Codeforces <span className="text-primary">Live</span>
               </h1>
               <p className="text-black text-sm font-medium">Real-time industry problems from Codeforces Global Problemset.</p>
            </div>

            <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-zinc-200">
               <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-lg">
                  <span className="text-[10px] font-black uppercase text-primary tracking-widest">{problems.length} Problems Available</span>
               </div>
            </div>
         </div>

         {/* Search & Filters */}
         <div className="grid md:grid-cols-[1fr,auto,auto] gap-4">
            <div className="relative group">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black group-focus-within:text-primary transition-colors" size={18} />
               <input
                  type="text"
                  placeholder="Search real-time challenges..."
                  className="w-full bg-white border border-zinc-200 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-all font-medium"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>

            <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-zinc-200">
               {["all", "easy", "medium", "hard"].map((f) => (
                  <button
                     key={f}
                     onClick={() => setFilter(f)}
                     className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'text-black hover:text-black'
                        }`}
                  >
                     {f}
                  </button>
               ))}
            </div>
         </div>

         {/* Content Area */}
         {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
               <Loader2 className="animate-spin text-primary w-12 h-12" />
               <p className="text-black font-bold uppercase tracking-[0.2em] animate-pulse">Fetching Real-time Problemset...</p>
            </div>
         ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {filteredProblems.slice(0, 100).map((problem, idx) => (
                  <Card
                     key={`${problem.contestId}-${problem.index}`}
                     className="bg-white border-zinc-200 hover:border-primary/30 group transition-all duration-500 hover:bg-zinc-50 relative overflow-hidden"
                  >
                     <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-primary/20 p-2 rounded-lg backdrop-blur-md">
                           <Trophy size={14} className="text-primary" />
                        </div>
                     </div>

                     <CardHeader className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                           <div className="px-2 py-0.5 rounded bg-zinc-100 border border-zinc-700 text-[9px] font-black text-zinc-600 uppercase">
                              #{problem.contestId}{problem.index}
                           </div>
                           {problem.rating && (
                              <div className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${problem.rating < 1200 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                                 problem.rating < 1800 ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                                    'bg-rose-500/10 border-rose-500/20 text-rose-500'
                                 }`}>
                                 Rating: {problem.rating}
                              </div>
                           )}
                        </div>

                        <CardTitle className="text-lg font-bold line-clamp-1 mb-2 group-hover:text-primary transition-colors">
                           {problem.name}
                        </CardTitle>

                        <div className="flex flex-wrap gap-1.5 mb-6 min-h-[48px]">
                           {problem.tags.slice(0, 3).map(tag => (
                              <span key={tag} className="text-[10px] text-black bg-zinc-50 px-2 py-1 rounded border border-zinc-100 lowercase italic font-medium">#{tag}</span>
                           ))}
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
                           <div className="flex items-center gap-2 text-black">
                              <Code size={14} />
                              <span className="text-[10px] font-bold uppercase tracking-widest">Global Practice</span>
                           </div>
                           <button
                              onClick={() => navigate(`/practice/cf-${problem.contestId}-${problem.index}`)}
                              className="bg-zinc-100 hover:bg-primary hover:text-black p-2 rounded-xl transition-all duration-300"
                           >
                              <ExternalLink size={16} />
                           </button>
                        </div>
                     </CardHeader>
                  </Card>
               ))}
            </div>
         )}

         {filteredProblems.length === 0 && !isLoading && (
            <div className="text-center py-20 bg-white/20 rounded-3xl border border-dashed border-zinc-200">
               <p className="text-black font-bold uppercase tracking-widest">No matching problems found in live feed.</p>
            </div>
         )}
      </div>
   );
}
