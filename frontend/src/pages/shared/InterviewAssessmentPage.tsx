import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Play, ClipboardCheck, History, Clock } from "lucide-react";

export function InterviewAssessmentPage() {
   return (
      <div className="container mx-auto py-8 px-4">
         <h1 className="text-3xl font-bold mb-8">AI Skill Assessment</h1>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <Card className="lg:col-span-2 border-primary/20 bg-primary/5">
               <CardContent className="pt-8 pb-8">
                  <div className="flex flex-col md:flex-row gap-8 items-center">
                     <div className="flex-1">
                        <Badge className="mb-2 bg-primary text-primary-foreground">NEW FEATURE</Badge>
                        <h2 className="text-3xl font-black mb-4 uppercase tracking-tighter">Diagnostic Test</h2>
                        <p className="text-muted-foreground mb-6">
                           Take a 45-minute comprehensive test to evaluate your coding proficiency, logic building, and architectural knowledge.
                           Our AI will generate a personalized learning roadmap based on your performance.
                        </p>
                        <div className="flex gap-4 items-center text-sm font-medium mb-8">
                           <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> 45 Minutes</span>
                           <span className="flex items-center gap-1"><ClipboardCheck className="h-4 w-4" /> 5 Sections</span>
                        </div>
                        <Button size="lg" className="w-full md:w-auto px-12 group">
                           Start Assessment <Play className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                     </div>
                     <div className="w-full md:w-64 aspect-square bg-muted rounded-2xl flex items-center justify-center">
                        <div className="relative">
                           <div className="w-32 h-32 rounded-full border-8 border-primary/20 flex items-center justify-center font-bold text-2xl text-primary">
                              AI
                           </div>
                           <div className="absolute -top-2 -right-2 bg-yellow-500 w-8 h-8 rounded-full border-4 border-white dark:border-zinc-950 shadow-lg" />
                        </div>
                     </div>
                  </div>
               </CardContent>
            </Card>

            <div className="space-y-6">
               <Card>
                  <CardHeader>
                     <CardTitle className="text-lg">Recent Results</CardTitle>
                     <CardDescription>Track your improvement over time.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     {[
                        { date: 'Jan 15, 2024', score: 85, type: 'Full Diagnostic' },
                        { date: 'Jan 10, 2024', score: 72, type: 'DSA Fundamentals' }
                     ].map((res, i) => (
                        <div key={i} className="flex justify-between items-center p-3 rounded-lg border bg-muted/20">
                           <div>
                              <p className="font-bold text-sm">{res.type}</p>
                              <p className="text-[10px] text-muted-foreground">{res.date}</p>
                           </div>
                           <div className="text-right">
                              <span className="font-black text-primary">{res.score}%</span>
                           </div>
                        </div>
                     ))}
                     <Button variant="ghost" size="sm" className="w-full gap-2">
                        <History className="h-4 w-4" /> View All History
                     </Button>
                  </CardContent>
               </Card>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
               { title: 'Data Structures', count: '12 topics', level: 'Intermediate' },
               { title: 'System Design', count: '8 topics', level: 'Advanced' },
               { title: 'Database Design', count: '10 topics', level: 'Intermediate' },
               { title: 'Logical Reasoning', count: '5 topics', level: 'Beginner' },
               { title: 'OOPS Concepts', count: '7 topics', level: 'Intermediate' }
            ].map((skill, i) => (
               <Card key={i} className="hover:border-primary transition-colors cursor-pointer group">
                  <CardContent className="pt-6">
                     <h3 className="font-bold mb-1 group-hover:text-primary">{skill.title}</h3>
                     <p className="text-xs text-muted-foreground mb-4">{skill.count}</p>
                     <div className="flex justify-between items-center">
                        <Badge variant="secondary" className="text-[10px]">{skill.level}</Badge>
                        <Button variant="ghost" size="sm" className="h-8 text-[10px]">Take Mini-Test</Button>
                     </div>
                  </CardContent>
               </Card>
            ))}
         </div>
      </div>
   );
}
