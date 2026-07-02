const fs = require('fs');
let content = fs.readFileSync('frontend/src/pages/shared/AIPage.tsx', 'utf8');

// The marker: <div className="absolute bottom-10 left-6 right-6 flex flex-col items-center pointer-events-none">
// The end: </motion.div> (next to )} )

const startPart = '<div className="absolute bottom-10 left-6 right-6 flex flex-col items-center pointer-events-none">';
const endPart = '</motion.div>\n                    )}\n               </AnimatePresence>';

// I'll replace everything from 1096 roughly.
// Actually, I'll use the EXACT text from 1419-line version.

const oldBlock = `                        <div className="absolute bottom-10 left-6 right-6 flex flex-col items-center pointer-events-none z-50">
                            <div className="w-full max-w-3xl flex flex-col items-end gap-2">
                               {/* Model Selector Outside the Pill */}
                               <div className="relative pointer-events-auto mr-4">
                                  <button
                                     onClick={() => setIsModelOpen(!isModelOpen)}
                                     className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#171717] text-white hover:bg-[#212121] transition-all text-[10px] font-bold tracking-widest font-['Poppins'] shadow-lg border border-white/10"
                                  >
                                     <div className="w-3.5 h-3.5 flex items-center justify-center filter invert">
                                        {selectedModel.toLowerCase().includes('gemini') || selectedModel.toLowerCase().includes('gemma') ? (
                                           <img src="/google.png" alt="Google" className="w-full h-full object-contain" />
                                        ) : selectedModel.toLowerCase().includes('gpt') ? (
                                           <img src="/chat-gpt-v2.png" alt="ChatGPT" className="w-full h-full object-contain" />
                                        ) : (
                                           <img src="/meta.png" alt="Meta" className="w-full h-4 object-contain" />
                                        )}
                                     </div>
                                     {selectedModel}
                                     <ChevronDown size={14} className={\`opacity-60 transition-transform \${isModelOpen ? 'rotate-180' : ''}\`} />
                                  </button>
                                  <AnimatePresence>
                                     {isModelOpen && (
                                        <>
                                           <div className="fixed inset-0 z-40" onClick={() => setIsModelOpen(false)} />
                                            <motion.div
                                               initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                               animate={{ opacity: 1, scale: 1, y: 0 }}
                                               exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                               className="absolute bottom-full right-0 mb-2 w-56 bg-[#212121] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 p-1.5 text-left"
                                            >
                                               {models.map((model) => (
                                                  <button
                                                     key={model}
                                                     onClick={() => {
                                                        setSelectedModel(model);
                                                        setIsModelOpen(false);
                                                     }}
                                                     className={\`w-full flex items-center justify-between p-2.5 rounded-xl transition-all group \${selectedModel === model ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-zinc-400 hover:text-white'}\`}
                                                  >
                                                     <span className="text-xs font-medium font-['Poppins']">{model}</span>
                                                     {selectedModel === model && <Check size={14} className="text-white" />}
                                                  </button>
                                               ))}
                                            </motion.div>
                                        </>
                                     )}
                                  </AnimatePresence>
                               </div>

                               {/* Sleek Chat Pill */}
                               <div className="w-full bg-[#2f2f2f] shadow-[0_4px_24px_rgba(0,0,0,0.15)] rounded-full px-2 py-1.5 flex items-center justify-between pointer-events-auto relative">
                                 {attachedFileName && (
                                    <div className="absolute -top-12 left-4 text-[11px] text-white bg-[#2f2f2f] rounded-full px-4 py-1.5 flex items-center gap-2 shadow-xl z-50">
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
                                          className={\`p-2 transition-all rounded-full \${isActionMenuOpen ? 'bg-white/20 text-white' : 'text-[#878787] hover:text-white'}\`}
                                          title="More Actions"
                                       >
                                          <Plus size={24} className={\`transition-transform duration-300 flex-shrink-0 \${isActionMenuOpen ? 'rotate-45' : ''}\`} strokeWidth={1.5} />
                                       </button>
                                       <AnimatePresence>
                                          {isActionMenuOpen && (
                                             <>
                                                <div className="fixed inset-0 z-40" onClick={() => setIsActionMenuOpen(false)} />
                                                <motion.div
                                                   initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                                   animate={{ opacity: 1, scale: 1, y: 0 }}
                                                   exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                                   className="absolute bottom-full mb-4 left-0 w-72 bg-[#212121] rounded-3xl shadow-[0_-30px_60px_rgba(0,0,0,0.5)] overflow-hidden z-50 p-2 text-left"
                                                >
                                                   {actionItems.map((item, idx) => (
                                                      <button
                                                         key={idx}
                                                         onClick={item.onClick}
                                                         className="w-full flex items-start gap-4 p-3.5 rounded-2xl hover:bg-white/5 transition-all group"
                                                      >
                                                         <div className={\`mt-0.5 p-2 rounded-xl bg-white/10 \${item.color} group-hover:scale-110 transition-transform duration-300\`}>
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
                                    className="flex-1 bg-transparent border-none outline-none resize-none text-[15px] font-['Inter'] text-zinc-100 placeholder-[#878787] px-3 py-2.5 min-h-[44px] leading-relaxed custom-scrollbar max-h-[120px] ml-1"
                                    style={{ flexGrow: 1 }}
                                 />

                                 <div className="flex items-center gap-2 shrink-0 pr-1">
                                    <button
                                       onClick={toggleVoice}
                                       className={\`p-2 rounded-full transition-all \${isListening ? 'text-blue-400 bg-blue-400/20' : 'text-[#878787] hover:text-white'}\`}
                                       title="Voice Input"
                                    >
                                       <Mic size={20} className="opacity-90" strokeWidth={1.5} />
                                    </button>
                                    <button
                                       onClick={handleSend}
                                       disabled={!searchValue.trim() || isLoading || isGeneratingImage}
                                       className={\`w-9 h-9 rounded-full flex items-center justify-center transition-all \${
                                          searchValue.trim() 
                                          ? 'bg-[#ffffff] text-[#2f2f2f] shadow-lg scale-100 hover:bg-zinc-200' 
                                          : 'bg-[#4d4d4d] text-[#878787] scale-95'
                                       }\`}
                                    >
                                       {isGeneratingImage || isLoading ? <Loader2 size={16} className="animate-spin text-white" /> : <ArrowUp size={18} strokeWidth={2.5} />}
                                    </button>
                                 </div>
                               </div>
                            </div>
                         </div>
                       </motion.div>`;

// Standardizing line endings for comparison
const cleanContent = content.split('\r\n').join('\n');
const startIdx = cleanContent.indexOf(oldBlock);

if (startIdx !== -1) {
    const replacement = `                        <div className="absolute bottom-8 left-0 right-0 px-6 flex flex-col items-center z-50 pointer-events-none">
                            <div className="w-full max-w-3xl bg-[#171717] border border-white/10 shadow-2xl rounded-[28px] p-2 flex flex-col pointer-events-auto border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
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

    const result = cleanContent.substring(0, startIdx) + replacement + cleanContent.substring(startIdx + oldBlock.length);
    fs.writeFileSync('frontend/src/pages/shared/AIPage.tsx', result);
    console.log("Replaced successfully!");
} else {
    console.log("Could not find oldBlock!");
}
