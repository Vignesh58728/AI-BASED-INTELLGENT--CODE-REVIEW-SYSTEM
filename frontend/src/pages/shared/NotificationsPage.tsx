import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
   Bell,
   Clock,
   User,
} from 'lucide-react';
import { notificationService, Notification } from '@/services/notificationService';

export function NotificationsPage() {
   const [notifications, setNotifications] = useState<Notification[]>([]);
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      const fetchNotifications = async () => {
         try {
            const data = await notificationService.getNotifications();
            setNotifications(data);
         } catch (error) {
            console.error("Failed to fetch notifications:", error);
         } finally {
            setIsLoading(false);
         }
      };
      fetchNotifications();
   }, []);

   const getTypeIcon = (type: string) => {
      return <User className="w-5 h-5 text-black" />;
   };

   return (
      <div className="min-h-screen bg-white text-black p-4 md:p-8 max-w-3xl mx-auto space-y-12">
         {/* Header */}
         <div className="border-b border-zinc-100 pb-8">
            <h1 className="text-4xl font-bold tracking-[0.2em] text-black uppercase" style={{ fontFamily: "'Syncopate', sans-serif" }}>
               Notifications
            </h1>
            <p className="text-black/40 text-[10px] font-black uppercase tracking-[0.3em] mt-2">REAL-TIME ACTIVITY FEED</p>
         </div>

         {/* Notification List */}
         <div className="divide-y divide-zinc-100">
            {isLoading ? (
               <div className="py-20 text-center">
                  <div className="animate-spin w-8 h-8 border-4 border-black border-t-transparent rounded-full mx-auto mb-4" />
                  <p className="text-xs font-black uppercase tracking-widest text-zinc-300">Syncing with server...</p>
               </div>
            ) : (
               <AnimatePresence mode="popLayout">
                  {notifications.map((notif) => (
                     <motion.div
                        key={notif._id || notif.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        layout
                        className={`py-8 flex gap-6 transition-all group ${!notif.is_read ? 'opacity-100' : 'opacity-50 hover:opacity-100'}`}
                     >
                        <div className="w-12 h-12 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110">
                           {getTypeIcon(notif.type)}
                        </div>

                        <div className="flex-1 min-w-0">
                           <div className="flex items-center justify-between gap-4 mb-1">
                              <h3 className="text-sm font-black uppercase tracking-wider text-black">
                                 {notif.title}
                              </h3>
                              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300 shrink-0">
                                 {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                           </div>

                           <p className="text-sm text-zinc-600 leading-relaxed font-medium">
                              {notif.description}
                           </p>
                        </div>

                        {!notif.is_read && (
                           <div className="w-2 h-2 bg-black rounded-full self-center ring-4 ring-black/5" />
                        )}
                     </motion.div>
                  ))}
               </AnimatePresence>
            )}

            {!isLoading && notifications.length === 0 && (
               <div className="py-20 text-center space-y-4">
                  <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto border border-zinc-100">
                     <Bell className="text-zinc-300" size={32} />
                  </div>
                  <p className="text-zinc-400 font-bold uppercase tracking-widest text-[10px]">No active notifications</p>
               </div>
            )}
         </div>

      </div>
   );
}
