import { cn } from "@/lib/utils";
import React from "react";

interface SafariProps extends React.HTMLAttributes<HTMLDivElement> {
   url?: string;
   src?: string;
   children?: React.ReactNode;
}

export function Safari({
   url = "aiviso.ai",
   src,
   children,
   className,
   ...props
}: SafariProps) {
   return (
      <div
         className={cn(
            "relative rounded-xl border border-white/10 bg-[#080808] shadow-2xl",
            className
         )}
         {...props}
      >
         {/* Browser Header */}
         <div className="flex items-center gap-4 border-b border-white/5 bg-white/5 px-4 py-3 backdrop-blur-md rounded-t-xl">
            {/* Traffic Lights */}
            <div className="flex gap-2">
               <div className="h-3 w-3 rounded-full bg-[#ff5f56]" />
               <div className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
               <div className="h-3 w-3 rounded-full bg-[#27c93f]" />
            </div>

            {/* Address Bar */}
            <div className="flex flex-1 items-center justify-center">
               <div className="flex h-7 w-full max-w-md items-center justify-center rounded-lg bg-white/5 border border-white/5 px-3 text-[11px] text-white/40">
                  <span className="truncate">{url}</span>
               </div>
            </div>

            {/* Spacer to balance traffic lights */}
            <div className="w-12" />
         </div>

         {/* Content Area */}
         <div className="p-1 sm:p-2">
            <div className="overflow-hidden rounded-lg bg-[#000000]">
               {src ? (
                  <img
                     src={src}
                     alt="Safari Browser Content"
                     className="h-full w-full object-cover"
                  />
               ) : (
                  children
               )}
            </div>
         </div>
      </div>
   );
}
