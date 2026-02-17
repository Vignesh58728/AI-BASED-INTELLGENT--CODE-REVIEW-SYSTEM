import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { LayoutDashboard, BookOpen, GraduationCap, Terminal, Trophy, User, FileText, Settings } from 'lucide-react';

const sidebarItems = [
   { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
   { icon: BookOpen, label: 'School', href: '/school' },
   { icon: GraduationCap, label: 'College', href: '/college' },
   { icon: Terminal, label: 'IT Professional', href: '/it' },
   { icon: Trophy, label: 'Leaderboard', href: '/leaderboard' },
   { icon: FileText, label: 'Certificates', href: '/certificates' },
   { icon: User, label: 'Profile', href: '/profile' },
   { icon: Settings, label: 'Settings', href: '/settings' },
];

export function Sidebar({ className }: { className?: string }) {
   const location = useLocation();

   return (
      <div className={cn("pb-12 w-64 border-r bg-background h-screen fixed left-0 top-0 overflow-y-auto hidden md:block", className)}>
         <div className="space-y-4 py-4">
            <div className="px-3 py-2">
               <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                  CodeReview AI
               </h2>
               <div className="space-y-1">
                  {sidebarItems.map((item) => (
                     <Button
                        key={item.href}
                        variant={location.pathname.startsWith(item.href) ? "secondary" : "ghost"}
                        className="w-full justify-start"
                        asChild
                     >
                        <Link to={item.href}>
                           <item.icon className="mr-2 h-4 w-4" />
                           {item.label}
                        </Link>
                     </Button>
                  ))}
               </div>
            </div>
         </div>
      </div>
   );
}
