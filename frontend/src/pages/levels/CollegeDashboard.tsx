import {
   Card,
   CardHeader,
   CardTitle,
   CardDescription
} from "@/components/ui/Card";
import { Briefcase, Code, Terminal, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { problemsApi } from "@/services/problemsApi";
import { useAuth } from "@/context/AuthContext";
import { DS_PROBLEMS, ALGO_PROBLEMS, CORE_SUBJECTS } from "@/data/collegeData";

export function CollegeDashboard() {
   const navigate = useNavigate();
   const { user } = useAuth();
   const [submissions, setSubmissions] = useState<any[]>([]);
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      const fetchProgress = async () => {
         if (!user?.id && !user?._id) return;
         try {
            const data = await problemsApi.getSubmissions(user.id || user._id);
            setSubmissions(data);
         } catch (error) {
            console.error("Error fetching submissions:", error);
         } finally {
            setIsLoading(false);
         }
      };
      fetchProgress();
   }, [user]);

   const trackStats = useMemo(() => {
      const getCompletedCount = (categoryIds: string[]) => {
         return submissions.filter(s =>
            categoryIds.includes(s.problem?.id || s.problem) &&
            (s.status === "success" || s.score >= 70)
         ).length;
      };

      const dsCompleted = getCompletedCount(DS_PROBLEMS.map((p: any) => p.id));
      const algoCompleted = getCompletedCount(ALGO_PROBLEMS.map((p: any) => p.id));
      const coreCompleted = getCompletedCount(CORE_SUBJECTS.map((p: any) => p.id));
      const totalProblems = DS_PROBLEMS.length + ALGO_PROBLEMS.length + CORE_SUBJECTS.length;
      const totalCompleted = dsCompleted + algoCompleted + coreCompleted;
      const overallProgress = totalProblems > 0 ? Math.round((totalCompleted / totalProblems) * 100) : 0;

      return {
         dsStats: `${dsCompleted}/${DS_PROBLEMS.length} Problems`,
         algoStats: `${algoCompleted}/${ALGO_PROBLEMS.length} Problems`,
         coreStats: `${coreCompleted}/${CORE_SUBJECTS.length} Topics`,
         overallProgress
      };
   }, [submissions]);

   const tracks = [
      {
         title: "Data Structures",
         description: "Master Arrays, Linked Lists, Trees, and Graphs.",
         icon: Code,
         color: "text-blue-500",
         beamColor: "#3b82f6",
         path: "/college/ds",
         stats: trackStats.dsStats
      },
      {
         title: "Algorithms",
         description: "Sorting, Searching, DP, and Greedy algorithms.",
         icon: Terminal,
         color: "text-green-500",
         beamColor: "#22c55e",
         path: "/college/algorithms",
         stats: trackStats.algoStats
      },
      {
         title: "CS Core Subjects",
         description: "OS, DBMS, CN, and System Design basics.",
         icon: BookOpen,
         color: "text-purple-500",
         beamColor: "#a855f7",
         path: "/college/core",
         stats: trackStats.coreStats
      },
   ];

   if (isLoading) {
      return (
         <div className="min-h-screen bg-black text-white flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-black text-white space-y-8 p-8">
         <div className="flex justify-between items-end">
            <div>
               <h1 className="text-3xl font-bold tracking-tight mb-2">College Module</h1>
            </div>
            <div className="text-right">
               <div className="text-sm font-medium">Overall Progress</div>
               <div className="text-2xl font-bold text-primary">{trackStats.overallProgress}%</div>
            </div>
         </div>

         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 group/cards">
            {tracks.map((track) => (
               <Card
                  key={track.title}
                  className="w-full border-zinc-800 p-1 shadow-none relative overflow-hidden transition-all duration-300 group-hover/cards:blur-[2px] group-hover/cards:scale-[0.98] hover:!blur-none hover:!scale-[1.02] hover:z-10 bg-zinc-900/50 cursor-pointer hover:bg-zinc-800/50"
                  onClick={() => navigate(track.path)}
               >
                  <CardHeader className="pb-2">
                     <div className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">{track.title}</CardTitle>
                        <track.icon className={`h-4 w-4 ${track.color} group-hover/cards:scale-110 transition-transform`} />
                     </div>
                     <div>
                        <CardDescription className="text-xs text-muted-foreground mb-3">{track.description}</CardDescription>
                        <div className="text-sm font-semibold">{track.stats}</div>
                     </div>
                  </CardHeader>
               </Card>
            ))}
         </div>

         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 group/sections">

            <Card className="col-span-full border border-zinc-800 p-1 shadow-none relative overflow-hidden transition-all duration-300 group-hover/sections:blur-[2px] group-hover/sections:scale-[0.98] hover:!blur-none hover:!scale-[1.01] hover:z-10 bg-zinc-900/50">
               <CardHeader>
                  <div className="flex flex-row items-center justify-between mb-4">
                     <CardTitle>Top Resources</CardTitle>
                  </div>
                  <div className="space-y-4">
                     <div className="flex items-center gap-3 p-3 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                        <div className="h-10 w-10 flex items-center justify-center rounded overflow-hidden">
                           <img src="/resource-pdf.jpeg" alt="PDF" className="h-full w-full object-cover" />
                        </div>
                        <div className="flex-1">
                           <div className="text-sm font-medium">DSA Cheat Sheet</div>
                           <div className="text-xs text-muted-foreground">Master sheet for common patterns</div>
                        </div>
                     </div>
                     <div className="flex items-center gap-3 p-3 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                        <div className="h-10 w-10 flex items-center justify-center rounded overflow-hidden text-green-500 font-bold">
                           <img src="/resource-web.jpeg" alt="WEB" className="h-full w-full object-cover" />
                        </div>
                        <div className="flex-1">
                           <div className="text-sm font-medium">System Design Primer</div>
                           <div className="text-xs text-muted-foreground">Most popular SD resource</div>
                        </div>
                     </div>
                     <div className="flex items-center gap-3 p-3 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                        <div className="h-10 w-10 flex items-center justify-center rounded overflow-hidden text-purple-500 font-bold">
                           <img src="/resource-leetcode.jpeg" alt="EXT" className="h-full w-full object-cover" />
                        </div>
                        <div className="flex-1">
                           <div className="text-sm font-medium">LeetCode Patterns</div>
                           <div className="text-xs text-muted-foreground">Interactive practice sets</div>
                        </div>
                     </div>
                  </div>
               </CardHeader>
            </Card>
         </div>
      </div>
   );
}
