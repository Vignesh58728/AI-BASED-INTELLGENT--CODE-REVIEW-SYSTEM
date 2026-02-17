import { cn } from "../../lib/utils";

export function RetroGrid({
   className,
   angle = 65,
}: {
   className?: string;
   angle?: number;
}) {
   return (
      <div
         className={cn(
            "pointer-events-none absolute h-full w-full overflow-hidden [perspective:200px] opacity-50",
            className
         )}
      >
         {/* Grid */}
         <div
            className="absolute inset-0"
            style={{ transform: `rotateX(${angle}deg)` }}
         >
            <div
               className={cn(
                  "animate-grid",

                  "[background-repeat:repeat] [background-size:60px_60px] [height:300%] [inset:0%_0px] [margin-left:-50%] [transform-origin:100%_0_0] [width:200%]",

                  // Light Styles
                  "[background-image:linear-gradient(to_right,rgba(0,0,0,0.1)_1px,transparent_0),linear-gradient(to_bottom,rgba(0,0,0,0.1)_1px,transparent_0)]",

                  // Dark Styles
                  "dark:[background-image:linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_0),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_0)]",
               )}
            />
         </div>

         {/* Background Gradient */}
         <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent to-90%" />
      </div>
   );
}
