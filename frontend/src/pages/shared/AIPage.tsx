import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
   History,
   Compass,
   LayoutGrid,
   Plus,
   Mic,
   ChevronDown,
   Bell,
   GraduationCap,
   FileText,
   Lightbulb,
   ArrowUp,
   LogOut,
   User as UserIcon,
   Check,
   X,
   Paperclip,
   Loader2,
   Globe,
   Languages,
   Link2
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { submissionService } from '@/services/submissionService';

interface Message {
   role: 'user' | 'assistant';
   content: string;
   sources?: Array<{ title: string; url: string }>;
}

export function AIPage() {
   const { user, logout } = useAuth();
   const navigate = useNavigate();
   const [searchValue, setSearchValue] = useState("");
   const [isModelOpen, setIsModelOpen] = useState(false);
   const [selectedModel, setSelectedModel] = useState("Gemini 2.0 Flash");
   const [useWebSearch, setUseWebSearch] = useState(false);
   const [languageHint, setLanguageHint] = useState<'english' | 'tamil'>('english');
   const [attachedFileName, setAttachedFileName] = useState('');
   const [attachedFileContent, setAttachedFileContent] = useState('');
   const [isProfileOpen, setIsProfileOpen] = useState(false);
   const [isChatActive, setIsChatActive] = useState(false);
   const [messages, setMessages] = useState<Message[]>([]);
   const [isLoading, setIsLoading] = useState(false);
   const [isListening, setIsListening] = useState(false);
   const chatEndRef = useRef<HTMLDivElement>(null);
   const fileInputRef = useRef<HTMLInputElement>(null);
   const recognitionRef = useRef<any>(null);

   const sidebarItems = [
      { icon: <History size={20} />, label: "History", path: "/history" },
      { icon: <Compass size={20} />, label: "Explore", path: "/explore" },
      { icon: <LayoutGrid size={20} />, label: "Library", path: "/problems" },
   ];

   const suggestionPills = [
      { icon: <GraduationCap size={14} />, label: "Teach me logic" },
      { icon: <FileText size={14} />, label: "Summarize code" },
      { icon: <Lightbulb size={14} />, label: "Architecture" },
   ];

   const models = ["Llama 3.3", "DeepSeek-V3", "Gemini 2.0 Flash", "GPT-OSS-120b", "GPT-4o"];

   useEffect(() => {
      const loadHistory = async () => {
         try {
            const historyData = await submissionService.getChatHistory();
            if (historyData.messages && historyData.messages.length > 0) {
               setMessages(historyData.messages);
               setIsChatActive(true);
            }
         } catch (error) {
            console.error("Failed to load chat history:", error);
         }
      };
      loadHistory();
   }, []);

   useEffect(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
   }, [messages]);

   const handleFileAttach = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setAttachedFileName(file.name);
      try {
         const text = await file.text();
         setAttachedFileContent(text.slice(0, 20000));
      } catch {
         setAttachedFileName('');
         setAttachedFileContent('');
      }
   };

   const clearAttachedFile = () => {
      setAttachedFileName('');
      setAttachedFileContent('');
      if (fileInputRef.current) {
         fileInputRef.current.value = '';
      }
   };

   const handleSend = async () => {
      if (!searchValue.trim() || isLoading) return;

      const userQuery = searchValue.trim();
      const priorHistory = messages.map(m => ({ role: m.role, content: m.content }));
      setMessages(prev => [...prev, { role: 'user', content: userQuery }]);
      setSearchValue("");
      setIsChatActive(true);
      setIsLoading(true);

      try {
         const response = await submissionService.getChatResponse(userQuery, {
            model: selectedModel,
            history: priorHistory,
            fileContext: attachedFileContent || undefined,
            languageHint,
            useWebSearch: useWebSearch,
         });
         const assistantMessage: Message = { role: 'assistant', content: response.answer, sources: response.sources };
         setMessages(prev => {
            const newMessages = [...prev, assistantMessage];
            // Save history asynchronously
            submissionService.saveChatHistory(newMessages.map(m => ({ role: m.role, content: m.content })));
            return newMessages;
         });
      } catch (error) {
         setMessages(prev => [...prev, { role: 'assistant', content: "Error: Could not reach the AI core. Please check your connection." }]);
      } finally {
         setIsLoading(false);
      }
   };

   const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         handleSend();
      }
   };

   const handleNewChat = async () => {
      setMessages([]);
      setIsChatActive(false);
      try {
         await submissionService.saveChatHistory([]);
      } catch (error) {
         console.error("Failed to clear chat history:", error);
      }
   };

   const toggleVoice = () => {
      if (isListening) {
         recognitionRef.current?.stop();
         setIsListening(false);
         return;
      }

      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
         alert("Speech recognition is not supported in this browser.");
         return;
      }

      if (!recognitionRef.current) {
         recognitionRef.current = new SpeechRecognition();
         recognitionRef.current.continuous = true;
         recognitionRef.current.interimResults = true;
         recognitionRef.current.lang = languageHint === 'tamil' ? 'ta-IN' : 'en-US';

         recognitionRef.current.onresult = (event: any) => {
            let transcript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
               transcript += event.results[i][0].transcript;
            }
            setSearchValue(transcript);
         };

         recognitionRef.current.onend = () => {
            setIsListening(false);
         };

         recognitionRef.current.onerror = (event: any) => {
            console.error("Speech recognition error:", event.error);
            setIsListening(false);
         };
      }

      recognitionRef.current.lang = languageHint === 'tamil' ? 'ta-IN' : 'en-US';
      recognitionRef.current.start();
      setIsListening(true);
   };

   return (
      <div className="flex h-screen bg-[#050505] text-[#e4e4e7] overflow-hidden selection:bg-primary/30 selection:text-white">
         {/* Premium Blur Background */}
         <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />
         </div>

         {/* Sidebar - Ultra Minimalist */}
         <aside className="w-16 lg:w-[72px] flex flex-col items-center py-6 border-r border-white/5 z-50 bg-black/20 backdrop-blur-3xl">
            <div className="mb-10 cursor-pointer group" onClick={() => navigate('/explore')}>
               <div className="w-10 h-10 flex items-center justify-center">
                  <img
                     src="/artificial-intelligence.png"
                     alt="AI"
                     className="w-10 h-10 object-contain"
                     style={{ filter: 'brightness(0) invert(1)' }}
                  />
               </div>
            </div>

            <nav className="flex flex-col gap-8 items-center flex-1">
               {sidebarItems.map((item, idx) => (
                  <button
                     key={idx}
                     onClick={() => navigate(item.path)}
                     className="text-zinc-500 hover:text-white transition-all duration-300 group relative"
                  >
                     {item.icon}
                     <div className="absolute left-full ml-4 px-3 py-1.5 bg-zinc-900 border border-white/5 rounded-lg text-[10px] uppercase tracking-widest font-bold opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100 pointer-events-none whitespace-nowrap z-[100]">
                        {item.label}
                     </div>
                  </button>
               ))}
            </nav>

            <div className="relative mt-auto pt-6 border-t border-white/5 w-full flex flex-col items-center gap-6">
               <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="w-9 h-9 rounded-full bg-zinc-900 border border-white/10 overflow-hidden hover:border-primary/50 transition-colors"
               >
                  <div className="w-full h-full flex items-center justify-center text-xs font-bold text-zinc-400">
                     {user?.name?.charAt(0) || "U"}
                  </div>
               </button>
               <AnimatePresence>
                  {isProfileOpen && (
                     <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="absolute bottom-0 left-full ml-4 w-48 bg-zinc-900/90 border border-white/10 rounded-2xl backdrop-blur-2xl shadow-2xl p-2 z-[100]"
                     >
                        <div className="px-3 py-2 border-b border-white/5 mb-1">
                           <p className="text-[11px] font-bold text-white truncate">{user?.name}</p>
                           <p className="text-[9px] text-zinc-500 truncate">{user?.email}</p>
                        </div>
                        <button onClick={() => navigate('/profile')} className="w-full text-left px-3 py-2 hover:bg-white/5 rounded-lg text-xs flex items-center gap-2 transition-colors">
                           <UserIcon size={14} /> Profile
                        </button>
                        <button onClick={() => { logout(); navigate('/login'); }} className="w-full text-left px-3 py-2 hover:bg-red-500/10 rounded-lg text-xs text-red-400 flex items-center gap-2 transition-colors">
                           <LogOut size={14} /> Sign out
                        </button>
                     </motion.div>
                  )}
               </AnimatePresence>
            </div>
         </aside>

         {/* Main Workspace */}
         <main className="flex-1 flex flex-col relative z-20">
            <header className="h-16 flex items-center justify-between px-8 bg-transparent">
               <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 relative">
                     <button
                        onClick={() => setIsModelOpen(!isModelOpen)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition-all text-[11px] font-bold tracking-tight"
                     >
                        <img
                           src="/artificial-intelligence.png"
                           alt="AI"
                           className="w-4 h-4"
                           style={{ filter: 'brightness(0) invert(1)' }}
                        />
                        {selectedModel}
                        <ChevronDown size={12} className={`transition-transform duration-300 ${isModelOpen ? 'rotate-180' : ''}`} />
                     </button>
                     <button
                        onClick={handleNewChat}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-all text-[11px] font-bold tracking-tight"
                     >
                        <Plus size={12} />
                        New Chat
                     </button>
                     <AnimatePresence>
                        {isModelOpen && (
                           <motion.div
                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.95 }}
                              className="absolute top-full mt-2 left-0 w-48 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl p-2 z-[100] backdrop-blur-xl"
                           >
                              {models.map(m => (
                                 <button
                                    key={m}
                                    onClick={() => { setSelectedModel(m); setIsModelOpen(false); }}
                                    className="w-full text-left px-3 py-2 hover:bg-white/5 rounded-lg text-[11px] font-medium flex items-center justify-between transition-colors"
                                 >
                                    {m} {selectedModel === m && <Check size={12} className="text-primary" />}
                                 </button>
                              ))}
                           </motion.div>
                        )}
                     </AnimatePresence>
                  </div>
                  <button
                     onClick={() => setUseWebSearch(v => !v)}
                     className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[11px] font-bold transition-all ${useWebSearch ? 'bg-primary/20 border-primary/40 text-primary' : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'}`}
                  >
                     <Globe size={12} /> Web {useWebSearch ? 'On' : 'Off'}
                  </button>
                  <button
                     onClick={() => setLanguageHint(v => v === 'english' ? 'tamil' : 'english')}
                     className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition-all text-[11px] font-bold"
                  >
                     <Languages size={12} /> {languageHint === 'english' ? 'English' : 'Tamil'}
                  </button>
               </div>

               <div className="flex items-center gap-3">
                  <button className="p-2 text-zinc-500 hover:text-white transition-colors relative">
                     <Bell size={20} />
                     <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary rounded-full" />
                  </button>
                  <button className="p-2 text-zinc-500 hover:text-white transition-colors">
                     <Plus size={20} onClick={() => { setIsChatActive(false); setMessages([]); }} />
                  </button>
               </div>
            </header>

            <div className="flex-1 overflow-hidden relative flex flex-col">
               <input
                  ref={fileInputRef}
                  type="file"
                  accept=".py,.js,.ts,.java,.cpp,.c,.go,.rs,.txt,.md"
                  className="hidden"
                  onChange={handleFileAttach}
               />
               <AnimatePresence mode="wait">
                  {!isChatActive ? (
                     <motion.div
                        key="landing"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="flex-1 flex flex-col items-center justify-center p-6 text-center"
                     >
                        <h1 className="text-6xl md:text-7xl font-black mb-10 tracking-[0.2em] bg-clip-text text-transparent bg-gradient-to-b from-white to-white/10 select-none font-['Orbitron'] uppercase">
                           aiviso
                        </h1>

                        {/* Centered Minimal Input */}
                        <div className="w-full max-w-2xl group flex flex-col gap-8">
                           <div className="relative transform-gpu bg-zinc-900/50 backdrop-blur-2xl border border-white/5 p-4 rounded-3xl transition-all duration-500 focus-within:border-primary/30 focus-within:shadow-[0_0_50px_-12px_rgba(59,130,246,0.15)] ring-1 ring-transparent focus-within:ring-primary/10">
                              <textarea
                                 placeholder="Ask aiviso anything..."
                                 value={searchValue}
                                 onChange={(e) => setSearchValue(e.target.value)}
                                 onKeyDown={handleKeyDown}
                                 className="w-full bg-transparent border-none outline-none resize-none text-lg leading-relaxed text-zinc-100 placeholder-zinc-700 min-h-[80px] p-2"
                              />
                              <div className="flex items-center justify-between mt-4">
                                 <div className="flex items-center gap-2">
                                    <button
                                       onClick={() => fileInputRef.current?.click()}
                                       className="p-2.5 rounded-xl hover:bg-white/5 text-zinc-500 hover:text-zinc-300 transition-all"
                                    >
                                       <Paperclip size={18} />
                                    </button>
                                    <button className="p-2.5 rounded-xl hover:bg-white/5 text-zinc-500 hover:text-zinc-300 transition-all">
                                       <Mic size={18} />
                                    </button>
                                 </div>
                                 <button
                                    onClick={handleSend}
                                    disabled={!searchValue.trim()}
                                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${searchValue.trim() ? 'bg-primary text-white scale-100 shadow-xl shadow-primary/20 hover:scale-105' : 'bg-zinc-800 text-zinc-600 scale-90 opacity-20'}`}
                                 >
                                    <ArrowUp size={20} strokeWidth={3} />
                                 </button>
                              </div>
                              {attachedFileName && (
                                 <div className="mt-2 px-2 flex items-center gap-2 text-[11px] text-zinc-400">
                                    <FileText size={12} className="text-primary" />
                                    <span className="truncate max-w-[70%]">{attachedFileName}</span>
                                    <button onClick={clearAttachedFile} className="text-zinc-500 hover:text-red-400 transition-colors">
                                       <X size={12} />
                                    </button>
                                 </div>
                              )}
                           </div>

                           <div className="flex flex-wrap items-center justify-center gap-2">
                              {suggestionPills.map((pill, idx) => (
                                 <button
                                    key={idx}
                                    onClick={() => {
                                       setSearchValue(pill.label);
                                    }}
                                    className="px-4 py-2 border border-white/5 bg-zinc-900/40 hover:bg-zinc-800/60 rounded-full text-[11px] font-bold text-zinc-500 hover:text-zinc-200 transition-all backdrop-blur-sm flex items-center gap-2"
                                 >
                                    {pill.icon} {pill.label}
                                 </button>
                              ))}
                           </div>

                        </div>
                     </motion.div>
                  ) : (
                     <motion.div
                        key="chat"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex-1 flex flex-col w-full max-w-4xl mx-auto overflow-hidden px-6"
                     >
                        <div className="flex-1 overflow-y-auto pt-10 pb-32 space-y-12 no-scrollbar">
                           {messages.map((msg, i) => (
                              <motion.div
                                 key={i}
                                 initial={{ opacity: 0, y: 10 }}
                                 animate={{ opacity: 1, y: 0 }}
                                 className={`flex gap-6 ${msg.role === 'assistant' ? 'bg-white/2 backdrop-blur-3xl p-8 rounded-[32px] border border-white/5' : 'px-8'}`}
                              >
                                 <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1">
                                    {msg.role === 'user' ? (
                                       <div className="w-full h-full rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold">U</div>
                                    ) : (
                                       <div className="w-full h-full rounded-full bg-zinc-800 flex items-center justify-center">
                                          <img
                                             src="/artificial-intelligence.png"
                                             alt="Assistant"
                                             className="w-4 h-4"
                                             style={{ filter: 'brightness(0) invert(1)' }}
                                          />
                                       </div>
                                    )}
                                 </div>
                                 <div className="flex-1 space-y-4">
                                    <p className="text-[15px] leading-relaxed text-zinc-200 whitespace-pre-wrap">
                                       {msg.content}
                                    </p>
                                    {msg.role === 'assistant' && msg.sources && msg.sources.length > 0 && msg.sources[0].url !== '#' && (
                                       <div className="pt-2 border-t border-white/5 space-y-1">
                                          <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Sources</p>
                                          {msg.sources.map((source, idx) => (
                                             <a
                                                key={`${source.url}-${idx}`}
                                                href={source.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-[11px] text-primary/90 hover:text-primary flex items-center gap-1 truncate"
                                             >
                                                <Link2 size={10} /> {source.title}
                                             </a>
                                          ))}
                                       </div>
                                    )}
                                 </div>
                              </motion.div>
                           ))}
                           {isLoading && (
                              <div className="flex gap-6 bg-white/2 backdrop-blur-3xl p-8 rounded-[32px] border border-white/5">
                                 <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary animate-pulse">
                                    <Loader2 size={16} className="animate-spin" />
                                 </div>
                                 <div className="flex items-center gap-1">
                                    {[0, 1, 2].map(d => <div key={d} className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: `${d * 0.2}s` }} />)}
                                 </div>
                              </div>
                           )}
                           <div ref={chatEndRef} />
                        </div>

                        <div className="absolute bottom-10 left-6 right-6 flex justify-center pointer-events-none">
                           <div className={`w-full max-w-2xl pointer-events-auto bg-zinc-900/90 border ${isListening ? 'border-primary shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 'border-white/10'} rounded-3xl backdrop-blur-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] p-2 pr-4 flex items-center gap-2 transition-all focus-within:border-primary/30`}>
                              <button
                                 onClick={() => fileInputRef.current?.click()}
                                 className="w-9 h-9 rounded-2xl flex items-center justify-center text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-all"
                              >
                                 <Paperclip size={16} />
                              </button>
                              <button
                                 onClick={toggleVoice}
                                 className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all ${isListening ? 'bg-primary/20 text-primary animate-pulse' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}`}
                              >
                                 <Mic size={16} />
                              </button>
                              <textarea
                                 rows={1}
                                 placeholder={isListening ? "Listening..." : "Type a message..."}
                                 value={searchValue}
                                 onChange={(e) => setSearchValue(e.target.value)}
                                 onKeyDown={handleKeyDown}
                                 className="flex-1 bg-transparent border-none outline-none resize-none text-sm text-zinc-200 placeholder-zinc-600 px-4 py-3"
                              />
                              <button
                                 onClick={handleSend}
                                 disabled={!searchValue.trim() || isLoading}
                                 className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all ${searchValue.trim() ? 'bg-primary text-white hover:scale-105' : 'bg-zinc-800 text-zinc-600 opacity-20'}`}
                              >
                                 <ArrowUp size={18} strokeWidth={3} />
                              </button>
                           </div>
                           {attachedFileName && (
                              <div className="absolute -top-7 text-[10px] text-zinc-400 bg-zinc-900/80 border border-white/10 rounded-full px-3 py-1 flex items-center gap-2">
                                 <FileText size={10} className="text-primary" />
                                 <span className="max-w-[180px] truncate">{attachedFileName}</span>
                                 <button onClick={clearAttachedFile} className="text-zinc-500 hover:text-red-400 transition-colors">
                                    <X size={10} />
                                 </button>
                              </div>
                           )}
                        </div>
                     </motion.div>
                  )}
               </AnimatePresence>
            </div>
         </main>

         <style dangerouslySetInnerHTML={{
            __html: `
            @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');
            .no-scrollbar::-webkit-scrollbar { display: none; }
            .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
         `}} />
      </div>
   );
}
