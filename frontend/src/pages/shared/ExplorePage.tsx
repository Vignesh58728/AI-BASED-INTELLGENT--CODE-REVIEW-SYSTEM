import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Compass, BookOpen, Users, Trophy } from "lucide-react";

export function ExplorePage() {
   return (
      <div className="container mx-auto py-8 px-4">
         <h1 className="text-3xl font-bold mb-8">Explore</h1>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
               { title: 'New to Coding?', icon: Compass, color: 'text-blue-500', desc: 'Start your journey here' },
               { title: 'Top Interview Qs', icon: Trophy, color: 'text-yellow-500', desc: 'Most asked problems' },
               { title: 'Learn DSA', icon: BookOpen, color: 'text-green-500', desc: 'Master basic concepts' },
               { title: 'Community Gems', icon: Users, color: 'text-purple-500', desc: 'Best posts by users' },
            ].map((item, i) => (
               <Card key={i} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="pt-6">
                     <item.icon className={`h-10 w-10 ${item.color} mb-4`} />
                     <h3 className="font-bold mb-1">{item.title}</h3>
                     <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </CardContent>
               </Card>
            ))}
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
               <section>
                  <h2 className="text-xl font-bold mb-4">Featured Cards</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <Card className="bg-blue-600 text-white min-h-[200px] flex flex-col justify-end p-6 border-none">
                        <h3 className="text-2xl font-bold mb-2">Introduction to Algorithms</h3>
                        <p className="text-blue-100 text-sm">Master the foundations of problem solving.</p>
                     </Card>
                     <Card className="bg-purple-600 text-white min-h-[200px] flex flex-col justify-end p-6 border-none">
                        <h3 className="text-2xl font-bold mb-2">Google Interview Prep</h3>
                        <p className="text-purple-100 text-sm">Targeted practice for top companies.</p>
                     </Card>
                  </div>
               </section>

               <section>
                  <h2 className="text-xl font-bold mb-4">Latest Articles</h2>
                  <div className="space-y-4">
                     {[1, 2, 3].map(i => (
                        <div key={i} className="flex gap-4 p-4 rounded-lg border hover:bg-muted transition-colors cursor-pointer">
                           <div className="h-20 w-32 bg-muted rounded-md shrink-0" />
                           <div>
                              <h3 className="font-bold mb-1">How I optimized my Dijkstra solution by 10x</h3>
                              <p className="text-sm text-muted-foreground line-clamp-2">In this article, I discuss the common pitfalls when implementing shortest path algorithms and how to use memory efficiently...</p>
                              <div className="flex gap-2 mt-2">
                                 <span className="text-[10px] bg-muted px-2 py-0.5 rounded italic">#dsa</span>
                                 <span className="text-[10px] bg-muted px-2 py-0.5 rounded italic">#optimization</span>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </section>
            </div>

            <div className="space-y-6">
               <Card>
                  <CardHeader>
                     <CardTitle className="text-lg">Daily Challenge</CardTitle>
                  </CardHeader>
                  <CardContent>
                     <div className="p-4 rounded-lg bg-muted mb-4">
                        <h4 className="font-medium text-blue-500 mb-1">4. Median of Two Sorted Arrays</h4>
                        <div className="flex gap-2 mb-4">
                           <Badge variant="outline" className="text-[10px] uppercase">Hard</Badge>
                        </div>
                        <Button className="w-full">Solve Now</Button>
                     </div>
                  </CardContent>
               </Card>
            </div>
         </div>
      </div>
   );
}
