import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/Input";
import { Search, CheckCircle2, Lock } from "lucide-react";
import advancedImg from "@/assets/images/career-path.png";

// ─── Types ────────────────────────────────────────────────────────────────────
interface ProgramItem {
   id: number;
   title: string;
   tags: string[];
}

// ─── Advanced Programs (71–100) ───────────────────────────────────────────────
const PROGRAMS: ProgramItem[] = [
   { id: 71, title: "Transpose a Matrix", tags: ["matrix", "2D-list"] },
   { id: 72, title: "Add Two Matrices", tags: ["matrix"] },
   { id: 73, title: "Multiply Two Matrices", tags: ["matrix", "algorithms"] },
   { id: 74, title: "Largest Element in Matrix", tags: ["matrix", "comparison"] },
   { id: 75, title: "Linear Search", tags: ["searching", "algorithms"] },
   { id: 76, title: "Binary Search", tags: ["searching", "algorithms"] },
   { id: 77, title: "Bubble Sort", tags: ["sorting", "algorithms"] },
   { id: 78, title: "Selection Sort", tags: ["sorting", "algorithms"] },
   { id: 79, title: "Insertion Sort", tags: ["sorting", "algorithms"] },
   { id: 80, title: "Find Duplicates in List", tags: ["lists", "sets"] },
   { id: 81, title: "Word Frequency Counter", tags: ["strings", "dictionary"] },
   { id: 82, title: "Anagram Check", tags: ["strings", "sorting"] },
   { id: 83, title: "Common Elements in Two Lists", tags: ["lists", "sets"] },
   { id: 84, title: "Find Missing Number in List", tags: ["lists", "math"] },
   { id: 85, title: "Rotate List Left", tags: ["lists", "rotation"] },
   { id: 86, title: "Rotate List Right", tags: ["lists", "rotation"] },
   { id: 87, title: "Stack Using List", tags: ["data-structures", "stack"] },
   { id: 88, title: "Queue Using List", tags: ["data-structures", "queue"] },
   { id: 89, title: "Balanced Parentheses Check", tags: ["stack", "strings"] },
   { id: 90, title: "Longest Word in Sentence", tags: ["strings", "loops"] },
   { id: 91, title: "Count Uppercase & Lowercase", tags: ["strings", "loops"] },
   { id: 92, title: "Random Number Guessing Game", tags: ["random", "game"] },
   { id: 93, title: "Password Validator", tags: ["strings", "regex"] },
   { id: 94, title: "Caesar Cipher Encoder", tags: ["strings", "encryption"] },
   { id: 95, title: "Count Prime Factors", tags: ["math", "prime"] },
   { id: 96, title: "Flatten Nested List", tags: ["lists", "recursion"] },
   { id: 97, title: "Find All Permutations", tags: ["strings", "recursion"] },
   { id: 98, title: "Power Set of a List", tags: ["lists", "recursion"] },
   { id: 99, title: "Number to Words Converter", tags: ["strings", "logic"] },
   { id: 100, title: "Simple Encryption / Decryption", tags: ["strings", "security"] },
];

// ─── Topic Emoji map ──────────────────────────────────────────────────────────

// ─── Program Card ─────────────────────────────────────────────────────────────
function ProgramCard({ item, completed, onClick, index }: {
   item: ProgramItem; completed: boolean; onClick: () => void; index: number;
}) {

   return (
      <div
         onClick={onClick}
         className={`group relative flex items-center gap-6 rounded-2xl border px-6 py-4 cursor-pointer
            transition-all duration-500 overflow-hidden
            ${completed
               ? "bg-emerald-500/5 border-emerald-500/30 hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]"
               : "bg-white border-zinc-200 hover:border-rose-500/30 hover:shadow-[0_0_20px_rgba(244,63,94,0.1)]"}
         `}
      >
         {/* Subtle gradient background on hover */}
         <div className="absolute inset-0 bg-gradient-to-r from-rose-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

         {/* Index (Minimal) */}
         <div className={`shrink-0 text-sm font-black transition-all duration-300 w-6
            ${completed
               ? "text-emerald-400"
               : "text-black group-hover:text-rose-400"}`}>
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

// ─── Main Component ───────────────────────────────────────────────────────────
export function AdvancedPractice() {
   const navigate = useNavigate();
   const [search, setSearch] = useState("");
   const [completedIds] = useState<Set<number>>(new Set<number>());

   const filtered = PROGRAMS.filter((p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
   );

   const completedCount = PROGRAMS.filter((p) => completedIds.has(p.id)).length;

   return (
      <div className="min-h-screen bg-white">
         <div className="container mx-auto px-4 py-8 max-w-7xl">

            {/* Header */}
            <div className="mb-8 flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                  <img src={advancedImg} alt="Advanced" className="w-7 h-7 object-contain" />
               </div>
               <div>
                  <h1 className="text-3xl font-bold tracking-tight text-foreground">Advanced Practice</h1>
                  <p className="text-black text-sm">Master — OOPs &amp; Algorithms • Programs 71–100</p>
               </div>
            </div>

            {/* Search (Premium OLED) */}
            <div className="relative mb-8 group">
               <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-20">
                  <Search className="w-4 h-4 text-black group-focus-within:text-rose-400 transition-colors duration-300" />
               </div>
               <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Query programs or filter by tags..."
                  className="pl-11 pr-4 py-6 bg-white border-zinc-200 text-black placeholder:text-black rounded-xl focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/20 transition-all duration-300 group-hover:border-zinc-700 shadow-inner"
               />
               <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300">
                  <span className="text-[10px] text-black font-bold border border-zinc-200 px-1.5 py-0.5 rounded bg-white">ESC</span>
               </div>
            </div>

            {/* Count */}
            <div className="flex items-center justify-between mb-4">
               <p className="text-sm text-black">
                  Showing <span className="text-foreground font-semibold">{filtered.length}</span> programs
               </p>
               <div className="flex items-center gap-1 text-xs text-black">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{completedCount} / {PROGRAMS.length} completed</span>
               </div>
            </div>

            {/* Horizontal List */}
            {filtered.length > 0 ? (
               <div className="flex flex-col gap-3">
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

            {/* Lock hint */}
            <div className="mt-10 p-4 rounded-xl border border-border bg-card/50">
               <p className="text-xs text-black font-medium mb-2 uppercase tracking-wider">Unlock Requirement</p>
               <div className="flex items-center gap-2 text-xs text-black">
                  <Lock className="w-3.5 h-3.5 shrink-0" />
                  <span>Complete all 35 Intermediate programs to unlock this Advanced level.</span>
               </div>
            </div>

         </div>
      </div>
   );
}
