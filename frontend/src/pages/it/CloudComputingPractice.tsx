
import { ProblemCard } from "@/components/practice/ProblemCard";

const cloudTopics = [
   { id: "cloud1", title: "Deploying to AWS S3", difficulty: "Easy", completed: true },
   { id: "cloud2", title: "Setting up EC2 Instances", difficulty: "Medium", completed: false },
   { id: "cloud3", title: "Kubernetes Cluster Config", difficulty: "Hard", completed: false },
   { id: "cloud4", title: "Identity & Access Management (IAM)", difficulty: "Medium", completed: false },
];

export function CloudComputingPractice() {
   return (
      <div className="space-y-6 container mx-auto py-8">
         <div className="flex justify-between items-end border-b border-zinc-100 pb-8">
            <div>
               <h1 className="text-4xl font-bold tracking-tight mb-2 text-black" style={{ fontFamily: "'Satisfy', cursive" }}>Cloud Computing</h1>
               <p className="text-zinc-500 text-lg font-medium leading-relaxed max-w-2xl" style={{ fontFamily: "'Outfit', sans-serif" }}>Learn to scale and deploy applications on global cloud infrastructure.</p>
            </div>
         </div>

         <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 pt-8">
            {cloudTopics.map((problem, idx) => (
               <ProblemCard key={problem.id} problem={problem as any} index={idx + 1} />
            ))}
         </div>
      </div>
   );
}
