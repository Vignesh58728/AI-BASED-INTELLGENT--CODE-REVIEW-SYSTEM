
import { ProblemCard } from "@/components/practice/ProblemCard";
import { INTERVIEW_QUESTIONS } from "@/data/collegeData";

export function InterviewPrep() {
   return (
      <div className="space-y-6 container mx-auto py-8">
         <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Interview Preparation</h1>
            <p className="text-muted-foreground">Master the most common HR and Technical interview questions.</p>
         </div>

         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {INTERVIEW_QUESTIONS.map((problem) => (
               <ProblemCard key={problem.id} problem={problem as any} />
            ))}
         </div>
      </div>
   );
}

