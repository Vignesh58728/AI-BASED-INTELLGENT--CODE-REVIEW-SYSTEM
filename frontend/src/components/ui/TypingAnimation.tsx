"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TypingAnimationProps {
   children: string;
   className?: string;
   duration?: number;
   delay?: number;
   as?: React.ElementType;
   style?: React.CSSProperties;
}

export default function TypingAnimation({
   children,
   className,
   duration = 100,
   delay = 0,
   as: Component = "h1",
   style,
}: TypingAnimationProps) {
   const [displayedText, setDisplayedText] = useState<string>("");
   const [i, setI] = useState<number>(0);

   useEffect(() => {
      const startTimeout = setTimeout(() => {
         const typingEffect = setInterval(() => {
            if (i < children.length) {
               setDisplayedText(children.substring(0, i + 1));
               setI(i + 1);
            } else {
               clearInterval(typingEffect);
            }
         }, duration);

         return () => {
            clearInterval(typingEffect);
         };
      }, delay);

      return () => {
         clearTimeout(startTimeout);
      };
   }, [duration, i, delay, children]);

   return (
      <Component
         className={cn(
            "font-display drop-shadow-sm whitespace-pre-wrap",
            className,
         )}
         style={style}
      >
         {displayedText ? displayedText : ""}
      </Component>
   );
}
