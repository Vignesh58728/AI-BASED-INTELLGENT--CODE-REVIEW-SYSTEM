
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
         <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Full Stack Development</h1>
            <p className="text-muted-foreground">End-to-end projects implementing modern web technologies.</p>
         </div>

         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((problem) => (
               <ProblemCard key={problem.id} problem={problem as any} />
            ))}
         </div>
      </div>
   );
}
