import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

interface ModelSelectorProps {
   selectedModel: string;
   onModelChange: (model: string) => void;
   models?: string[];
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
   selectedModel,
   onModelChange,
   models = ["Llama 3.3", "DeepSeek-V3", "Gemini 2.0 Flash", "GPT-OSS-120b", "GPT-4o"]
}) => {
   const [isOpen, setIsOpen] = useState(false);

   return (
      <div className="relative">
         <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition-all text-[11px] font-bold tracking-tight"
         >
            <img
               src="/artificial-intelligence.png"
               alt="AI"
               className="w-4 h-4"
               style={{ filter: 'brightness(0) invert(1)' }}
            />
            {selectedModel}
            <ChevronDown size={12} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
         </button>

         <AnimatePresence>
            {isOpen && (
               <>
                  <div
                     className="fixed inset-0 z-[90]"
                     onClick={() => setIsOpen(false)}
                  />
                  <motion.div
                     initial={{ opacity: 0, y: 10, scale: 0.95 }}
                     animate={{ opacity: 1, y: 0, scale: 1 }}
                     exit={{ opacity: 0, y: 10, scale: 0.95 }}
                     className="absolute bottom-full mb-2 left-0 w-48 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl p-2 z-[100] backdrop-blur-xl"
                  >
                     {models.map(m => (
                        <button
                           key={m}
                           onClick={() => { onModelChange(m); setIsOpen(false); }}
                           className="w-full text-left px-3 py-2 hover:bg-white/5 rounded-lg text-[11px] font-medium flex items-center justify-between transition-colors"
                        >
                           {m} {selectedModel === m && <Check size={12} className="text-primary" />}
                        </button>
                     ))}
                  </motion.div>
               </>
            )}
         </AnimatePresence>
      </div>
   );
};
