import { Card, CardHeader, CardTitle, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Problem } from "@/types/problem";
import { CheckCircle2 } from "lucide-react";

interface ProblemCardProps {
   problem: Problem;
   isCompleted?: boolean;
   onClick?: () => void;
}

export function ProblemCard({ problem, isCompleted, onClick }: ProblemCardProps) {
   return (
      <Card
         className="group relative overflow-hidden transition-all duration-500 cursor-pointer bg-black/90 border border-zinc-800/50 hover:border-primary/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] rounded-2xl"
         onClick={onClick}
      >
         <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 relative z-10">
            <CardTitle className="text-xl font-bold tracking-tight text-white group-hover:text-primary transition-colors">
               {problem.title}
            </CardTitle>
            {isCompleted && (
               <div className="p-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
               </div>
            )}
         </CardHeader>

         <CardFooter className="pt-4 pb-6 relative z-10">
            <Button
               variant="ghost"
               className="w-full justify-between px-0 text-zinc-400 group-hover:text-white transition-all hover:bg-transparent"
            >
               <span className="text-xs font-semibold uppercase tracking-wider">Solve Challenge</span>
               <div className="transform transition-all duration-300 group-hover:translate-x-1 flex items-center gap-1">
                  <span className="text-lg">&rarr;</span>
               </div>
            </Button>
         </CardFooter>
      </Card>
   );
}
