import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { SkillChart } from "@/components/SkillChart";

export function SkillAnalysis() {
   return (
      <div className="p-8 space-y-8">
         <div>
            <h1 className="text-3xl font-bold text-primary">Skill Gap Analysis</h1>
            <p className="text-muted-foreground">Deep dive into your coding profile.</p>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <SkillChart />
            <Card className="bg-black/40 border-primary/20">
               <CardHeader>
                  <CardTitle>Top Skill Gaps</CardTitle>
               </CardHeader>
               <CardContent>
                  <ul className="space-y-4">
                     <li className="flex justify-between items-center text-sm">
                        <span>Concurrency Loops</span>
                        <span className="text-red-400">-12%</span>
                     </li>
                     <li className="flex justify-between items-center text-sm">
                        <span>Memory Management</span>
                        <span className="text-yellow-400">-5%</span>
                     </li>
                  </ul>
               </CardContent>
            </Card>
         </div>
      </div>
   );
}
