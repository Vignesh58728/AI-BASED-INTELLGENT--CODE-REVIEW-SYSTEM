import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Outlet } from 'react-router-dom';

export function MainLayout() {
   return (
      <div className="min-h-screen bg-background">
         <Header />
         <div className="flex">
            <Sidebar className="hidden md:block w-64 fixed h-[calc(100vh-64px)] top-[64px]" />
            <main className="flex-1 md:ml-64 p-6 overflow-y-auto h-[calc(100vh-64px)]">
               <Outlet />
            </main>
         </div>
      </div>
   );
}
