import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { leetcodeApi, LeetCodeProblem } from "@/services/leetcodeService";
import {
   Card,
   CardHeader,
   CardTitle,
   CardDescription
} from "@/components/ui/Card";
import {
   Search,
   Loader2,
   Trophy,
   Code,
   Send,
   Star
} from "lucide-react";

export function LeetCodeChallenges() {
   const navigate = useNavigate();
   const [problems, setProblems] = useState<LeetCodeProblem[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [searchTerm, setSearchTerm] = useState("");
   const [filter, setFilter] = useState("all");

   useEffect(() => {
      const fetchLCData = async () => {
         setIsLoading(true);
         try {
            const { problemsApi } = await import("@/services/problemsApi");
            const data = await problemsApi.getLeetCodeProblems(0, 3000);
            if (data) {
               setProblems(data);
            }
         } catch (e) {
            console.error("Failed to fetch internal LC data:", e);
         } finally {
            setIsLoading(false);
         }
      };
      fetchLCData();
   }, []);

   const filteredProblems = problems.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
      if (filter === "all") return matchesSearch;
      return p.difficulty.toLowerCase() === filter.toLowerCase() && matchesSearch;
   });

   return (
      <div className="min-h-screen bg-white text-black p-8 space-y-8">
         {/* Header */}
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
               <h1 className="text-3xl font-bold tracking-[0.2em] uppercase mb-2 flex items-center gap-3" style={{ fontFamily: "'Syncopate', sans-serif" }}>
                  <Star className="text-yellow-500 w-8 h-8" />
                  LeetCode <span className="text-primary">Master</span>
               </h1>
               <p className="text-black text-sm font-medium">Native LeetCode challenges with AI-powered reviews.</p>
            </div>

            <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-zinc-200">
               <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-lg text-primary text-[10px] font-black uppercase tracking-widest">
                  {problems.length} Questions Loaded
               </div>
            </div>
         </div>

         {/* Search & Filters */}
         <div className="grid md:grid-cols-[1fr,auto] gap-4">
            <div className="relative group">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black group-focus-within:text-primary transition-colors" size={18} />
               <input
                  type="text"
                  placeholder="Search LeetCode problems..."
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
                     className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-primary text-black shadow-lg' : 'text-black hover:text-black'
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
               <p className="text-black font-bold uppercase tracking-[0.2em]">Syncing LeetCode Bank...</p>
            </div>
         ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {filteredProblems.map((problem) => (
                  <Card
                     key={problem.titleSlug}
                     className="bg-white border-zinc-200 hover:border-primary/30 group transition-all duration-500 hover:bg-zinc-50 relative overflow-hidden cursor-pointer"
                     onClick={() => navigate(`/practice/lc-${problem.titleSlug}`)}
                  >
                     <CardHeader className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                           <div className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${problem.difficulty.toLowerCase() === 'easy' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                              problem.difficulty.toLowerCase() === 'medium' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                                 'bg-rose-500/10 border-rose-500/20 text-rose-500'
                              }`}>
                              {problem.difficulty}
                           </div>
                           <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                              <Send size={14} className="text-primary" />
                           </div>
                        </div>

                        <CardTitle className="text-lg font-bold line-clamp-1 mb-2 group-hover:text-primary transition-colors">
                           {problem.title}
                        </CardTitle>

                        <CardDescription className="text-[11px] text-black font-medium mb-4">
                           Problem Slug: {problem.titleSlug}
                        </CardDescription>

                        <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
                           <div className="flex items-center gap-2 text-black">
                              <Code size={14} />
                              <span className="text-[10px] font-bold uppercase tracking-widest">Internal Practice</span>
                           </div>
                           <Trophy size={14} className="text-black group-hover:text-primary/50 transition-colors" />
                        </div>
                     </CardHeader>
                  </Card>
               ))}
            </div>
         )}
      </div>
   );
}
