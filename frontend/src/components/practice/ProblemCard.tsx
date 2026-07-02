import { Card, CardHeader, CardTitle, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Problem } from "@/types/problem";
import { CheckCircle2 } from "lucide-react";

interface ProblemCardProps {
   problem: Problem;
   index: number;
   isCompleted?: boolean;
   onClick?: () => void;
}

export function ProblemCard({ problem, index, onClick }: ProblemCardProps) {
   return (
      <Card 
         className="w-full border-zinc-100 p-1 shadow-sm hover:shadow-2xl relative overflow-hidden transition-all duration-500 bg-white rounded-3xl cursor-pointer hover:bg-zinc-50 hover:border-black/5 hover:!scale-[1.02] group"
         onClick={onClick}
      >
         <CardHeader className="py-12 flex flex-col items-center justify-center space-y-4">
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300 font-sans group-hover:text-primary transition-colors">
               {index}. Question
            </div>
            <CardTitle className="text-3xl font-bold text-black tracking-tight group-hover:bg-gradient-to-r from-[#ff8a00] to-[#e52e71] group-hover:bg-clip-text group-hover:text-transparent transition-all text-center" style={{ fontFamily: "'Satisfy', cursive" }}>
               {problem.title}
            </CardTitle>
         </CardHeader>
      </Card>
   );
}
