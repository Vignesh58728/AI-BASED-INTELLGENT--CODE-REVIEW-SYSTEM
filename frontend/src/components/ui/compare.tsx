"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CompareProps {
   firstImage?: string;
   secondImage?: string;
   className?: string;
   firstImageClassName?: string;
   secondImageClassname?: string;
   initialSliderPercentage?: number;
   slideMode?: "hover" | "drag";
   showHandlebar?: boolean;
   autoplay?: boolean;
   autoplayDuration?: number;
}

export const Compare = ({
   firstImage = "",
   secondImage = "",
   className,
   firstImageClassName,
   secondImageClassname,
   initialSliderPercentage = 50,
   slideMode = "hover",
   showHandlebar = true,
   autoplay = false,
   autoplayDuration = 5000,
}: CompareProps) => {
   const [sliderXPercent, setSliderXPercent] = useState(initialSliderPercentage);
   const [isDragging, setIsDragging] = useState(false);

   const sliderRef = useRef<HTMLDivElement>(null);

   // Unused state removed

   const autoplayRef = useRef<ReturnType<typeof setTimeout> | null>(null);

   const startAutoplay = useCallback(() => {
      if (!autoplay) return;

      const startTime = Date.now();
      const animate = () => {
         const elapsedTime = Date.now() - startTime;
         const progress = (elapsedTime % (autoplayDuration * 2)) / autoplayDuration;
         const percentage = progress <= 1 ? progress * 100 : (2 - progress) * 100;

         setSliderXPercent(percentage);
         autoplayRef.current = setTimeout(animate, 16); // ~60fps
      };

      animate();
   }, [autoplay, autoplayDuration]);

   const stopAutoplay = useCallback(() => {
      if (autoplayRef.current) {
         clearTimeout(autoplayRef.current);
         autoplayRef.current = null;
      }
   }, []);

   useEffect(() => {
      startAutoplay();
      return () => stopAutoplay();
   }, [startAutoplay, stopAutoplay]);

   function mouseEnterHandler() {
      stopAutoplay();
   }

   function mouseLeaveHandler() {
      if (slideMode === "hover") {
         setSliderXPercent(initialSliderPercentage);
      }
      if (slideMode === "drag") {
         setIsDragging(false);
      }
      startAutoplay();
   }

   const handleStart = useCallback(
      (_clientX: number) => {
         if (slideMode === "drag") {
            setIsDragging(true);
         }
      },
      [slideMode]
   );

   const handleEnd = useCallback(() => {
      if (slideMode === "drag") {
         setIsDragging(false);
      }
   }, [slideMode]);

   const handleMove = useCallback(
      (clientX: number) => {
         if (!sliderRef.current) return;
         if (slideMode === "hover" || (slideMode === "drag" && isDragging)) {
            const rect = sliderRef.current.getBoundingClientRect();
            const x = clientX - rect.left;
            const percent = (x / rect.width) * 100;
            setSliderXPercent(Math.max(0, Math.min(100, percent)));
         }
      },
      [slideMode, isDragging]
   );

   const handleMouseDown = useCallback((e: React.MouseEvent) => handleStart(e.clientX), [handleStart]);
   const handleMouseUp = useCallback(() => handleEnd(), [handleEnd]);
   const handleMouseMove = useCallback((e: React.MouseEvent) => handleMove(e.clientX), [handleMove]);

   const handleTouchStart = useCallback((e: React.TouchEvent) => handleStart(e.touches[0].clientX), [handleStart]);
   const handleTouchEnd = useCallback(() => handleEnd(), [handleEnd]);
   const handleTouchMove = useCallback((e: React.TouchEvent) => handleMove(e.touches[0].clientX), [handleMove]);

   return (
      <div
         ref={sliderRef}
         className={cn("w-[400px] h-[400px] overflow-hidden relative select-none", className)}
         onMouseEnter={mouseEnterHandler}
         onMouseLeave={mouseLeaveHandler}
         onMouseDown={handleMouseDown}
         onMouseUp={handleMouseUp}
         onMouseMove={handleMouseMove}
         onTouchStart={handleTouchStart}
         onTouchEnd={handleTouchEnd}
         onTouchMove={handleTouchMove}
      >
         <AnimatePresence initial={false}>
            <motion.div
               className="h-full w-px absolute top-0 m-auto z-30 bg-gradient-to-b from-transparent from-[5%] via-indigo-500 to-[95%] to-transparent"
               style={{
                  left: `${sliderXPercent}%`,
                  top: "0",
                  bottom: "0",
               }}
               transition={{ duration: 0 }}
            >
               <div className="w-36 h-full [mask-image:radial-gradient(100px_at_left,white,transparent)] absolute top-1/2 -translate-y-1/2 left-0 z-20 bg-gradient-to-r from-indigo-400 via-transparent to-transparent opacity-20 pointer-events-none" />
               <div className="w-10 h-1/2 [mask-image:radial-gradient(50px_at_left,white,transparent)] absolute top-1/2 -translate-y-1/2 left-0 z-10 bg-gradient-to-r from-cyan-400 via-transparent to-transparent opacity-50 pointer-events-none" />
               <div className="w-10 h-3/4 top-1/2 -translate-y-1/2 absolute -right-10 [mask-image:radial-gradient(100px_at_left,white,transparent)]">
                  <MemoizedSparklesCore
                     background="transparent"
                     minSize={0.4}
                     maxSize={1}
                     particleDensity={1200}
                     className="w-full h-full"
                     particleColor="#FFFFFF"
                  />
               </div>
               {showHandlebar && (
                  <div className="h-5 w-5 rounded-md top-1/2 -translate-y-1/2 bg-white z-30 -left-2.5 absolute flex items-center justify-center shadow-[0px_-1px_0px_0px_#FFFFFF40]">
                     <div className="h-3 w-3 text-black">
                        <svg
                           xmlns="http://www.w3.org/2000/svg"
                           width="24"
                           height="24"
                           viewBox="0 0 24 24"
                           fill="none"
                           stroke="currentColor"
                           strokeWidth="2"
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           className="h-3 w-3"
                        >
                           <path d="M18 8L22 12L18 16" />
                           <path d="M6 8L2 12L6 16" />
                        </svg>
                     </div>
                  </div>
               )}
            </motion.div>
         </AnimatePresence>
         <div className="overflow-hidden relative w-full h-full">
            <AnimatePresence initial={false}>
               {firstImage && (
                  <motion.img
                     className={cn("absolute inset-0 z-20 w-full h-full object-cover object-left-top select-none", firstImageClassName)}
                     src={firstImage}
                     key={firstImage}
                     transition={{ duration: 0 }}
                     style={{
                        clipPath: `inset(0 ${100 - sliderXPercent}% 0 0)`,
                     } as any}
                  />
               )}
            </AnimatePresence>
            <AnimatePresence initial={false}>
               {secondImage && (
                  <motion.img
                     className={cn("absolute inset-0 z-10 w-full h-full object-cover object-left-top select-none", secondImageClassname)}
                     src={secondImage}
                     key={secondImage}
                     transition={{ duration: 0 }}
                  />
               )}
            </AnimatePresence>
         </div>
      </div>
   );
};

const MemoizedSparklesCore = React.memo(SparklesCore);

function SparklesCore(_props: any) {
   return null;
}
