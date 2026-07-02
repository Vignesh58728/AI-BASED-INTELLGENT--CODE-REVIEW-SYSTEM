'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Terminal, Cpu, HardDrive, FolderTree } from 'lucide-react';

export default function JudgePage() {
   const router = useRouter();

   return (
      <div className="min-h-screen bg-[#050505] text-[#e4e4e7] p-8 font-sans relative overflow-hidden">
         {/* Premium Blur Background */}
         <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/5 blur-[120px] rounded-full" />
         </div>

         <div className="max-w-4xl mx-auto relative z-10 space-y-12">
            {/* Header */}
            <div className="flex items-center gap-6 border-b border-white/5 pb-8">
               <button
                  onClick={() => router.back()}
                  className="p-3 rounded-2xl hover:bg-white/5 text-zinc-500 hover:text-white transition-all group border border-white/5"
               >
                  <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
               </button>
               <div>
                  <h1 className="text-3xl font-black tracking-[0.3em] uppercase font-['Orbitron'] bg-gradient-to-r from-white via-white to-white/40 bg-clip-text text-transparent">
                     AI BASED INTELLGENCE
                  </h1>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] mt-1">CODE REVIEW SYSTEM</p>
               </div>
            </div>

            {/* Environment Setup Section */}
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
               <section className="space-y-6">
                  <div className="flex items-center gap-3 text-indigo-400">
                     <Cpu size={20} />
                     <h2 className="text-lg font-black uppercase tracking-widest">Environment Setup</h2>
                  </div>

                  <div className="grid gap-4">
                     <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-3xl backdrop-blur-xl flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                           <Terminal size={20} />
                        </div>
                        <div>
                           <p className="text-sm font-bold text-zinc-200">Python Initialization</p>
                           <p className="text-xs text-zinc-500 mt-0.5">Install Python (>=3.9)</p>
                        </div>
                     </div>

                     <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-3xl backdrop-blur-xl">
                        <div className="flex items-center gap-4 mb-4">
                           <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400">
                              <HardDrive size={20} />
                           </div>
                           <p className="text-sm font-bold text-zinc-200">Required Libraries</p>
                        </div>
                        <div className="bg-black/40 border border-white/5 p-4 rounded-2xl font-mono text-sm text-indigo-400">
                           pip install openai flask pylint
                        </div>
                     </div>
                  </div>
               </section>

               <section className="space-y-6">
                  <div className="flex items-center gap-3 text-indigo-400">
                     <FolderTree size={20} />
                     <h2 className="text-lg font-black uppercase tracking-widest">Project Structure</h2>
                  </div>

                  <div className="bg-zinc-900/50 border border-white/5 p-8 rounded-3xl backdrop-blur-xl font-mono text-sm leading-relaxed text-zinc-400">
                     <div className="text-white font-bold mb-2">/gpt-code-review</div>
                     <div className="pl-4 border-l border-white/10 space-y-1">
                        <div>├── backend/</div>
                        <div>├── frontend/</div>
                        <div>├── tests/</div>
                        <div>└── data/</div>
                     </div>
                  </div>
               </section>
            </div>
         </div>

         <style dangerouslySetInnerHTML={{
            __html: `
            @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Fira+Code&display=swap');
         `}} />
      </div>
   );
}
