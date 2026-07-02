const fs = require('fs');
let content = fs.readFileSync('frontend/src/pages/shared/AIPage.tsx', 'utf8');

// 1. Assistant Message Style
content = content.replace(/className={`flex gap-6 \${msg\.role === 'assistant' \? 'bg-white p-8 rounded-\[32px\] border-2 border-black shadow-sm' : 'px-8 py-2'}`}/g, "className={`flex gap-6 \${msg.role === 'assistant' ? 'bg-zinc-50/50 p-8 rounded-[32px] border border-zinc-100' : 'px-8 py-2'}`}");

// 2. Loading State Style
content = content.replace(/<div className="flex gap-6 bg-white border-2 border-black p-8 rounded-\[32px\] shadow-sm">/g, '<div className="flex gap-6 bg-zinc-50/50 p-8 rounded-[32px] border border-zinc-100 shadow-sm animate-pulse">');

// 3. Active Chat Bar
const activeChatStart = '<div className="absolute bottom-10 left-6 right-6 flex flex-col items-center pointer-events-none">';
const activeChatEndSnippet = '{attachedFileName && (\\n                                 <div className="absolute -top-10 left-4 text-\\[11px\\] text-black bg-white border-2 border-black rounded-full px-4 py-1.5 flex items-center gap-2 shadow-xl">';
const activeChatRegex = /<div className="absolute bottom-10 left-6 right-6 flex flex-col items-center pointer-events-none">[\s\S]+?<\/div>\s+<\/div>\s+<\/div>(?=\s+{attachedFileName &&)/;

const slimDarkBar = `                         <div className="absolute bottom-10 left-6 right-6 flex justify-center pointer-events-none">
                           <div className="w-full max-w-3xl pointer-events-auto bg-[#171717] rounded-full p-2 pl-4 flex items-center gap-3 transition-all duration-300 shadow-2xl border border-white/5">
                              <button
                                 onClick={() => setIsActionMenuOpen(!isActionMenuOpen)}
                                 className="p-2 text-zinc-400 hover:text-white transition-colors relative"
                              >
                                 <Plus size={20} className={\`transition-transform duration-300 \${isActionMenuOpen ? 'rotate-45' : ''}\`} />
                                 <AnimatePresence>
                                    {isActionMenuOpen && (
                                       <>
                                          <div className="fixed inset-0 z-40" onClick={() => setIsActionMenuOpen(false)} />
                                          <motion.div
                                             initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                             animate={{ opacity: 1, scale: 1, y: 0 }}
                                             exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                             className="absolute bottom-full mb-6 left-0 w-72 bg-[#212121] border border-white/10 rounded-3xl shadow-2xl p-2 text-left z-50 overflow-hidden"
                                          >
                                             {actionItems.map((item, idx) => (
                                                <button
                                                   key={idx}
                                                   onClick={item.onClick}
                                                   className="w-full flex items-start gap-4 p-3.5 rounded-2xl hover:bg-white/5 transition-all group"
                                                >
                                                   <div className={\`mt-0.5 p-2 rounded-xl bg-white/5 \${item.color} group-hover:scale-110 transition-transform duration-300\`}>
                                                      {item.icon}
                                                   </div>
                                                   <div className="flex-1">
                                                      <p className="text-sm font-bold text-white font-['Poppins']">{item.label}</p>
                                                      <p className="text-[10px] text-zinc-500 font-medium font-['Poppins'] leading-tight">{item.subtitle}</p>
                                                   </div>
                                                </button>
                                             ))}
                                          </motion.div>
                                       </>
                                    )}
                                 </AnimatePresence>
                              </button>

                              <textarea
                                 rows={1}
                                 placeholder="Ask anything"
                                 value={searchValue}
                                 onChange={(e) => setSearchValue(e.target.value)}
                                 onKeyDown={handleKeyDown}
                                 className="flex-1 bg-transparent border-none outline-none resize-none text-sm text-white placeholder-zinc-500 py-2"
                                 style={{ minHeight: '32px', maxHeight: '150px' }}
                              />

                              <div className="flex items-center gap-1 pr-1">
                                 <button
                                    onClick={toggleVoice}
                                    className={\`p-2 rounded-full transition-all \${isListening ? 'text-blue-500 bg-blue-500/10' : 'text-zinc-400 hover:text-white hover:bg-white/5'}\`}
                                    title="Voice Input"
                                 >
                                    <Mic size={19} />
                                 </button>

                                 <button
                                    onClick={handleLiveVoiceClick}
                                    className="p-2 text-zinc-400 hover:text-white transition-all hover:bg-white/5 rounded-full"
                                    title="Read Last Message"
                                 >
                                    <AudioLines size={19} />
                                 </button>

                                 <button
                                    onClick={handleSend}
                                    disabled={!searchValue.trim() || isLoading || isGeneratingImage}
                                    className={\`w-10 h-10 rounded-full flex items-center justify-center transition-all \${searchValue.trim() ? 'bg-white text-black shadow-xl' : 'bg-white/10 text-zinc-600'}\`}
                                 >
                                    {isGeneratingImage || isLoading ? <Loader2 size={18} className="animate-spin" /> : <ArrowUp size={20} strokeWidth={2.5} />}
                                 </button>
                              </div>
                           </div>
                        </div>`;

content = content.replace(activeChatRegex, slimDarkBar);

// 4. Landing Model Selector
const landingModelRegex = /<div className="flex items-center gap-3">[\s\S]+?setIsModelOpen\(!isModelOpen\)[\s\S]+?<\/AnimatePresence>\s+<\/div>/;
content = content.replace(landingModelRegex, '</div>');

fs.writeFileSync('frontend/src/pages/shared/AIPage.tsx', content);
