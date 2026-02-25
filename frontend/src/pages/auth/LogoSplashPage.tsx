import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BrandIcon } from "@/components/ui/BrandIcon";

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
         <div className="relative z-10 flex flex-col items-center">
            <motion.div
               initial={{ scale: 0.8, opacity: 0, filter: "blur(20px)" }}
               animate={{
                  scale: 1,
                  opacity: 1,
                  filter: "blur(0px)",
               }}
               transition={{
                  duration: 2.5,
                  ease: "easeOut",
               }}
               className="relative"
            >
               {/* Premium Glow Aura */}
               <motion.div
                  animate={{
                     opacity: [0.3, 0.6, 0.3],
                     scale: [1, 1.2, 1]
                  }}
                  transition={{
                     duration: 4,
                     repeat: Infinity,
                     ease: "easeInOut"
                  }}
                  className="absolute inset-0 bg-primary/20 blur-[80px] rounded-full z-0"
               />

               <motion.div
                  animate={{
                     y: [0, -15, 0],
                  }}
                  transition={{
                     duration: 5,
                     repeat: Infinity,
                     ease: "easeInOut"
                  }}
                  className="relative z-10"
               >
                  <BrandIcon size={220} className="drop-shadow-[0_0_40px_rgba(139,92,246,0.3)]" />
               </motion.div>
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

         </div>
      </div>
   );
}
