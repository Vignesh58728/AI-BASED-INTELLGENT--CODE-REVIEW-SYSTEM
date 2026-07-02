
import { ProblemCard } from "@/components/practice/ProblemCard";

const securityTasks = [
   { id: "sec1", title: "Cross-Site Scripting (XSS) Prevention", difficulty: "Medium", completed: false },
   { id: "sec2", title: "SQL Injection Simulation", difficulty: "Hard", completed: false },
   { id: "sec3", title: "Securing Express APIs", difficulty: "Medium", completed: true },
   { id: "sec4", title: "Network Penetration Basics", difficulty: "Hard", completed: false },
];

export function SecurityPractice() {
   return (
      <div className="space-y-6 container mx-auto py-8">
         <div className="flex justify-between items-end border-b border-zinc-100 pb-8">
            <div>
               <h1 className="text-4xl font-bold tracking-tight mb-2 text-black" style={{ fontFamily: "'Satisfy', cursive" }}>Cyber Security</h1>
               <p className="text-zinc-500 text-lg font-medium leading-relaxed max-w-2xl" style={{ fontFamily: "'Outfit', sans-serif" }}>Protect systems and data with ethical hacking and defensive strategies.</p>
            </div>
         </div>

         <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 pt-8">
            {securityTasks.map((problem, idx) => (
               <ProblemCard key={problem.id} problem={problem as any} index={idx + 1} />
            ))}
         </div>
      </div>
   );
}
