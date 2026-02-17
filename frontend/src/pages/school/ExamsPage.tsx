import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Timer, FileText, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Exam {
   id: string;
   title: string;
   duration: string;
   questionCount: number;
   difficulty: "easy" | "medium" | "hard";
   status: "locked" | "available" | "completed";
}

const mockExams: Exam[] = [
   {
      id: "exam-1",
      title: "Basics Assessment",
      duration: "45 mins",
      questionCount: 20,
      difficulty: "easy",
      status: "available"
   },
   {
      id: "exam-2",
      title: "Mid-Term Mock",
      duration: "90 mins",
      questionCount: 40,
      difficulty: "medium",
      status: "locked"
   },
   {
      id: "exam-3",
      title: "Final Exam Simulation",
      duration: "180 mins",
      questionCount: 60,
      difficulty: "hard",
      status: "locked"
   }
];

export function ExamsPage() {
   const navigate = useNavigate();

   return (
      <div className="space-y-6 container mx-auto py-8">
         <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Mock Exams</h1>
            <p className="text-muted-foreground">Test your knowledge under timed conditions.</p>
         </div>

         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mockExams.map((exam) => (
               <Card key={exam.id} className={exam.status === "locked" ? "opacity-75 bg-muted/50" : ""}>
                  <CardHeader>
                     <div className="flex justify-between items-start">
                        <CardTitle className="text-xl">{exam.title}</CardTitle>
                        {exam.status === "completed" && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                     </div>
                     <CardDescription className="flex items-center gap-2 mt-1">
                        <Timer className="h-4 w-4" /> {exam.duration}
                        <span>•</span>
                        <FileText className="h-4 w-4" /> {exam.questionCount} Questions
                     </CardDescription>
                  </CardHeader>
                  <CardContent>
                     <div className="flex gap-2 mb-4">
                        <Badge variant="secondary" className="capitalize">{exam.difficulty}</Badge>
                        <Badge variant={exam.status === "available" ? "default" : "outline"} className="capitalize">
                           {exam.status}
                        </Badge>
                     </div>
                  </CardContent>
                  <CardFooter>
                     <Button
                        className="w-full"
                        disabled={exam.status === "locked"}
                        onClick={() => navigate(`/exam/${exam.id}`)}
                     >
                        {exam.status === "locked" ? "Locked" : "Start Exam"}
                     </Button>
                  </CardFooter>
               </Card>
            ))}
         </div>
      </div>
   );
}
