import { cn } from "@/lib/utils";
import React from "react";

interface IphoneProps extends React.HTMLAttributes<HTMLDivElement> {
   children?: React.ReactNode;
}

export function Iphone({ children, className, ...props }: IphoneProps) {
   return (
      <div
         className={cn(
            "relative mx-auto h-[700px] w-[350px] rounded-[3rem] border-[8px] border-neutral-800 bg-neutral-900 p-2 shadow-2xl",
            className
         )}
         {...props}
      >
         {/* Notch */}
         <div className="absolute left-1/2 top-0 h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-neutral-800" />

         {/* Power Button */}
         <div className="absolute -right-2 top-32 h-12 w-1 rounded-l-md bg-neutral-800" />

         {/* Volume Buttons */}
         <div className="absolute -left-2 top-24 h-8 w-1 rounded-r-md bg-neutral-800" />
         <div className="absolute -left-2 top-36 h-12 w-1 rounded-r-md bg-neutral-800" />
         <div className="absolute -left-2 top-52 h-12 w-1 rounded-r-md bg-neutral-800" />

         {/* Content Area */}
         <div className="h-full w-full overflow-hidden rounded-[2.5rem] bg-black">
            {children}
         </div>

         {/* Home Indicator */}
         <div className="absolute bottom-2 left-1/2 h-1 w-24 -translate-x-1/2 rounded-full bg-white/20" />
      </div>
   );
}
