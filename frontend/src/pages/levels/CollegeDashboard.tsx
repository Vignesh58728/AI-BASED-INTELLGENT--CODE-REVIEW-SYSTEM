import { MagicCard } from "@/components/ui/magic-card";
import {
   Card,
   CardHeader,
   CardTitle,
   CardDescription
} from "@/components/ui/Card";
import { useTheme } from "next-themes";
import { Briefcase, Code, Terminal, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { problemsApi } from "@/services/problemsApi";
import { useAuth } from "@/context/AuthContext";
import { DS_PROBLEMS, ALGO_PROBLEMS, CORE_SUBJECTS, INTERVIEW_QUESTIONS } from "@/data/collegeData";

export function CollegeDashboard() {
   const navigate = useNavigate();
   const { theme } = useTheme();
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
      const interviewCompleted = getCompletedCount(INTERVIEW_QUESTIONS.map((p: any) => p.id));

      const totalProblems = DS_PROBLEMS.length + ALGO_PROBLEMS.length + CORE_SUBJECTS.length + INTERVIEW_QUESTIONS.length;
      const totalCompleted = dsCompleted + algoCompleted + coreCompleted + interviewCompleted;
      const overallProgress = totalProblems > 0 ? Math.round((totalCompleted / totalProblems) * 100) : 0;

      return {
         dsStats: `${dsCompleted}/${DS_PROBLEMS.length} Problems`,
         algoStats: `${algoCompleted}/${ALGO_PROBLEMS.length} Problems`,
         coreStats: `${coreCompleted}/${CORE_SUBJECTS.length} Topics`,
         placementStats: interviewCompleted > 0 ? `${interviewCompleted}/${INTERVIEW_QUESTIONS.length} Done` : "Ready to Start",
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
      {
         title: "Placement Preparation",
         description: "Mock interviews and top company questions.",
         icon: Briefcase,
         color: "text-orange-500",
         beamColor: "#f97316",
         path: "/college/placement",
         stats: trackStats.placementStats
      }
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
               <Card key={track.title} className="w-full border-none p-0 shadow-none relative overflow-hidden transition-all duration-300 group-hover/cards:blur-[2px] group-hover/cards:scale-[0.98] hover:!blur-none hover:!scale-[1.02] hover:z-10 bg-black">
                  <MagicCard
                     gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
                     className="p-1 cursor-pointer hover:bg-accent/50 group h-full border-none"
                     onClick={() => navigate(track.path)}
                  >
                     <CardHeader className="pb-2">
                        <div className="flex flex-row items-center justify-between pb-2">
                           <CardTitle className="text-sm font-medium">{track.title}</CardTitle>
                           <track.icon className={`h-4 w-4 ${track.color} group-hover:scale-110 transition-transform`} />
                        </div>
                        <div>
                           <CardDescription className="text-xs text-muted-foreground mb-3">{track.description}</CardDescription>
                           <div className="text-sm font-semibold">{track.stats}</div>
                        </div>
                     </CardHeader>
                  </MagicCard>
               </Card>
            ))}
         </div>

         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 group/sections">
            <Card className="col-span-4 border-none p-0 shadow-none relative overflow-hidden transition-all duration-300 group-hover/sections:blur-[2px] group-hover/sections:scale-[0.98] hover:!blur-none hover:!scale-[1.01] hover:z-10 bg-black">
               <MagicCard
                  gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
                  className="p-1 h-full border-none"
               >
                  <CardHeader>
                     <CardTitle className="mb-4">Interview Roadmap</CardTitle>
                     <div className="space-y-6">
                        {[
                           { step: "1", title: "DSA Fundamentals", status: "Pending", date: "Not started" },
                           { step: "2", title: "System Design Basics", status: "Pending", date: "Not started" },
                           { step: "3", title: "Mock Interview #1", status: "Pending", date: "Not started" },
                        ].map((item, i) => (
                           <div key={i} className="flex items-start gap-4">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                                 {item.step}
                              </div>
                              <div className="flex-1 space-y-1">
                                 <p className="text-sm font-medium leading-none">{item.title}</p>
                                 <CardDescription className="text-xs text-muted-foreground">{item.date}</CardDescription>
                              </div>
                              <div className={`text-xs font-medium ${item.status === 'Completed' ? 'text-green-500' : item.status === 'In Progress' ? 'text-blue-500' : 'text-muted-foreground'}`}>
                                 {item.status}
                              </div>
                           </div>
                        ))}
                     </div>
                  </CardHeader>
               </MagicCard>
            </Card>

            <Card className="col-span-3 border-none p-0 shadow-none relative overflow-hidden transition-all duration-300 group-hover/sections:blur-[2px] group-hover/sections:scale-[0.98] hover:!blur-none hover:!scale-[1.01] hover:z-10 bg-black">
               <MagicCard
                  gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
                  className="p-1"
               >
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
               </MagicCard>
            </Card>
         </div>
      </div>
   );
}
