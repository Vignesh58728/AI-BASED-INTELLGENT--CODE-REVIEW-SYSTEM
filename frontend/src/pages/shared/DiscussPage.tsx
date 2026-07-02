import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';

export function DiscussPage() {
    const { user } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newBody, setNewBody] = useState('');
    const [topics, setTopics] = useState([
        { id: 1, title: 'Mastering Dynamic Programming | Comprehensive Guide', user: 'dp_wizard', time: '4 hours ago', comments: 156, views: '2.4k' },
        { id: 2, title: 'Amazon OA Discussion | SDE-1 Role', user: 'interview_warrior', time: '12 hours ago', comments: 89, views: '1.8k' },
        { id: 3, title: 'Rust vs Go for Backend Systems in 2024', user: 'system_design_pro', time: '1 day ago', comments: 245, views: '5.2k' },
    ]);

    const handlePostDiscussion = () => {
        if (!newTitle.trim()) return;
        setTopics(prev => [{ id: Date.now(), title: newTitle, user: user?.username || user?.name || 'You', time: 'Just now', comments: 0, views: '0' }, ...prev]);
        setNewTitle('');
        setNewBody('');
        setShowModal(false);
    };

    return (
        <div className="bg-background text-on-background min-h-screen relative satisfy-font-override selection:bg-tertiary-container selection:text-on-tertiary-container">
            <style>{`
                .material-symbols-outlined {
                    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
                }
                .satisfy-font-override,
                .satisfy-font-override * {
                    font-family: 'Satisfy', cursive !important;
                }
                .satisfy-font-override .material-symbols-outlined {
                    font-family: 'Material Symbols Outlined' !important;
                }
            `}</style>
            <link href="https://fonts.googleapis.com/css2?family=Satisfy&display=swap" rel="stylesheet" />
            <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

            <div className="flex max-w-[1920px] mx-auto min-h-screen">
                {/* Fixed SideNavBar */}
                <aside className="h-screen w-72 sticky top-0 left-0 hidden lg:flex flex-col p-6 gap-4 bg-white backdrop-blur-xl text-sm font-medium border-r border-slate-200 " style={{ fontFamily: "'Spectral', serif" }}>
 <div className="flex flex-col gap-4 mb-6">
 <div className="w-24 h-24 rounded-full overflow-hidden bg-surface-container-high flex items-center justify-center">
 {user?.photo ? (
 <img src={user.photo} alt={user.name || 'User'} className="w-full h-full object-cover" />
 ) : (
 <span className="material-symbols-outlined text-4xl text-on-surface-variant flex items-center justify-center w-full h-full">person</span>
 )}
 </div>
 <div>
 <h2 className="text-xl font-bold text-slate-900 capitalize">{user?.name || user?.username || 'Guest User'}</h2>
 <p className="text-slate-600 capitalize">{user?.role === 'admin' ? 'Administrator' : user?.role === 'student' ? 'Student' : (user?.role || 'Member')}</p>
 </div>
 <button onClick={() => window.open('/profile', '_self')} className="w-full py-2 bg-primary text-on-primary rounded-md font-semibold hover:bg-primary-dim transition-all duration-200 scale-95 active:scale-90">View Profile</button>
 </div>
 <div className="flex flex-col gap-1">
 <Link to="/profile" className="flex items-center gap-3 p-3 text-slate-600 hover:bg-slate-100 rounded-lg hover:translate-x-1 transition-all duration-200">
 <span className="material-symbols-outlined">dashboard</span> Overview
 </Link>
 <Link to="/solutions" className="flex items-center gap-3 p-3 text-slate-600 hover:bg-slate-100 rounded-lg hover:translate-x-1 transition-all duration-200">
 <span className="material-symbols-outlined">code</span> Solutions
 </Link>
 <a className="flex items-center gap-3 p-3 bg-slate-100 text-slate-900 rounded-lg shadow-sm font-semibold hover:translate-x-1 transition-all duration-200" href="/discuss">
 <span className="material-symbols-outlined">forum</span> Discussions
 </a>
 <a className="flex items-center gap-3 p-3 text-slate-600 hover:bg-slate-100 rounded-lg hover:translate-x-1 transition-all duration-200" href="/skill-analysis">
 <span className="material-symbols-outlined">bar_chart</span> Stats
 </a>
 <a className="flex items-center gap-3 p-3 text-slate-600 hover:bg-slate-100 rounded-lg hover:translate-x-1 transition-all duration-200 border-b border-slate-200 pb-4 mb-2" href="/settings">
 <span className="material-symbols-outlined">settings</span> Settings
 </a>
 </div>
 </aside>

                {/* Main Content */}
                <main className="flex-1 p-8 bg-surface overflow-y-auto">
                    <div className="max-w-5xl mx-auto space-y-8">
                        <header className="flex justify-between items-end">
                            <div>
                                <h1 className="text-4xl font-black tracking-tight text-on-surface mb-2">Community Discussions</h1>
                                <p className="text-on-surface-variant text-lg">Learn, share, and grow withfellow developers across the globe.</p>
                            </div>
                            <button onClick={() => setShowModal(true)} className="px-6 py-3 bg-primary text-on-primary rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg hover:bg-primary-dim transition-all active:scale-95">New Discussion</button>
                        </header>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            <div className="lg:col-span-8 space-y-4">
                                {topics.map(topic => (
                                    <div key={topic.id} className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/10 hover:shadow-xl hover:shadow-on-surface/5 transition-all group cursor-pointer">
                                        <h3 className="text-xl font-bold text-on-surface group-hover:text-primary mb-3 transition-colors">{topic.title}</h3>
                                        <div className="flex items-center gap-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                                            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">person</span> {topic.user}</span>
                                            <span>•</span>
                                            <span>{topic.time}</span>
                                            <span className="ml-auto flex items-center gap-4">
                                                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">mode_comment</span> {topic.comments}</span>
                                                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">visibility</span> {topic.views}</span>
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="lg:col-span-4 space-y-6">
                                <div className="bg-tertiary-container p-8 rounded-3xl relative overflow-hidden">
                                    <h4 className="text-xl font-black text-on-tertiary-container mb-2">Trending Now</h4>
                                    <p className="text-sm text-on-tertiary-container/80">Graph theory discussions are peaking after the latest weekly challenge.</p>
                                    <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-8xl text-on-tertiary-container opacity-10">trending_up</span>
                                </div>

                                <div className="bg-surface-container-low p-6 rounded-3xl border border-outline-variant/10">
                                    <h4 className="text-sm font-black uppercase tracking-widest mb-4">Popular Tags</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {['Graphs', 'Interviews', 'Dynamic Programming', 'Rust', 'Career'].map(tag => (
                                            <span key={tag} className="px-3 py-1 bg-surface-container-lowest border border-outline-variant/20 rounded-full text-[10px] font-bold uppercase hover:bg-primary hover:text-on-primary transition-all cursor-pointer">#{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            {/* New Discussion Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-black text-slate-900">New Discussion</h2>
                            <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Title</label>
                                <input className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-medium outline-none focus:ring-2 focus:ring-slate-900/20" placeholder="What's on your mind?" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Body</label>
                                <textarea className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-medium outline-none focus:ring-2 focus:ring-slate-900/20 h-28 resize-none" placeholder="Describe your topic..." value={newBody} onChange={e => setNewBody(e.target.value)} />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button onClick={() => setShowModal(false)} className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors">Cancel</button>
                                <button onClick={handlePostDiscussion} disabled={!newTitle.trim()} className="flex-1 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">Post Discussion</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DiscussPage;
