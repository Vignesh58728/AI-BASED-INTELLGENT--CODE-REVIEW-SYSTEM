import React from 'react';

export function SettingsPage() {
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
                        <a className="flex items-center gap-3 p-3 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-lg hover:translate-x-1 transition-all duration-200" href="/discuss">
                            <span className="material-symbols-outlined">forum</span> Discussions
                        </a>
                        <a className="flex items-center gap-3 p-3 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-lg hover:translate-x-1 transition-all duration-200" href="/skill-analysis">
                            <span className="material-symbols-outlined">bar_chart</span> Stats
                        </a>
                        <a className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg shadow-sm font-semibold hover:translate-x-1 transition-all duration-200 border-b border-slate-200 dark:border-slate-800 pb-4 mb-2" href="/settings">
                            <span className="material-symbols-outlined">settings</span> Settings
                        </a>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-8 bg-surface overflow-y-auto">
                    <div className="max-w-5xl mx-auto space-y-8">
                        <header>
                            <h1 className="text-4xl font-black tracking-tight text-on-surface mb-2">Account Settings</h1>
                            <p className="text-on-surface-variant text-lg">Manage your personal information, privacy, and system preferences.</p>
                        </header>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            <div className="lg:col-span-8 space-y-8">
                                <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/10 shadow-sm">
                                    <h3 className="text-xl font-bold mb-6">Profile Settings</h3>
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Username</label>
                                                <input type="text" value="alex_rivera" className="w-full bg-surface-container-low p-3 rounded-2xl border-none font-bold text-sm" readOnly />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Full Name</label>
                                                <input type="text" value="Alex Rivera" className="w-full bg-surface-container-low p-3 rounded-2xl border-none font-bold text-sm" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Bio</label>
                                            <textarea className="w-full bg-surface-container-low p-3 rounded-2xl border-none font-bold text-sm h-24 resize-none">Senior Data Architect with a focus on scalable systems and algorithmic efficiency.</textarea>
                                        </div>
                                        <button className="px-6 py-2 bg-primary text-on-primary rounded-xl font-black uppercase text-xs tracking-widest hover:bg-primary-dim transition-all">Save Profile</button>
                                    </div>
                                </div>

                                <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/10 shadow-sm">
                                    <h3 className="text-xl font-bold mb-6">System Preferences</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-2xl">
                                            <div>
                                                <p className="font-bold">Privacy Mode</p>
                                                <p className="text-xs text-on-surface-variant">Hide your global ranking from other users.</p>
                                            </div>
                                            <div className="w-12 h-6 bg-tertiary-container rounded-full relative cursor-pointer shadow-inner">
                                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-2xl">
                                            <div>
                                                <p className="font-bold">Dark Mode</p>
                                                <p className="text-xs text-on-surface-variant">Switch to the high-contrast dark interface.</p>
                                            </div>
                                            <div className="w-12 h-6 bg-surface-container-highest rounded-full relative cursor-pointer shadow-inner">
                                                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-4 space-y-6">
                                <div className="bg-secondary-container p-8 rounded-3xl relative overflow-hidden">
                                    <h4 className="text-xl font-black text-on-secondary-container mb-2">Account Status</h4>
                                    <p className="text-sm text-on-secondary-container/80">Pro Member since March 2024. Your account is in good standing.</p>
                                    <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-8xl text-on-secondary-container opacity-10">verified_user</span>
                                </div>
                                <button className="w-full py-4 text-error font-black uppercase tracking-widest text-xs border border-error/20 rounded-3xl hover:bg-error-container hover:text-on-error transition-all">Deactivate Account</button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default SettingsPage;
