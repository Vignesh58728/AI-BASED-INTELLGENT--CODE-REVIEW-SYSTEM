import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
// import { Button } from "@/components/ui/Button";
import { BookOpen, Trophy, Timer } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function SchoolDashboard() {
   const navigate = useNavigate();

   return (
      <div className="space-y-8">
         <div>
            <h1 className="text-3xl font-bold tracking-tight">School Dashboard</h1>
            <p className="text-muted-foreground">Start your coding journey here.</p>
         </div>

         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="hover:bg-muted/50 transition cursor-pointer" onClick={() => navigate('/school/beginner')}>
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Beginner Practice</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
               </CardHeader>
               <CardContent>
                  <div className="text-2xl font-bold">Start</div>
                  <p className="text-xs text-muted-foreground">Learn syntax & loops</p>
               </CardContent>
            </Card>
            <Card className="hover:bg-muted/50 transition cursor-pointer" onClick={() => navigate('/school/intermediate')}>
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Intermediate</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
               </CardHeader>
               <CardContent>
                  <div className="text-2xl font-bold">Level Up</div>
                  <p className="text-xs text-muted-foreground">Functions & Arrays</p>
               </CardContent>
            </Card>
            <Card className="hover:bg-muted/50 transition cursor-pointer" onClick={() => navigate('/school/advanced')}>
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Advanced</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
               </CardHeader>
               <CardContent>
                  <div className="text-2xl font-bold">Master</div>
                  <p className="text-xs text-muted-foreground">OOPs & Algorithms</p>
               </CardContent>
            </Card>
            <Card className="hover:bg-muted/50 transition cursor-pointer" onClick={() => navigate('/school/exams')}>
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Mock Exams</CardTitle>
                  <Timer className="h-4 w-4 text-muted-foreground" />
               </CardHeader>
               <CardContent>
                  <div className="text-2xl font-bold">Test</div>
                  <p className="text-xs text-muted-foreground">3hr Full Mock</p>
               </CardContent>
            </Card>
         </div>

         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
               <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="space-y-4">
                     <div className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                        <div className="space-y-1">
                           <p className="text-sm font-medium leading-none">Completed "Hello World"</p>
                           <p className="text-xs text-muted-foreground">Beginner • 2 hours ago</p>
                        </div>
                        <span className="text-xs font-medium text-green-500">+10 XP</span>
                     </div>
                     <div className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                        <div className="space-y-1">
                           <p className="text-sm font-medium leading-none">Started "Sum of Two Numbers"</p>
                           <p className="text-xs text-muted-foreground">Beginner • 5 hours ago</p>
                        </div>
                        <span className="text-xs font-medium text-blue-500">In Progress</span>
                     </div>
                  </div>
               </CardContent>
            </Card>
            <Card className="col-span-3">
               <CardHeader>
                  <CardTitle>Class Leaderboard</CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="space-y-4">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <Trophy className="h-4 w-4 text-yellow-500" />
                           <div className="space-y-1">
                              <p className="text-sm font-medium leading-none">Olivia Martin</p>
                              <p className="text-xs text-muted-foreground">Level 5</p>
                           </div>
                        </div>
                        <span className="text-sm font-bold">1,999 XP</span>
                     </div>
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <span className="h-4 w-4 flex items-center justify-center text-sm font-bold text-muted-foreground">2</span>
                           <div className="space-y-1">
                              <p className="text-sm font-medium leading-none">Jackson Lee</p>
                              <p className="text-xs text-muted-foreground">Level 4</p>
                           </div>
                        </div>
                        <span className="text-sm font-bold">1,850 XP</span>
                     </div>
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <span className="h-4 w-4 flex items-center justify-center text-sm font-bold text-muted-foreground">3</span>
                           <div className="space-y-1">
                              <p className="text-sm font-medium leading-none">Isabella Nguyen</p>
                              <p className="text-xs text-muted-foreground">Level 3</p>
                           </div>
                        </div>
                        <span className="text-sm font-bold">1,600 XP</span>
                     </div>
                  </div>
               </CardContent>
            </Card>
         </div>
      </div>
   );
}
