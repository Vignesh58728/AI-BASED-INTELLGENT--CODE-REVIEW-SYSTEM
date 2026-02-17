"use client";

import { useState, useRef } from "react";
import { cn } from "../../lib/utils";
import { ChevronsLeftRight } from "lucide-react";
import { AivisoLogo } from "./AivisoLogo";

const beforeCode = [
   { text: "def calculate_total(items):", color: "text-blue-400" },
   { text: "    t = 0", color: "text-neutral-400" },
   { text: "    for i in items:", color: "text-purple-400" },
   { text: "        t = t + i['price']", color: "text-neutral-300" },
   { text: "    return t", color: "text-purple-400" },
];

const afterCode = [
   { text: "def calculate_total(items: list[dict]) -> float:", color: "text-blue-400" },
   { text: "    \"\"\"Calculates optimized sum of item prices.\"\"\"", color: "text-emerald-500 italic" },
   { text: "    return sum(item.get('price', 0) for item in items)", color: "text-emerald-400 font-bold" },
   { text: "# Optimized using built-in sum and generator", color: "text-neutral-500" },
   { text: "", color: "text-neutral-500" },
];

export function CodeComparisonSlider() {
   const [sliderPos, setSliderPos] = useState(50);
   const containerRef = useRef<HTMLDivElement>(null);

   const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = "touches" in e ? e.touches[0].clientX : e.clientX;
      const position = ((x - rect.left) / rect.width) * 100;

      setSliderPos(Math.min(Math.max(position, 0), 100));
   };

   return (
      <div className="w-full max-w-5xl mx-auto my-32 px-4">
         <div className="text-center mb-16 flex flex-col items-center gap-4">
            <AivisoLogo className="w-12 h-12" />
            <h3 className="text-3xl font-black text-white uppercase tracking-tighter" style={{ fontFamily: "'Outfit', system-ui" }}>
               Aiviso Power: Before vs After
            </h3>
         </div>

         <div
            ref={containerRef}
            className="relative h-[400px] w-full bg-black rounded-3xl overflow-hidden border border-white/10 cursor-col-resize group shadow-2xl"
            onMouseMove={handleMove}
            onTouchMove={handleMove}
         >
            {/* After Code (Right/Top Layer) */}
            <div className="absolute inset-0 p-8 md:p-12 font-mono text-sm md:text-base bg-black">
               <div className="space-y-3">
                  {afterCode.map((line, i) => (
                     <div key={i} className={cn(line.color, "whitespace-pre")}>{line.text}</div>
                  ))}
               </div>
            </div>

            {/* Before Code (Left Layer - Clipped) */}
            <div
               className="absolute inset-0 p-8 md:p-12 font-mono text-sm md:text-base bg-[#0a0a0a] border-r border-white/20 z-10"
               style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
            >
               <div className="space-y-3">
                  {beforeCode.map((line, i) => (
                     <div key={i} className={cn(line.color, "whitespace-pre")}>{line.text}</div>
                  ))}
               </div>
            </div>

            {/* Slider Handle */}
            <div
               className="absolute top-0 bottom-0 z-20 w-1 bg-white flex items-center justify-center pointer-events-none"
               style={{ left: `${sliderPos}%` }}
            >
               <div className="w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center text-black border-4 border-black/5">
                  <ChevronsLeftRight className="w-5 h-5" />
               </div>
            </div>

            {/* Labels */}
            <div className="absolute bottom-6 left-6 z-20 text-[10px] font-black text-white/30 uppercase tracking-[0.3em] pointer-events-none group-hover:opacity-0 transition-opacity">
               Original
            </div>
            <div className="absolute bottom-6 right-6 z-20 text-[10px] font-black text-white/30 uppercase tracking-[0.3em] pointer-events-none group-hover:opacity-0 transition-opacity">
               Clean Code
            </div>
         </div>
      </div>
   );
}
