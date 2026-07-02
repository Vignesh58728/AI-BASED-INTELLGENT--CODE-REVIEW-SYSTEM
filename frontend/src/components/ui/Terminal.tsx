import { useEffect, useState, ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

interface TerminalProps {
   children: ReactNode;
   className?: string;
}

export function Terminal({ children, className }: TerminalProps) {
   return (
      <div className={cn(
         "w-full max-w-2xl mx-auto bg-[#0d1117] rounded-xl overflow-hidden shadow-2xl border border-neutral-800 font-mono text-sm sm:text-base",
         className
      )}>
         <div className="flex items-center gap-2 px-4 py-3 bg-[#161b22] border-b border-neutral-800">
            <div className="flex gap-1.5">
               <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
               <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
               <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
            </div>
            <div className="flex-1 text-center pr-12">
               <span className="text-xs text-neutral-500">bash</span>
            </div>
         </div>
         <div className="p-6 space-y-2 min-h-[300px]">
            {children}
         </div>
      </div>
   );
}

interface TypingAnimationProps {
   children: string;
   className?: string;
   delay?: number;
}

export function TypingAnimation({ children, className, delay = 0 }: TypingAnimationProps) {
   const [displayedText, setDisplayedText] = useState("");

   useEffect(() => {
      const timer = setTimeout(() => {
         let i = 0;
         const interval = setInterval(() => {
            setDisplayedText(children.slice(0, i + 1));
            i++;
            if (i >= children.length) clearInterval(interval);
         }, 50);
         return () => clearInterval(interval);
      }, delay);
      return () => clearTimeout(timer);
   }, [children, delay]);

   return (
      <div className={cn("flex items-start gap-2", className)}>
         <span className="text-blue-400">$</span>
         <span>{displayedText}</span>
         <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="w-2 h-4 bg-neutral-400 mt-1"
         />
      </div>
   );
}

interface AnimatedSpanProps {
   children: ReactNode;
   className?: string;
   delay?: number;
}

export function AnimatedSpan({ children, className, delay = 0 }: AnimatedSpanProps) {
   return (
      <motion.div
         initial={{ opacity: 0, x: -5 }}
         animate={{ opacity: 1, x: 0 }}
         transition={{ delay: delay / 1000, duration: 0.3 }}
         className={cn("flex items-center gap-2", className)}
      >
         {children}
      </motion.div>
   );
}
