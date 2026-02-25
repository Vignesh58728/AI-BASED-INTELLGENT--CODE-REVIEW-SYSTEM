import { MagicCard } from "@/components/ui/magic-card";
import {
   Card,
   CardHeader,
   CardTitle,
   CardDescription
} from "@/components/ui/Card";
import { useTheme } from "next-themes";
import { useNavigate } from "react-router-dom";

export function ITDashboard() {
   const navigate = useNavigate();
   const { theme } = useTheme();

   const tracks = [
      {
         title: "Full Stack Development",
         description: "React, Node.js, and Modern Web Architecture.",
         image: "/web-development.png",
         path: "/it/fullstack",
         stats: "Ready to Start"
      },
      {
         title: "Cloud Computing",
         description: "AWS, Azure, and Google Cloud Platform.",
         image: "/cloud-computing.jpeg",
         path: "/it/cloud",
         stats: "Ready to Start"
      },
      {
         title: "Cyber Security",
         description: "Network security, ethical hacking, and defense.",
         image: "/cyber-security.jpeg",
         path: "/it/security",
         stats: "0/10 Modules"
      },
      {
         title: "DevOps & SRE",
         description: "Docker, Kubernetes, CI/CD, and Monitoring.",
         image: "/devops.jpeg",
         path: "/it/devops",
         stats: "Coming Soon"
      }
   ];

   return (
      <div className="min-h-screen bg-black text-white space-y-8 p-8">
         <div className="flex justify-between items-end">
            <div>
               <h1 className="text-3xl font-bold tracking-tight mb-2">IT Module</h1>
            </div>
            <div className="text-right">
               <div className="text-sm font-medium">Industry Readiness</div>
               <div className="text-2xl font-bold text-primary">0%</div>
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
                           <img src={track.image} alt={track.title} className="h-6 w-6 object-contain group-hover:scale-110 transition-transform" />
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

      </div>
   );
}
