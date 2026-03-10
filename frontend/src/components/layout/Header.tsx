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
   LogOut,
   Bell
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
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-zinc-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] h-20 flex items-center transition-all duration-300">
         <div className="w-full flex items-center px-6 md:px-12 h-full">
            
            {/* Left: Mobile Toggle (Logo removed as requested) */}
            <div className="flex items-center min-w-fit lg:min-w-[100px] gap-4">
               <Button
                  variant="ghost"
                  className="px-0 text-black hover:bg-zinc-100 lg:hidden"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
               >
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle Menu</span>
               </Button>
            </div>

            {/* Center: Mega Menu Navigation */}
            <div className="flex-1 flex justify-center h-full items-center">
               <MegaMenu />
            </div>

            {/* Right: User Actions / Auth */}
            <div className="flex items-center gap-6 min-w-[200px] justify-end">

               {user ? (
                  <div className="flex items-center gap-3">
                     <Link to="/notifications">
                        <Button variant="ghost" size="icon" className="relative h-10 w-10 text-black hover:bg-zinc-100 rounded-lg">
                           <Bell className="h-5 w-5" />
                           <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-[#2192ff] ring-2 ring-white" />
                        </Button>
                     </Link>

                     <div className="relative group">
                        <Button variant="ghost" size="icon" className="rounded-lg h-10 w-10 text-black hover:bg-zinc-100 border border-zinc-100 overflow-hidden p-0">
                           {user.photo ? (
                              <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
                           ) : (
                              <User className="h-5 w-5" />
                           )}
                        </Button>
                        <div className="absolute right-0 top-full hidden pt-3 group-hover:block w-56 z-50">
                           <div className="rounded-2xl border border-zinc-100 bg-white text-black p-2 shadow-2xl mt-2 backdrop-blur-xl">
                              <div className="px-4 py-3 border-b border-zinc-50 mb-1">
                                 <p className="text-sm font-bold" style={{ fontFamily: "'Poppins', sans-serif" }}>{user.name}</p>
                                 <p className="text-[11px] text-zinc-500 uppercase tracking-widest font-bold" style={{ fontFamily: "'Poppins', sans-serif" }}>Member</p>
                              </div>
                              <Link to="/profile" className="flex items-center gap-3 px-4 py-2 hover:bg-zinc-50 text-sm font-medium rounded-xl transition-colors" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                 <User className="h-4 w-4" /> Profile
                              </Link>
                              <Link to="/skill-analysis" className="flex items-center gap-3 px-4 py-2 hover:bg-zinc-50 text-sm font-medium rounded-xl transition-colors" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                 <Activity className="h-4 w-4" /> Skill Analysis
                              </Link>
                              <Link to="/settings" className="flex items-center gap-3 px-4 py-2 hover:bg-zinc-50 text-sm font-medium rounded-xl transition-colors" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                 <Settings className="h-4 w-4" /> Settings
                              </Link>
                              <button
                                 onClick={handleLogout}
                                 className="w-full text-left px-4 py-2 hover:bg-red-50/50 text-sm font-bold rounded-xl text-red-500 flex items-center gap-3 transition-colors mt-1"
                                 style={{ fontFamily: "'Poppins', sans-serif" }}
                              >
                                 <LogOut className="h-4 w-4" /> Logout
                              </button>
                           </div>
                        </div>
                     </div>
                  </div>
               ) : (
                  <div className="flex gap-4 items-center">
                     <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate('/login')}
                        className="text-sm font-bold text-black hover:bg-zinc-100 rounded-lg px-4 h-10"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                     >
                        Log In
                     </Button>
                     <Button
                        size="sm"
                        onClick={() => navigate('/register')}
                        className="text-sm font-bold bg-[#2192ff] text-white hover:bg-[#2192ff]/90 rounded-lg px-6 h-10 shadow-md transition-all active:scale-95"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                     >
                        Join Us
                     </Button>
                  </div>
               )}
            </div>
         </div>
      </header>
   );
}
