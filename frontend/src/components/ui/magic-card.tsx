"use client";

import React, { useCallback, useEffect } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

import { cn } from "@/lib/utils";

interface MagicCardProps extends React.HTMLAttributes<HTMLDivElement> {
   gradientSize?: number;
   gradientColor?: string;
   gradientOpacity?: number;
}

export function MagicCard({
   children,
   className,
   gradientSize = 200,
   gradientColor = "#262626",
   gradientOpacity = 0.8,
   ...props
}: MagicCardProps) {
   const mouseX = useMotionValue(0);
   const mouseY = useMotionValue(0);

   const handleMouseMove = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
         const { left, top } = e.currentTarget.getBoundingClientRect();
         mouseX.set(e.clientX - left);
         mouseY.set(e.clientY - top);
      },
      [mouseX, mouseY],
   );

   const handleMouseLeave = useCallback(() => {
      mouseX.set(-gradientSize);
      mouseY.set(-gradientSize);
   }, [mouseX, mouseY, gradientSize]);

   useEffect(() => {
      mouseX.set(-gradientSize);
      mouseY.set(-gradientSize);
   }, [mouseX, mouseY, gradientSize]);

   return (
      <div
         onMouseMove={handleMouseMove}
         onMouseLeave={handleMouseLeave}
         className={cn(
            "group relative flex size-full overflow-hidden rounded-xl bg-black text-black dark:text-white transition-all duration-300",
            className,
         )}
         {...props}
      >
         <div className="relative z-10 w-full">{children}</div>
         <motion.div
            className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
            style={{
               background: useMotionTemplate`
            radial-gradient(
              ${gradientSize}px circle at ${mouseX}px ${mouseY}px,
              ${gradientColor},
              transparent 100%
            )
          `,
               opacity: gradientOpacity,
            }}
         />
      </div>
   );
}
