import { cn } from "../../lib/utils";

interface MindArcLogoProps {
   className?: string;
}

export function MindArcLogo({ className }: MindArcLogoProps) {
   return (
      <svg
         viewBox="0 0 100 100"
         className={cn("w-10 h-10", className)}
         fill="none"
         xmlns="http://www.w3.org/2000/svg"
      >
         <defs>
            <linearGradient id="logo-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
               <stop offset="0%" stopColor="#FBFF3F" />
               <stop offset="50%" stopColor="#E935C1" />
               <stop offset="100%" stopColor="#E935C1" />
            </linearGradient>
         </defs>

         {/* Top half - Dark */}
         <path
            d="M50 10 C60 40 60 40 90 50 L10 50 C40 40 40 40 50 10 Z"
            fill="#FFFFFF"
         />

         {/* Bottom half - Gradient (pink to yellow) */}
         <path
            d="M50 90 C60 60 60 60 90 50 L10 50 C40 60 40 60 50 90 Z"
            fill="url(#logo-gradient)"
         />
      </svg>
   );
}
