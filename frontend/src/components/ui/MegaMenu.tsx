import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Flame, Map, Target, Trophy, Sparkles, Clock } from 'lucide-react';
import schoolIcon from "@/assets/images/school.png";
import collegeIcon from "@/assets/images/college.png";
import itIcon from "@/assets/images/it.png";


const MegaMenu = () => {
   const location = useLocation();

   return (
      <nav className="hidden md:flex items-center gap-10 h-full px-4 md:px-6">
         <Link
            to="/explore"
            className={`nav-link-custom text-lg font-medium ${location.pathname === '/explore' ? 'text-blue-600' : ''}`}
            style={{ fontFamily: "'Spectral', serif" }}
         >
            Explore
         </Link>

         <Link
            to="/ai"
            className="nav-link-custom text-lg font-medium flex items-center gap-1"
            style={{ fontFamily: "'Spectral', serif" }}
         >
            Mind Arc
         </Link>

         <Link
            to="/ai/practice"
            className="nav-link-custom text-lg font-medium"
            style={{ fontFamily: "'Spectral', serif" }}
         >
            Code Review
         </Link>



         {/* 1. Challenges Dropdown 🔥 */}
         <div className="relative group">
            <button className="nav-link-custom flex items-center gap-1 text-lg font-medium" style={{ fontFamily: "'Spectral', serif" }}>
               Challenges <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 top-full pt-4 w-[350px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
               <div className="bg-white rounded-2xl border border-zinc-100 shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden p-4 grid gap-3 backdrop-blur-xl">
                  <div className="space-y-3">
                     <h4 className="font-bold text-base text-zinc-400 px-2 uppercase tracking-widest" style={{ fontFamily: "'Spectral', serif" }}>Daily Missions</h4>
                     <div className="grid gap-1">
                        <Link to="/practice/lc-two-sum" className="group/item flex items-center gap-3 rounded-xl p-3 hover:bg-orange-50 transition-all duration-300">
                           <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100/50">
                              <img src="/24-hours.png" alt="Daily" className="h-6 w-6 object-contain" />
                           </div>
                           <div className="flex flex-col">
                              <span className="text-sm font-bold text-black" style={{ fontFamily: "'Spectral', serif" }}>Daily Coding Problem</span>
                              <span className="text-[11px] text-zinc-500" style={{ fontFamily: "'Spectral', serif" }}>New challenge every 24 hours</span>
                           </div>
                        </Link>
                        <Link to="/practice/lc-generate-parentheses" className="group/item flex items-center gap-3 rounded-xl p-3 hover:bg-blue-50 transition-all duration-300">
                           <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100/50">
                              <img src="/week.png" alt="Weekly" className="h-6 w-6 object-contain" />
                           </div>
                           <div className="flex flex-col">
                              <span className="text-sm font-bold text-black" style={{ fontFamily: "'Spectral', serif" }}>Weekly Challenge</span>
                              <span className="text-[11px] text-zinc-500" style={{ fontFamily: "'Spectral', serif" }}>Master a new topic every week</span>
                           </div>
                        </Link>
                        <Link to="/school/beginner-rush" className="group/item flex items-center gap-3 rounded-xl p-3 hover:bg-green-50 transition-all duration-300">
                           <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100/50">
                              <img src="/newbie.png" alt="Beginner" className="h-6 w-6 object-contain" />
                           </div>
                           <div className="flex flex-col">
                              <span className="text-sm font-bold text-black" style={{ fontFamily: "'Spectral', serif" }}>Beginner Rush</span>
                              <span className="text-[11px] text-zinc-500" style={{ fontFamily: "'Spectral', serif" }}>Perfect for starting your journey</span>
                           </div>
                        </Link>

                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* 2. Levels Dropdown */}
         <div className="relative group">
            <button className="nav-link-custom flex items-center gap-1 text-lg font-medium" style={{ fontFamily: "'Spectral', serif" }}>
               Levels <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 top-full pt-4 w-[400px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
               <div className="bg-white rounded-2xl border border-zinc-100 shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden p-5 grid gap-4 backdrop-blur-xl">
                  <div className="space-y-4">
                     <h4 className="font-bold text-lg text-black px-2" style={{ fontFamily: "'Spectral', serif" }}>Select Your Path</h4>
                     <div className="grid gap-2">
                        <Link to="/school" className="group/item flex items-center gap-4 rounded-xl p-3 hover:bg-zinc-50 transition-all duration-300">
                           <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-zinc-100 bg-zinc-50 group-hover/item:border-[#2192ff] transition-colors">
                              <img src={schoolIcon} alt="School" className="h-8 w-8 object-contain" />
                           </div>
                           <div className="flex flex-col">
                              <span className="text-sm font-bold text-black" style={{ fontFamily: "'Spectral', serif" }}>School Level</span>
                              <span className="text-xs text-zinc-500" style={{ fontFamily: "'Spectral', serif" }}>Foundational concepts and basics</span>
                           </div>
                        </Link>
                        <Link to="/college" className="group/item flex items-center gap-4 rounded-xl p-3 hover:bg-zinc-50 transition-all duration-300">
                           <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-zinc-100 bg-zinc-50 group-hover/item:border-[#2192ff] transition-colors">
                              <img src={collegeIcon} alt="College" className="h-8 w-8 object-contain" />
                           </div>
                           <div className="flex flex-col">
                              <span className="text-sm font-bold text-black" style={{ fontFamily: "'Spectral', serif" }}>College Level</span>
                              <span className="text-xs text-zinc-500" style={{ fontFamily: "'Spectral', serif" }}>DSA, Algorithms, and Logic</span>
                           </div>
                        </Link>
                        <Link to="/it" className="group/item flex items-center gap-4 rounded-xl p-3 hover:bg-zinc-50 transition-all duration-300">
                           <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-zinc-100 bg-zinc-50 group-hover/item:border-[#2192ff] transition-colors">
                              <img src={itIcon} alt="IT" className="h-8 w-8 object-contain" />
                           </div>
                           <div className="flex flex-col">
                              <span className="text-sm font-bold text-black" style={{ fontFamily: "'Spectral', serif" }}>Professional Level</span>
                              <span className="text-xs text-zinc-500" style={{ fontFamily: "'Spectral', serif" }}>System Design & Advanced Topics</span>
                           </div>
                        </Link>
                     </div>
                  </div>
               </div>
            </div>
         </div>



      </nav>
   );
};

export default MegaMenu;
