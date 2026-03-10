import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, CheckCircle2 } from "lucide-react";
import { problemsApi } from "@/services/problemsApi";
import { Input } from "@/components/ui/Input";


// ─── Program Card ─────────────────────────────────────────────────────────────
function ProgramCard({ item, completed, onClick, index }: {
   item: any; completed: boolean; onClick: () => void; index: number;
}) {

   return (
      <div
         onClick={onClick}
         className={`group relative flex items-center gap-6 rounded-2xl border px-6 py-4 cursor-pointer
            transition-all duration-500 overflow-hidden
            ${completed
               ? "bg-emerald-500/5 border-emerald-500/30 hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]"
               : "bg-white border-zinc-200 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.1)]"}
         `}
      >
         {/* Subtle gradient background on hover */}
         <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

         {/* Index (Minimal) */}
         <div className={`shrink-0 text-sm font-black transition-all duration-300 w-6
            ${completed
               ? "text-emerald-400"
               : "text-black group-hover:text-primary"}`}>
            {completed ? <CheckCircle2 className="w-5 h-5" /> : index}
         </div>

         {/* Title Section */}
         <div className="flex-1 min-w-0 relative z-10">
            <p className={`text-base font-bold tracking-tight transition-colors duration-300 truncate
               ${completed ? "text-emerald-400/90" : "text-black group-hover:text-black"}`}>
               {item.title}
            </p>
         </div>
      </div>
   );
}

export function BeginnerPractice() {
   const navigate = useNavigate();
   const [search, setSearch] = useState("");
   const [problems, setProblems] = useState<any[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [completedIds] = useState<Set<number>>(new Set<number>());

   useEffect(() => {
      const fetchProblems = async () => {
         try {
            const data = await problemsApi.getSchoolProblems();
            setProblems(data);
         } catch (e) {
            console.error("Error fetching school problems:", e);
         } finally {
            setIsLoading(false);
         }
      };
      fetchProblems();
   }, []);

   const filtered = problems.filter((p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.tags && p.tags.some((t: string) => t.toLowerCase().includes(search.toLowerCase())))
   );



   return (
      <div className="min-h-screen bg-white">
         <div className="container mx-auto px-4 py-8 max-w-4xl">

            {/* Header Section */}
            <div className="mb-8 flex items-center gap-3">
               <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <svg viewBox="0 0 48 48" className="w-7 h-7" xmlns="http://www.w3.org/2000/svg">
                     <path d="M24 4C13.5 4 14 8.9 14 8.9V14h10.2v1.5H9.5S4 14.9 4 25.5c0 10.5 5.8 10.1 5.8 10.1H13v-4.9s-.2-5.8 5.7-5.8H29s5.5.1 5.5-5.3V9.8S35.4 4 24 4zm-5.5 3.2c1 0 1.8.8 1.8 1.8S19.5 11 18.5 11s-1.8-.8-1.8-1.8.8-1.8 1.8-1.8z" fill="#306998" />
                     <path d="M24 44c10.5 0 10-4.9 10-4.9V34H23.8v-1.5h14.7S44 33.1 44 22.5c0-10.5-5.8-10.1-5.8-10.1H35v4.9s.2 5.8-5.7 5.8H19s-5.5-.1-5.5 5.3v8.8S12.6 44 24 44zm5.5-3.2c-1 0-1.8-.8-1.8-1.8s.8-1.8 1.8-1.8 1.8.8 1.8 1.8-.8 1.8-1.8 1.8z" fill="#FFD43B" />
                  </svg>
               </div>
               <div>
                  <h1 className="text-3xl font-bold tracking-tight text-foreground">Beginner Practice</h1>
                  <p className="text-black text-sm">Learn syntax & symbols • Programs 1–35</p>
               </div>
            </div>

            {/* Search (Premium OLED) */}
            <div className="relative mb-8 group">
               <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-20">
                  <Search className="w-4 h-4 text-black group-focus-within:text-primary transition-colors duration-300" />
               </div>
               <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="e.g Find prime number, swap numbers..."
                  className="pl-11 pr-4 py-6 bg-white border-zinc-200 text-black placeholder:text-black rounded-xl focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all duration-300 group-hover:border-zinc-700 shadow-inner"
               />
               <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300">
                  <span className="text-[10px] text-black font-bold border border-zinc-200 px-1.5 py-0.5 rounded bg-white">ESC</span>
               </div>
            </div>



            {/* ── Result count ── */}
            <div className="flex items-center justify-between mb-3">
               <p className="text-sm text-black">
                  Showing <span className="text-foreground font-semibold">{filtered.length}</span> programs
                  {search && <> matching "<span className="text-primary">{search}</span>"</>}
               </p>
               <div className="flex items-center gap-1 text-xs text-black">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                  <span>{completedIds.size} / {problems.length}</span>
               </div>
            </div>

            {/* ── Program List ── */}
            {isLoading ? (
               <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
                  <p className="text-black text-sm">Loading problems...</p>
               </div>
            ) : filtered.length > 0 ? (
               <div className="flex flex-col gap-2">
                  {filtered.map((item, idx) => (
                     <ProgramCard key={item.id} item={item}
                        index={idx + 1}
                        completed={completedIds.has(item.id)}
                        onClick={() => navigate(`/practice/${item.id}`)} />
                  ))}
               </div>
            ) : (
               <div className="flex flex-col items-center justify-center py-24 text-center">
                  <Search className="w-7 h-7 text-black mb-3" />
                  <h3 className="text-foreground font-semibold mb-1">No programs found</h3>
                  <p className="text-black text-sm">Try a different search term.</p>
               </div>
            )}


         </div>
      </div>
   );
}
