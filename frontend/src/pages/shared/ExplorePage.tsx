import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/Card";
import { BorderBeam } from "@/components/ui/BorderBeam";
import pythonIcon from "@/assets/images/python.png";
import bookIcon from "@/assets/images/book.png";
import aiIcon from "@/assets/images/ai-assistant.png";
import consoleIcon from "@/assets/images/console-icon.png";
import itIcon from "@/assets/images/it.png";

export function ExplorePage() {
   const navigate = useNavigate();
   const [articles, setArticles] = useState<any[]>([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchArticles = async () => {
         try {
            // Increased to 12 articles for a richer grid
            const response = await fetch('https://dev.to/api/articles?tag=coding&per_page=12');
            const data = await response.json();
            setArticles(data);
         } catch (error) {
            console.error('Error fetching articles:', error);
         } finally {
            setLoading(false);
         }
      };
      fetchArticles();
   }, []);

   // --- Daily Thirukkural Logic ---
   const kurals = [
      {
         tamil: "தெய்வத்தான் ஆகா தெனினும் முயற்சிதன் மெய்வருத்தக் கூலி தரும்.",
         meaning: "Even if divine help is unavailable, the effort put in by one's own body will yield its reward."
      },
      {
         tamil: "கற்க கசடறக் கற்பவை கற்றபின் நிற்க அதற்குத் தக.",
         meaning: "Learn what needs to be learned flawlessly; then act according to what you have learned."
      },
      {
         tamil: "எண்ணித் துணிக கருமம் துணிந்தபின் எண்ணுவம் என்பது இழுக்கு.",
         meaning: "Think deeply before starting any action; to think after starting is a failing."
      }
   ];

   const dailyKural = kurals[new Date().getDate() % kurals.length];

   const mainModules = [
      {
         title: 'New to Coding?',
         image: pythonIcon,
         desc: 'Start your journey here',
         path: '/school',
         detail: 'Python & Logic'
      },
      {
         title: 'AI BASED INTELLGENCE',
         image: aiIcon,
         desc: 'Code Review',
         path: '/ai/practice',
         detail: 'CODE REVIEW SYSTEM'
      },
      {
         title: 'AIVISO Assistant',
         image: aiIcon,
         desc: 'AI-powered reviews',
         path: '/ai-coach',
         detail: 'Smart Guidance'
      }
   ];

   return (
      <div className="min-h-screen bg-black text-white space-y-12 p-8 md:p-12">
         {/* --- Hero Header --- */}
         <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight uppercase text-white leading-none">
               Explore <span className="text-primary">Now</span>
            </h1>
         </div>

         {/* --- Main Modules Grid --- */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
            {mainModules.map((item, i) => (
               <Card key={i} className="group/card w-full border border-zinc-800/50 p-0 shadow-xl relative overflow-hidden bg-zinc-900/30 backdrop-blur-sm transition-all duration-500 hover:border-zinc-700/50">
                  <CardContent className="p-6 flex items-center gap-6 relative z-10 h-full cursor-pointer" onClick={() => navigate(item.path)}>
                     <div className="bg-white/90 p-3 rounded-xl flex items-center justify-center border border-zinc-200 group-hover/card:scale-105 transition-all duration-500 shadow-lg shrink-0">
                        <img src={item.image} alt={item.title} className="h-8 w-8 object-contain" />
                     </div>
                     <div>
                        <h3 className="text-xl font-black text-white uppercase tracking-tight">{item.title}</h3>
                     </div>
                  </CardContent>
               </Card>
            ))}
         </div>


         {/* --- Daily Thirukkural Section --- */}
         <div className="py-12 text-center max-w-4xl mx-auto relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-800/5 to-transparent blur-3xl opacity-30" />
            <h2 className="text-lg md:text-2xl font-light text-white mb-6 leading-tight px-4 italic font-serif">
               "{dailyKural.tamil}"
            </h2>
            <div className="h-px w-16 bg-zinc-800 mx-auto mb-6" />
            <p className="text-zinc-500 text-xs md:text-base font-medium max-w-xl mx-auto px-6 leading-relaxed">
               {dailyKural.meaning}
            </p>
         </div>

         {/* --- Latest Articles Section --- */}
         <div className="space-y-8 pb-16">
            <div className="flex items-end justify-between border-b border-zinc-900 pb-6">
               <div className="space-y-1">
                  <h2 className="text-2xl font-black uppercase tracking-tighter">Latest Articles</h2>
               </div>
            </div>

            <div className="max-w-5xl space-y-6">
               {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                     <div key={i} className="h-20 bg-zinc-900/10 rounded-lg animate-pulse" />
                  ))
               ) : (
                  articles.map((article: any) => (
                     <a
                        key={article.id}
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/article block border-b border-zinc-900/50 pb-6 last:border-0"
                     >
                        <div className="flex gap-5">
                           <div className="hidden sm:block h-20 w-32 rounded-lg bg-zinc-900 overflow-hidden shrink-0 border border-white/5">
                              {article.cover_image ? (
                                 <img
                                    src={article.cover_image}
                                    alt={article.title}
                                    className="h-full w-full object-cover grayscale transition-all duration-500 group-hover/article:grayscale-0 group-hover/article:scale-105"
                                 />
                              ) : (
                                 <div className="h-full w-full bg-gradient-to-br from-zinc-800 to-zinc-900" />
                              )}
                           </div>

                           <div className="flex-1 flex flex-col justify-center min-w-0">
                              <div className="flex gap-2 mb-1.5">
                                 {article.tag_list?.slice(0, 3).map((tag: string) => (
                                    <span key={tag} className="text-[8px] font-black uppercase tracking-[0.15em] text-zinc-600">
                                       #{tag}
                                    </span>
                                 ))}
                              </div>

                              <h3 className="text-lg font-bold text-white leading-snug mb-2 group-hover/article:text-primary transition-colors truncate">
                                 {article.title}
                              </h3>

                              <div className="flex items-center justify-between">
                                 <div className="flex items-center gap-2.5">
                                    {article.user?.profile_image_90 && (
                                       <img src={article.user.profile_image_90} className="h-4 w-4 rounded-full grayscale opacity-70" alt={article.user.name} />
                                    )}
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">
                                       {article.user.name}
                                    </span>
                                    <span className="text-zinc-800">/</span>
                                    <span className="text-[9px] font-bold text-zinc-600 tabular-nums uppercase tracking-widest">
                                       {article.reading_time_minutes} min read
                                    </span>
                                 </div>

                                 <div className="hidden md:flex items-center text-primary text-[9px] font-black uppercase tracking-[0.2em] opacity-0 group-hover/article:opacity-100 transition-opacity">
                                    Read Article →
                                 </div>
                              </div>
                           </div>
                        </div>
                     </a>
                  ))
               )}
            </div>
         </div>
      </div>
   );
}
