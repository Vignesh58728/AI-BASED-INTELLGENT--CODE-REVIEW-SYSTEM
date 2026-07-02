"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export const BackgroundBeamsWithCollision = ({
   children,
   className,
}: {
   children: React.ReactNode;
   className?: string;
}) => {
   const containerRef = useRef<HTMLDivElement>(null);
   const parentRef = useRef<HTMLDivElement>(null);

   const beams = [
      {
         initialX: 10,
         translateX: 10,
         duration: 7,
         repeatDelay: 3,
         delay: 2,
      },
      {
         initialX: 600,
         translateX: 600,
         duration: 3,
         repeatDelay: 3,
         delay: 4,
      },
      {
         initialX: 100,
         translateX: 100,
         duration: 7,
         repeatDelay: 7,
         className: "h-20",
      },
      {
         initialX: 400,
         translateX: 400,
         duration: 5,
         repeatDelay: 14,
         delay: 4,
      },
      {
         initialX: 800,
         translateX: 800,
         duration: 11,
         repeatDelay: 2,
         className: "h-20",
      },
      {
         initialX: 1000,
         translateX: 1000,
         duration: 4,
         repeatDelay: 2,
         className: "h-12",
      },
      {
         initialX: 1200,
         translateX: 1200,
         duration: 6,
         repeatDelay: 4,
         delay: 2,
         className: "h-6",
      },
   ];

   return (
      <div
         ref={parentRef}
         className={cn(
            "min-h-screen relative flex items-center w-full justify-center overflow-hidden",
            className
         )}
      >
         {beams.map((beam) => (
            <CollisionMechanism
               key={beam.initialX + "beam-idx"}
               beamOptions={beam}
               containerRef={containerRef}
               parentRef={parentRef}
            />
         ))}
         {children}
         <div
            ref={containerRef}
            className="absolute bottom-0 bg-indigo-500/5 w-full inset-x-0 pointer-events-none"
            style={{
               boxShadow:
                  "0 0 24px rgba(99, 102, 241, 0.04), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(99, 102, 241, 0.02), 0 0 4px rgba(99, 102, 241, 0.04), 0 16px 68px rgba(99, 102, 241, 0.02)",
            }}
         ></div>
      </div>
   );
};

const CollisionMechanism = React.forwardRef<
   HTMLDivElement,
   {
      containerRef: React.RefObject<HTMLDivElement | null>;
      parentRef: React.RefObject<HTMLDivElement | null>;
      beamOptions?: {
         initialX?: number;
         translateX?: number;
         initialY?: number;
         translateY?: number;
         rotate?: number;
         className?: string;
         duration?: number;
         delay?: number;
         repeatDelay?: number;
      };
   }
>(({ parentRef, containerRef, beamOptions }) => {
   const beamRef = useRef<HTMLDivElement>(null);
   const [collision, setCollision] = useState<{
      detected: boolean;
      coordinates: { x: number; y: number } | null;
   }>({
      detected: false,
      coordinates: null,
   });
   const [beamKey, setBeamKey] = useState(0);

   useEffect(() => {
      const checkCollision = () => {
         if (
            beamRef.current &&
            containerRef.current &&
            parentRef.current &&
            !collision.detected
         ) {
            const beamRect = beamRef.current.getBoundingClientRect();
            const containerRect = containerRef.current.getBoundingClientRect();
            const parentRect = parentRef.current.getBoundingClientRect();

            if (beamRect.bottom >= containerRect.top) {
               const relativeX =
                  beamRect.left - parentRect.left + beamRect.width / 2;
               const relativeY = beamRect.bottom - parentRect.top;

               setCollision({
                  detected: true,
                  coordinates: {
                     x: relativeX,
                     y: relativeY,
                  },
               });
            }
         }
      };

      const animationInterval = setInterval(checkCollision, 50);

      return () => clearInterval(animationInterval);
   }, [collision.detected, containerRef, parentRef]);

   useEffect(() => {
      if (collision.detected) {
         setTimeout(() => {
            setCollision({
               detected: false,
               coordinates: null,
            });
            setBeamKey((prevKey) => prevKey + 1);
         }, 2000);
      }
   }, [collision.detected]);

   return (
      <>
         <motion.div
            key={beamKey}
            ref={beamRef}
            animate="animate"
            initial="initial"
            variants={{
               initial: {
                  translateY: beamOptions?.initialY || "-200px",
                  translateX: beamOptions?.initialX || "0px",
                  rotate: beamOptions?.rotate || 0,
               },
               animate: {
                  translateY: beamOptions?.translateY || "1800px",
                  translateX: beamOptions?.translateX || "0px",
                  rotate: beamOptions?.rotate || 0,
               },
            }}
            transition={{
               duration: beamOptions?.duration || 8,
               repeat: Infinity,
               repeatType: "loop",
               ease: "linear",
               delay: beamOptions?.delay || 0,
               repeatDelay: beamOptions?.repeatDelay || 0,
            }}
            className={cn(
               "absolute left-0 top-0 m-auto h-14 w-px rounded-full bg-gradient-to-t from-indigo-500 via-purple-500 to-transparent",
               beamOptions?.className
            )}
         />
         <AnimatePresence>
            {collision.detected && collision.coordinates && (
               <Explosion
                  key={`${collision.coordinates.x}-${collision.coordinates.y}`}
                  className=""
                  style={{
                     left: `${collision.coordinates.x}px`,
                     top: `${collision.coordinates.y}px`,
                     transform: "translate(-50%, -50%)",
                  }}
               />
            )}
         </AnimatePresence>
      </>
   );
});

CollisionMechanism.displayName = "CollisionMechanism";

const Explosion = ({ ...props }: React.HTMLProps<HTMLDivElement>) => {
   const spans = Array.from({ length: 20 }, (_, i) => i);

   return (
      <div {...props} className={cn("absolute z-50 h-2 w-2", props.className)}>
         <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute -inset-px h-px w-px rounded-full bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.5)]"
         />
         {spans.map((span) => (
            <motion.span
               key={span}
               initial={{ x: 0, y: 0, opacity: 1 }}
               animate={{
                  x: Math.random() * 80 - 40,
                  y: Math.random() * -80,
                  opacity: 0,
                  scale: [1, 0, 0],
               }}
               transition={{
                  duration: Math.random() * 1.5 + 0.5,
                  ease: "easeOut",
               }}
               className="absolute h-px w-px rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
            />
         ))}
      </div>
   );
};
