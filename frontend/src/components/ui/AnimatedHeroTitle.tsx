"use client";

import { motion, Variants } from "framer-motion";
import { useEffect, useState } from "react";

const wordsTop = ["MIND"];
const wordsBottom = ["ARC"];

export function AnimatedHeroTitle() {
   const [showLightning, setShowLightning] = useState(false);

   useEffect(() => {
      // Trigger lightning flash after words finish (approx 3 seconds)
      const timer = setTimeout(() => {
         setShowLightning(true);
         setTimeout(() => setShowLightning(false), 300); // 300ms flash
      }, 3000);

      return () => clearTimeout(timer);
   }, []);

   const containerVariants: Variants = {
      visible: {
         transition: {
            staggerChildren: 0.4,
         },
      },
   };

   const wordVariants: Variants = {
      hidden: { opacity: 0, y: 20, scale: 0.8 },
      visible: {
         opacity: 1,
         y: 0,
         scale: 1,
         transition: { type: "spring", stiffness: 100 }
      },
   };

   return (
      <div className="relative flex flex-col items-center justify-center py-20 overflow-hidden w-full">
         {/* Lightning Flash Overlay */}
         <motion.div
            animate={{ opacity: showLightning ? 0.3 : 0 }}
            className="absolute inset-0 bg-white z-10 pointer-events-none"
         />

         {/* The Lightning Bolt SVG */}
         {showLightning && (
            <motion.svg
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="absolute z-30 w-full h-[300px] pointer-events-none text-yellow-400"
               viewBox="0 0 1000 300"
               fill="none"
               stroke="currentColor"
               strokeWidth="4"
               strokeLinecap="round"
            >
               <motion.path
                  d="M100,50 L400,150 L350,170 L900,280"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.2 }}
               />
               <motion.path
                  d="M200,20 L500,100 L450,120 L800,200"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.2, delay: 0.1 }}
               />
            </motion.svg>
         )}

         <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative z-20 flex flex-col items-center gap-4"
         >
            {/* Top Row: MIND */}
            <div className="flex gap-4 md:gap-10">
               {wordsTop.map((word, i) => (
                  <motion.span
                     key={i}
                     variants={wordVariants}
                     className="text-4xl md:text-7xl font-black tracking-[0.3em] text-neutral-400"
                     style={{ fontFamily: "'Outfit', system-ui" }}
                  >
                     {word}
                  </motion.span>
               ))}
            </div>

            {/* Bottom Row: ARC */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-8 mt-6">
               {wordsBottom.map((word, i) => (
                  <motion.span
                     key={i}
                     variants={wordVariants}
                     className="text-3xl md:text-6xl lg:text-8xl font-black tracking-tight"
                     style={{
                        fontFamily: "'Outfit', system-ui",
                        background: "linear-gradient(to right, #363062, #6d28d9, #F99417)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent"
                     }}
                  >
                     {word}
                  </motion.span>
               ))}
            </div>
         </motion.div>

         {/* Delayed Glow Pulse */}
         <motion.div
            animate={{
               scale: showLightning ? [1, 1.3, 1] : 1,
               opacity: showLightning ? [0, 0.6, 0] : 0
            }}
            transition={{ duration: 0.3 }}
            className="absolute w-[1000px] h-[400px] bg-purple-500/30 rounded-full blur-[120px] pointer-events-none"
         />
      </div>
   );
}
