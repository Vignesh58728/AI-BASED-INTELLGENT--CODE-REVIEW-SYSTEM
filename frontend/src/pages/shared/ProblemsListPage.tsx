import { useState } from 'react';
import { Input } from "@/components/ui/Input";
import { Search, CheckCircle2, Circle } from "lucide-react";
import { useNavigate } from 'react-router-dom';

interface Problem {
   id: string;
   title: string;
   difficulty: string;
   status: string;
}

const PROBLEMS: Problem[] = [
   { id: '1', title: 'Two Sum', difficulty: 'Easy', status: 'Todo' },
   { id: '2', title: 'Add Two Numbers', difficulty: 'Medium', status: 'Todo' },
   { id: '3', title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', status: 'Todo' },
   { id: '4', title: 'Median of Two Sorted Arrays', difficulty: 'Hard', status: 'Todo' },
   { id: '5', title: 'Longest Palindromic Substring', difficulty: 'Medium', status: 'Todo' },
   { id: '6', title: 'Zigzag Conversion', difficulty: 'Medium', status: 'Todo' },
   { id: '7', title: 'Reverse Integer', difficulty: 'Medium', status: 'Todo' },
   { id: '8', title: 'String to Integer (atoi)', difficulty: 'Medium', status: 'Todo' },
   { id: '9', title: 'Palindrome Number', difficulty: 'Easy', status: 'Todo' },
   { id: '10', title: 'Regular Expression Matching', difficulty: 'Hard', status: 'Todo' },
];

export function ProblemsListPage() {
   const navigate = useNavigate();
   const [searchTerm, setSearchTerm] = useState('');

   const getDifficultyColor = (difficulty: string) => {
      switch (difficulty.toLowerCase()) {
         case 'easy': return 'text-green-500 bg-green-500/10 border-green-500/20';
         case 'medium': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
         case 'hard': return 'text-red-500 bg-red-500/10 border-red-500/20';
         default: return '';
      }
   };

   return (
      <div className="min-h-screen bg-black text-white p-8 space-y-12">
         {/* Minimal Header */}
         <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-black uppercase tracking-tighter italic">Challenge Vault</h1>
         </div>

         {/* Search Only */}
         <div className="max-w-xl group relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
               placeholder="Filter challenges..."
               className="pl-10 bg-zinc-900/50 border-white/5 focus:border-primary/50 transition-all rounded-full h-12"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>

         {/* Minimalist Table */}
         <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
               <thead>
                  <tr className="border-b border-white/5">
                     <th className="h-12 px-6 text-left font-black text-zinc-500 text-[10px] uppercase tracking-[0.2em] w-12">Status</th>
                     <th className="h-12 px-6 text-left font-black text-zinc-500 text-[10px] uppercase tracking-[0.2em]">Title</th>
                     <th className="h-12 px-6 text-right font-black text-zinc-500 text-[10px] uppercase tracking-[0.2em]">Difficulty</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  {PROBLEMS.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase())).map((problem) => (
                     <tr
                        key={problem.id}
                        className="group hover:bg-white/[0.02] transition-colors cursor-pointer"
                        onClick={() => navigate(`/problem/${problem.id}`)}
                     >
                        <td className="px-6 py-6">
                           {problem.status === 'Solved' ? (
                              <CheckCircle2 className="h-5 w-5 text-green-500" />
                           ) : (
                              <Circle className="h-5 w-5 text-zinc-900 group-hover:text-zinc-700" />
                           )}
                        </td>
                        <td className="px-6 py-6">
                           <span className="text-lg font-bold group-hover:text-primary transition-colors italic">
                              {problem.id}. {problem.title}
                           </span>
                        </td>
                        <td className="px-6 py-6 text-right">
                           <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getDifficultyColor(problem.difficulty)}`}>
                              {problem.difficulty}
                           </span>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
   );
}
