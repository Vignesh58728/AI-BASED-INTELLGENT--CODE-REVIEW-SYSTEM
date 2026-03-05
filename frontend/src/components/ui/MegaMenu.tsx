
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import schoolIcon from "@/assets/images/school.png";
import collegeIcon from "@/assets/images/college.png";
import itIcon from "@/assets/images/it.png";


const MegaMenu = () => {
   return (
      <nav className="hidden md:flex items-center gap-1">

         <Link
            to="/explore"
            className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white focus:outline-none disabled:pointer-events-none disabled:opacity-50 text-white"
         >
            Explore
         </Link>


         {/* Code Review */}
         <Link
            to="/ai/practice"
            className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white focus:outline-none disabled:pointer-events-none disabled:opacity-50 text-white"
         >
            Code Review
         </Link>


         {/* 2. AI (Direct Link to Chat) */}
         <Link
            to="/ai"
            className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white focus:outline-none disabled:pointer-events-none disabled:opacity-50 text-white"
         >
            AI
         </Link>

         {/* 2. Level Dropdown */}
         <div className="relative group">
            <button className="inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white focus:outline-none disabled:pointer-events-none disabled:opacity-50 text-white group-hover:text-primary">
               Levels <ChevronDown className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
            </button>
            <div className="absolute left-0 top-full pt-2 w-[400px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
               <div className="bg-neutral-900 rounded-xl border border-white/10 shadow-xl overflow-hidden p-4 grid gap-4 backdrop-blur-md">
                  <div className="space-y-4">
                     <h4 className="font-medium leading-none text-primary">Select Your Path</h4>
                     <div className="grid gap-2">
                        <Link to="/school" className="group/item flex items-center gap-4 rounded-lg p-2 hover:bg-white/5 transition-colors">
                           <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/5 group-hover/item:border-primary transition-colors">
                              <img src={schoolIcon} alt="School" className="h-7 w-7 object-contain" />
                           </div>
                           <div className="flex flex-col">
                              <span className="text-sm font-medium text-white">School Level</span>
                              <span className="text-xs text-zinc-400">Foundational concepts and basics</span>
                           </div>
                        </Link>
                        <Link to="/college" className="group/item flex items-center gap-4 rounded-lg p-2 hover:bg-white/5 transition-colors">
                           <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/5 group-hover/item:border-primary transition-colors">
                              <img src={collegeIcon} alt="College" className="h-7 w-7 object-contain" />
                           </div>
                           <div className="flex flex-col">
                              <span className="text-sm font-medium text-white">College Level</span>
                              <span className="text-xs text-zinc-400">DSA, Algorithms, and Logic</span>
                           </div>
                        </Link>
                        <Link to="/it" className="group/item flex items-center gap-4 rounded-lg p-2 hover:bg-white/5 transition-colors">
                           <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/5 group-hover/item:border-primary transition-colors">
                              <img src={itIcon} alt="IT" className="h-7 w-7 object-contain" />
                           </div>
                           <div className="flex flex-col">
                              <span className="text-sm font-medium text-white">Professional Level</span>
                              <span className="text-xs text-zinc-400">System Design & Advanced Topics</span>
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
