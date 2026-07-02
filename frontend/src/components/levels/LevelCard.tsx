import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Lock, Unlock } from "lucide-react";
import { Progress } from "@/components/ui/Progress";

interface LevelCardProps {
   title: string;
   description: string;
   isLocked: boolean;
   progress: number;
   onClick?: () => void;
}

export function LevelCard({ title, description, isLocked, progress, onClick }: LevelCardProps) {
   return (
      <Card className={`w-[350px] ${isLocked ? 'opacity-75 bg-muted' : ''}`}>
         <CardHeader>
            <CardTitle className="flex justify-between items-center">
               {title}
               {isLocked ? <Lock className="h-5 w-5" /> : <Unlock className="h-5 w-5 text-green-500" />}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
         </CardHeader>
         <CardContent>
            <div className="flex items-center space-x-2">
               <Progress value={progress} className="w-[60%]" />
               <span className="text-sm text-muted-foreground">{progress}%</span>
            </div>
         </CardContent>
         <CardFooter>
            <Button className="w-full" disabled={isLocked} onClick={onClick}>
               {isLocked ? 'Locked' : 'Start'}
            </Button>
         </CardFooter>
      </Card>
   );
}
