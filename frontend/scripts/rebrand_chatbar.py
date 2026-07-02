import os
import re

path = r'd:\AI BASED INTELLGENT  CODE REVIEW SYSTEM\frontend\src\pages\shared\AIPage.tsx'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Define the new Chat Bar HTML/React code
new_chat_bar = r'''                        <div className="w-full max-w-2xl group flex flex-col gap-4 relative z-20">
                           <div className="relative transform-gpu bg-white border border-zinc-200 shadow-sm p-6 rounded-[24px] transition-all duration-500 focus-within:border-zinc-300 focus-within:shadow-md ring-4 ring-transparent focus-within:ring-zinc-50">
                              <textarea
                                 placeholder={isListening ? "LISTENING..." : "Type / for search modes and shortcuts"}
                                 value={searchValue}
                                 onChange={(e) => setSearchValue(e.target.value)}
                                 onKeyDown={handleKeyDown}
                                 className="w-full bg-transparent border-none outline-none resize-none text-[15px] leading-relaxed text-zinc-800 placeholder-zinc-300 min-h-[40px] p-0"
                              />
                              <div className="flex items-center justify-between mt-6">
                                 <div className="flex items-center gap-3">
                                    <div className="relative">
                                       <button
                                          onClick={() => setIsActionMenuOpen(!isActionMenuOpen)}
                                          className={`p-1.5 transition-all rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50 ${isActionMenuOpen ? 'bg-zinc-100 text-black' : ''}`}
                                          title="More Actions"
                                       >
                                          <Plus size={20} className={`transition-transform duration-300 ${isActionMenuOpen ? 'rotate-45' : ''}`} />
                                       </button>

                                       <AnimatePresence>
                                          {isActionMenuOpen && (
                                             <>
                                                <div className="fixed inset-0 z-40" onClick={() => setIsActionMenuOpen(false)} />
                                                <motion.div
                                                   initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                                   animate={{ opacity: 1, scale: 1, y: 0 }}
                                                   exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                                   className="absolute bottom-full mb-4 left-0 w-72 bg-white border border-zinc-200 rounded-2xl shadow-xl overflow-hidden z-50 p-2 text-left"
                                                >
                                                   {actionItems.map((item, idx) => (
                                                      <button
                                                         key={idx}
                                                         onClick={item.onClick}
                                                         className="w-full flex items-start gap-4 p-3 rounded-xl hover:bg-zinc-50 transition-all group"
                                                      >
                                                          <div className={`mt-0.5 p-2 rounded-lg bg-zinc-50 ${item.color} group-hover:scale-110 transition-transform duration-300`}>
                                                             {item.icon}
                                                          </div>
                                                          <div className="flex-1">
                                                              <p className="text-sm font-bold text-black font-sans">{item.label}</p>
                                                              <p className="text-[10px] text-zinc-400 font-medium font-sans leading-tight">{item.subtitle}</p>
                                                          </div>
                                                      </button>
                                                   ))}
                                                </motion.div>
                                             </>
                                          )}
                                       </AnimatePresence>
                                    </div>
                                    
                                    {/* Computer+ Pill Button */}
                                    <button className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-dashed border-zinc-200 text-zinc-600 hover:border-zinc-400 hover:bg-zinc-50 transition-all text-xs font-semibold group">
                                       <div className="w-5 h-5 flex items-center justify-center bg-zinc-100 rounded-md group-hover:bg-zinc-200 transition-colors">
                                          <div className="w-3 h-3 flex items-center justify-center">
                                             <Smartphone size={14} className="text-zinc-500" />
                                          </div>
                                       </div>
                                       Computer <Plus size={12} strokeWidth={3} className="text-zinc-400" />
                                    </button>
                                 </div>

                                 <div className="flex items-center gap-4">
                                    <div className="relative">
                                       <button
                                            onClick={() => setIsModelOpen(!isModelOpen)}
                                            className="flex items-center gap-2 px-1 text-zinc-400 text-xs font-semibold hover:text-zinc-600 transition-all"
                                         >
                                            Model
                                             <ChevronDown size={14} className={`transition-transform duration-300 ${isModelOpen ? 'rotate-180' : ''}`} />
                                         </button>
                                       <AnimatePresence>
                                          {isModelOpen && (
                                             <>
                                                <div className="fixed inset-0 z-40" onClick={() => setIsModelOpen(false)} />
                                                <motion.div
                                                   initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                                   animate={{ opacity: 1, scale: 1, y: 0 }}
                                                   exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                                   className="absolute bottom-full mb-4 right-0 w-64 bg-white border border-zinc-200 rounded-3xl shadow-2xl overflow-hidden z-[100] p-3"
                                                >
                                                   <div className="px-1 pt-1 pb-3">
                                                       <div className="relative">
                                                           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
                                                           <input 
                                                              type="text" 
                                                              placeholder="Search models..."
                                                              value={modelSearch}
                                                              onChange={(e) => setModelSearch(e.target.value)}
                                                              className="w-full bg-zinc-50 border border-zinc-100 rounded-xl py-2 pl-9 pr-3 text-xs text-black placeholder-zinc-300 outline-none focus:border-zinc-200 transition-all font-sans"
                                                           />
                                                       </div>
                                                   </div>
                                                   <div className="max-h-60 overflow-y-auto no-scrollbar">
                                                       {models.filter(m => m.toLowerCase().includes(modelSearch.toLowerCase())).map((model) => (
                                                          <button
                                                             key={model}
                                                             onClick={() => {
                                                                setSelectedModel(model);
                                                                setIsModelOpen(false);
                                                             }}
                                                             className={`w-full flex items-center justify-between p-3 rounded-xl transition-all group ${selectedModel === model ? 'bg-zinc-50 text-black' : 'hover:bg-zinc-50 text-zinc-600 hover:text-black'}`}
                                                          >
                                                             <div className="flex items-center gap-3">
                                                                <div className="w-5 h-5 flex items-center justify-center">
                                                                   {model.toLowerCase().includes('gemini') || model.toLowerCase().includes('gemma') ? (
                                                                      <img src="/google.png" alt="Google" className="w-full h-full object-contain" />
                                                                   ) : model.toLowerCase().includes('gpt') ? (
                                                                      <img src="/chat-gpt-v2.png" alt="ChatGPT" className="w-full h-full object-contain" />
                                                                   ) : (
                                                                      <img src="/meta.png" alt="Meta" className="w-full h-full object-contain" />
                                                                   )}
                                                                </div>
                                                                <span className="text-xs font-bold font-sans">{model}</span>
                                                             </div>
                                                             {selectedModel === model && <Check size={14} className="text-black" />}
                                                          </button>
                                                       ))}
                                                   </div>
                                                </motion.div>
                                             </>
                                          )}
                                       </AnimatePresence>
                                    </div>

                                    <button
                                       onClick={toggleVoice}
                                       className={`p-2 transition-all text-zinc-400 hover:text-zinc-600`}
                                       title="Voice Input"
                                    >
                                       <Mic size={20} />
                                    </button>

                                    <button 
                                       onClick={handleSend}
                                       disabled={isLoading || !searchValue.trim()}
                                       className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center text-white hover:scale-105 transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:scale-100 placeholder:text-zinc-400"
                                    >
                                       <AudioLines size={20} />
                                    </button>
                                 </div>
                              </div>
                           </div>
                           
                           {/* Show suggestions link */}
                           <div className="flex justify-center -mt-2">
                              <button className="text-[13px] font-medium text-zinc-400 hover:text-zinc-600 transition-colors">
                                 Show suggestions
                              </button>
                           </div>
                        </div>'''

# Regex to find the chat bar block
# We anchor on the className and find up to the next big block (attachedFileName check)
pattern = re.compile(r'<div className="w-full max-w-2xl group flex flex-col gap-8 relative z-20">.*?<button\s+onClick=\{handleSend\}.*?</button>\s+</div>\s+</div>\s+</div>', re.DOTALL)

# Let's try a simpler regex that matches from the div start to the point before attachedFileName
pattern_simple = re.compile(r'<div className="w-full max-w-2xl group flex flex-col gap-8 relative z-20">.*?(\n\s+\{attachedFileName &&)', re.DOTALL)

# Note: The simple pattern will replace everything up to the attachedFileName check.
# I need to make sure I don't accidentally consume the attachedFileName check.
def replacer(match):
    return new_chat_bar + "\n" + (match.group(1).strip() if match.group(1) else "")

# Actually, let's just use a very specific block replace
old_block_start = '<div className="w-full max-w-2xl group flex flex-col gap-8 relative z-20">'
# We find the matching end for this div manually or use regex balance (python re doesn't support it easily)
# But I know the structure.

# Let's try replacing from old_block_start to the handleSend button area.
# In view_file:
# 752:                        <div className="w-full max-w-2xl group flex flex-col gap-8 relative z-20">
# ...
# 889:                              </div>
# 890:                               {attachedFileName && (

content = re.sub(r'<div className="w-full max-w-2xl group flex flex-col gap-8 relative z-20">.*?</div>(?=\s+\{attachedFileName &&)', new_chat_bar, content, flags=re.DOTALL)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Chat bar redesigned.")
