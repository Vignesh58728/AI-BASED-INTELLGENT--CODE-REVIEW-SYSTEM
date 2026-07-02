import React from 'react';

export function Profile() {
    // To implement the heatmap dynamically
    const heatmapCells = Array.from({ length: 350 }).map((_, i) => {
        return <div key={i} className="heatmap-cell rounded-sm bg-surface-container-highest opacity-40"></div>;
    });

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
                .heatmap-cell { width: 10px; height: 10px; }
                @media (min-width: 1024px) {
                    .heatmap-cell { width: 12px; height: 12px; }
                }
            `}</style>
            <link href="https://fonts.googleapis.com/css2?family=Satisfy&display=swap" rel="stylesheet" />
            <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

            <div className="flex max-w-[1920px] mx-auto min-h-screen">
                {/* SideNavBar Implementation */}
                <aside className="h-screen w-72 sticky top-0 left-0 hidden lg:flex flex-col p-6 gap-4 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-xl text-sm font-medium border-r border-slate-200 dark:border-slate-800" style={{ fontFamily: "'Spectral', serif" }}>
                    {/* Profile Header */}
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
                    {/* Nav Links */}
                    <div className="flex flex-col gap-1">
                        <a className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg shadow-sm font-semibold hover:translate-x-1 transition-all duration-200" href="/profile">
                            <span className="material-symbols-outlined">dashboard</span> Overview
                        </a>
                        <a className="flex items-center gap-3 p-3 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-lg hover:translate-x-1 transition-all duration-200" href="/solutions">
                            <span className="material-symbols-outlined">code</span> Solutions
                        </a>
                        <a className="flex items-center gap-3 p-3 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-lg hover:translate-x-1 transition-all duration-200" href="/discuss">
                            <span className="material-symbols-outlined">forum</span> Discussions
                        </a>
                        <a className="flex items-center gap-3 p-3 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-lg hover:translate-x-1 transition-all duration-200" href="/skill-analysis">
                            <span className="material-symbols-outlined">bar_chart</span> Stats
                        </a>
                        <a className="flex items-center gap-3 p-3 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-lg hover:translate-x-1 transition-all duration-200 border-b border-slate-200 dark:border-slate-800 pb-4 mb-2" href="/settings">
                            <span className="material-symbols-outlined">settings</span> Settings
                        </a>
                    </div>
                    {/* Social Links */}
                    <div className="mt-4 flex flex-col gap-3">

                        <div className="flex items-center gap-2 text-on-surface-variant">
                            <span className="material-symbols-outlined text-lg">link</span>
                            <a className="text-xs hover:text-primary" href="#">github.com/alex_dev</a>
                        </div>
                    </div>
                    {/* Footer Links */}
                    <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-800">
                        <a className="flex items-center gap-3 p-3 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-lg" href="#">
                            <span className="material-symbols-outlined">help</span> Help
                        </a>
                        <a className="flex items-center gap-3 p-3 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-lg" href="#">
                            <span className="material-symbols-outlined">logout</span> Logout
                        </a>
                    </div>
                </aside>
                {/* Main Content Canvas */}
                <main className="flex-1 p-8 bg-surface overflow-y-auto">
                    <div className="max-w-5xl mx-auto space-y-8">
                        {/* Hero Stats / Solved Problems */}
                        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-1 bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-transparent">
                                <h3 className="text-on-surface-variant text-sm font-bold uppercase tracking-wider mb-6">Solved Problems</h3>
                                <div className="flex flex-col items-center gap-8">
                                    <div className="relative w-40 h-40">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle className="text-surface-container-high" cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" strokeWidth="8"></circle>
                                            <circle className="text-tertiary" cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" strokeDasharray="440" strokeDashoffset="440" strokeWidth="8"></circle>
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="text-4xl font-black text-on-surface">0</span>
                                            <span className="text-xs text-on-surface-variant font-medium">Solved</span>
                                        </div>
                                    </div>
                                    <div className="w-full space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-on-surface-variant">Easy</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold">0/620</span>
                                                <div className="w-24 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                                                    <div className="h-full bg-tertiary w-0 rounded-full"></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-on-surface-variant">Medium</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold">0/1200</span>
                                                <div className="w-24 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                                                    <div className="h-full bg-secondary w-0 rounded-full"></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-on-surface-variant">Hard</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold">0/450</span>
                                                <div className="w-24 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                                                    <div className="h-full bg-error w-0 rounded-full"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Submission Heatmap */}
                            <div className="lg:col-span-2 bg-surface-container-lowest p-6 rounded-xl shadow-sm">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-on-surface-variant text-sm font-bold uppercase tracking-wider">Submission Activity</h3>
                                    <div className="flex gap-2 text-xs font-bold text-on-surface-variant">
                                        <span className="px-2 py-1 bg-surface-container rounded">Last Year</span>
                                        <span className="px-2 py-1 hover:bg-surface-container rounded cursor-pointer">Last Month</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-4 overflow-x-auto pb-4">
                                    <div className="flex gap-[2px]">
                                        <div className="flex flex-col gap-[2px]">
                                            <div className="heatmap-cell bg-surface-container-highest rounded-sm"></div>
                                            <div className="heatmap-cell bg-tertiary-container rounded-sm"></div>
                                            <div className="heatmap-cell bg-surface-container-highest rounded-sm"></div>
                                            <div className="heatmap-cell bg-surface-container-highest rounded-sm"></div>
                                            <div className="heatmap-cell bg-tertiary rounded-sm"></div>
                                            <div className="heatmap-cell bg-surface-container-highest rounded-sm"></div>
                                            <div className="heatmap-cell bg-tertiary-dim rounded-sm"></div>
                                        </div>
                                        <div className="flex flex-wrap gap-[2px] flex-1">
                                            {heatmapCells}
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] text-on-surface-variant px-1 font-medium">
                                        <span>0 Submissions in the past year</span>
                                        <div className="flex items-center gap-1">
                                            <span>Less</span>
                                            <div className="heatmap-cell bg-surface-container-highest rounded-sm"></div>
                                            <div className="heatmap-cell bg-tertiary-container rounded-sm"></div>
                                            <div className="heatmap-cell bg-tertiary rounded-sm"></div>
                                            <div className="heatmap-cell bg-tertiary-dim rounded-sm"></div>
                                            <span>More</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                        {/* Badges & Recent Submissions Grid */}
                        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                            {/* Badges */}
                            <div className="lg:col-span-1 bg-surface-container-low p-6 rounded-xl">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-on-surface-variant text-sm font-bold uppercase tracking-wider">Badges</h3>
                                    <span className="text-xs font-bold text-tertiary cursor-pointer">View All</span>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="group flex flex-col items-center gap-2 cursor-pointer">
                                        <div className="w-16 h-16 bg-secondary-container rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                            <span className="material-symbols-outlined text-on-secondary-container text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
                                        </div>
                                        <span className="text-[10px] text-center font-bold text-on-surface leading-tight">Top 100 Global</span>
                                    </div>
                                    <div className="group flex flex-col items-center gap-2 cursor-pointer">
                                        <div className="w-16 h-16 bg-tertiary-container rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                            <span className="material-symbols-outlined text-on-tertiary-container text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>calendar_today</span>
                                        </div>
                                        <span className="text-[10px] text-center font-bold text-on-surface leading-tight">50 Day Streak</span>
                                    </div>
                                    <div className="group flex flex-col items-center gap-2 cursor-pointer">
                                        <div className="w-16 h-16 bg-primary-container rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                            <span className="material-symbols-outlined text-on-primary-container text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>award_star</span>
                                        </div>
                                        <span className="text-[10px] text-center font-bold text-on-surface leading-tight">Nov 2023 Challenge</span>
                                    </div>
                                </div>
                            </div>
                            {/* Recent Submissions */}
                            <div className="lg:col-span-2 bg-surface-container-lowest p-6 rounded-xl shadow-sm">
                                <h3 className="text-on-surface-variant text-sm font-bold uppercase tracking-wider mb-6">Recent Submissions</h3>
                                <div className="py-12 flex flex-col items-center justify-center opacity-40">
                                    <span className="material-symbols-outlined text-4xl mb-2">history</span>
                                    <p className="text-sm font-medium">No recent activity detected</p>
                                </div>
                            </div>
                        </section>
                        {/* Bento Area for Skills and Notes */}
                        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-8">
                            <div className="md:col-span-2 bg-gradient-to-br from-primary to-primary-dim p-8 rounded-xl text-on-primary relative overflow-hidden">
                                <div className="relative z-10">
                                    <h4 className="text-2xl font-black tracking-tight mb-2">Skill Overview</h4>
                                    <p className="text-on-primary/80 text-sm leading-relaxed max-w-xs">Start solving problems to track your technical proficiency and growth.</p>
                                    <div className="mt-8 flex gap-3">
                                        <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest">Expertise</span>
                                        <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest">Algorithms</span>
                                    </div>
                                </div>
                                <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-[120px] opacity-10">schema</span>
                            </div>
                            <div className="md:col-span-1 bg-secondary-container p-6 rounded-xl flex flex-col justify-between">
                                <span className="material-symbols-outlined text-on-secondary-container text-4xl">local_fire_department</span>
                                <div>
                                    <span className="text-4xl font-black text-on-secondary-container">0</span>
                                    <p className="text-xs font-bold text-on-secondary-container/70 uppercase">Current Streak</p>
                                </div>
                            </div>
                            <div className="md:col-span-1 bg-tertiary-container p-6 rounded-xl flex flex-col justify-between">
                                <span className="material-symbols-outlined text-on-tertiary-container text-4xl">trending_up</span>
                                <div>
                                    <span className="text-4xl font-black text-on-tertiary-container">0</span>
                                    <p className="text-xs font-bold text-on-tertiary-container/70 uppercase">Contest Rating</p>
                                </div>
                            </div>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Profile;
