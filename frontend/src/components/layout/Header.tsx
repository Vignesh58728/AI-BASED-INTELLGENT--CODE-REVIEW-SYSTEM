import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ModeToggle } from './ModeToggle';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
   Search,
   User,
   LogOut,
   Menu
} from 'lucide-react';
import PremiumNav from '@/components/ui/PremiumNav';

export function Header() {
   const { user, logout } = useAuth();
   const navigate = useNavigate();
   const [isMenuOpen, setIsMenuOpen] = useState(false);

   const handleLogout = () => {
      logout();
      navigate('/login');
   };

   return (
      <header className="sticky top-0 z-50 w-full border-b border-border/10 bg-black">
         <div className="container flex h-16 items-center lg:px-6">
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

               <Link to="/" className="flex items-center space-x-2 mr-6 text-white">
                  <span className="font-bold">CodeReview</span>
               </Link>
            </div>

            {/* Center: Desktop Navigation + Search Bar */}
            <div className="flex-1 flex justify-center items-center gap-8 h-full overflow-hidden">
               <PremiumNav
                  items={[
                     { label: "Explore", href: "/explore" },
                     { label: "AI", href: "/ai" },
                     { label: "Problems", href: "/problems" },
                     { label: "Discuss", href: "/discuss" },
                     { label: "Interview", href: "/interview/preparation" }
                  ]}
               />

               {/* Search Bar (Nearby Center Links) */}
               <div className="w-full max-w-[200px] hidden xl:flex items-center relative ml-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                  <Input
                     type="search"
                     placeholder="Search..."
                     className="w-full bg-white/10 pl-9 h-8 rounded-md border-none text-xs text-white placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-white/50"
                  />
               </div>
            </div>

            {/* Right: User Actions / Auth */}
            <div className="flex items-center gap-3 ml-auto text-white">
               <ModeToggle />

               {user ? (
                  <div className="flex items-center gap-3">
                     <Button variant="ghost" size="icon" className="relative h-9 w-9 text-white hover:bg-white/10 hover:text-white">
                        <i className="fa-regular fa-bell fa-bounce text-lg"></i>
                        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-600" />
                     </Button>

                     <div className="relative group">
                        <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 text-white hover:bg-white/10 hover:text-white">
                           <User className="h-5 w-5" />
                        </Button>
                        <div className="absolute right-0 top-full hidden pt-2 group-hover:block w-48 z-50">
                           <div className="rounded-md border bg-popover text-popover-foreground p-2 shadow-md">
                              <div className="px-4 py-2 border-b mb-1">
                                 <p className="text-sm font-medium">{user.name}</p>
                                 <p className="text-xs text-muted-foreground">{user.email}</p>
                              </div>
                              <Link to="/profile" className="block px-4 py-2 hover:bg-muted text-sm rounded">Profile</Link>
                              <Link to="/settings" className="block px-4 py-2 hover:bg-muted text-sm rounded">Settings</Link>
                              <button
                                 onClick={handleLogout}
                                 className="w-full text-left px-4 py-2 hover:bg-muted text-sm rounded text-red-500 flex items-center gap-2"
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
                        className="text-sm font-semibold text-white hover:bg-white/10 hover:text-white"
                     >
                        Login
                     </Button>
                     <Button
                        size="sm"
                        onClick={() => navigate('/register')}
                        className="text-sm font-semibold bg-white text-black hover:bg-gray-200 rounded-lg px-4"
                     >
                        Sign Up
                     </Button>
                  </div>
               )}
            </div>
         </div>
      </header>
   );
}
