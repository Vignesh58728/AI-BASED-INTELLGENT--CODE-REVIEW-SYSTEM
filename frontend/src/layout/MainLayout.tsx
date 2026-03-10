import { Header } from '@/components/layout/Header';

import { Outlet } from 'react-router-dom';

export function MainLayout() {
   return (
      <div className="min-h-screen bg-white pt-16">
         <Header />
         <div className="flex">
            <main className="flex-1 overflow-y-auto h-[calc(100vh-64px)]">
               <Outlet />
            </main>
         </div>
      </div>
   );
}
