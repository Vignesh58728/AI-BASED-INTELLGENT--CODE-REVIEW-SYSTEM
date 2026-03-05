import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';

import {
   User,
   Settings,
   Menu,
   Activity,
   Clock,
   ShieldCheck,
   LogOut
} from 'lucide-react';
import MegaMenu from '@/components/ui/MegaMenu';

export function Header() {
   const { user, logout } = useAuth();
   const navigate = useNavigate();
   const [isMenuOpen, setIsMenuOpen] = useState(false);

   const handleLogout = () => {
      logout();
      navigate('/login');
   };

   return (
      <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
         <div className="w-full max-w-5xl bg-black/20 backdrop-blur-md border border-white/10 rounded-full shadow-2xl h-16 flex items-center px-6 transition-all duration-300">

            {/* Left: Mobile Menu + Logo */}
            <div className="flex items-center min-w-fit">
               <Button
                  variant="ghost"
                  className="mr-2 px-0 text-base text-white hover:bg-white/10 hover:text-white lg:hidden"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
               >
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle Menu</span>
               </Button>

               <div className="flex items-center mr-6 text-white cursor-default">
                  <span className="font-bold text-lg tracking-widest font-['Orbitron']">AIVISO</span>
               </div>
            </div>

            {/* Center: Mega Menu Navigation */}
            <div className="flex-1 flex justify-center h-full">
               <MegaMenu />
            </div>

            {/* Right: User Actions / Auth */}
            <div className="flex items-center gap-4 ml-auto text-white">

               {user ? (
                  <div className="flex items-center gap-3">
                     <Button variant="ghost" size="icon" className="relative h-9 w-9 text-white hover:bg-white/10 hover:text-white rounded-full">
                        <i className="fa-regular fa-bell text-lg"></i>
                        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-600" />
                     </Button>

                     <div className="relative group">
                        <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 text-white hover:bg-white/10 hover:text-white border border-white/10">
                           <User className="h-5 w-5" />
                        </Button>
                        <div className="absolute right-0 top-full hidden pt-2 group-hover:block w-48 z-50">
                           <div className="rounded-xl border border-white/10 bg-neutral-900 text-white p-2 shadow-xl mt-2 backdrop-blur-md">
                              <div className="px-4 py-2 border-b border-white/10 mb-1">
                                 <p className="text-sm font-medium">{user.name}</p>
                                 <p className="text-xs text-zinc-400">{user.email}</p>
                              </div>
                              <Link to="/profile" className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 text-sm rounded-lg transition-colors">
                                 <User className="h-4 w-4" /> Profile
                              </Link>
                              <Link to="/skill-analysis" className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 text-sm rounded-lg transition-colors">
                                 <Activity className="h-4 w-4" /> Skill Analysis
                              </Link>
                              <Link to="/admin" className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 text-sm rounded-lg transition-colors">
                                 <ShieldCheck className="h-4 w-4" /> Admin Panel
                              </Link>
                              <Link to="/settings" className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 text-sm rounded-lg transition-colors">
                                 <Settings className="h-4 w-4" /> Settings
                              </Link>
                              <button
                                 onClick={handleLogout}
                                 className="w-full text-left px-4 py-2 hover:bg-red-500/10 text-sm rounded-lg text-red-500 flex items-center gap-2 transition-colors"
                              >
                                 <LogOut className="h-4 w-4" /> Logout
                              </button>
                           </div>
                        </div>
                     </div>
                  </div>
               ) : (
                  <div className="flex gap-2">
                     <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate('/login')}
                        className="text-sm font-medium text-white hover:bg-white/10 hover:text-white rounded-full px-4"
                     >
                        Sign In
                     </Button>
                     <Button
                        size="sm"
                        onClick={() => navigate('/register')}
                        className="text-sm font-semibold bg-white text-black hover:bg-gray-200 rounded-full px-6 shadow-lg hover:shadow-xl transition-all"
                     >
                        Get Started
                     </Button>
                  </div>
               )}
            </div>
         </div>
      </header>
   );
}
