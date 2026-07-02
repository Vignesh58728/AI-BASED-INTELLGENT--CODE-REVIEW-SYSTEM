import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { notificationService, type Notification } from '@/services/notificationService';
import { formatDistanceToNow } from 'date-fns';
import { Loader2, BellOff, Bell, Trophy, Code, Users, Settings as SettingsIcon, CheckCheck } from 'lucide-react';

export function NotificationsPage() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'unread'>('all');

    const fetchNotifications = async () => {
        try {
            const data = await notificationService.getNotifications();
            setNotifications(data);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, []);

    const handleMarkAllRead = async () => {
        try {
            await notificationService.markAllAsRead();
            fetchNotifications();
        } catch (error) {
            console.error("Error marking all as read:", error);
        }
    };

    const filteredNotifications = filter === 'all' 
        ? notifications 
        : notifications.filter(n => !n.is_read);

    const getIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case 'achievement': return <Trophy className="w-5 h-5" />;
            case 'solution': return <Code className="w-5 h-5" />;
            case 'team': return <Users className="w-5 h-5" />;
            default: return <Bell className="w-5 h-5" />;
        }
    };

    const getBgColor = (type: string) => {
        switch (type.toLowerCase()) {
            case 'achievement': return 'bg-amber-50 text-amber-600';
            case 'solution': return 'bg-emerald-50 text-emerald-600';
            case 'team': return 'bg-blue-50 text-blue-600';
            default: return 'bg-slate-50 text-slate-600';
        }
    };

    return (
        <div className="bg-white text-slate-900 min-h-screen relative font-['Outfit']">
            <style>{`
                .satisfy-font { font-family: 'Satisfy', cursive; }
            `}</style>
            <link href="https://fonts.googleapis.com/css2?family=Satisfy&display=swap" rel="stylesheet" />
            <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
            <link href="https://fonts.googleapis.com/css2?family=Spectral:wght@200;300;400;500;600;700;800&display=swap" rel="stylesheet" />

            <div className="w-full px-12 py-16 min-h-screen">

                <main className="w-full">
                    <header className="mb-12 flex items-end justify-between">
                        <div>
                            <h1 className="text-6xl font-extralight tracking-tight text-slate-900 mb-4 font-['Spectral']">Notifications</h1>
                            <p className="text-slate-500 text-xl font-medium">Stay updated on your <span className="satisfy-font text-indigo-600 text-3xl">Mind Arc</span> journey.</p>
                        </div>
                        {notifications.length > 0 && (
                             <button 
                                onClick={handleMarkAllRead}
                                className="flex items-center gap-2 px-6 py-3 bg-slate-50 hover:bg-slate-100 text-slate-900 text-sm font-bold rounded-2xl transition-all active:scale-95"
                             >
                                <CheckCheck size={18} className="text-indigo-600" />
                                Mark all as read
                            </button>
                        )}
                    </header>

                    <div className="space-y-6">
                        {/* Filter Tabs */}
                        <div className="flex items-center gap-2 p-1.5 bg-slate-50 w-fit rounded-2xl mb-8">
                            <button 
                                onClick={() => setFilter('all')}
                                className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${filter === 'all' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                            >
                                All
                            </button>
                            <button 
                                onClick={() => setFilter('unread')}
                                className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${filter === 'unread' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                            >
                                Unread {notifications.filter(n => !n.is_read).length > 0 && `(${notifications.filter(n => !n.is_read).length})`}
                            </button>
                        </div>

                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-32 space-y-4">
                                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
                                <p className="text-slate-400 font-medium">Loading updates...</p>
                            </div>
                        ) : filteredNotifications.length > 0 ? (
                            <div className="grid gap-4">
                                {filteredNotifications.map((n) => (
                                    <div 
                                        key={n._id || n.id} 
                                        className={`group relative bg-white p-6 rounded-[2rem] border transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 ${!n.is_read ? 'border-indigo-100 bg-indigo-50/10' : 'border-slate-100'}`}
                                    >
                                        <div className="flex gap-6">
                                            <div className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300 ${getBgColor(n.type)}`}>
                                                {getIcon(n.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h3 className="font-medium text-2xl text-slate-900 truncate pr-4 font-['Spectral']">{n.title}</h3>
                                                    <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider shrink-0 mt-2">
                                                        {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                                                    </span>
                                                </div>
                                                <p className="text-slate-600 text-[15px] leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
                                                    {n.description}
                                                </p>
                                            </div>
                                            {!n.is_read && (
                                                <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full mt-2 ring-4 ring-indigo-50"></div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-32 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200">
                                <div className="w-24 h-24 bg-white rounded-full shadow-inner flex items-center justify-center mb-6">
                                    <BellOff className="w-10 h-10 text-slate-300" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">All Caught Up!</h3>
                                <p className="text-slate-500 max-w-xs text-center font-medium">There are no {filter === 'unread' ? 'unread' : ''} notifications at the moment.</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default NotificationsPage;
