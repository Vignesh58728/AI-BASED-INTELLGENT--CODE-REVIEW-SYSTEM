import React from 'react';

interface BrandIconProps {
   className?: string;
   size?: number;
   dark?: boolean;
}

export const BrandIcon: React.FC<BrandIconProps> = ({ className = "", size = 64, dark = false }) => {
   const mainColor = dark ? "#000000" : "#FFFFFF";

   return (
      <svg
         width={size}
         height={size}
         viewBox="0 0 100 100"
         fill="none"
         xmlns="http://www.w3.org/2000/svg"
         className={`${className} ${dark ? 'drop-shadow-[0_0_8px_rgba(0,0,0,0.1)]' : 'drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]'}`}
      >
         <defs>
            <linearGradient id="brand-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
               <stop offset="0%" stopColor="#FBFF3F" /> {/* Yellow tip */}
               <stop offset="30%" stopColor="#FF1CF7" /> {/* Pink */}
               <stop offset="100%" stopColor="#7000FF" /> {/* Purple */}
            </linearGradient>
         </defs>

         {/* Top-Left Half (Main Color - White or Black) */}
         <path
            d="M47 5 C 47 30 30 47 5 47 C 30 47 47 64 47 89 L 47 5 Z"
            fill={mainColor}
         />

         {/* Bottom-Right Half (Gradient) */}
         <path
            d="M53 95 C 53 70 70 53 95 53 C 70 53 53 36 53 11 L 53 95 Z"
            fill="url(#brand-gradient)"
         />
      </svg>
   );
};
