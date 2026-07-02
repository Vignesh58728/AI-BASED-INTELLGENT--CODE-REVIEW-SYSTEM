import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

// --- Real SVG Brand Icons ---
const FacebookIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
);

const GitHubIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
);

const LinkedInIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
);

const GoogleIcon = () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
);

// --- Panel Components ---

const SettingsPanel = ({ user, username, setUsername, mergeUsername, setMergeUsername, mergeEmail, setMergeEmail }: any) => (
    <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-7 space-y-8">
            <section className="bg-white p-8 rounded-xl shadow-[0_4px_24px_rgba(43,52,56,0.04)]">
                <label className="block text-sm font-semibold text-[#586065] mb-3 uppercase tracking-wider">Username</label>
                <div className="relative">
                    <input className="w-full bg-[#f1f4f7] border-none rounded-xl py-4 px-5 text-[#2b3438] font-medium focus:ring-2 focus:ring-[#5f5e5e]/40 transition-all outline-none pr-12" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                    <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#586065]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </div>
            </section>
            <section className="bg-white p-8 rounded-xl shadow-[0_4px_24px_rgba(43,52,56,0.04)]">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <svg className="w-5 h-5 text-[#5f5e5e]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    Email Addresses
                </h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-[#f1f4f7]">
                        <div className="flex flex-col"><span className="font-semibold text-[#2b3438]">{user?.email || 'No email connected'}</span><span className="text-xs text-[#586065]">Primary email address</span></div>
                        <div className="flex gap-2">
                            <span className="px-3 py-1 bg-[#7fff9d] text-[#006c31] text-[10px] font-bold rounded-full uppercase tracking-tighter">Verified</span>
                            <span className="px-3 py-1 bg-[#ffddba] text-[#764700] text-[10px] font-bold rounded-full uppercase tracking-tighter">Primary</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl hover:bg-[#f1f4f7]/50 transition-colors cursor-pointer border border-dashed border-[#aab3b9]/50">
                        <span className="text-[#586065] font-medium">Add another email address...</span>
                        <svg className="w-5 h-5 text-[#586065]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    </div>
                </div>
            </section>
            <section className="bg-white p-8 rounded-xl shadow-[0_4px_24px_rgba(43,52,56,0.04)]">
                <h3 className="text-lg font-bold mb-6">Merge Accounts</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-xs font-bold text-[#586065] mb-2 uppercase">Username</label><input className="w-full bg-[#f1f4f7] border-none rounded-lg py-3 px-4 text-sm focus:ring-2 focus:ring-[#5f5e5e]/40 outline-none" placeholder="Target username" type="text" value={mergeUsername} onChange={(e) => setMergeUsername(e.target.value)} /></div>
                    <div><label className="block text-xs font-bold text-[#586065] mb-2 uppercase">Email</label><input className="w-full bg-[#f1f4f7] border-none rounded-lg py-3 px-4 text-sm focus:ring-2 focus:ring-[#5f5e5e]/40 outline-none" placeholder="Target email" type="email" value={mergeEmail} onChange={(e) => setMergeEmail(e.target.value)} /></div>
                </div>
                <button onClick={() => { if (!mergeUsername && !mergeEmail) { alert('Please fill in a username or email to merge.'); return; } if (window.confirm(`Submit merge request for ${mergeUsername || mergeEmail}?`)) { alert('Merge request submitted! You will receive a confirmation email.'); } }} className="mt-6 w-full py-3 bg-[#e2e9ee] text-[#525151] font-bold rounded-xl hover:bg-[#dbe4ea] transition-colors">Submit Merge Request</button>
            </section>
        </div>
        <div className="col-span-12 lg:col-span-5 space-y-8">
            <section className="bg-white p-8 rounded-xl shadow-[0_4px_24px_rgba(43,52,56,0.04)]">
                <h3 className="text-lg font-bold mb-6">Connected Accounts</h3>
                <div className="space-y-3">
                    <button onClick={() => alert('Facebook OAuth connection is not configured yet. Contact admin to enable social login.')} className="w-full flex items-center justify-between p-4 rounded-xl bg-[#1877F2]/10 border border-[#1877F2]/20 group hover:bg-[#1877F2]/20 transition-all">
                        <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-[#1877F2] flex items-center justify-center text-white"><FacebookIcon /></div><span className="font-bold text-[#1877F2]">Facebook</span></div>
                        <span className="text-xs font-bold text-[#586065] group-hover:text-[#2b3438]">Connect</span>
                    </button>
                    <button className="w-full flex items-center justify-between p-4 rounded-xl bg-[#24292e]/5 border border-[#24292e]/10 group hover:bg-[#24292e]/10 transition-all">
                        <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-[#24292e] flex items-center justify-center text-white"><GitHubIcon /></div><span className="font-bold text-[#24292e]">GitHub</span></div>
                        <span className="px-3 py-1 bg-[#e2e9ee] text-[#586065] text-[10px] font-bold rounded-full">Linked</span>
                    </button>
                    <button onClick={() => alert('LinkedIn OAuth connection is not configured yet. Contact admin to enable social login.')} className="w-full flex items-center justify-between p-4 rounded-xl bg-[#0A66C2]/10 border border-[#0A66C2]/20 group hover:bg-[#0A66C2]/20 transition-all">
                        <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-[#0A66C2] flex items-center justify-center text-white"><LinkedInIcon /></div><span className="font-bold text-[#0A66C2]">LinkedIn</span></div>
                        <span className="text-xs font-bold text-[#586065] group-hover:text-[#2b3438]">Connect</span>
                    </button>
                    <button className="w-full flex items-center justify-between p-4 rounded-xl bg-white border border-slate-200 group hover:bg-slate-50 transition-all">
                        <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center"><GoogleIcon /></div><span className="font-bold text-slate-700">Google</span></div>
                        <span className="px-3 py-1 bg-[#7fff9d] text-[#006c31] text-[10px] font-bold rounded-full">Linked</span>
                    </button>
                </div>
            </section>
            <section className="bg-white p-8 rounded-xl shadow-[0_4px_24px_rgba(43,52,56,0.04)] border-l-4 border-[#5f5e5e]">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-[#f1f4f7] rounded-lg"><svg className="w-7 h-7 text-[#5f5e5e]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg></div>
                    <div><h3 className="text-lg font-bold">Export Data</h3><p className="text-sm text-[#586065] mt-1 leading-relaxed">Download a full archive of your account data including activity logs and shared files.</p><button onClick={() => { alert('Your data export has been queued. You will receive a download link via email within 24 hours.'); }} className="mt-4 px-6 py-2 bg-[#5f5e5e] text-[#faf7f6] font-bold rounded-lg hover:bg-[#535252] transition-all shadow-sm">Create new archive</button></div>
                </div>
            </section>
            <section className="bg-[#fe8983]/10 p-8 rounded-xl border border-[#9f403d]/20">
                <h3 className="text-lg font-bold text-[#9f403d] mb-2">Danger Zone</h3>
                <p className="text-sm text-[#752121] mb-6 opacity-80">Once you delete your account, there is no going back. Please be certain.</p>
                <button onClick={() => { if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) { if (window.confirm('Final warning: ALL your data will be permanently deleted. Type OK to confirm.')) { alert('Account deletion has been initiated. You will receive a confirmation email.'); } } }} className="w-full py-4 bg-[#9f403d] text-[#fff7f6] font-extrabold rounded-xl hover:bg-[#7a2f2d] transition-all shadow-lg shadow-[#9f403d]/10">Delete Account</button>
            </section>
        </div>
    </div>
);

const TeamsPanel = () => (
    <div className="space-y-8 max-w-3xl">
        <section className="bg-white p-8 rounded-xl shadow-[0_4px_24px_rgba(43,52,56,0.04)]">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-[#5f5e5e]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                Your Teams
            </h3>
            <div className="space-y-4">
                {[{ name: 'Frontend Team', members: 8, role: 'Admin', color: 'bg-blue-100 text-blue-700' }, { name: 'Backend Dev', members: 5, role: 'Member', color: 'bg-green-100 text-green-700' }, { name: 'Design System', members: 3, role: 'Viewer', color: 'bg-purple-100 text-purple-700' }].map((team) => (
                    <div key={team.name} className="flex items-center justify-between p-4 rounded-xl bg-[#f1f4f7] hover:bg-[#e2e9ee] transition-colors cursor-pointer">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-[#5f5e5e] flex items-center justify-center text-white font-bold text-sm">{team.name[0]}</div>
                            <div><p className="font-semibold text-[#2b3438]">{team.name}</p><p className="text-xs text-[#586065]">{team.members} members</p></div>
                        </div>
                        <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-tight ${team.color}`}>{team.role}</span>
                    </div>
                ))}
            </div>
            <button className="mt-6 w-full py-3 bg-[#006e32] text-white font-bold rounded-xl hover:bg-[#005a29] transition-colors flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                Create New Team
            </button>
        </section>
        <section className="bg-white p-8 rounded-xl shadow-[0_4px_24px_rgba(43,52,56,0.04)]">
            <h3 className="text-lg font-bold mb-4">Invite Member</h3>
            <p className="text-sm text-[#586065] mb-6">Invite colleagues to collaborate with you.</p>
            <div className="flex gap-3">
                <input className="flex-1 bg-[#f1f4f7] border-none rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-[#5f5e5e]/40" placeholder="Email address..." type="email" />
                <button className="px-6 py-3 bg-[#5f5e5e] text-white font-bold rounded-xl hover:bg-[#535252] transition-colors">Send Invite</button>
            </div>
        </section>
    </div>
);

const PasswordPanel = () => {
    const [currentPwd, setCurrentPwd] = useState('');
    const [newPwd, setNewPwd] = useState('');
    const [confirmPwd, setConfirmPwd] = useState('');
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const strength = newPwd.length === 0 ? 0 : newPwd.length < 6 ? 1 : newPwd.length < 10 ? 2 : 3;
    const strengthLabel = ['', 'Weak', 'Fair', 'Strong'];
    const strengthColor = ['', 'bg-red-400', 'bg-yellow-400', 'bg-green-500'];
    return (
        <div className="max-w-lg space-y-8">
            <section className="bg-white p-8 rounded-xl shadow-[0_4px_24px_rgba(43,52,56,0.04)]">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <svg className="w-5 h-5 text-[#5f5e5e]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    Change Password
                </h3>
                <div className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-[#586065] mb-2 uppercase tracking-wider">Current Password</label>
                        <div className="relative">
                            <input className="w-full bg-[#f1f4f7] border-none rounded-xl py-3.5 px-4 text-sm outline-none focus:ring-2 focus:ring-[#5f5e5e]/40 pr-12" type={showCurrent ? 'text' : 'password'} value={currentPwd} onChange={e => setCurrentPwd(e.target.value)} placeholder="••••••••" />
                            <button onClick={() => setShowCurrent(!showCurrent)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#586065]">
                                {showCurrent ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg> : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-[#586065] mb-2 uppercase tracking-wider">New Password</label>
                        <div className="relative">
                            <input className="w-full bg-[#f1f4f7] border-none rounded-xl py-3.5 px-4 text-sm outline-none focus:ring-2 focus:ring-[#5f5e5e]/40 pr-12" type={showNew ? 'text' : 'password'} value={newPwd} onChange={e => setNewPwd(e.target.value)} placeholder="••••••••" />
                            <button onClick={() => setShowNew(!showNew)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#586065]">
                                {showNew ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg> : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
                            </button>
                        </div>
                        {newPwd && (
                            <div className="mt-2 space-y-1">
                                <div className="flex gap-1">{[1,2,3].map(i => <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i <= strength ? strengthColor[strength] : 'bg-[#e2e9ee]'}`} />)}</div>
                                <p className="text-xs text-[#586065] font-medium">{strengthLabel[strength]}</p>
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-[#586065] mb-2 uppercase tracking-wider">Confirm New Password</label>
                        <input className={`w-full bg-[#f1f4f7] border-none rounded-xl py-3.5 px-4 text-sm outline-none focus:ring-2 transition-all ${confirmPwd && confirmPwd !== newPwd ? 'ring-2 ring-red-300' : 'focus:ring-[#5f5e5e]/40'}`} type="password" value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)} placeholder="••••••••" />
                        {confirmPwd && confirmPwd !== newPwd && <p className="text-xs text-red-500 mt-1 font-medium">Passwords do not match</p>}
                    </div>
                    <button disabled={!currentPwd || !newPwd || newPwd !== confirmPwd} className="w-full py-3.5 bg-[#006e32] text-white font-bold rounded-xl hover:bg-[#005a29] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm">Update Password</button>
                </div>
            </section>
            <section className="bg-white p-6 rounded-xl shadow-[0_4px_24px_rgba(43,52,56,0.04)]">
                <h4 className="font-bold text-sm mb-4 text-[#2b3438]">Password Tips</h4>
                <ul className="space-y-2 text-sm text-[#586065]">
                    {['Use at least 10 characters', 'Mix uppercase and lowercase letters', 'Include numbers and symbols', 'Never reuse old passwords'].map(tip => (
                        <li key={tip} className="flex items-center gap-2"><svg className="w-3.5 h-3.5 text-[#006e32] shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>{tip}</li>
                    ))}
                </ul>
            </section>
        </div>
    );
};

const EmailsPanel = () => {
    const { user } = useAuth();
    const [newEmail, setNewEmail] = useState('');
    const [notifyLogin, setNotifyLogin] = useState(true);
    const [notifyUpdates, setNotifyUpdates] = useState(true);
    const [notifyMarketing, setNotifyMarketing] = useState(false);
    return (
        <div className="max-w-2xl space-y-8">
            <section className="bg-white p-8 rounded-xl shadow-[0_4px_24px_rgba(43,52,56,0.04)]">
                <h3 className="text-lg font-bold mb-6">Email Addresses</h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-[#f1f4f7]">
                        <div><p className="font-semibold text-[#2b3438]">{user?.email || 'user@example.com'}</p><p className="text-xs text-[#586065] mt-0.5">Added on account creation</p></div>
                        <div className="flex gap-2"><span className="px-3 py-1 bg-[#7fff9d] text-[#006c31] text-[10px] font-bold rounded-full uppercase">Verified</span><span className="px-3 py-1 bg-[#ffddba] text-[#764700] text-[10px] font-bold rounded-full uppercase">Primary</span></div>
                    </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100">
                    <label className="block text-xs font-bold text-[#586065] mb-2 uppercase">Add Email Address</label>
                    <div className="flex gap-3">
                        <input className="flex-1 bg-[#f1f4f7] border-none rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-[#5f5e5e]/40" type="email" placeholder="new@email.com" value={newEmail} onChange={e => setNewEmail(e.target.value)} />
                        <button className="px-5 py-3 bg-[#5f5e5e] text-white font-bold rounded-xl hover:bg-[#535252] transition-colors text-sm">Add</button>
                    </div>
                </div>
            </section>
            <section className="bg-white p-8 rounded-xl shadow-[0_4px_24px_rgba(43,52,56,0.04)]">
                <h3 className="text-lg font-bold mb-6">Email Notifications</h3>
                <div className="space-y-4">
                    {[
                        { label: 'Security Alerts', desc: 'Get notified for new logins and suspicious activity.', value: notifyLogin, set: setNotifyLogin },
                        { label: 'Product Updates', desc: 'News about new features and improvements.', value: notifyUpdates, set: setNotifyUpdates },
                        { label: 'Marketing Emails', desc: 'Promotions, announcements and offers.', value: notifyMarketing, set: setNotifyMarketing },
                    ].map(item => (
                        <div key={item.label} className="flex items-center justify-between p-4 bg-[#f1f4f7] rounded-xl">
                            <div><p className="font-semibold text-sm text-[#2b3438]">{item.label}</p><p className="text-xs text-[#586065] mt-0.5">{item.desc}</p></div>
                            <button onClick={() => item.set(!item.value)} className={`w-11 h-6 rounded-full transition-all relative ${item.value ? 'bg-[#006e32]' : 'bg-[#dbe4ea]'}`}>
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${item.value ? 'right-1' : 'left-1'}`} />
                            </button>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

const LanguagePanel = () => {
    const [selected, setSelected] = useState('en');
    const langs = [
        { code: 'en', name: 'English', flag: '🇺🇸', region: 'United States' },
        { code: 'ta', name: 'Tamil', flag: '🇮🇳', region: 'India' },
        { code: 'hi', name: 'Hindi', flag: '🇮🇳', region: 'India' },
        { code: 'fr', name: 'French', flag: '🇫🇷', region: 'France' },
        { code: 'de', name: 'German', flag: '🇩🇪', region: 'Germany' },
        { code: 'es', name: 'Spanish', flag: '🇪🇸', region: 'Spain' },
        { code: 'ja', name: 'Japanese', flag: '🇯🇵', region: 'Japan' },
        { code: 'zh', name: 'Chinese', flag: '🇨🇳', region: 'China' },
    ];
    return (
        <div className="max-w-2xl space-y-8">
            <section className="bg-white p-8 rounded-xl shadow-[0_4px_24px_rgba(43,52,56,0.04)]">
                <h3 className="text-lg font-bold mb-2">Display Language</h3>
                <p className="text-sm text-[#586065] mb-6">Select the language you want to use for the interface.</p>
                <div className="grid grid-cols-2 gap-3">
                    {langs.map(lang => (
                        <button key={lang.code} onClick={() => setSelected(lang.code)} className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${selected === lang.code ? 'border-[#5f5e5e] bg-[#f1f4f7]' : 'border-transparent bg-[#f8f9fb] hover:bg-[#f1f4f7]'}`}>
                            <span className="text-2xl">{lang.flag}</span>
                            <div><p className="font-semibold text-sm text-[#2b3438]">{lang.name}</p><p className="text-xs text-[#586065]">{lang.region}</p></div>
                            {selected === lang.code && <svg className="w-4 h-4 text-[#006e32] ml-auto" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                        </button>
                    ))}
                </div>
            </section>
        </div>
    );
};

const PersonalizationPanel = () => {
    const [theme, setTheme] = useState('light');
    const [fontSize, setFontSize] = useState('medium');
    const [codeFont, setCodeFont] = useState('fira');
    const [privacy, setPrivacy] = useState(false);
    const [animations, setAnimations] = useState(true);
    return (
        <div className="max-w-2xl space-y-8">
            <section className="bg-white p-8 rounded-xl shadow-[0_4px_24px_rgba(43,52,56,0.04)]">
                <h3 className="text-lg font-bold mb-6">Appearance</h3>
                <div className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-[#586065] mb-3 uppercase tracking-wider">Theme</label>
                        <div className="flex gap-3">
                            {[{ v: 'light', label: 'Light', icon: '☀️' }, { v: 'dark', label: 'Dark', icon: '🌙' }, { v: 'system', label: 'System', icon: '💻' }].map(t => (
                                <button key={t.v} onClick={() => setTheme(t.v)} className={`flex-1 py-3.5 rounded-xl border-2 font-semibold text-sm transition-all flex flex-col items-center gap-1.5 ${theme === t.v ? 'border-[#5f5e5e] bg-[#f1f4f7] text-[#2b3438]' : 'border-transparent bg-[#f8f9fb] text-[#586065] hover:bg-[#f1f4f7]'}`}>
                                    <span className="text-xl">{t.icon}</span>{t.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-[#586065] mb-3 uppercase tracking-wider">Font Size</label>
                        <div className="flex gap-3">
                            {['small', 'medium', 'large'].map(s => (
                                <button key={s} onClick={() => setFontSize(s)} className={`flex-1 py-2.5 rounded-xl border-2 font-semibold capitalize text-sm transition-all ${fontSize === s ? 'border-[#5f5e5e] bg-[#f1f4f7] text-[#2b3438]' : 'border-transparent bg-[#f8f9fb] text-[#586065] hover:bg-[#f1f4f7]'}`}>{s}</button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-[#586065] mb-3 uppercase tracking-wider">Code Editor Font</label>
                        <div className="grid grid-cols-2 gap-2">
                            {[{ v: 'fira', label: 'Fira Code' }, { v: 'mono', label: 'JetBrains Mono' }, { v: 'source', label: 'Source Code Pro' }, { v: 'consolas', label: 'Consolas' }].map(f => (
                                <button key={f.v} onClick={() => setCodeFont(f.v)} className={`py-2.5 px-4 rounded-xl border-2 font-mono text-sm transition-all text-left ${codeFont === f.v ? 'border-[#5f5e5e] bg-[#f1f4f7] text-[#2b3438]' : 'border-transparent bg-[#f8f9fb] text-[#586065] hover:bg-[#f1f4f7]'}`}>{f.label}</button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
            <section className="bg-white p-8 rounded-xl shadow-[0_4px_24px_rgba(43,52,56,0.04)]">
                <h3 className="text-lg font-bold mb-5">Privacy & Experience</h3>
                <div className="space-y-4">
                    {[
                        { label: 'Privacy Mode', desc: 'Hide your ranking from other users.', value: privacy, set: setPrivacy },
                        { label: 'Animations', desc: 'Enable smooth UI transitions.', value: animations, set: setAnimations },
                    ].map(item => (
                        <div key={item.label} className="flex items-center justify-between p-4 bg-[#f1f4f7] rounded-xl">
                            <div><p className="font-semibold text-sm text-[#2b3438]">{item.label}</p><p className="text-xs text-[#586065] mt-0.5">{item.desc}</p></div>
                            <button onClick={() => item.set(!item.value)} className={`w-11 h-6 rounded-full transition-all relative ${item.value ? 'bg-[#006e32]' : 'bg-[#dbe4ea]'}`}>
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${item.value ? 'right-1' : 'left-1'}`} />
                            </button>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

// --- Main Settings Page ---
export function SettingsPage() {
    const { user, updateProfile } = useAuth();
    const [username, setUsername] = useState(user?.username || '');
    const [mergeUsername, setMergeUsername] = useState('');
    const [mergeEmail, setMergeEmail] = useState('');
    const [activeNav, setActiveNav] = useState('settings');
    const [saveSuccess, setSaveSuccess] = useState(false);

    const handleSaveChanges = async () => {
        try {
            await updateProfile({ username });
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (error) {
            console.error('Failed to save:', error);
        }
    };

    const navItems = [
        { id: 'settings', label: 'Settings', group: 'account', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
        { id: 'teams', label: 'Teams', group: 'account', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
        { id: 'password', label: 'Password', group: 'account', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg> },
        { id: 'emails', label: 'Emails', group: 'preferences', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> },
        { id: 'language', label: 'Language', group: 'preferences', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg> },
        { id: 'personalization', label: 'Personalization', group: 'preferences', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg> },
    ];

    const pageTitles: Record<string, { title: string; desc: string }> = {
        settings: { title: 'Profile Settings', desc: 'Manage your personal information and connected services.' },
        teams: { title: 'Teams', desc: 'Manage your team memberships and collaborations.' },
        password: { title: 'Password & Security', desc: 'Update your password and secure your account.' },
        emails: { title: 'Email Management', desc: 'Manage email addresses and notification preferences.' },
        language: { title: 'Language', desc: 'Choose your preferred display language.' },
        personalization: { title: 'Personalization', desc: 'Customize your theme, fonts, and interface experience.' },
    };

    return (
        <div className="bg-[#f8f9fb] text-[#2b3438] min-h-screen flex font-['Outfit']">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,300&family=Outfit:wght@300;400;500;600;700;800&display=swap');
                .settings-heading { font-family: 'Spectral', serif; }
            `}</style>
            <link href="https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,300&family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

            {/* Sidebar */}
            <aside className="w-64 fixed left-0 top-20 bottom-0 overflow-y-auto flex flex-col py-6 px-5 bg-slate-50 border-r border-slate-200 z-40">
                <div className="mb-8">
                    <h2 className="text-lg font-bold text-zinc-900 tracking-tight settings-heading">ACCOUNT</h2>
                    <p className="text-[10px] font-bold text-zinc-400 tracking-[0.2em] mt-1 uppercase">PREFERENCES</p>
                </div>

                <nav className="flex-1 space-y-1">
                    {/* Account group */}
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-3 mb-2">Account</p>
                    {navItems.filter(n => n.group === 'account').map(item => (
                        <button key={item.id} onClick={() => setActiveNav(item.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left ${activeNav === item.id ? 'bg-white text-zinc-900 font-semibold shadow-sm' : 'text-zinc-500 hover:text-zinc-700 hover:bg-slate-200/50'}`}>
                            {item.icon}
                            <span className="text-sm font-medium tracking-tight">{item.label}</span>
                        </button>
                    ))}

                    {/* Preferences group */}
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-3 mb-2 pt-5">Preferences</p>
                    {navItems.filter(n => n.group === 'preferences').map(item => (
                        <button key={item.id} onClick={() => setActiveNav(item.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left ${activeNav === item.id ? 'bg-white text-zinc-900 font-semibold shadow-sm' : 'text-zinc-500 hover:text-zinc-700 hover:bg-slate-200/50'}`}>
                            {item.icon}
                            <span className="text-sm font-medium tracking-tight">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="mt-auto pt-6 space-y-2">
                    {saveSuccess && (
                        <div className="flex items-center gap-2 px-3 py-2 bg-[#7fff9d]/30 rounded-lg">
                            <svg className="w-4 h-4 text-[#006e32]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                            <span className="text-xs font-bold text-[#006e32]">Saved!</span>
                        </div>
                    )}
                    <button onClick={handleSaveChanges} className="w-full bg-[#006e32] text-[#e9ffe7] py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-sm hover:bg-[#005a29] transition-all active:scale-[0.98]">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        Save Changes
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="ml-64 flex-1 p-12 pt-28">
                <header className="mb-10">
                    <h1 className="text-5xl font-light text-[#2b3438] tracking-tight settings-heading">{pageTitles[activeNav]?.title}</h1>
                    <p className="text-[#586065] mt-3 text-lg font-['Outfit']">{pageTitles[activeNav]?.desc}</p>
                </header>

                {activeNav === 'settings' && <SettingsPanel user={user} username={username} setUsername={setUsername} mergeUsername={mergeUsername} setMergeUsername={setMergeUsername} mergeEmail={mergeEmail} setMergeEmail={setMergeEmail} />}
                {activeNav === 'teams' && <TeamsPanel />}
                {activeNav === 'password' && <PasswordPanel />}
                {activeNav === 'emails' && <EmailsPanel />}
                {activeNav === 'language' && <LanguagePanel />}
                {activeNav === 'personalization' && <PersonalizationPanel />}
            </main>
        </div>
    );
}

export default SettingsPage;
