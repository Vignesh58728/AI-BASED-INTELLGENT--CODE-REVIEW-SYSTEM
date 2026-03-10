import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
   User, 
   Settings as SettingsIcon, 
   ShieldCheck, 
   Bell, 
   Mail, 
   Palette, 
   CreditCard,
   Camera,
   Github,
   Linkedin,
   Globe,
   Save
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function SettingsPage() {
   const { user, updateProfile } = useAuth();
   const [activeTab, setActiveTab] = useState('profile');
   
   const [formData, setFormData] = useState({
      name: user?.full_name || '',
      email: user?.email || '',
      bio: '',
      website: '',
      github: '',
      linkedin: ''
   });

   const navItems = [
      { id: 'profile', label: 'Public Profile', icon: User },
      { id: 'account', label: 'Account', icon: SettingsIcon },
      { id: 'security', label: 'Security', icon: ShieldCheck },
      { id: 'notifications', label: 'Notifications', icon: Bell },
      { id: 'emails', label: 'Emails', icon: Mail },
      { id: 'appearance', label: 'Appearance', icon: Palette },
   ];

   const handleSave = async (e: React.FormEvent) => {
      e.preventDefault();
      // Implement save logic here
      console.log('Saving settings:', formData);
   };

   return (
      <div className="min-h-screen bg-white font-['Poppins']">
         <main className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex flex-col lg:flex-row gap-12">
               
               {/* Left Sidebar */}
               <aside className="w-full lg:w-64 flex-shrink-0">
                  <div className="sticky top-24">
                     <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-6 px-4 font-['Syncopate']">Settings</h2>
                     <nav className="space-y-2">
                        {navItems.map((item) => {
                           const ItemIcon = item.icon;
                           return (
                              <button
                                 key={item.id}
                                 onClick={() => setActiveTab(item.id)}
                                 className={`w-full flex items-center gap-3 px-6 py-4 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all font-['Syncopate'] ${
                                    activeTab === item.id 
                                    ? 'bg-black text-white shadow-xl shadow-black/10' 
                                    : 'text-zinc-400 hover:bg-zinc-50 hover:text-black'
                                 }`}
                              >
                                 <ItemIcon size={16} className={activeTab === item.id ? 'text-white' : 'text-black'} />
                                 {item.label}
                              </button>
                           );
                        })}
                     </nav>
                  </div>
               </aside>

               {/* Right Content */}
               <section className="flex-grow max-w-3xl">
                  <motion.div
                     key={activeTab}
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="space-y-8"
                  >
                     {/* Header */}
                     <div>
                        <h1 className="text-2xl font-black text-black tracking-[0.1em] mb-2 font-['Syncopate'] uppercase">
                           {navItems.find(i => i.id === activeTab)?.label}
                        </h1>
                     </div>

                     <div className="bg-white border border-zinc-100 rounded-[32px] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
                        {activeTab === 'profile' && (
                           <form onSubmit={handleSave} className="space-y-10">
                              {/* Avatar Section */}
                              <div className="flex flex-col sm:flex-row items-center gap-8 pb-10 border-b border-zinc-50">
                                 <div className="relative group">
                                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-zinc-50 p-1 bg-white">
                                       <img 
                                          src={user?.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.full_name || 'U')}&background=f3f4f6&color=000&bold=true`} 
                                          alt="Avatar" 
                                          className="w-full h-full object-cover rounded-full"
                                       />
                                    </div>
                                    <button type="button" className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                                       <Camera className="text-white w-6 h-6" />
                                    </button>
                                 </div>
                                 <div className="flex flex-col items-center sm:items-start gap-4">
                                    <div>
                                       <h3 className="text-lg font-black text-black tracking-tight">Profile Picture</h3>
                                    </div>
                                    <div className="flex gap-4">
                                       <button type="button" className="px-6 py-3 bg-black text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-zinc-800 transition-all shadow-xl shadow-black/10 active:scale-95 font-['Syncopate']">
                                          Change Photo
                                       </button>
                                       <button type="button" className="px-6 py-3 bg-white text-zinc-400 text-[9px] font-black uppercase tracking-[0.2em] rounded-xl border border-zinc-100 hover:bg-zinc-50 hover:text-black transition-all font-['Syncopate']">
                                          Remove
                                       </button>
                                    </div>
                                 </div>
                              </div>

                              {/* Form Fields */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                 <div className="space-y-3">
                                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-300 ml-1 font-['Syncopate']">Full Name</label>
                                    <input 
                                       type="text" 
                                       value={formData.name}
                                       onChange={(e) => setFormData({...formData, name: e.target.value})}
                                       className="w-full px-5 py-3.5 bg-zinc-50 border-none rounded-2xl focus:ring-2 focus:ring-black/5 focus:bg-white transition-all text-sm font-bold text-black placeholder:text-zinc-300"
                                       placeholder="Enter your name"
                                    />
                                 </div>

                                 <div className="space-y-3">
                                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-300 ml-1 font-['Syncopate']">Public Email</label>
                                    <input 
                                       type="email" 
                                       value={formData.email}
                                       onChange={(e) => setFormData({...formData, email: e.target.value})}
                                       className="w-full px-5 py-3.5 bg-zinc-50 border-none rounded-2xl focus:ring-2 focus:ring-black/5 focus:bg-white transition-all text-sm font-bold text-black placeholder:text-zinc-300"
                                       placeholder="you@example.com"
                                    />
                                 </div>

                                 <div className="col-span-full space-y-3">
                                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-300 ml-1 font-['Syncopate']">Bio</label>
                                    <textarea 
                                       rows={4}
                                       value={formData.bio}
                                       onChange={(e) => setFormData({...formData, bio: e.target.value})}
                                       className="w-full px-5 py-4 bg-zinc-50 border-none rounded-[24px] focus:ring-2 focus:ring-black/5 focus:bg-white transition-all text-sm font-bold text-black placeholder:text-zinc-300 resize-none"
                                       placeholder="Tell us a bit about yourself..."
                                    />
                                 </div>

                                 <div className="space-y-3">
                                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-300 ml-1 font-['Syncopate']">Website</label>
                                    <div className="relative">
                                       <div className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-300">
                                          <Globe size={16} />
                                       </div>
                                       <input 
                                          type="text" 
                                          value={formData.website}
                                          onChange={(e) => setFormData({...formData, website: e.target.value})}
                                          className="w-full pl-12 pr-5 py-3.5 bg-zinc-50 border-none rounded-2xl focus:ring-2 focus:ring-black/5 focus:bg-white transition-all text-sm font-bold text-black placeholder:text-zinc-300"
                                          placeholder="alexrivera.io"
                                       />
                                    </div>
                                 </div>

                                 <div className="space-y-3">
                                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-300 ml-1 font-['Syncopate']">Twitter Username</label>
                                    <input 
                                       type="text" 
                                       className="w-full px-5 py-3.5 bg-zinc-50 border-none rounded-2xl focus:ring-2 focus:ring-black/5 focus:bg-white transition-all text-sm font-bold text-black placeholder:text-zinc-300"
                                       placeholder="arivera"
                                    />
                                 </div>

                                 <div className="space-y-3">
                                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-300 ml-1 font-['Syncopate']">GitHub</label>
                                    <div className="relative">
                                       <div className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-300">
                                          <Github size={16} />
                                       </div>
                                       <input 
                                          type="text" 
                                          value={formData.github}
                                          onChange={(e) => setFormData({...formData, github: e.target.value})}
                                          className="w-full pl-12 pr-5 py-3.5 bg-zinc-50 border-none rounded-2xl focus:ring-2 focus:ring-black/5 focus:bg-white transition-all text-sm font-bold text-black placeholder:text-zinc-300"
                                          placeholder="arivera"
                                       />
                                    </div>
                                 </div>

                                 <div className="space-y-3">
                                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-300 ml-1 font-['Syncopate']">LinkedIn</label>
                                    <div className="relative">
                                       <div className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-300">
                                          <Linkedin size={16} />
                                       </div>
                                       <input 
                                          type="text" 
                                          value={formData.linkedin}
                                          onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
                                          className="w-full pl-12 pr-5 py-3.5 bg-zinc-50 border-none rounded-2xl focus:ring-2 focus:ring-black/5 focus:bg-white transition-all text-sm font-bold text-black placeholder:text-zinc-300"
                                          placeholder="arivera"
                                       />
                                    </div>
                                 </div>
                              </div>

                               <div className="pt-10 flex justify-end">
                                  <button 
                                     type="submit"
                                     className="flex items-center gap-4 px-10 py-5 bg-black text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-zinc-800 transition-all shadow-xl shadow-black/10 active:scale-95 font-['Syncopate']"
                                  >
                                     <Save size={16} />
                                     Save Changes
                                  </button>
                               </div>
                           </form>
                        )}

                        {activeTab !== 'profile' && (
                           <div className="py-20 text-center space-y-4">
                              <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto text-zinc-300">
                                 {(() => {
                                    const ActiveIcon = navItems.find((i) => i.id === activeTab)?.icon;
                                    return ActiveIcon ? <ActiveIcon size={32} /> : null;
                                 })()}
                              </div>
                              <div>
                                 <h3 className="text-lg font-black text-black">Under Development</h3>
                              </div>
                           </div>
                        )}
                     </div>
                  </motion.div>
               </section>
            </div>
         </main>
      </div>
   );
}
