"use client";

import { cn } from "@/lib/utils";
import React, {
   useRef,
   useEffect,
   useCallback,
} from "react";

export const CardContainer = ({
   children,
   className,
   containerClassName,
}: {
   children?: React.ReactNode;
   className?: string;
   containerClassName?: string;
}) => {
   const containerRef = useRef<HTMLDivElement>(null);

   const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;
      const { left, top, width, height } =
         containerRef.current.getBoundingClientRect();
      const x = (e.clientX - left - width / 2) / 25;
      const y = (e.clientY - top - height / 2) / 25;
      containerRef.current.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
   };

   const handleMouseEnter = () => {
      if (!containerRef.current) return;
   };

   const handleMouseLeave = () => {
      if (!containerRef.current) return;
      containerRef.current.style.transform = `rotateY(0deg) rotateX(0deg)`;
   };

   return (
      <div
         className={cn(
            "flex items-center justify-center",
            containerClassName
         )}
         style={{
            perspective: "1000px",
         } as React.CSSProperties}
      >
         <div
            ref={containerRef}
            onMouseEnter={handleMouseEnter}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={cn(
               "flex items-center justify-center relative transition-all duration-200 ease-linear",
               className
            )}
            style={{
               transformStyle: "preserve-3d",
            }}
         >
            {children}
         </div>
      </div>
   );
};

export const CardBody = ({
   children,
   className,
}: {
   children: React.ReactNode;
   className?: string;
}) => {
   return (
      <div
         className={cn(
            "h-96 w-96 [transform-style:preserve-3d]  [&>*]:[transform-style:preserve-3d]",
            className
         )}
      >
         {children}
      </div>
   );
};

export const CardItem = ({
   as: Tag = "div",
   children,
   className,
   translateX = 0,
   translateY = 0,
   translateZ = 0,
   rotateX = 0,
   rotateY = 0,
   rotateZ = 0,
   ...rest
}: {
   as?: React.ElementType;
   children: React.ReactNode;
   className?: string;
   translateX?: number | string;
   translateY?: number | string;
   translateZ?: number | string;
   rotateX?: number | string;
   rotateY?: number | string;
   rotateZ?: number | string;
   [key: string]: any;
}) => {
   const ref = useRef<any>(null);

   const handleAnimations = useCallback(() => {
      if (!ref.current) return;
      ref.current.style.transform = `translateX(${translateX}px) translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`;
   }, [translateX, translateY, translateZ, rotateX, rotateY, rotateZ]);

   useEffect(() => {
      handleAnimations();
   }, [handleAnimations]);

   const CustomTag = Tag as any;

   return (
      <CustomTag
         ref={ref}
         className={cn("transition duration-200 ease-linear", className)}
         {...rest}
      >
         {children}
      </CustomTag>
   );
};
