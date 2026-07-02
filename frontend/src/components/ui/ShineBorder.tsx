"use client";

import { cn } from "@/lib/utils";

interface ShineBorderProps {
  borderRadius?: number;
  borderWidth?: number;
  duration?: number;
  className?: string;
  children?: React.ReactNode;
  shineColor?: string | string[];
}

/**
 * @name Shine Border
 * @description It is an animated background border effect that uses a radial gradient and animation to create a shining effect.
 */
export function ShineBorder({
  borderRadius = 12,
  borderWidth = 1,
  duration = 14,
  className,
  children,
  shineColor = "#ffffff",
}: ShineBorderProps) {
  return (
    <div
      style={
        {
          "--border-radius": `${borderRadius}px`,
        } as React.CSSProperties
      }
      className={cn(
        "relative rounded-[var(--border-radius)] overflow-hidden",
        className,
      )}
    >
      <div
        style={
          {
            "--border-width": `${borderWidth}px`,
            "--duration": `${duration}s`,
            "--mask-linear-gradient": `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
            "--background-conic-gradient": `conic-gradient(from 0deg, transparent, ${
              Array.isArray(shineColor) ? shineColor.join(",") : shineColor
            }, transparent)`,
          } as React.CSSProperties
        }
        className={`pointer-events-none before:absolute before:inset-[-100%] before:size-[300%] before:rounded-[var(--border-radius)] before:p-[var(--border-width)] before:will-change-[transform] before:content-[""] before:![-webkit-mask-composite:xor] before:![mask-composite:exclude] before:[background-image:var(--background-conic-gradient)] before:[mask:var(--mask-linear-gradient)] motion-safe:before:animate-shine-spin`}
      ></div>
      {children}
    </div>
  );
}
