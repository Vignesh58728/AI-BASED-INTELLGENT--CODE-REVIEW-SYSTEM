import { Card, CardHeader, CardTitle, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Problem } from "@/types/problem";
import { CheckCircle2 } from "lucide-react";

interface ProblemCardProps {
   problem: Problem;
   isCompleted?: boolean;
   onClick?: () => void;
}

export function ProblemCard({ problem, onClick }: ProblemCardProps) {
   return (
      <article 
         className="card group cursor-pointer"
         onClick={onClick}
      >
         <header className="card-header">
            <h2 className="font-['Syncopate'] font-bold text-black group-hover:bg-gradient-to-r from-[#ff8a00] to-[#e52e71] group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
               {problem.title}
            </h2>
         </header>
         
         <div className="card-author">
            <div className="author-avatar">
               <img 
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(problem.id)}&background=000&color=fff&bold=true`} 
                  alt="Reviewer" 
               />
            </div>
            <svg className="half-circle" viewBox="0 0 106 57">
               <path d="M102 4c0 27.1-21.9 49-49 49S4 31.1 4 4"></path>
            </svg>
            <div className="author-name font-['Outfit']">
               <div className="author-name-prefix text-[#7a7a8c] font-black uppercase text-[10px] tracking-widest">Level</div>
               <span className="text-black font-bold uppercase">{problem.difficulty}</span>
            </div>
         </div>

      </article>
   );
}
