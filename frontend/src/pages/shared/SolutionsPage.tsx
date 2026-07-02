import React from 'react';

export function SolutionsPage() {
    const solutions = [
        { id: 1, title: 'Median of Two Sorted Arrays', lang: 'Go', status: 'Accepted', time: '4 hours ago', difficulty: 'Hard' },
        { id: 2, title: 'Longest Common Subsequence', lang: 'Python3', status: 'Accepted', time: '2 mins ago', difficulty: 'Medium' },
        { id: 3, title: 'Two Sum', lang: 'C++', status: 'Accepted', time: '1 day ago', difficulty: 'Easy' },
        { id: 4, title: 'Reverse Link List', lang: 'Java', status: 'Accepted', time: '2 days ago', difficulty: 'Easy' }
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
                        <a className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg shadow-sm font-semibold hover:translate-x-1 transition-all duration-200" href="/solutions">
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
                    {/* Socials */}
                    <div className="mt-4 flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-on-surface-variant">
                            <span className="material-symbols-outlined text-lg">link</span>
                            <a className="text-xs hover:text-primary" href="#">github.com/alex_dev</a>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-8 bg-surface overflow-y-auto">
                    <div className="max-w-5xl mx-auto space-y-8">
                        <header>
                            <h1 className="text-4xl font-black tracking-tight text-on-surface mb-2">My Solutions</h1>
                            <p className="text-on-surface-variant text-lg">A chronicle of your algorithmic journey and code contributions.</p>
                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-2 bg-surface-container-lowest p-6 rounded-3xl shadow-sm border border-outline-variant/10">
                                <h3 className="text-sm font-black uppercase tracking-widest text-on-surface-variant mb-6">Latest Contributions</h3>
                                <div className="space-y-4">
                                    {solutions.map(sol => (
                                        <div key={sol.id} className="flex items-center justify-between p-4 bg-surface-container-low rounded-2xl hover:bg-surface-container-high transition-all group cursor-pointer">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">{sol.title}</span>
                                                <span className="text-[10px] text-on-surface-variant uppercase font-black mt-1">{sol.lang} • {sol.difficulty}</span>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <span className="text-[10px] font-black uppercase bg-tertiary-container text-on-tertiary-container px-2 py-1 rounded-full">{sol.status}</span>
                                                <span className="text-xs text-on-surface-variant min-w-[80px] text-right">{sol.time}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-primary text-on-primary p-8 rounded-3xl relative overflow-hidden">
                                    <h4 className="text-xl font-black mb-2">Consistency</h4>
                                    <p className="text-sm opacity-80">You've maintained a high acceptance rate this month. Keep it up!</p>
                                    <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-8xl opacity-10">verified</span>
                                </div>
                                
                                <div className="bg-surface-container-low p-6 rounded-3xl border border-outline-variant/10">
                                    <h4 className="text-sm font-black uppercase tracking-widest mb-4">Top Languages</h4>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-bold">Python3</span>
                                            <span className="text-xs font-black text-primary">64%</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-bold">Go</span>
                                            <span className="text-xs font-black text-secondary">22%</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-bold">Rust</span>
                                            <span className="text-xs font-black text-tertiary">14%</span>
                                        </div>
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

export default SolutionsPage;
