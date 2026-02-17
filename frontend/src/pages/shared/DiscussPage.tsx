import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { MessageSquare, Search, TrendingUp, MessageCircle } from "lucide-react";

export function DiscussPage() {
   return (
      <div className="container mx-auto py-8 px-4">
         <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Community Discussion</h1>
            <Button className="gap-2">
               <MessageSquare className="h-4 w-4" /> New Post
            </Button>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3 space-y-4">
               {/* Search bar */}
               <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search discussions..." className="pl-10 h-10" />
               </div>

               {/* Tags filter */}
               <div className="flex flex-wrap gap-2 mb-6">
                  {['Interview Experience', 'Study Guide', 'General Discussion', 'Career Advice', 'Feedback'].map(tag => (
                     <Badge key={tag} variant="secondary" className="cursor-pointer hover:bg-muted-foreground/20">
                        {tag}
                     </Badge>
                  ))}
               </div>

               {/* Posts list */}
               {[1, 2, 3, 4, 5].map(i => (
                  <Card key={i} className="hover:border-primary/50 transition-colors cursor-pointer group">
                     <CardContent className="p-4 flex gap-4">
                        <div className="flex flex-col items-center justify-center min-w-[50px] bg-muted/30 rounded-lg p-2 h-fit">
                           <TrendingUp className="h-4 w-4 text-orange-500 mb-1" />
                           <span className="text-sm font-bold">245</span>
                        </div>
                        <div className="flex-1">
                           <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                              Amazon SDE-1 Interview Experience | Dec 2023 | Chennai
                           </h3>
                           <p className="text-muted-foreground text-sm line-clamp-1 mb-2">
                              I recently interviewed with Amazon for an SDE-1 role. The process consisted of an OA followed by 3 virtual onsite rounds...
                           </p>
                           <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1 font-medium">
                                 <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} className="w-5 h-5 rounded-full" alt="avatar" />
                                 user_{i * 123}
                              </span>
                              <span>•</span>
                              <span>4 hours ago</span>
                              <span className="flex items-center gap-1 ml-auto">
                                 <MessageCircle className="h-4 w-4" /> 56 comments
                              </span>
                           </div>
                        </div>
                     </CardContent>
                  </Card>
               ))}
            </div>

            {/* Sidebar widgets */}
            <div className="space-y-6">
               <Card>
                  <CardContent className="pt-6">
                     <h3 className="font-bold mb-4 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-orange-500" /> Hot Topics
                     </h3>
                     <ul className="space-y-3 text-sm">
                        {[
                           'How to master Graph algorithms?',
                           'Google vs Meta: TC comparison',
                           'My first 100 solved problems',
                           'System Design roadmap 2024'
                        ].map((link, i) => (
                           <li key={i} className="hover:text-primary cursor-pointer transition-colors truncate">
                              # {link}
                           </li>
                        ))}
                     </ul>
                  </CardContent>
               </Card>
            </div>
         </div>
      </div>
   );
}
