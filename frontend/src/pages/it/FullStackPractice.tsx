
import { ProblemCard } from "@/components/practice/ProblemCard";

const projects = [
   { id: "fs1", title: "Build a Trello Clone", difficulty: "Hard", completed: false },
   { id: "fs2", title: "Auth System with JWT", difficulty: "Medium", completed: true },
   { id: "fs3", title: "Real-time Chat with Socket.io", difficulty: "Hard", completed: false },
   { id: "fs4", title: "Personal Portfolio Website", difficulty: "Easy", completed: true },
];

export function FullStackPractice() {
   return (
      <div className="space-y-6 container mx-auto py-8">
         <div className="flex justify-between items-end border-b border-zinc-100 pb-8">
            <div>
               <h1 className="text-4xl font-bold tracking-tight mb-2 text-black" style={{ fontFamily: "'Satisfy', cursive" }}>Full Stack Development</h1>
               <p className="text-zinc-500 text-lg font-medium leading-relaxed max-w-2xl" style={{ fontFamily: "'Outfit', sans-serif" }}>End-to-end projects implementing modern web technologies.</p>
            </div>
         </div>

         <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 pt-8">
            {projects.map((problem, idx) => (
               <ProblemCard key={problem.id} problem={problem as any} index={idx + 1} />
            ))}
         </div>
      </div>
   );
}
