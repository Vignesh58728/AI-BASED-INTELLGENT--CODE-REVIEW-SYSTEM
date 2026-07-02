const fs = require('fs');
let content = fs.readFileSync('frontend/src/pages/shared/AIPage.tsx', 'utf8');

// The goal: Replace the entire "active chat" input section (from absolute wrapper to end of motion.div)
// with the sleek, dark, correctly closed version.

const startMarker = '<div className="absolute bottom-10 left-6 right-6 flex flex-col items-center pointer-events-none">';
const endMarker = '</motion.div>';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker, startIndex);

if (startIndex !== -1 && endIndex !== -1) {
    const before = content.substring(0, startIndex);
    const after = content.substring(endIndex + endMarker.length);
    
    // Check if the next things are )} and </AnimatePresence>
    // To ensure we aren't deleting too much or too little.
    
    const replacement = `<div className="absolute bottom-8 left-0 right-0 px-6 flex flex-col items-center z-50 pointer-events-none">
                            <div className="w-full max-w-3xl bg-[#171717] border border-white/10 shadow-2xl rounded-[28px] p-2 flex flex-col border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] pointer-events-auto">
                               <textarea
                                  rows={1}
                                  placeholder="Reply to AIVISO..."
                                  value={searchValue}
                                  onChange={(e) => setSearchValue(e.target.value)}
                                  onKeyDown={handleKeyDown}
                                  className="w-full bg-transparent border-none outline-none resize-none text-[15px] text-white placeholder-zinc-500 px-4 py-3 min-h-[48px] leading-relaxed"
                               />

                               <div className="flex items-center justify-between px-2 pb-1">
                                  <div className="flex items-center gap-1">
                                     <button
                                        onClick={toggleVoice}
                                        className={\`p-2.5 rounded-xl transition-all \${isListening ? 'text-blue-400 bg-blue-400/10' : 'text-zinc-500 hover:text-white hover:bg-white/5'}\`}
                                        title="Voice Input"
                                     >
                                        <Mic size={19} />
                                     </button>
                                     <button
                                        onClick={handleLiveVoiceClick}
                                        className="p-2.5 text-zinc-500 hover:text-white transition-all hover:bg-white/5 rounded-xl"
                                        title="Read Last Message"
                                     >
                                        <AudioLines size={19} />
                                     </button>
                                  </div>

                                  <div className="flex items-center gap-2">
                                     <div className="relative">
                                        <button
                                           onClick={() => setIsModelOpen(!isModelOpen)}
                                           className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-all text-[10px] font-bold uppercase tracking-wider h-9"
                                        >
                                           <div className="w-3.5 h-3.5 flex items-center justify-center opacity-70">
                                              {selectedModel.toLowerCase().includes('gemini') || selectedModel.toLowerCase().includes('gemma') ? (
                                                 <img src="/google.png" alt="Google" className="w-full h-full object-contain" />
                                              ) : selectedModel.toLowerCase().includes('gpt') ? (
                                                 <img src="/chat-gpt-v2.png" alt="ChatGPT" className="w-full h-full object-contain" />
                                              ) : (
                                                 <img src="/meta.png" alt="Meta" className="w-full h-full object-contain" />
                                              )}
                                           </div>
                                           {selectedModel.split(' ')[0]}
                                           <ChevronDown size={14} className={\`opacity-40 transition-transform \${isModelOpen ? 'rotate-180' : ''}\`} />
                                        </button>

                                        <AnimatePresence>
                                           {isModelOpen && (
                                              <>
                                                 <div className="fixed inset-0 z-40" onClick={() => setIsModelOpen(false)} />
                                                 <motion.div
                                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                                    className="absolute bottom-full mb-4 right-0 w-64 bg-[#212121] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 p-1.5 text-left"
                                                 >
                                                    {models.map((model) => (
                                                       <button
                                                          key={model}
                                                          onClick={() => {
                                                             setSelectedModel(model);
                                                             setIsModelOpen(false);
                                                          }}
                                                          className={\`w-full flex items-center justify-between p-3 rounded-xl transition-all group \${selectedModel === model ? 'bg-white/5 text-white' : 'hover:bg-white/5 text-zinc-500 hover:text-white'}\`}
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
                                                             <span className="text-sm font-semibold font-['Poppins']">{model}</span>
                                                          </div>
                                                          {selectedModel === model && <Check size={14} className="text-white" />}
                                                       </button>
                                                    ))}
                                                 </motion.div>
                                              </>
                                           )}
                                        </AnimatePresence>
                                     </div>
                                     <button
                                        onClick={handleSend}
                                        disabled={!searchValue.trim() || isLoading || isGeneratingImage}
                                        className={\`w-10 h-10 rounded-full flex items-center justify-center transition-all \${searchValue.trim() ? 'bg-white text-black shadow-xl' : 'bg-white/10 text-zinc-600'}\`}
                                     >
                                        {isGeneratingImage || isLoading ? <Loader2 size={18} className="animate-spin" /> : <ArrowUp size={20} strokeWidth={2.5} />}
                                     </button>
                                  </div>
                               </div>
                               {attachedFileName && (
                                  <div className="absolute -top-10 left-4 text-[11px] text-black bg-white border-2 border-black rounded-full px-4 py-1.5 flex items-center gap-2 shadow-xl">
                                     <FileText size={12} className="text-black" />
                                     <span className="max-w-[180px] truncate font-medium">{attachedFileName}</span>
                                     <button onClick={clearAttachedFile} className="ml-1 text-black hover:text-red-400 transition-colors">
                                        <X size={12} />
                                     </button>
                                  </div>
                               )}
                            </div>
                        </div>
                     </motion.div>`;
    
    content = before + replacement + after;
    fs.writeFileSync('frontend/src/pages/shared/AIPage.tsx', content);
    console.log("Section replaced successfully.");
} else {
    console.log("Could not find start or end markers.");
}
