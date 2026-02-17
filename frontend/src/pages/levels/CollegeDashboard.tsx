import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Briefcase, Code, Terminal, BookOpen, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function CollegeDashboard() {
   const navigate = useNavigate();

   const tracks = [
      {
         title: "Data Structures",
         description: "Master Arrays, Linked Lists, Trees, and Graphs.",
         icon: Code,
         color: "text-blue-500",
         path: "/college/ds",
         stats: "24/50 Problems"
      },
      {
         title: "Algorithms",
         description: "Sorting, Searching, DP, and Greedy algorithms.",
         icon: Terminal,
         color: "text-green-500",
         path: "/college/algorithms",
         stats: "12/40 Problems"
      },
      {
         title: "CS Core Subjects",
         description: "OS, DBMS, CN, and System Design basics.",
         icon: BookOpen,
         color: "text-purple-500",
         path: "/college/core",
         stats: "8/30 Topics"
      },
      {
         title: "Placement Preparation",
         description: "Mock interviews and top company questions.",
         icon: Briefcase,
         color: "text-orange-500",
         path: "/college/placement",
         stats: "Ready to Start"
      }
   ];

   return (
      <div className="space-y-8 container mx-auto py-8">
         <div className="flex justify-between items-end">
            <div>
               <h1 className="text-3xl font-bold tracking-tight mb-2">College Module</h1>
               <p className="text-muted-foreground">Placement preparation and advanced computer science concepts.</p>
            </div>
            <div className="text-right">
               <div className="text-sm font-medium">Overall Progress</div>
               <div className="text-2xl font-bold text-primary">42%</div>
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
                  <CardTitle>Interview Roadmap</CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="space-y-6">
                     {[
                        { step: "1", title: "DSA Fundamentals", status: "Completed", date: "2 days ago" },
                        { step: "2", title: "System Design Basics", status: "In Progress", date: "Ongoing" },
                        { step: "3", title: "Mock Interview #1", status: "Pending", date: "Not started" },
                     ].map((item, i) => (
                        <div key={i} className="flex items-start gap-4">
                           <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                              {item.step}
                           </div>
                           <div className="flex-1 space-y-1">
                              <p className="text-sm font-medium leading-none">{item.title}</p>
                              <p className="text-xs text-muted-foreground">{item.date}</p>
                           </div>
                           <div className={`text-xs font-medium ${item.status === 'Completed' ? 'text-green-500' : item.status === 'In Progress' ? 'text-blue-500' : 'text-muted-foreground'}`}>
                              {item.status}
                           </div>
                        </div>
                     ))}
                  </div>
               </CardContent>
            </Card>

            <Card className="col-span-3">
               <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Top Resources</CardTitle>
                  <Video className="h-4 w-4 text-muted-foreground" />
               </CardHeader>
               <CardContent>
                  <div className="space-y-4">
                     {[
                        "Standard Template Library (STL)",
                        "Dynamic Programming Patterns",
                        "SQL Query Optimization",
                        "Networking Protocols 101"
                     ].map((resource, i) => (
                        <div key={i} className="flex items-center gap-3 p-2 rounded-md hover:bg-accent cursor-pointer group">
                           <div className="h-2 w-2 rounded-full bg-primary/40 group-hover:bg-primary" />
                           <span className="text-sm font-medium">{resource}</span>
                        </div>
                     ))}
                  </div>
               </CardContent>
            </Card>
         </div>
      </div>
   );
}
