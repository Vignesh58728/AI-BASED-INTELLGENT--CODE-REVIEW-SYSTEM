const fs = require('fs');
let content = fs.readFileSync('frontend/src/pages/shared/AIPage.tsx', 'utf8');

// The goal is to fix the active chat bar's trailing tags.
// Current problematic section around 1225-1247:
/*
1231:                                     {isGeneratingImage || isLoading ? <Loader2 size={20} className="animate-spin" /> : <ArrowUp size={22} strokeWidth={2.5} />}
1232:                                  </button>
1233:                               </div>
1234:                            </div>
1235:                         </div>{attachedFileName && (
...
1243:                               )}
1244:                            </div>
1245:                         </div>
1246:                        </motion.div>
1247:                     )}
1248:                </AnimatePresence>
*/

// I'll replace the block from "handleSend" button's end to the end of the chat motion div.

const startPattern = /\{isGeneratingImage \|\| isLoading \? <Loader2 size=\{20\} className="animate-spin" \/> : <ArrowUp size=\{22\} strokeWidth=\{2\.5\} \/>\}\s+<\/button>\s+<\/div>\s+<\/div>/;
const endPattern = /<\/motion\.div>\s+\)\}\s+<\/AnimatePresence>\s+<\/div>\s+<\/main>/;

// I'll look for the whole block between the buttons and the modal start.
// Using a more robust regex that covers the extra divs.

const fullBlockRegex = /<div className="flex items-center gap-1 pr-1">[\s\S]+?<\/motion\.div>\s+\)}\s+<\/AnimatePresence>/;

const correctBlock = `<div className="flex items-center gap-1 pr-1">
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
                     </motion.div>
                  )}
               </AnimatePresence>`;

// Re-writing the replacement to be safer.
// Instead of regex on the WHOLE active chat, I'll just fix the tags.

content = content.replace(/<\/div>\s*<\/div>\s*<\/div>\{attachedFileName && \([\s\S]+?\}\s+<\/div>\s+<\/div>\s+<\/motion\.div>/, 
`</div>
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
                  </motion.div>`);

fs.writeFileSync('frontend/src/pages/shared/AIPage.tsx', content);
