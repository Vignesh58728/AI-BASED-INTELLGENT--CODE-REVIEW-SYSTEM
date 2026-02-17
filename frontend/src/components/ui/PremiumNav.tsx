import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavItem {
   label: string;
   href: string;
}

interface PremiumNavProps {
   items: NavItem[];
}

const PremiumNav: React.FC<PremiumNavProps> = ({ items }) => {
   const location = useLocation();

   return (
      <nav className="flex items-center">
         <ul className="flex gap-4 list-none p-0 m-0">
            {items.map((item, index) => {
               const isActive = location.pathname.startsWith(item.href);

               return (
                  <li key={index} className="relative group">
                     <Link
                        to={item.href}
                        className={cn(
                           "block px-4 py-2 text-sm font-semibold transition-all duration-400 ease-in-out rounded-lg",
                           "bg-white/10 text-white hover:text-white",
                           "hover:tracking-[4px]",
                           isActive ? "bg-white/20 shadow-lg ring-1 ring-white/20" : "hover:bg-white/20"
                        )}
                     >
                        {item.label}
                     </Link>
                  </li>
               );
            })}
         </ul>
      </nav>
   );
};

export default PremiumNav;
