
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
         <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Cyber Security</h1>
            <p className="text-muted-foreground">Protect systems and data with ethical hacking and defensive strategies.</p>
         </div>

         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {securityTasks.map((problem) => (
               <ProblemCard key={problem.id} problem={problem as any} />
            ))}
         </div>
      </div>
   );
}
