import { useNavigate } from 'react-router-dom';

export function AIPracticePage() {
   const navigate = useNavigate();

   return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center relative">
         {/* Navigation */}
         <div className="absolute top-8 left-8">
            <button
               onClick={() => navigate(-1)}
               className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-800 hover:text-zinc-500 transition-colors"
            >
               / Back
            </button>
         </div>

         {/* Empty State */}
         <div className="text-zinc-900 font-black uppercase tracking-[1em] text-xs">
            Code Review
         </div>
      </div>
   );
}
