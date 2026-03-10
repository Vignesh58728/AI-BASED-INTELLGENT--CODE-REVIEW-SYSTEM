import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/Input";
import { Search, CheckCircle2, Lock } from "lucide-react";
import intermediateImg from "@/assets/images/intermediate-level.png";

// ─── Types ────────────────────────────────────────────────────────────────────
interface ProgramItem {
   id: number;
   title: string;
   tags: string[];
}

// ─── Intermediate Programs (36–70) ───────────────────────────────────────────
const PROGRAMS: ProgramItem[] = [
   { id: 36, title: "Check Prime Number", tags: ["math", "prime"] },
   { id: 37, title: "Print Primes from 1 to N", tags: ["math", "prime", "loops"] },
   { id: 38, title: "Fibonacci Series", tags: ["series", "loops"] },
   { id: 39, title: "Armstrong Number", tags: ["math", "digits"] },
   { id: 40, title: "LCM of Two Numbers", tags: ["math"] },
   { id: 41, title: "HCF of Two Numbers", tags: ["math"] },
   { id: 42, title: "GCD Using Function", tags: ["functions", "math"] },
   { id: 43, title: "Multiplication Table", tags: ["loops", "math"] },
   { id: 44, title: "Count Vowels in String", tags: ["strings", "loops"] },
   { id: 45, title: "Reverse a String", tags: ["strings"] },
   { id: 46, title: "String Palindrome Check", tags: ["strings", "logic"] },
   { id: 47, title: "Count Words in Sentence", tags: ["strings"] },
   { id: 48, title: "String to Uppercase", tags: ["strings", "conversion"] },
   { id: 49, title: "String to Lowercase", tags: ["strings", "conversion"] },
   { id: 50, title: "Remove Spaces from String", tags: ["strings"] },
   { id: 51, title: "String Length Without len()", tags: ["strings", "loops"] },
   { id: 52, title: "Sort a List of Numbers", tags: ["lists", "sorting"] },
   { id: 53, title: "Maximum in a List", tags: ["lists", "comparison"] },
   { id: 54, title: "Minimum in a List", tags: ["lists", "comparison"] },
   { id: 55, title: "Second Largest Number", tags: ["lists", "sorting"] },
   { id: 56, title: "Remove Duplicates from List", tags: ["lists", "sets"] },
   { id: 57, title: "Merge Two Lists", tags: ["lists"] },
   { id: 58, title: "Frequency of List Elements", tags: ["lists", "dictionary"] },
   { id: 59, title: "Leap Year Check", tags: ["conditions", "date"] },
   { id: 60, title: "Right Triangle Star Pattern", tags: ["patterns", "loops"] },
   { id: 61, title: "Inverted Star Pattern", tags: ["patterns", "loops"] },
   { id: 62, title: "Sum of Even Numbers in List", tags: ["lists", "math"] },
   { id: 63, title: "Count Positive Numbers in List", tags: ["lists", "conditions"] },
   { id: 64, title: "Calculator Using if-else", tags: ["if-else", "input"] },
   { id: 65, title: "Voting Eligibility Check", tags: ["conditions"] },
   { id: 66, title: "Decimal to Binary", tags: ["conversion", "binary"] },
   { id: 67, title: "Binary to Decimal", tags: ["conversion", "binary"] },
   { id: 68, title: "ASCII Value of Character", tags: ["strings", "ascii"] },
   { id: 69, title: "Vowel or Consonant Check", tags: ["strings", "conditions"] },
   { id: 70, title: "Sum of Matrix Elements", tags: ["matrix", "2D-list"] },
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
               : "bg-white border-zinc-200 hover:border-amber-500/30 hover:shadow-[0_0_20px_rgba(245,158,11,0.1)]"}
         `}
      >
         {/* Subtle gradient background on hover */}
         <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

         {/* Index (Minimal) */}
         <div className={`shrink-0 text-sm font-black transition-all duration-300 w-6
            ${completed
               ? "text-emerald-400"
               : "text-black group-hover:text-amber-400"}`}>
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
export function IntermediatePractice() {
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
               <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                  <img src={intermediateImg} alt="Intermediate" className="w-7 h-7 object-contain" />
               </div>
               <div>
                  <h1 className="text-3xl font-bold tracking-tight text-foreground">Intermediate Practice</h1>
                  <p className="text-black text-sm">Level Up — Functions &amp; Arrays • Programs 36–70</p>
               </div>
            </div>

            {/* Search (Premium OLED) */}
            <div className="relative mb-8 group">
               <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-20">
                  <Search className="w-4 h-4 text-black group-focus-within:text-amber-400 transition-colors duration-300" />
               </div>
               <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Query programs or filter by tags..."
                  className="pl-11 pr-4 py-6 bg-white border-zinc-200 text-black placeholder:text-black rounded-xl focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all duration-300 group-hover:border-zinc-700 shadow-inner"
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
                  <span>Complete all 35 Beginner programs to unlock this level. Complete all Intermediate programs to unlock Advanced.</span>
               </div>
            </div>

         </div>
      </div>
   );
}
