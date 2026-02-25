import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/Card";
import { MagicCard } from "@/components/ui/magic-card";
import { useTheme } from "next-themes";
import pythonIcon from "@/assets/images/python.png";
import bookIcon from "@/assets/images/book.png";
import aiIcon from "@/assets/images/ai-assistant.png";

export function ExplorePage() {
   const { theme } = useTheme();
   const [articles, setArticles] = useState<any[]>([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchArticles = async () => {
         try {
            const response = await fetch('https://dev.to/api/articles?tag=coding&per_page=6');
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
         title: 'Learn DSA',
         image: bookIcon,
         desc: 'Master algorithms',
         path: '/college',
         detail: 'Structured Thinking'
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
      <div className="min-h-screen bg-black text-white space-y-12 p-12">
         <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tighter uppercase text-white">
               Explore <span className="text-primary">Now</span>
            </h1>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl">
            {mainModules.map((item, i) => (
               <Card key={i} className="w-full border-none p-0 shadow-none relative overflow-hidden bg-black group/card">
                  <MagicCard
                     gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
                     className="p-1 cursor-pointer transition-all duration-300 h-full border-none"
                  >
                     <CardContent className="p-8 flex items-center gap-8 relative z-10 h-full">
                        <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center border border-zinc-200 group-hover/card:scale-110 transition-transform duration-500 shadow-xl shrink-0">
                           <img src={item.image} alt={item.title} className="h-10 w-10 object-contain" />
                        </div>
                        <div>
                           <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-1">{item.title}</h3>
                           <p className="text-zinc-400 text-xs font-medium">{item.desc}</p>
                           <div className="mt-4 text-primary/60 text-[10px] font-black uppercase tracking-[0.2em]">{item.detail}</div>
                        </div>
                     </CardContent>
                  </MagicCard>
               </Card>
            ))}
         </div>

         {/* --- Daily Thirukkural Section --- */}
         <div className="py-12 text-center max-w-4xl mx-auto mb-16 relative overflow-hidden">
            <h2 className="text-2xl md:text-3xl font-medium text-white mb-6 leading-relaxed px-4 italic font-serif">
               "{dailyKural.tamil}"
            </h2>
            <p className="text-zinc-400 text-sm md:text-base font-medium max-w-2xl mx-auto px-6 leading-relaxed opacity-80">
               {dailyKural.meaning}
            </p>
         </div>

         {/* --- Latest Articles Section --- */}
         <div className="max-w-4xl space-y-8">
            <h2 className="text-xl font-black uppercase tracking-tight">Latest Articles</h2>
            <div className="space-y-4 bg-zinc-900/10 rounded-3xl p-4">
               {loading ? (
                  <div className="space-y-4 animate-pulse">
                     {[1, 2, 3].map(i => (
                        <div key={i} className="h-24 bg-white/5 rounded-2xl" />
                     ))}
                  </div>
               ) : (
                  articles.map((article: any) => (
                     <a
                        key={article.id}
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex gap-6 p-6 rounded-2xl border border-white/5 hover:bg-white/5 transition-all cursor-pointer group/article block"
                     >
                        <div className="hidden sm:block h-20 w-32 rounded-lg bg-zinc-800 overflow-hidden shrink-0">
                           {article.cover_image && (
                              <img src={article.cover_image} alt={article.title} className="h-full w-full object-cover grayscale group-hover/article:grayscale-0 transition-all" />
                           )}
                        </div>
                        <div className="flex-1 min-w-0">
                           <h3 className="text-lg font-bold text-white mb-1 group-hover/article:text-primary transition-colors truncate">
                              {article.title}
                           </h3>
                           <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-zinc-500">
                              <span>{article.user.name}</span>
                              <span className="opacity-20">//</span>
                              <span>{article.reading_time_minutes} min read</span>
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
