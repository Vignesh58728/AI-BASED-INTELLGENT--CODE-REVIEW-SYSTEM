import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import {
   Card,
   CardContent,
   CardHeader,
   CardTitle
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MagicCard } from "@/components/ui/magic-card";
import { Landmark, Video, Loader2, ExternalLink } from "lucide-react";
import netflixLogo from "@/assets/images/netflix_logo.png";
import metaLogo from "@/assets/images/meta_logo.png";
import amazonLogo from "@/assets/images/amazon_logo.png";
import googleLogo from "@/assets/images/google_logo.png";
import uberLogo from "@/assets/images/uber_logo.png";
import microsoftLogo from "@/assets/images/microsoft_logo.png";
import officeBuilding from "@/assets/images/office-building.png";
import interviewIcon from "@/assets/images/interview.png";
import { UiverseLogo } from "@/components/ui/UiverseLogo";

export function InterviewPrepPage() {
   const navigate = useNavigate();
   const { theme } = useTheme();
   const [articles, setArticles] = useState<any[]>([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchArticles = async () => {
         try {
            const response = await fetch('https://dev.to/api/articles?tag=interviewexperience&per_page=5');
            const data = await response.json();
            setArticles(data);
         } catch (error) {
            console.error('Error fetching interview experiences:', error);
         } finally {
            setLoading(false);
         }
      };

      fetchArticles();
   }, []);

   return (
      <div className="container mx-auto py-8 px-4">
         <h1 className="text-3xl font-bold mb-2">Interview Preparation</h1>
         <p className="text-muted-foreground mb-8">Guided resources to help you land your dream job.</p>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card className="w-full border-none p-0 shadow-none relative overflow-hidden bg-black group/card1">
               <MagicCard
                  gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
                  className="p-1 cursor-pointer transition-all duration-300 border-none"
               >
                  <CardContent className="p-8 flex flex-col h-full relative z-10">
                     <div className="mb-6 w-16 h-16 flex items-center justify-center">
                        <UiverseLogo size={60} />
                     </div>
                     <CardTitle className="text-3xl font-black mb-4 text-white uppercase tracking-tight">CRACK THE CODE</CardTitle>
                     <p className="mb-8 text-zinc-400 text-sm leading-relaxed max-w-sm">
                        Master technical challenges with our comprehensive roadmap covering basic arrays to complex dynamic programming.
                     </p>
                     <Button
                        onClick={() => navigate('/college')}
                        className="w-fit bg-blue-600 text-white hover:bg-blue-700 font-bold border-none shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                     >
                        View Roadmap
                     </Button>
                  </CardContent>
                  <div className="absolute right-[-20px] bottom-[-20px] opacity-[0.03] group-hover/card1:opacity-[0.08] transition-opacity">
                     <Landmark className="h-48 w-48 text-white" />
                  </div>
               </MagicCard>
            </Card>

            <Card className="w-full border-none p-0 shadow-none relative overflow-hidden bg-black group/card2">
               <MagicCard
                  gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
                  className="p-1 cursor-pointer transition-all duration-300 border-none"
               >
                  <CardContent className="p-8 flex flex-col h-full relative z-10">
                     <div className="mb-6 w-16 h-16 flex items-center justify-center">
                        <UiverseLogo size={60} />
                     </div>
                     <CardTitle className="text-3xl font-black mb-4 text-white uppercase tracking-tight">MOCK INTERVIEW</CardTitle>
                     <p className="mb-8 text-zinc-400 text-sm leading-relaxed max-w-sm">
                        Engage in realistic AI-driven virtual simulations with detailed feedback on your technical and behavioral performance.
                     </p>
                     <Button
                        onClick={() => navigate('/interview/assessment')}
                        className="w-fit bg-orange-600 text-white hover:bg-orange-700 font-bold border-none shadow-[0_0_20px_rgba(249,115,22,0.3)]"
                     >
                        Start Session
                     </Button>
                  </CardContent>
                  <div className="absolute right-[-20px] bottom-[-20px] opacity-[0.03] group-hover/card2:opacity-[0.08] transition-opacity">
                     <Video className="h-48 w-48 text-white" />
                  </div>
               </MagicCard>
            </Card>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
               <section>
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                     <img src={officeBuilding} alt="Office" className="h-8 w-8 object-contain" /> Company Wise Sets
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                     {[
                        { name: 'Google', icon: <img src={googleLogo} alt="Google" className="w-8 h-8 object-contain" /> },
                        { name: 'Amazon', icon: <img src={amazonLogo} alt="Amazon" className="w-8 h-8 object-contain" /> },
                        { name: 'Meta', icon: <img src={metaLogo} alt="Meta" className="w-8 h-8 object-contain" /> },
                        { name: 'Microsoft', icon: <img src={microsoftLogo} alt="Microsoft" className="w-8 h-8 object-contain" /> },
                        { name: 'Netflix', icon: <img src={netflixLogo} alt="Netflix" className="w-8 h-8 object-contain" /> },
                        { name: 'Adobe', icon: <span className="text-red-500 text-xl font-black">A</span> },
                        { name: 'Uber', icon: <img src={uberLogo} alt="Uber" className="w-8 h-8 object-contain" /> },
                        { name: 'Apple', icon: <i className="bi bi-apple text-gray-800 text-xl"></i> },
                     ].map(company => (
                        <Card key={company.name} className="flex flex-col items-center justify-center p-6 hover:border-primary transition-colors cursor-pointer text-center group">
                           <div className="w-12 h-12 bg-muted rounded-full mb-3 group-hover:bg-primary/10 flex items-center justify-center font-bold">
                              {company.icon}
                           </div>
                           <span className="font-medium text-sm">{company.name}</span>
                        </Card>
                     ))}
                  </div>
               </section>
               <section>
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                     <img src={interviewIcon} alt="Interview" className="h-8 w-8 object-contain" /> Recent Interview Experiences
                  </h2>
                  <div className="space-y-4">
                     {loading ? (
                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-3">
                           <Loader2 className="h-8 w-8 animate-spin text-primary" />
                           <p className="text-sm font-medium">Fetching real-time experiences...</p>
                        </div>
                     ) : articles.length > 0 ? (
                        articles.map((article) => (
                           <Card key={article.id} className="hover:bg-muted/30 cursor-pointer overflow-hidden transition-all border-l-4 border-l-transparent hover:border-l-primary group">
                              <CardContent className="p-4 flex justify-between items-center text-sm">
                                 <div className="flex-1 min-w-0 pr-4">
                                    <h4 className="font-bold text-base truncate group-hover:text-primary transition-colors">
                                       {article.title}
                                    </h4>
                                    <div className="flex items-center gap-3 mt-1 text-muted-foreground">
                                       <span className="flex items-center gap-1">
                                          <span className="font-medium text-foreground">{article.user.name}</span>
                                       </span>
                                       <span>•</span>
                                       <span>{new Date(article.published_at).toLocaleDateString()}</span>
                                       {article.tag_list && article.tag_list.slice(0, 2).map((tag: string) => (
                                          <span key={tag} className="hidden sm:inline bg-primary/5 text-primary text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">
                                             #{tag}
                                          </span>
                                       ))}
                                    </div>
                                 </div>
                                 <a
                                    href={article.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="shrink-0"
                                 >
                                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10 gap-2">
                                       Read <ExternalLink className="h-3 w-3" />
                                    </Button>
                                 </a>
                              </CardContent>
                           </Card>
                        ))
                     ) : (
                        <p className="text-muted-foreground py-8 text-center bg-muted/20 rounded-lg">No recent experiences found. Check back later!</p>
                     )}
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
         <footer className="mt-16 pt-8 border-t border-muted text-[10px] text-muted-foreground flex flex-col items-center gap-1 opacity-50">
            <p>Created by VIGNESH, VINITH, BAHADOORSHA, GOPAL</p>
         </footer>
      </div>
   );
}
