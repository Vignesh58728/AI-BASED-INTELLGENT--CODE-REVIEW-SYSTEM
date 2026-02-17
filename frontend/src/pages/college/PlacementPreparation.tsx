
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Clock, User, CheckCircle } from "lucide-react";

const placements = [
   {
      id: "p1",
      company: "Google",
      type: "Mock Interview",
      duration: "45 mins",
      questions: 2,
      difficulty: "Hard",
      available: true
   },
   {
      id: "p2",
      company: "Amazon",
      type: "Technical SDE-1",
      duration: "60 mins",
      questions: 3,
      difficulty: "Medium",
      available: true
   },
   {
      id: "p3",
      company: "Microsoft",
      type: "Coding Round",
      duration: "90 mins",
      questions: 4,
      difficulty: "Hard",
      available: false
   },
];

export function PlacementPreparation() {
   return (
      <div className="space-y-6 container mx-auto py-8">
         <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Placement Preparation</h1>
            <p className="text-muted-foreground">Simulate real interview scenarios with top company assessments.</p>
         </div>

         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {placements.map((p) => (
               <Card key={p.id} className={!p.available ? "opacity-60" : ""}>
                  <CardHeader className="pb-2">
                     <div className="flex justify-between items-start mb-2">
                        <Badge variant={p.difficulty === 'Hard' ? 'destructive' : p.difficulty === 'Medium' ? 'default' : 'secondary'}>
                           {p.difficulty}
                        </Badge>
                        {!p.available && <Badge variant="outline">Coming Soon</Badge>}
                     </div>
                     <CardTitle>{p.company} - {p.type}</CardTitle>
                  </CardHeader>
                  <CardContent>
                     <div className="space-y-4">
                        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                           <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span>{p.duration}</span>
                           </div>
                           <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              <span>{p.questions} Questions</span>
                           </div>
                        </div>
                        <Button className="w-full" disabled={!p.available}>
                           {p.available ? (
                              <span className="flex items-center gap-2"><CheckCircle className="h-4 w-4" /> Start Interview</span>
                           ) : "Locked"}
                        </Button>
                     </div>
                  </CardContent>
               </Card>
            ))}
         </div>
      </div>
   );
}
