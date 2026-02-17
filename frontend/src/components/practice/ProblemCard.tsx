import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Problem } from "@/types/problem";
import { CheckCircle2 } from "lucide-react";

interface ProblemCardProps {
   problem: Problem;
   isCompleted?: boolean;
   onClick?: () => void;
}

export function ProblemCard({ problem, isCompleted, onClick }: ProblemCardProps) {
   const difficultyColor = {
      easy: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      hard: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
   }[problem.difficulty];

   return (
      <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">
               {problem.title}
            </CardTitle>
            {isCompleted && <CheckCircle2 className="h-5 w-5 text-green-500" />}
         </CardHeader>
         <CardDescription className="px-6 py-2">
            <Badge variant="outline" className={difficultyColor}>{problem.difficulty}</Badge>
         </CardDescription>
         <CardFooter>
            <Button variant="ghost" className="w-full justify-start pl-0">Solve Challenge &rarr;</Button>
         </CardFooter>
      </Card>
   );
}
