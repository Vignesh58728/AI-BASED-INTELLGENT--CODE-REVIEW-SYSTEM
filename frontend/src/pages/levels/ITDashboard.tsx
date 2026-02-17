import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Server, Shield, Cloud, Terminal, Cpu } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function ITDashboard() {
   const navigate = useNavigate();

   const tracks = [
      {
         title: "Full Stack Development",
         description: "React, Node.js, and Modern Web Architecture.",
         icon: Terminal,
         color: "text-blue-500",
         path: "/it/fullstack",
         stats: "Project in Progress"
      },
      {
         title: "Cloud Computing",
         description: "AWS, Azure, and Google Cloud Platform.",
         icon: Cloud,
         color: "text-cyan-500",
         path: "/it/cloud",
         stats: "Level 1 Certified"
      },
      {
         title: "Cyber Security",
         description: "Network security, ethical hacking, and defense.",
         icon: Shield,
         color: "text-red-500",
         path: "/it/security",
         stats: "3/10 Modules"
      },
      {
         title: "DevOps & SRE",
         description: "Docker, Kubernetes, CI/CD, and Monitoring.",
         icon: Server,
         color: "text-orange-500",
         path: "/it/devops",
         stats: "Coming Soon"
      }
   ];

   return (
      <div className="space-y-8 container mx-auto py-8">
         <div className="flex justify-between items-end">
            <div>
               <h1 className="text-3xl font-bold tracking-tight mb-2">IT Module</h1>
               <p className="text-muted-foreground">Professional industry tracks and certification prep.</p>
            </div>
            <div className="text-right">
               <div className="text-sm font-medium">Industry Readiness</div>
               <div className="text-2xl font-bold text-primary">28%</div>
            </div>
         </div>

         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {tracks.map((track) => (
               <Card
                  key={track.title}
                  className="cursor-pointer hover:border-primary/50 transition-all hover:bg-accent/50 group"
                  onClick={() => navigate(track.path)}
               >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                     <CardTitle className="text-sm font-medium">{track.title}</CardTitle>
                     <track.icon className={`h-4 w-4 ${track.color} group-hover:scale-110 transition-transform`} />
                  </CardHeader>
                  <CardContent>
                     <p className="text-xs text-muted-foreground mb-3">{track.description}</p>
                     <div className="text-sm font-semibold">{track.stats}</div>
                  </CardContent>
               </Card>
            ))}
         </div>

         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
               <CardHeader>
                  <CardTitle>Industry Projects</CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="space-y-6">
                     {[
                        { title: "E-Commerce Microservices", tech: "React, Spring Boot", status: "Active" },
                        { title: "Real-time Chat App", tech: "Socket.io, Node.js", status: "Plan" },
                        { title: "Portfolio Website", tech: "Next.js, Tailwind", status: "Completed" },
                     ].map((project, i) => (
                        <div key={i} className="flex items-center justify-between">
                           <div className="space-y-1">
                              <p className="text-sm font-medium leading-none">{project.title}</p>
                              <p className="text-xs text-muted-foreground">{project.tech}</p>
                           </div>
                           <div className={`text-xs px-2 py-1 rounded-full ${project.status === 'Completed' ? 'bg-green-500/10 text-green-500' : project.status === 'Active' ? 'bg-blue-500/10 text-blue-500' : 'bg-muted text-muted-foreground'}`}>
                              {project.status}
                           </div>
                        </div>
                     ))}
                  </div>
               </CardContent>
            </Card>

            <Card className="col-span-3">
               <CardHeader>
                  <CardTitle>Recent Certifications</CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="flex flex-col items-center justify-center p-6 space-y-4 border-2 border-dashed rounded-lg bg-accent/20">
                     <Cpu className="h-12 w-12 text-muted-foreground" />
                     <div className="text-center">
                        <p className="text-sm font-medium">AWS Certified Developer</p>
                        <p className="text-xs text-muted-foreground">Issued Jan 2026</p>
                     </div>
                     <Button variant="outline" size="sm">View Certificate</Button>
                  </div>
               </CardContent>
            </Card>
         </div>
      </div>
   );
}
