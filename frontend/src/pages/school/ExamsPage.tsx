import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Timer, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SCHOOL_EXAMS } from "@/data/schoolExams";


export function ExamsPage() {
   const navigate = useNavigate();

   return (
      <div className="space-y-6 container mx-auto py-8">
         <div className="flex items-center justify-between">
            <div>
               <h1 className="text-3xl font-bold tracking-tight mb-2">Mock Exams</h1>
               <p className="text-black">Test your knowledge under timed conditions.</p>
            </div>
         </div>

         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {SCHOOL_EXAMS.map((exam) => (
               <Card key={exam.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                     <div className="flex justify-between items-start">
                        <CardTitle className="text-xl">{exam.title}</CardTitle>
                     </div>
                     <CardDescription className="flex items-center gap-2 mt-1">
                        <Timer className="h-4 w-4" /> {exam.duration}
                        <span>•</span>
                        <FileText className="h-4 w-4" /> {exam.questions.length} Questions
                     </CardDescription>
                  </CardHeader>
                  <CardContent>
                     <div className="flex gap-2 mb-4">
                        <Badge variant="secondary" className="capitalize">{exam.difficulty}</Badge>
                        <Badge variant="default" className="capitalize">
                           Available
                        </Badge>
                     </div>
                  </CardContent>
                  <CardFooter>
                     <Button
                        className="w-full"
                        onClick={() => navigate(`/exam/${exam.id}`)}
                     >
                        Start Exam
                     </Button>
                  </CardFooter>

               </Card>
            ))}
         </div>
      </div>
   );
}
