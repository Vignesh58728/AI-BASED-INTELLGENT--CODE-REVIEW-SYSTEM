
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import { Award, Target, BookOpen } from "lucide-react";
import { problemsApi } from "@/services/problemsApi";

export function PlacementAnalytics() {
   const [stats, setStats] = useState({
      ds: { count: 0, total: 100 },
      algo: { count: 0, total: 100 },
      core: { count: 0, total: 20 }
   });

   useEffect(() => {
      const fetchStats = async () => {
         try {
            const data = await problemsApi.getCollegeProblems();
            const dsCount = data.filter(p => p.title.includes("Linked List") || p.title.includes("Tree")).length;
            const algoCount = data.filter(p => p.title.includes("Sort") || p.title.includes("Knapsack")).length;
            const coreCount = data.filter(p => p.title.includes("OS") || p.title.includes("DBMS")).length;

            setStats({
               ds: { count: dsCount, total: 100 },
               algo: { count: algoCount, total: 100 },
               core: { count: coreCount, total: 20 }
            });
         } catch (e) {
            console.error("Error fetching stats:", e);
         }
      };
      fetchStats();
   }, []);

   const analytics = [
      {
         title: "Data Structures",
         current: stats.ds.count,
         total: stats.ds.total,
         icon: BookOpen,
         color: "text-blue-500"
      },
      {
         title: "Algorithms",
         current: stats.algo.count,
         total: stats.algo.total,
         icon: Target,
         color: "text-purple-500"
      },
      {
         title: "CS Core Subjects",
         current: stats.core.count,
         total: stats.core.total,
         icon: Award,
         color: "text-green-500"
      }
   ];

   return (
      <div className="space-y-6 container mx-auto py-8">
         <div className="grid gap-6 md:grid-cols-3">
            {analytics.map((item) => (
               <Card key={item.title}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                     <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                     <item.icon className={`h-4 w-4 ${item.color}`} />
                  </CardHeader>
                  <CardContent>
                     <div className="text-2xl font-bold">{item.current}/{item.total}</div>
                     <Progress value={(item.current / item.total) * 100} className="mt-2" />
                     <p className="text-xs text-muted-foreground mt-2">
                        {Math.round((item.current / item.total) * 100)}% Complete
                     </p>
                  </CardContent>
               </Card>
            ))}
         </div>

         <Card className="p-8 flex flex-col items-center justify-center text-center space-y-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
               <Target className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-2">
               <h3 className="text-xl font-bold">Restart Complete!</h3>
               <p className="text-muted-foreground max-w-md">
                  All college modules have been reset. Your progress is now at 0%. Start practicing to see your analytics grow!
               </p>
            </div>
         </Card>
      </div>
   );
}

