import React from 'react';

export function NotificationsPage() {
    return (
        <div className="bg-background text-on-background min-h-screen relative satisfy-font-override">
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

            <div className="flex w-full">
                <main className="flex-1 px-8 py-12 lg:px-12 w-full">
                    <header className="mb-12">
                        <h1 className="text-4xl font-extrabold tracking-tight text-on-background mb-2 font-headline">Notifications</h1>
                        <p className="text-on-surface-variant text-lg">Stay updated on your coding journey.</p>
                    </header>

                    <div className="grid grid-cols-12 gap-8">
                        {/* Filter Tabs Section */}
                        <div className="col-span-12 flex items-center justify-between bg-surface-container-low p-1 rounded-full">
                            <div className="flex gap-1">
                                <button className="px-6 py-2 bg-surface-container-lowest text-primary font-semibold rounded-full shadow-sm transition-all">All</button>
                                <button className="px-6 py-2 text-on-surface-variant hover:bg-white/40 rounded-full transition-all">Unread</button>
                                <button className="px-6 py-2 text-on-surface-variant hover:bg-white/40 rounded-full transition-all">System</button>
                                <button className="px-6 py-2 text-on-surface-variant hover:bg-white/40 rounded-full transition-all">Community</button>
                            </div>
                            <button className="flex items-center gap-2 px-4 py-2 text-primary hover:text-primary-dim text-sm font-medium rounded-full">
                                <span className="material-symbols-outlined text-sm" data-icon="done_all">done_all</span>
                                Mark all as read
                            </button>
                        </div>

                        {/* Main Feed */}
                        <div className="col-span-12 lg:col-span-8 space-y-4">
                            {/* Notification Card: Solution Accepted */}
                            <div className="group relative bg-surface-container-lowest p-6 rounded-3xl transition-all duration-300 hover:shadow-xl hover:shadow-on-surface/5 border border-transparent hover:border-outline-variant/10">
                                <div className="flex gap-5">
                                    <div className="flex-shrink-0 w-12 h-12 bg-tertiary-container text-on-tertiary-container rounded-full flex items-center justify-center">
                                        <span className="material-symbols-outlined rounded-full" data-icon="code">code</span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="font-bold text-lg text-on-background font-headline">Solution Accepted</h3>
                                            <span className="text-xs text-on-surface-variant font-medium">2 hours ago</span>
                                        </div>
                                        <p className="text-on-surface-variant mb-4 leading-relaxed">Your solution for <span className="font-semibold text-on-surface">"Longest Common Subsequence"</span> passed all 142 test cases. Performance: Top 5% of users.</p>
                                        <div className="flex gap-4">
                                            <a className="text-tertiary font-bold text-sm flex items-center gap-1 hover:underline" href="#">
                                                View Solution
                                                <span className="material-symbols-outlined text-xs rounded-full" data-icon="arrow_forward">arrow_forward</span>
                                            </a>
                                        </div>
                                    </div>
                                    <div className="w-2 h-2 bg-tertiary rounded-full mt-2"></div>
                                </div>
                            </div>

                            {/* Notification Card: New Achievement */}
                            <div className="group relative bg-surface-container-lowest p-6 rounded-3xl transition-all duration-300 hover:shadow-xl hover:shadow-on-surface/5 border border-transparent hover:border-outline-variant/10">
                                <div className="flex gap-5">
                                    <div className="flex-shrink-0 w-12 h-12 bg-secondary-container text-on-secondary-container rounded-full flex items-center justify-center">
                                        <span className="material-symbols-outlined rounded-full" data-icon="trophy" style={{ fontVariationSettings: "'FILL' 1" }}>trophy</span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="font-bold text-lg text-on-background font-headline">New Achievement Unlocked</h3>
                                            <span className="text-xs text-on-surface-variant font-medium">5 hours ago</span>
                                        </div>
                                        <p className="text-on-surface-variant mb-4 leading-relaxed">You've earned the <span className="font-semibold text-on-surface">"Efficiency Expert"</span> badge for optimizing 10 algorithms to O(log n) complexity.</p>
                                        <div className="flex gap-4">
                                            <a className="text-secondary font-bold text-sm flex items-center gap-1 hover:underline" href="#">
                                                Share Milestone
                                                <span className="material-symbols-outlined text-xs rounded-full" data-icon="share">share</span>
                                            </a>
                                        </div>
                                    </div>
                                    <div className="w-2 h-2 bg-secondary rounded-full mt-2"></div>
                                </div>
                            </div>

                            {/* Notification Card: Team Invite */}
                            <div className="group relative bg-surface-container-lowest p-6 rounded-3xl transition-all duration-300 hover:shadow-xl hover:shadow-on-surface/5 border border-transparent hover:border-outline-variant/10">
                                <div className="flex gap-5">
                                    <div className="flex-shrink-0 w-12 h-12 bg-surface-container-high text-on-surface-variant rounded-full flex items-center justify-center">
                                        <span className="material-symbols-outlined rounded-full" data-icon="group">group</span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="font-bold text-lg text-on-background font-headline">Team Invite</h3>
                                            <span className="text-xs text-on-surface-variant font-medium">Yesterday</span>
                                        </div>
                                        <p className="text-on-surface-variant mb-4 leading-relaxed"><span className="font-semibold text-on-surface">Alex Rivers</span> invited you to join the "Kernel Mavericks" research group for the upcoming Global Hackathon.</p>
                                        <div className="flex gap-3">
                                            <button className="bg-primary text-on-primary px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-primary-dim transition-colors">Accept Invite</button>
                                            <button className="bg-surface-container-low text-on-surface-variant px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-surface-container-high transition-colors">Decline</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Notification Card: System Maintenance */}
                            <div className="group relative bg-surface-container-lowest p-6 rounded-3xl transition-all duration-300 hover:shadow-xl hover:shadow-on-surface/5 border border-transparent hover:border-outline-variant/10 opacity-70">
                                <div className="flex gap-5">
                                    <div className="flex-shrink-0 w-12 h-12 bg-surface-container-low text-outline rounded-full flex items-center justify-center">
                                        <span className="material-symbols-outlined rounded-full" data-icon="settings_suggest">settings_suggest</span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="font-bold text-lg text-on-background font-headline">Scheduled Maintenance</h3>
                                            <span className="text-xs text-on-surface-variant font-medium">2 days ago</span>
                                        </div>
                                        <p className="text-on-surface-variant mb-0 leading-relaxed">The Analytical environment will be undergoing maintenance on Saturday, 02:00 UTC. Expect 15 mins of downtime.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Content (Bento Style) */}
                        <div className="col-span-12 lg:col-span-4 space-y-8">
                            {/* Notification Preferences Mini Card */}
                            <div className="bg-surface-container-low p-6 rounded-3xl">
                                <h4 className="font-bold text-on-background mb-4 text-xl font-headline">Frequency</h4>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Email Digests</span>
                                        <div className="w-10 h-5 bg-tertiary rounded-full relative cursor-pointer">
                                            <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Push Notifications</span>
                                        <div className="w-10 h-5 bg-tertiary rounded-full relative cursor-pointer">
                                            <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Achievement Alerts</span>
                                        <div className="w-10 h-5 bg-surface-container-highest rounded-full relative cursor-pointer">
                                            <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                                <button className="mt-6 w-full py-2 border border-outline-variant/30 rounded-full text-xs font-bold uppercase tracking-widest text-primary hover:bg-white transition-colors">Manage All Settings</button>
                            </div>

                            {/* Achievement Highlight */}
                            <div className="relative overflow-hidden bg-on-surface text-surface-container-lowest p-6 rounded-3xl">
                                <div className="relative z-10">
                                    <h4 className="font-bold mb-2 text-xl font-headline">Weekly Goal</h4>
                                    <p className="text-xs opacity-70 mb-4">Complete 5 Medium challenges to keep your streak alive.</p>
                                    <div className="h-2 w-full bg-white/20 rounded-full mb-2">
                                        <div className="h-full w-0 bg-tertiary-fixed rounded-full shadow-[0_0_8px_rgba(127,255,157,0.5)]"></div>
                                    </div>
                                    <p className="text-right text-[10px] font-bold">0 / 5 Solved</p>
                                </div>
                                <div className="absolute -right-8 -bottom-8 opacity-10">
                                    <span className="material-symbols-outlined text-[120px] rounded-full" data-icon="bolt">bolt</span>
                                </div>
                            </div>

                            {/* Info Card */}
                            <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-lg shadow-on-surface/5 border border-outline-variant/10">
                                <p className="text-xs text-on-surface-variant italic">Changes to notification preferences will be applied immediately across all linked devices.</p>
                            </div>
                        </div>

                        {/* Empty State Example (Hidden by default unless data is empty) */}
                        <div className="col-span-12 hidden flex-col items-center justify-center py-32 bg-surface-container-lowest rounded-full border-2 border-dashed border-outline-variant/20">
                            <div className="w-24 h-24 bg-surface-container-low rounded-full flex items-center justify-center mb-6">
                                <span className="material-symbols-outlined text-4xl text-outline-variant rounded-full" data-icon="notifications_off">notifications_off</span>
                            </div>
                            <h3 className="text-2xl font-bold text-on-background mb-2 font-headline">All Caught Up!</h3>
                            <p className="text-on-surface-variant max-w-xs text-center">There are no new notifications at the moment. We'll let you know when something important happens.</p>
                            <button className="mt-8 px-6 py-2 bg-primary text-on-primary rounded-full font-semibold text-sm">Return to Dashboard</button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default NotificationsPage;
