import React from 'react';

export function DiscussPage() {
    const topics = [
        { id: 1, title: 'Mastering Dynamic Programming | Comprehensive Guide', user: 'dp_wizard', time: '4 hours ago', comments: 156, views: '2.4k' },
        { id: 2, title: 'Amazon OA Discussion | SDE-1 Role', user: 'interview_warrior', time: '12 hours ago', comments: 89, views: '1.8k' },
        { id: 3, title: 'Rust vs Go for Backend Systems in 2024', user: 'system_design_pro', time: '1 day ago', comments: 245, views: '5.2k' },
    ];

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
                <aside className="h-screen w-72 sticky top-0 left-0 hidden lg:flex flex-col p-6 gap-4 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-xl text-sm font-medium border-r border-slate-200 dark:border-slate-800" style={{ fontFamily: "'Spectral', serif" }}>
                    <div className="flex flex-col gap-4 mb-6">
                        <div className="w-24 h-24 rounded-full overflow-hidden bg-surface-container-high flex items-center justify-center">
                            <span className="material-symbols-outlined text-4xl text-on-surface-variant">person</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Alex Rivera</h2>
                            <p className="text-slate-500 dark:text-slate-400">Senior Data Architect</p>
                        </div>
                        <button className="w-full py-2 bg-primary text-on-primary rounded-md font-semibold hover:bg-primary-dim transition-all duration-200 scale-95 active:scale-90">View Resume</button>
                    </div>
                    <div className="flex flex-col gap-1">
                        <a className="flex items-center gap-3 p-3 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-lg hover:translate-x-1 transition-all duration-200" href="/profile">
                            <span className="material-symbols-outlined">dashboard</span> Overview
                        </a>
                        <a className="flex items-center gap-3 p-3 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-lg hover:translate-x-1 transition-all duration-200" href="/solutions">
                            <span className="material-symbols-outlined">code</span> Solutions
                        </a>
                        <a className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg shadow-sm font-semibold hover:translate-x-1 transition-all duration-200" href="/discuss">
                            <span className="material-symbols-outlined">forum</span> Discussions
                        </a>
                        <a className="flex items-center gap-3 p-3 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-lg hover:translate-x-1 transition-all duration-200" href="/skill-analysis">
                            <span className="material-symbols-outlined">bar_chart</span> Stats
                        </a>
                        <a className="flex items-center gap-3 p-3 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-lg hover:translate-x-1 transition-all duration-200 border-b border-slate-200 dark:border-slate-800 pb-4 mb-2" href="/settings">
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
                            <button className="px-6 py-3 bg-primary text-on-primary rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg hover:bg-primary-dim transition-all active:scale-95">New Discussion</button>
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
        </div>
    );
}

export default DiscussPage;
