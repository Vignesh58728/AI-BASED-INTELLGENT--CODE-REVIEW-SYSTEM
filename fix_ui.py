import re

def update():
    with open('frontend/src/pages/shared/AIPage.tsx', 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Imports
    if 'Edit' not in content:
        content = content.replace('X, Link2, ', 'X, Link2, Edit, Search, ImageIcon, FolderPlus, ')

    # 2. savedChats logic
    if 'localStorage.getItem(\'ai_user_chats\')' not in content:
        content = content.replace('const [savedChats, setSavedChats] = useState<string[]>([]);', '''const [savedChats, setSavedChats] = useState<string[]>(() => {
      const saved = localStorage.getItem('ai_user_chats');
      return saved ? JSON.parse(saved) : [];
   });''')

    # 2.b handleSend persistence
    if 'localStorage.setItem' not in content:
        src_send = "setMessages(prev => [...prev, newUserMsg]);"
        dest_send = """setMessages(prev => [...prev, newUserMsg]);
         if (!savedChats.includes(searchValue)) {
            const nextChats = [searchValue, ...savedChats].slice(0, 10);
            setSavedChats(nextChats);
            localStorage.setItem('ai_user_chats', JSON.stringify(nextChats));
         }"""
        content = content.replace(src_send, dest_send)

    # 3. Sidebar exact match replacement
    src_sidebar = """{/* Sidebar - Ultra Minimalist White */}
         <aside className="w-16 lg:w-[72px] flex flex-col items-center py-6 border-r border-zinc-100 z-50 bg-white">"""
    if src_sidebar in content:
        # We find the end of the sidebar
        sidebar_start = content.find(src_sidebar)
        sidebar_end = content.find('</aside>', sidebar_start) + len('</aside>')
        
        dest_sidebar = """{/* Sidebar - Light Theme Sidebar */}
         <aside className="w-64 flex-shrink-0 flex flex-col h-full bg-[#f9f9f9] text-slate-600 z-50 transition-all font-['Inter'] shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between p-3 mt-1">
               <button className="p-2 hover:bg-[#ebebeb] rounded-lg transition-colors flex items-center justify-center">
                  <div className="w-6 h-6 flex items-center justify-center">
                     <img src="/artificial-intelligence.png" alt="AI" className="w-full h-full object-contain opacity-90" />
                  </div>
               </button>
               <button className="p-2 hover:bg-[#ebebeb] rounded-lg transition-colors text-slate-500 hover:text-black">
                  <Maximize2 size={18} />
               </button>
            </div>

            <nav className="flex flex-col flex-1 px-3 mt-2 overflow-y-auto custom-scrollbar relative">
               <div className="space-y-0.5 mb-6">
                  <button onClick={handleNewChat} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#ebebeb] transition-colors text-sm font-medium text-black">
                     <Edit size={16} /> New chat
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#ebebeb] transition-colors text-sm font-medium text-black" onClick={() => {}}>
                     <Search size={16} /> Search chats
                  </button>
                  <button onClick={() => setAiMode('image')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#ebebeb] transition-colors text-sm font-medium text-black">
                     <ImageIcon size={16} /> Images
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#ebebeb] transition-colors text-sm font-medium text-black">
                     <FolderPlus size={16} /> Projects
                  </button>
               </div>

               <div className="mt-2 flex-1 pb-4">
                  <h3 className="px-3 text-xs font-semibold text-slate-500 mb-2 font-['Inter'] tracking-tight">Your chats</h3>
                  <div className="flex flex-col space-y-0.5">
                     {savedChats.length > 0 ? savedChats.map((chat, idx) => (
                        <button 
                           key={idx} 
                           onClick={() => { 
                              setIsChatActive(true); 
                              setMessages([]); 
                              setIsGeneratingImage(false); 
                              setAiMode('chat'); 
                              setSearchValue(chat); 
                           }}
                           className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#ebebeb] transition-colors text-sm text-slate-600 hover:text-black truncate font-['Inter'] relative group flex items-center justify-between"
                        >
                           <span className="truncate pr-4">{chat}</span>
                           <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#ebebeb] hover:from-[#e0e0e0] to-transparent rounded-r-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                     )) : (
                        <div className="px-3 py-2 text-xs text-slate-500 font-medium italic">No recent chats. Start a new conversation!</div>
                     )}
                  </div>
               </div>
            </nav>

            {/* Profile Section */}
            <div className="p-3 border-t border-zinc-200 relative z-50">
                <button
                   onClick={() => setIsProfileOpen(!isProfileOpen)}
                   className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#ebebeb] transition-colors group"
                >
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-zinc-200 flex items-center justify-center shrink-0 border border-zinc-300">
                       {user?.photo ? (
                          <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
                       ) : (
                          <span className="text-xs font-bold text-slate-600 uppercase">{user?.name?.charAt(0) || "U"}</span>
                       )}
                    </div>
                    <div className="flex-1 text-left truncate">
                       <span className="text-sm font-semibold text-slate-700 group-hover:text-black transition-colors">{user?.name}</span>
                    </div>
                </button>
               <AnimatePresence>
                  {isProfileOpen && (
                     <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                        <motion.div
                           initial={{ opacity: 0, y: 10, scale: 0.95 }}
                           animate={{ opacity: 1, y: 0, scale: 1 }}
                           exit={{ opacity: 0, y: 10, scale: 0.95 }}
                           transition={{ duration: 0.2 }}
                           className="absolute bottom-full left-3 w-64 mb-2 bg-white border border-zinc-200 rounded-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.08)] p-1.5 z-[100]"
                        >
                           <div className="px-3 py-2.5 border-b border-zinc-100 mb-1">
                              <p className="text-sm font-bold text-black truncate">{user?.name}</p>
                              <p className="text-xs text-slate-500 truncate mt-0.5">{user?.email}</p>
                           </div>
                           <button onClick={() => { navigate('/profile'); setIsProfileOpen(false); }} className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-xl text-sm flex items-center gap-3 transition-colors text-slate-700 hover:text-black">
                              <UserIcon size={16} /> Profile
                           </button>
                           <button onClick={() => { navigate('/settings'); setIsProfileOpen(false); }} className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-xl text-sm flex items-center gap-3 transition-colors text-slate-700 hover:text-black">
                              <Settings2 size={16} /> Settings
                           </button>
                           <div className="my-1 border-t border-zinc-100" />
                           <button onClick={() => { logout(); navigate('/login'); }} className="w-full text-left px-3 py-2 hover:bg-red-50 rounded-xl text-sm text-red-500 flex items-center gap-3 transition-colors">
                              <LogOut size={16} /> Sign out
                           </button>
                        </motion.div>
                     </>
                  )}
               </AnimatePresence>
            </div>
         </aside>"""
        content = content[:sidebar_start] + dest_sidebar + content[sidebar_end:]

    # 4. Remove Chat bubble border
    content = content.replace("className={`flex gap-6 ${msg.role === 'assistant' ? 'bg-white p-8 rounded-[32px] border-2 border-black shadow-sm' : 'px-8 py-2'}`}", "className={`flex gap-6 ${msg.role === 'assistant' ? 'bg-white p-8 rounded-[32px] shadow-sm' : 'px-8 py-2'}`}")

    # 5. Active Chat pill redesign (Image 2 exact match)
    # Be sure to match the ACTIVE chat block specifically!
    src_active = '''                        <div className="absolute bottom-8 left-0 right-0 px-6 flex flex-col items-center z-50 pointer-events-none">
                            <div className="w-full max-w-3xl bg-[#171717] border border-white/10 shadow-2xl rounded-[28px] p-2 flex flex-col pointer-events-auto border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">'''
    if src_active in content:
        # We find the end of the z-50 pointer-events-none DIV exactly by isolating that block.
        block_start = content.find(src_active)
        # the end of this block is where it hits:
        end_marker = '''                     )}
               </AnimatePresence>'''
        
        block_end = content.find(end_marker, block_start)
        
        # New chat pill UI
        dest_active = """                        <div className="absolute bottom-8 left-0 right-0 px-6 flex flex-col items-center z-50 pointer-events-none">
                            <div className="w-full max-w-3xl flex flex-col items-end gap-2">
                               {/* Sleek Chat Pill */}
                               <div className="w-full bg-[#2f2f2f] border border-white/5 shadow-[0_4px_24px_rgba(0,0,0,0.2)] rounded-full px-2 py-1.5 flex items-center justify-between pointer-events-auto relative">
                                 {attachedFileName && (
                                    <div className="absolute -top-12 left-4 text-[11px] text-white bg-[#2f2f2f] border border-white/10 rounded-full px-4 py-1.5 flex items-center gap-2 shadow-xl z-50">
                                       <FileText size={12} className="text-white" />
                                       <span className="max-w-[180px] truncate font-medium">{attachedFileName}</span>
                                       <button onClick={clearAttachedFile} className="ml-1 text-white hover:text-red-400 transition-colors">
                                          <X size={12} />
                                       </button>
                                    </div>
                                 )}

                                 <div className="flex items-center gap-1 shrink-0 pl-1">
                                    <div className="relative">
                                       <button
                                          onClick={() => setIsActionMenuOpen(!isActionMenuOpen)}
                                          className={`p-2 transition-all rounded-full ${isActionMenuOpen ? 'bg-white/20 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/10'}`}
                                          title="More Actions"
                                       >
                                          <Plus size={22} className={`transition-transform duration-300 flex-shrink-0 ${isActionMenuOpen ? 'rotate-45' : ''}`} strokeWidth={1.5} />
                                       </button>
                                       <AnimatePresence>
                                          {isActionMenuOpen && (
                                             <>
                                                <div className="fixed inset-0 z-40" onClick={() => setIsActionMenuOpen(false)} />
                                                <motion.div
                                                   initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                                   animate={{ opacity: 1, scale: 1, y: 0 }}
                                                   exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                                   className="absolute bottom-full mb-4 left-0 w-72 bg-[#212121] border border-white/10 rounded-3xl shadow-[0_-30px_60px_rgba(0,0,0,0.5)] overflow-hidden z-50 p-2 text-left"
                                                >
                                                   {actionItems.map((item, idx) => (
                                                      <button
                                                         key={idx}
                                                         onClick={item.onClick}
                                                         className="w-full flex items-start gap-4 p-3.5 rounded-2xl hover:bg-white/5 transition-all group"
                                                      >
                                                         <div className={`mt-0.5 p-2 rounded-xl bg-white/10 ${item.color} group-hover:scale-110 transition-transform duration-300`}>
                                                            {item.icon}
                                                         </div>
                                                         <div className="flex-1">
                                                            <p className="text-sm font-bold text-white font-['Poppins']">{item.label}</p>
                                                            <p className="text-[10px] text-zinc-400 font-medium font-['Poppins'] leading-tight">{item.subtitle}</p>
                                                         </div>
                                                      </button>
                                                   ))}
                                                </motion.div>
                                             </>
                                          )}
                                       </AnimatePresence>
                                    </div>
                                 </div>

                                 <textarea
                                    rows={1}
                                    placeholder={isListening ? "Listening..." : "Ask anything"}
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    className="flex-1 bg-transparent border-none outline-none resize-none text-[15px] font-['Inter'] text-zinc-100 placeholder-[#797979] px-3 py-2.5 min-h-[44px] leading-relaxed custom-scrollbar max-h-[120px] ml-1"
                                 />

                                 <div className="flex items-center gap-2 shrink-0 pr-1">
                                    <button
                                       onClick={toggleVoice}
                                       className={`p-2 rounded-full transition-all ${isListening ? 'text-blue-400 bg-blue-400/20' : 'text-zinc-400 hover:text-white hover:bg-white/10'}`}
                                       title="Voice Input"
                                    >
                                       <Mic size={20} className="opacity-90" strokeWidth={1.5} />
                                    </button>
                                    <button
                                       onClick={handleSend}
                                       disabled={!searchValue.trim() || isLoading || isGeneratingImage}
                                       className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                                          searchValue.trim() 
                                          ? 'bg-[#ffffff] text-[#2f2f2f] shadow-lg scale-100 hover:bg-zinc-200' 
                                          : 'bg-[#4d4d4d] text-[#2f2f2f] scale-95'
                                       }`}
                                    >
                                       {isGeneratingImage || isLoading ? <Loader2 size={16} className="animate-spin text-white" /> : <ArrowUp size={18} strokeWidth={2.5} />}
                                    </button>
                                 </div>
                               </div>
                            </div>
                         </div>
"""
        content = content[:block_start] + dest_active + content[block_end:]


    with open('frontend/src/pages/shared/AIPage.tsx', 'w', encoding='utf-8') as f:
        f.write(content)

update()
