import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BrandIcon } from "@/components/ui/BrandIcon";
import Hyperspeed from "@/components/ui/Hyperspeed";
import { hyperspeedPresets } from "@/components/ui/HyperspeedPresets";

export function LogoSplashPage() {
   const navigate = useNavigate();

   useEffect(() => {
      const timer = setTimeout(() => {
         navigate("/register");
      }, 10000);

      return () => clearTimeout(timer);
   }, [navigate]);

   return (
      <div className="relative flex items-center justify-center min-h-screen w-full overflow-hidden bg-black">
         {/* Background Effect */}
         <div className="absolute inset-0 z-0 opacity-70">
            <Hyperspeed effectOptions={hyperspeedPresets.three as any} />
         </div>

         <div className="relative z-10 flex flex-col items-center">
            <motion.div
               initial={{ scale: 0.5, opacity: 0 }}
               animate={{
                  scale: [0.5, 1.2, 1],
                  opacity: 1,
                  rotate: [0, -10, 10, 0]
               }}
               transition={{
                  duration: 1.5,
                  ease: "easeOut",
                  times: [0, 0.6, 1]
               }}
            >
               <BrandIcon size={200} className="drop-shadow-[0_0_50px_rgba(139,92,246,0.5)]" />
            </motion.div>

            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.8, duration: 0.8 }}
               className="mt-12 text-center"
            >
               <h1 className="text-4xl md:text-6xl font-bold text-white tracking-[0.3em] uppercase mb-4" style={{ fontFamily: "'Syncopate', sans-serif" }}>
                  Aiviso <span className="text-primary">AI</span>
               </h1>
               <div className="h-[2px] w-48 bg-gradient-to-r from-transparent via-white to-transparent mx-auto opacity-50"></div>
               <p className="mt-4 text-white/40 text-sm tracking-[0.5em] uppercase font-light">
                  Initializing Intelligence
               </p>
            </motion.div>

            {/* Loading Indicator */}
            <motion.div
               className="mt-16 flex gap-2"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 1.2 }}
            >
               {[0, 1, 2].map((i) => (
                  <motion.div
                     key={i}
                     animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.3, 1, 0.3]
                     }}
                     transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.2
                     }}
                     className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_white]"
                  />
               ))}
            </motion.div>
         </div>
      </div>
   );
}
