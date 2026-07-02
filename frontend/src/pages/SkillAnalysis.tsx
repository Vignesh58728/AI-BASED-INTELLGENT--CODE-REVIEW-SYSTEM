import React from 'react';
import { useAuth } from '@/context/AuthContext';

export function SkillAnalysis() {
    const { user } = useAuth();
    return (
        <div className="bg-background text-on-surface selection:bg-tertiary-container selection:text-on-tertiary-container min-h-screen relative satisfy-font-override w-full">
            <style>{`
                .material-symbols-outlined {
                    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
                    vertical-align: middle;
                }
                .satisfy-font-override,
                .satisfy-font-override * {
                    font-family: 'Satisfy', cursive !important;
                }
                .satisfy-font-override .material-symbols-outlined {
                    font-family: 'Material Symbols Outlined' !important;
                }
                .glass-panel {
                    background: rgba(255, 255, 255, 0.7);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
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
 <button className="w-full py-2 bg-primary text-on-primary rounded-md font-semibold hover:bg-primary-dim transition-all duration-200 scale-95 active:scale-90">View Resume</button>
 </div>
 <div className="flex flex-col gap-1">
 <a className="flex items-center gap-3 p-3 text-slate-600 hover:bg-slate-100 rounded-lg hover:translate-x-1 transition-all duration-200" href="/profile">
 <span className="material-symbols-outlined">dashboard</span> Overview
 </a>
 <a className="flex items-center gap-3 p-3 text-slate-600 hover:bg-slate-100 rounded-lg hover:translate-x-1 transition-all duration-200" href="/solutions">
 <span className="material-symbols-outlined">code</span> Solutions
 </a>
 <a className="flex items-center gap-3 p-3 text-slate-600 hover:bg-slate-100 rounded-lg hover:translate-x-1 transition-all duration-200" href="/discuss">
 <span className="material-symbols-outlined">forum</span> Discussions
 </a>
 <a className="flex items-center gap-3 p-3 bg-slate-100 text-slate-900 rounded-lg shadow-sm font-semibold hover:translate-x-1 transition-all duration-200" href="/skill-analysis">
 <span className="material-symbols-outlined">bar_chart</span> Stats
 </a>
 <a className="flex items-center gap-3 p-3 text-slate-600 hover:bg-slate-100 rounded-lg hover:translate-x-1 transition-all duration-200 border-b border-slate-200 pb-4 mb-2" href="/settings">
 <span className="material-symbols-outlined">settings</span> Settings
 </a>
 </div>
 </aside>

                <main className="flex-1 p-8 bg-surface overflow-y-auto">
                    <header className="mb-12">
                        <h2 className="text-4xl font-black tracking-tight text-on-surface mb-2">Skill Analysis</h2>
                        <p className="text-on-surface-variant font-medium">Comprehensive breakdown of your technical proficiency and growth path.</p>
                    </header>

                    {/* Bento Grid Layout */}
                    <div className="grid grid-cols-12 gap-6 max-w-7xl mx-auto">
                        {/* 1. Solved Problems Overview */}
                        <div className="col-span-12 lg:col-span-4 bg-surface-container-lowest rounded-xl p-6 shadow-[0_4px_24px_rgba(43,52,56,0.04)] flex flex-col justify-between">
                            <div className="flex justify-between items-start mb-6">
                                <h3 className="text-lg font-bold text-on-surface">Solved Problems</h3>
                                <span className="material-symbols-outlined text-primary">insights</span>
                            </div>
                            <div className="relative flex justify-center items-center py-4">
                                <svg className="w-48 h-48 transform -rotate-90">
                                    <circle className="text-surface-container-high" cx="96" cy="96" fill="transparent" r="80" stroke="currentColor" strokeWidth="12"></circle>
                                    <circle className="text-tertiary" cx="96" cy="96" fill="transparent" r="80" stroke="currentColor" strokeDasharray="502.4" strokeDashoffset="502.4" strokeWidth="12"></circle>
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-4xl font-black text-on-surface">0</span>
                                    <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Total Solved</span>
                                </div>
                            </div>
                            <div className="space-y-4 mt-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                                        <span className="text-sm font-medium text-on-surface-variant">Easy</span>
                                    </div>
                                    <span className="text-sm font-bold text-on-surface">0 <span className="text-xs text-on-surface-variant">/ 400</span></span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-secondary"></span>
                                        <span className="text-sm font-medium text-on-surface-variant">Medium</span>
                                    </div>
                                    <span className="text-sm font-bold text-on-surface">0 <span className="text-xs text-on-surface-variant">/ 400</span></span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-error"></span>
                                        <span className="text-sm font-medium text-on-surface-variant">Hard</span>
                                    </div>
                                    <span className="text-sm font-bold text-on-surface">0 <span className="text-xs text-on-surface-variant">/ 200</span></span>
                                </div>
                            </div>
                        </div>

                        {/* 2. Topic Skill Analysis (Radar/Spider Simulation) */}
                        <div className="col-span-12 lg:col-span-5 bg-surface-container-lowest rounded-xl p-6 shadow-[0_4px_24px_rgba(43,52,56,0.04)] overflow-hidden relative">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-bold text-on-surface">Domain Proficiency</h3>
                                <div className="px-3 py-1 bg-tertiary-container rounded-full">
                                    <span className="text-[10px] font-black text-on-tertiary-container uppercase tracking-tighter">Balanced Growth</span>
                                </div>
                            </div>
                            {/* Simplified Radar Chart Visual */}
                            <div className="relative h-64 flex items-center justify-center my-4">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-48 h-48 border border-outline-variant/30 rounded-full"></div>
                                    <div className="w-32 h-32 border border-outline-variant/30 rounded-full"></div>
                                    <div className="w-16 h-16 border border-outline-variant/30 rounded-full"></div>
                                </div>
                                {/* Synthetic Spider Path */}
                                <svg className="w-64 h-64 absolute" viewBox="0 0 100 100">
                                    <polygon fill="transparent" points="50,10 85,30 80,75 50,90 20,75 15,30" stroke="#aab3b9" strokeDasharray="1 1" strokeWidth="0.5"></polygon>
                                    <polygon fill="rgba(0, 110, 50, 0.1)" points="50,50 50,50 50,50 50,50 50,50 50,50" stroke="#006e32" strokeWidth="2"></polygon>
                                </svg>
                                {/* Labels */}
                                <div className="absolute top-0 text-[10px] font-bold text-on-surface-variant">FRONTEND</div>
                                <div className="absolute bottom-0 text-[10px] font-bold text-on-surface-variant">TESTING</div>
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 text-[10px] font-bold text-on-surface-variant">BACKEND</div>
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 text-[10px] font-bold text-on-surface-variant">MOBILE</div>
                                <div className="absolute right-8 bottom-8 text-[10px] font-bold text-on-surface-variant">DEVOPS</div>
                                <div className="absolute left-8 bottom-8 text-[10px] font-bold text-on-surface-variant">SECURITY</div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-4 text-center">
                                <div className="p-3 bg-surface-container rounded-lg">
                                    <p className="text-[10px] font-bold text-on-surface-variant uppercase mb-1">Strongest</p>
                                    <p className="text-sm font-bold text-tertiary">N/A</p>
                                </div>
                                <div className="p-3 bg-surface-container rounded-lg">
                                    <p className="text-[10px] font-bold text-on-surface-variant uppercase mb-1">Working on</p>
                                    <p className="text-sm font-bold text-secondary">N/A</p>
                                </div>
                            </div>
                        </div>

                        {/* 3. Performance Metrics Card */}
                        <div className="col-span-12 lg:col-span-3 space-y-6">
                            {/* Accuracy Gauge */}
                            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-[0_4px_24px_rgba(43,52,56,0.04)] text-center">
                                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-4">Accuracy Rate</p>
                                <div className="relative inline-flex items-center justify-center">
                                    <svg className="w-24 h-24 transform -rotate-90">
                                        <circle className="text-surface-container-high" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" strokeWidth="8"></circle>
                                        <circle className="text-secondary" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" strokeDasharray="251.2" strokeDashoffset="251.2" strokeWidth="8"></circle>
                                    </svg>
                                    <span className="absolute text-xl font-black text-on-surface">0%</span>
                                </div>
                                <p className="mt-4 text-xs font-medium text-on-surface-variant">Top 5% for your level</p>
                            </div>
                            {/* Coding Streak */}
                            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-[0_4px_24px_rgba(43,52,56,0.04)]">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-lg bg-secondary-container flex items-center justify-center text-on-secondary-container">
                                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-on-surface-variant uppercase">Coding Streak</p>
                                        <p className="text-lg font-black text-on-surface">0 Days</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-bold uppercase text-on-surface-variant">
                                        <span>Progress to next badge</span>
                                        <span>0 / 20</span>
                                    </div>
                                    <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                                        <div className="h-full bg-secondary w-[0%] rounded-full"></div>
                                    </div>
                                    <p className="text-[10px] text-right font-medium text-on-surface-variant">Personal Best: 0 Days</p>
                                </div>
                            </div>
                        </div>

                        {/* 4. Weak Areas List */}
                        <div className="col-span-12 lg:col-span-6 bg-surface-container-lowest rounded-xl p-6 shadow-[0_4px_24px_rgba(43,52,56,0.04)]">
                            <div className="flex items-center gap-2 mb-6">
                                <span className="material-symbols-outlined text-error">priority_high</span>
                                <h3 className="text-lg font-bold text-on-surface">Identified Weak Areas</h3>
                            </div>
                            <div className="space-y-6">
                                <div className="group">
                                    <div className="flex justify-between items-end mb-2">
                                        <div>
                                            <p className="text-sm font-bold text-on-surface">Dynamic Programming</p>
                                            <p className="text-[10px] text-on-surface-variant font-medium">Topic frequency in Hard problems: High</p>
                                        </div>
                                        <span className="text-xs font-black text-error">0% Mastery</span>
                                    </div>
                                    <div className="w-full h-3 bg-surface-container-high rounded-full overflow-hidden">
                                        <div className="h-full bg-error w-[0%] rounded-full group-hover:opacity-80 transition-all"></div>
                                    </div>
                                </div>
                                <div className="group">
                                    <div className="flex justify-between items-end mb-2">
                                        <div>
                                            <p className="text-sm font-bold text-on-surface">System Design</p>
                                            <p className="text-[10px] text-on-surface-variant font-medium">Interview relevance: Critical</p>
                                        </div>
                                        <span className="text-xs font-black text-secondary">0% Mastery</span>
                                    </div>
                                    <div className="w-full h-3 bg-surface-container-high rounded-full overflow-hidden">
                                        <div className="h-full bg-secondary w-[0%] rounded-full group-hover:opacity-80 transition-all"></div>
                                    </div>
                                </div>
                                <div className="group">
                                    <div className="flex justify-between items-end mb-2">
                                        <div>
                                            <p className="text-sm font-bold text-on-surface">Graph Theory</p>
                                            <p className="text-[10px] text-on-surface-variant font-medium">Algorithmic complexity: High</p>
                                        </div>
                                        <span className="text-xs font-black text-secondary">0% Mastery</span>
                                    </div>
                                    <div className="w-full h-3 bg-surface-container-high rounded-full overflow-hidden">
                                        <div className="h-full bg-secondary w-[0%] rounded-full group-hover:opacity-80 transition-all"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 5. Recommended Challenges */}
                        <div className="col-span-12 lg:col-span-6 bg-surface-container-lowest rounded-xl p-6 shadow-[0_4px_24px_rgba(43,52,56,0.04)]">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-on-surface">Recommended Challenges</h3>
                                <a className="text-xs font-bold text-primary hover:underline transition-all" href="#">View All</a>
                            </div>
                            <div className="space-y-3 opacity-50">
                                <div className="flex items-center justify-center p-8 bg-surface-container rounded-xl border-dashed border-2 border-outline-variant/30">
                                    <p className="text-sm font-bold text-on-surface-variant">No recommendations yet. Start solving problems!</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default SkillAnalysis;
