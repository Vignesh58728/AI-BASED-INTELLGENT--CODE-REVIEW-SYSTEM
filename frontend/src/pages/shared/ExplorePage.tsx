import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Star, GitFork, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';



export function ExplorePage() {
   const navigate = useNavigate();
   const [articles, setArticles] = useState<any[]>([]);
   const [repos, setRepos] = useState<any[]>([]);
   const [loading, setLoading] = useState(true);
   const [reposLoading, setReposLoading] = useState(true);

   useEffect(() => {

      const fetchArticles = async () => {
         try {
            const response = await fetch('https://dev.to/api/articles?tag=coding&per_page=10');
            const data = await response.json();
            setArticles(data);
         } catch (error) {
            console.error('Error fetching articles:', error);
         } finally {
            setLoading(false);
         }
      };

      const fetchTrendingRepos = async () => {
         try {
            // Fetching repositories with >1000 stars (as a proxy for trending)
            const response = await fetch('https://api.github.com/search/repositories?q=stars:>1000+pushed:>2024-01-01&sort=stars&order=desc&per_page=6');
            const data = await response.json();
            setRepos(data.items || []);
         } catch (error) {
            console.error('Error fetching repos:', error);
         } finally {
            setReposLoading(false);
         }
      };

      fetchArticles();
      fetchTrendingRepos();
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
         title: 'Powerful Code Review System',
         content: 'Start your journey from scratch with comprehensive fundamentals.',
         path: '/school'
      },
      {
         title: 'AI Teacher',
         content: 'Master core concepts to ace interviews and build efficient code.',
         path: '/college/ds'
      },
      {
         title: 'Mind Arc Assistant',
         content: 'Your personal AI tutor to guide you through complex problems.',
         path: '/ai-coach'
      }
   ];

   return (
      <div className="min-h-screen bg-white text-black space-y-12 px-4 md:px-12 py-20 relative overflow-hidden">
         {/* Premium background layer (Local Image) */}
         <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.85 }}
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
               backgroundImage: `url(/pexels-codioful-7130543.jpg)`,
               backgroundSize: 'cover',
               backgroundPosition: 'center',
               filter: 'grayscale(100%) brightness(1.5) contrast(100%)',
               mixBlendMode: 'multiply'
            }}
         />

         {/* Premium background mesh gradients - Refined for Code Visibility */}
         <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-white/10 via-white/40 to-white/80 z-[1]" />
         <div className="absolute -top-[10%] -right-[10%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-white/20 via-transparent to-transparent blur-[120px] pointer-events-none opacity-40 z-[2]" />
         <div className="absolute -bottom-[10%] -left-[10%] w-[60%] h-[60%] rounded-full bg-gradient-to-tr from-white/20 via-transparent to-transparent blur-[120px] pointer-events-none opacity-40 z-[2]" />

         {/* --- Main Modules Section --- */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full relative z-10 px-0">
            {mainModules.map((item, i) => (
               <div
                  key={i}
                  onClick={() => navigate(item.path)}
                  className="group/card w-full mx-auto bg-[#f5f5f5] rounded-[10px] p-[50px_30px] relative overflow-hidden flex flex-col items-start shadow-[0_0_10px_#4445] cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_5px_20px_#444e]"
               >
                  {/* Number Bubble & Expanding Background */}
                  <div className="absolute -top-[90px] -right-[85px] pt-[80px] pr-[100px] pb-[30px] pl-[30px] bg-purple-500 rounded-full z-[5]">
                     <p className="mt-[20px] text-[28px] font-semibold text-white">
                        0{i + 1}
                     </p>
                     
                     <div className="absolute w-[50px] h-[50px] bg-purple-500 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-500 group-hover/card:w-[1200px] group-hover/card:h-[1200px] -z-[1]" />
                  </div>



                  {/* Heading */}
                  <h3 className="relative z-10 text-[26px] font-[800] text-black transition-all duration-500 group-hover/card:text-[#f5f5f5] mb-5 font-['Dancing_Script'] leading-tight tracking-wider">
                     {item.title}
                  </h3>

                  {/* Content */}
                  <p className="relative z-10 text-xl text-zinc-600 transition-all duration-500 group-hover/card:text-[#f5f5f5] font-['Dancing_Script']">
                     {item.content}
                  </p>
               </div>
            ))}
         </div>

         {/* --- Daily Thirukkural Section --- */}
         <div className="py-24 text-center max-w-5xl mx-auto relative z-10">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent blur-[120px] opacity-60 -z-1" />

            <h2 className="text-2xl md:text-3xl font-bold text-black mb-8 leading-tight px-4 tracking-[-0.02em]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
               "{dailyKural.tamil}"
            </h2>

            <p className="text-zinc-600 text-lg font-light max-w-3xl mx-auto px-6 leading-relaxed" style={{ fontFamily: "'Outfit', sans-serif" }}>
               {dailyKural.meaning}
            </p>
         </div>

         {/* --- GitHub Trending Repositories --- */}
         <div className="space-y-12 relative z-10">
            <div className="flex items-center justify-between border-b border-black/10 pb-8">
               <h2 className="text-4xl font-bold tracking-tight text-black" style={{ fontFamily: "'Instrument Serif', serif" }}>Trending Repos</h2>
               <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest"></span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {reposLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                     <div key={i} className="h-48 bg-zinc-50 rounded-none animate-pulse border border-black/5" />
                  ))
               ) : (
                  repos.map((repo, idx) => (
                     <motion.div
                        key={repo.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="group/repo bg-white/40 backdrop-blur-2xl border-2 border-black/5 p-8 rounded-none hover:border-black/20 hover:shadow-xl transition-all duration-500 flex flex-col justify-between"
                     >
                        <div className="space-y-4">
                           <div className="flex items-center justify-between">
                              <div className="h-10 w-10 rounded-none overflow-hidden border border-black/10">
                                 <img src={repo.owner?.avatar_url} alt={repo.owner?.login} className="h-full w-full object-cover" />
                              </div>
                              <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="p-2 bg-black/5 rounded-full hover:bg-black text-black hover:text-white transition-all">
                                 <ExternalLink size={14} />
                              </a>
                           </div>

                           <div>
                              <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-1" style={{ fontFamily: "'Instrument Serif', serif" }}>{repo.owner?.login}</h4>
                              <h3 className="text-2xl font-bold text-black group-hover/repo:text-primary leading-tight truncate" style={{ fontFamily: "'Instrument Serif', serif" }}>
                                 {repo.name}
                              </h3>
                           </div>

                           <p className="text-zinc-500 text-[17px] leading-relaxed line-clamp-2 min-h-[48px]" style={{ fontFamily: "'Instrument Serif', serif" }}>
                              {repo.description || "No description provided for this repository."}
                           </p>
                        </div>

                        <div className="mt-8 flex items-center justify-between pt-6 border-t border-black/5">
                           <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1.5">
                                 <Star size={14} className="text-yellow-500 fill-yellow-500" />
                                 <span className="text-xs font-bold text-black tracking-tight">{(repo.stargazers_count / 1000).toFixed(1)}k</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                 <GitFork size={14} className="text-zinc-400" />
                                 <span className="text-xs font-bold text-black tracking-tight">{repo.forks_count}</span>
                              </div>
                           </div>
                           {repo.language && (
                              <span className="text-[9px] font-black uppercase tracking-wider bg-black/5 px-3 py-1 rounded-full text-black">
                                 {repo.language}
                              </span>
                           )}
                        </div>
                     </motion.div>
                  ))
               )}
            </div>
         </div>

         {/* --- Latest Articles Section --- */}
         <div className="space-y-10 pb-16 relative z-10">
            <div className="flex items-end justify-between border-b border-black/10 pb-8">
               <div className="space-y-2">
                  <h2 className="text-4xl font-bold tracking-tight text-black" style={{ fontFamily: "'Instrument Serif', serif" }}>Latest Insights</h2>
               </div>
            </div>

            <div className="max-w-5xl space-y-10">
               {loading ? (
                  Array.from({ length: 10 }).map((_, i) => (
                     <div key={i} className="h-32 bg-zinc-100/50 rounded-none animate-pulse" />
                  ))
               ) : (
                  articles.map((article: any) => (
                     <a
                        key={article.id}
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/article block border-b border-black/10 py-10 last:border-0 transition-all duration-500"
                     >
                        <div className="flex flex-col sm:flex-row gap-8 items-center">
                           <div className="h-40 sm:h-28 sm:w-48 rounded-none overflow-hidden shrink-0 border border-black/5 shadow-md">
                              {(article.cover_image || article.social_image) ? (
                                 <img
                                    src={article.cover_image || article.social_image}
                                    alt={article.title}
                                    className="h-full w-full object-cover transition-all duration-700 group-hover/article:scale-105"
                                 />
                              ) : (
                                 <div className="h-full w-full bg-zinc-50 flex items-center justify-center">
                                    <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">No Image</span>
                                 </div>
                              )}
                           </div>

                           <div className="flex-1 flex flex-col justify-center min-w-0">
                              <div className="flex flex-wrap gap-3 mb-3">
                                 {article.tag_list?.slice(0, 3).map((tag: string) => (
                                    <span key={tag} className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                                       #{tag}
                                    </span>
                                 ))}
                              </div>

                              <h3 className="text-3xl font-bold text-black leading-tight mb-4 group-hover/article:underline decoration-black/20 underline-offset-8 transition-all" style={{ fontFamily: "'Instrument Serif', serif" }}>
                                 {article.title}
                              </h3>

                              <div className="flex items-center justify-between">
                                 <div className="flex items-center gap-3">
                                    {article.user?.profile_image_90 && (
                                       <img src={article.user.profile_image_90} className="h-6 w-6 rounded-full border border-black/10" alt={article.user.name} />
                                    )}
                                    <div className="flex items-center gap-3">
                                       <span className="text-sm font-bold uppercase tracking-wider text-black" style={{ fontFamily: "'Instrument Serif', serif" }}>
                                          {article.user.name}
                                       </span>
                                       <span className="w-1 h-1 bg-black/20 rounded-full" />
                                       <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest">
                                          {article.reading_time_minutes} min read
                                       </span>
                                    </div>
                                 </div>

                                 <div className="hidden md:block text-black font-bold uppercase tracking-[0.2em] text-[10px] opacity-0 group-hover/article:opacity-100 transition-all duration-500">
                                    Read Article <span className="ml-2">→</span>
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
