"use client";

import { cn } from "@/lib/utils";

interface ShineBorderProps {
   borderRadius?: number;
   borderWidth?: number;
   duration?: number;
   shineColor?: string | string[];
   className?: string;
}

/**
 * @name Shine Border
 * @description Shine Border is an animated background border effect.
 * @param {number} [borderRadius=8] - The border radius of the component.
 * @param {number} [borderWidth=1] - The border width of the component.
 * @param {number} [duration=14] - The duration of the animation in seconds.
 * @param {string | string[]} [shineColor="#000000"] - The color(s) of the shine effect.
 * @param {string} [className] - The class name of the component.
 */
export function ShineBorder({
   borderRadius = 8,
   borderWidth = 1,
   duration = 14,
   shineColor = "#000000",
   className,
}: ShineBorderProps) {
   return (
      <div
         style={
            {
               "--border-radius": `${borderRadius}px`,
               "--border-width": `${borderWidth}px`,
               "--duration": `${duration}s`,
               "--mask-linear-gradient": `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
               "--background-radial-gradient": `radial-gradient(transparent,transparent, ${Array.isArray(shineColor) ? shineColor.join(",") : shineColor
                  },transparent,transparent)`,
            } as React.CSSProperties
         }
         className={cn(
            "pointer-events-none absolute inset-0 size-full rounded-[--border-radius]",
            className,
         )}
      >
         <div
            className={cn(
               "before:bg-shine-size before:absolute before:inset-0 before:size-full before:rounded-[--border-radius] before:p-[--border-width] before:will-change-[background-position] before:content-['']",
               "before:![-webkit-mask-composite:xor] before:![mask-composite:exclude] before:[background-image:--background-radial-gradient] before:[background-size:300%_300%] before:[mask:--mask-linear-gradient]",
               "motion-safe:before:animate-[shine_var(--duration)_infinite_linear]",
            )}
         ></div>
      </div>
   );
}
