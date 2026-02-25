import { MagicCard } from "@/components/ui/magic-card";
import {
   Card,
   CardHeader,
   CardTitle,
   CardDescription
} from "@/components/ui/Card";
import { useTheme } from "next-themes";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { progressApi } from "@/services/skillService";

import pythonIcon from "@/assets/images/python.png";
import intermediateIcon from "@/assets/images/intermediate-level.png";
import advancedIcon from "@/assets/images/it.png";
import careerIcon from "@/assets/images/career-path.png";

export function SchoolDashboard() {
   const navigate = useNavigate();
   const { theme } = useTheme();
   const [progress, setProgress] = useState<any>(null);

   useEffect(() => {
      const fetchProgress = async () => {
         try {
            const data = await progressApi.getUserProgress();
            setProgress(data);
         } catch (error) {
            console.error("Error fetching school progress:", error);
         }
      };
      fetchProgress();
   }, []);

   const modules = [
      {
         title: "Beginner Practice",
         desc: "35 Foundational Programs",
         icon: pythonIcon,
         path: "/school/beginner",
         stats: progress?.scores?.school?.beginner !== undefined ? `${progress.scores.school.beginner}% Done` : "Level 1"
      },
      {
         title: "Intermediate",
         desc: "Level Up your Skills",
         icon: intermediateIcon,
         path: "/school/intermediate",
         stats: progress?.scores?.school?.intermediate !== undefined ? `${progress.scores.school.intermediate}% Done` : "Level 2"
      },
      {
         title: "Advanced",
         desc: "Master Complex Logic",
         icon: advancedIcon,
         path: "/school/advanced",
         stats: progress?.scores?.school?.advanced !== undefined ? `${progress.scores.school.advanced}% Done` : "Level 3"
      },
      {
         title: "Mock Exams",
         desc: "3hr Full Simulation",
         icon: careerIcon,
         path: "/school/exams",
         stats: "Assessment"
      }
   ];

   return (
      <div className="min-h-screen bg-black text-white space-y-8 p-8">
         <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">School Dashboard</h1>
         </div>

         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 group/cards">
            {modules.map((item, i) => (
               <Card key={i} className="w-full border-none p-0 shadow-none relative overflow-hidden transition-all duration-300 group-hover/cards:blur-[2px] group-hover/cards:scale-[0.98] hover:!blur-none hover:!scale-[1.02] hover:z-10 bg-black">
                  <MagicCard
                     gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
                     className="p-1 cursor-pointer hover:bg-accent/50 group h-full border-none"
                     onClick={() => navigate(item.path)}
                  >
                     <CardHeader className="pb-2">
                        <div className="flex flex-row items-center justify-between pb-2">
                           <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                           <img src={item.icon} alt={item.title} className="h-4 w-4 group-hover:scale-110 transition-transform" />
                        </div>
                        <div>
                           <CardDescription className="text-xs text-muted-foreground mb-3">{item.desc}</CardDescription>
                           <div className="text-sm font-semibold">{item.stats}</div>
                        </div>
                     </CardHeader>
                  </MagicCard>
               </Card>
            ))}
         </div>
      </div>
   );
}
