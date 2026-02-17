import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Landmark, Briefcase, Video, FileText } from "lucide-react";

export function InterviewPrepPage() {
   return (
      <div className="container mx-auto py-8 px-4">
         <h1 className="text-3xl font-bold mb-2">Interview Preparation</h1>
         <p className="text-muted-foreground mb-8">Guided resources to help you land your dream job.</p>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-none overflow-hidden">
               <CardContent className="pt-8 pb-8 flex flex-col h-full relative z-10">
                  <CardTitle className="text-3xl font-black mb-4">CRACK THE CODE</CardTitle>
                  <p className="mb-6 text-blue-100 max-w-md">Our comprehensive roadmap covers everything from basic arrays to complex dynamic programming.</p>
                  <Button className="w-fit bg-white text-blue-600 hover:bg-blue-50">View Roadmap</Button>
               </CardContent>
               <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
                  <Landmark className="h-48 w-48" />
               </div>
            </Card>

            <Card className="bg-gradient-to-r from-orange-500 to-red-600 text-white border-none overflow-hidden">
               <CardContent className="pt-8 pb-8 flex flex-col h-full relative z-10">
                  <CardTitle className="text-3xl font-black mb-4">MOCK INTERVIEW</CardTitle>
                  <p className="mb-6 text-orange-100 max-w-md">Practice with our AI-driven virtual interview dashboard. Get real-time feedback on your code and voice.</p>
                  <Button className="w-fit bg-white text-orange-600 hover:bg-orange-50">Start Session</Button>
               </CardContent>
               <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
                  <Video className="h-48 w-48" />
               </div>
            </Card>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
               <section>
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                     <Briefcase className="h-6 w-6 text-primary" /> Company Wise Sets
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                     {['Google', 'Amazon', 'Meta', 'Microsoft', 'Netflix', 'Adobe', 'Uber', 'Apple'].map(company => (
                        <Card key={company} className="flex flex-col items-center justify-center p-6 hover:border-primary transition-colors cursor-pointer text-center group">
                           <div className="w-12 h-12 bg-muted rounded-full mb-3 group-hover:bg-primary/10 flex items-center justify-center font-bold">
                              {company[0]}
                           </div>
                           <span className="font-medium text-sm">{company}</span>
                        </Card>
                     ))}
                  </div>
               </section>

               <section>
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                     <FileText className="h-6 w-6 text-primary" /> Recent Interview Experiences
                  </h2>
                  <div className="space-y-4">
                     {[1, 2, 3].map(i => (
                        <Card key={i} className="hover:bg-muted/30 cursor-pointer">
                           <CardContent className="p-4 flex justify-between items-center text-sm">
                              <div>
                                 <h4 className="font-bold">Software Engineer II | Backend | Amazon</h4>
                                 <p className="text-muted-foreground">3 rounds onsite • Chennai • 2 days ago</p>
                              </div>
                              <Button variant="ghost" size="sm" className="text-primary hover:text-primary underline">Read More</Button>
                           </CardContent>
                        </Card>
                     ))}
                  </div>
               </section>
            </div>

            <div className="space-y-6">
               <Card>
                  <CardHeader>
                     <CardTitle className="text-lg">Tips and Tricks</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     {[
                        { title: 'Think Out Loud', desc: 'Always explain your thought process during interviews.' },
                        { title: 'Edge Cases', desc: 'Discuss constraint and boundary conditions before coding.' },
                        { title: 'Optimize Early?', desc: 'Get a working solution first, then optimize if asked.' }
                     ].map((tip, i) => (
                        <div key={i}>
                           <h5 className="font-bold text-sm mb-1">{tip.title}</h5>
                           <p className="text-xs text-muted-foreground">{tip.desc}</p>
                        </div>
                     ))}
                  </CardContent>
               </Card>
            </div>
         </div>
      </div>
   );
}
