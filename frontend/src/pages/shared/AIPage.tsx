import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
   Plus,
   History,
   Compass,
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
   Link2,
   ImageIcon,
   Sparkles,
   Download,
   RefreshCw,
   Share2,
   Maximize2,
   Wand2,
   Settings2,
   AudioLines,
   Cpu,
   Zap,
   Telescope,
   ShoppingBag,
   MoreHorizontal,
   BookOpen
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { submissionService } from '@/services/submissionService';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import { Search } from 'lucide-react';
import VoiceLoader from '@/components/ui/VoiceLoader';

interface Message {
   role: 'user' | 'assistant';
   content: string;
   sources?: Array<{ title: string; url: string }>;
   type?: 'text' | 'image';
   imageUrl?: string;
}

interface GeneratedImage {
   url: string;
   prompt: string;
   timestamp: number;
   seed: number;
}

export function AIPage() {
   const { user, logout } = useAuth();
   const navigate = useNavigate();
   const [searchValue, setSearchValue] = useState("");
   const [isModelOpen, setIsModelOpen] = useState(false);
   const [selectedModel, setSelectedModel] = useState("gpt-oss");
   const [useWebSearch, setUseWebSearch] = useState(false);
   const [languageHint, setLanguageHint] = useState<'english' | 'tamil'>('english');
   const [attachedFileName, setAttachedFileName] = useState('');
   const [attachedFileContent, setAttachedFileContent] = useState('');
   const [isProfileOpen, setIsProfileOpen] = useState(false);
   const [isChatActive, setIsChatActive] = useState(false);
   const [messages, setMessages] = useState<Message[]>([]);
   const [isLoading, setIsLoading] = useState(false);
   const [aiMode, setAiMode] = useState<'chat' | 'image'>('chat');
   const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
   const [isGeneratingImage, setIsGeneratingImage] = useState(false);
   const [isListening, setIsListening] = useState(false);
   const [previewCode, setPreviewCode] = useState<string | null>(null);
   const [isPreviewOpen, setIsPreviewOpen] = useState(false);
   const [modelSearch, setModelSearch] = useState("");
   const [isVoiceSession, setIsVoiceSession] = useState(false);
   const [isVoiceReplaying, setIsVoiceReplaying] = useState(false);
   const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
   const chatEndRef = useRef<HTMLDivElement>(null);
   const fileInputRef = useRef<HTMLInputElement>(null);
   const recognitionRef = useRef<any>(null);

   const sidebarItems = [
      { icon: <Compass size={20} />, label: "Explore", path: "/explore" },
   ];

   const suggestionPills = [
      { icon: <GraduationCap size={14} />, label: "Teach me logic" },
      { icon: <FileText size={14} />, label: "Summarize code" },
      { icon: <Lightbulb size={14} />, label: "Architecture" },
   ];
   const models = [
      "Gemini 2.5 Flash", "Gemma 3", "gpt-oss", "Llama 3.1 8b"
   ];

   const { isAuthenticated } = useAuth();

   useEffect(() => {
      const loadHistory = async () => {
         if (!isAuthenticated) return;
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
         // Attempt to read basic text for any attached file for the AI context.
         // If it's a binary file like PDF/Image, the raw text may look messy but we can at least pass the filename.
         if (file.type.startsWith('image/')) {
            setAttachedFileContent(`[Image File Attached: ${file.name}]`);
         } else {
            const text = await file.text();
            setAttachedFileContent(text.slice(0, 50000)); // Increased limit to 50k chars
         }
      } catch {
         setAttachedFileName(file.name);
         setAttachedFileContent(`[File Attached: ${file.name}]`);
      }
   };

   const clearAttachedFile = () => {
      setAttachedFileName('');
      setAttachedFileContent('');
      if (fileInputRef.current) {
         fileInputRef.current.value = '';
      }
   };

   const handleGenerateImage = async (prompt?: string) => {
      const targetPrompt = prompt || searchValue.trim();
      if (!targetPrompt || isGeneratingImage) return;

      setIsGeneratingImage(true);
      if (!prompt) setSearchValue("");
      setIsChatActive(true);

      const seed = Math.floor(Math.random() * 1000000);
      try {
         // Call our backend instead of pollinations.ai
         const response = await fetch("http://localhost:5001/api/image-gen/generate", {
            method: "POST",
            headers: {
               "Content-Type": "application/json"
               // Note: If you have auth tokens, add them here
            },
            body: JSON.stringify({
               prompt: targetPrompt,
               model: "stabilityai/stable-diffusion-xl-base-1.0"
            })
         });

         if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || "Failed to generate image.");
         }

         const blob = await response.blob();
         const imageUrl = URL.createObjectURL(blob);

         const newImage: GeneratedImage = {
            url: imageUrl,
            prompt: targetPrompt,
            timestamp: Date.now(),
            seed
         };

         setGeneratedImages(prev => [newImage, ...prev]);

         // Also add to message history for integrated feel
         setMessages(prev => [...prev, {
            role: 'assistant',
            content: targetPrompt,
            type: 'image',
            imageUrl: imageUrl
         }]);
      } catch (error: any) {
         console.error("Image generation error:", error);
         setMessages(prev => [...prev, {
            role: 'assistant',
            content: `Failed to generate image: ${error.message || 'Unknown error occurred or HF_TOKEN missing.'}`,
         }]);
      } finally {
         setIsGeneratingImage(false);
      }
   };

   const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, prompt: string) => {
      const target = e.target as HTMLImageElement;

      target.parentElement?.querySelector('.image-error')?.classList.remove('hidden');
      target.classList.add('hidden');
      target.parentElement?.querySelector('.image-loader')?.classList.add('hidden');
   };

   const handleExportPDF = async () => {
      const element = document.getElementById('chat-messages-container');
      if (!element) return;

      const canvas = await html2canvas(element, { backgroundColor: '#050505' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`chat-export-${Date.now()}.pdf`);
   };

   const handleExportExcel = () => {
      const data = messages.map(m => ({
         Role: m.role,
         Content: m.content,
         Time: new Date().toLocaleTimeString()
      }));
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "ChatHistory");
      XLSX.writeFile(wb, `chat-data-${Date.now()}.xlsx`);
   };

   const handleExportWord = () => {
      const content = messages.map(m => `${m.role.toUpperCase()}:\n${m.content}\n\n`).join('');
      const blob = new Blob(['\ufeff', content], {
         type: 'application/msword'
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `chat-export-${Date.now()}.doc`;
      link.click();
      URL.revokeObjectURL(url);
   };

   const handleSend = async () => {
      if (!searchValue.trim() || isLoading || isGeneratingImage) return;

      const userQuery = searchValue.trim();
      const lowerQuery = userQuery.toLowerCase();

      // Smart Command Detection
      if (lowerQuery.includes('pdf')) {
         handleExportPDF();
         setSearchValue("");
         return;
      }
      if (lowerQuery.includes('excel') || lowerQuery.includes('xlsx')) {
         handleExportExcel();
         setSearchValue("");
         return;
      }
      if (lowerQuery.includes('word') || lowerQuery.includes('doc')) {
         handleExportWord();
         setSearchValue("");
         return;
      }

      // Intent detection for images (English & Tamil)
      const imageKeywords = [
         'draw', 'generate image', 'create image', 'imagine', 'paint',
         'picture of', 'photo of', 'visualize',
         'படம் வரை', 'புகைப்படம்', 'உருவாக்கு'
      ];

      const isImageIntent = imageKeywords.some(keyword => lowerQuery.includes(keyword));

      if (aiMode === 'image' || isImageIntent) {
         // If in chat mode but image intent detected, we still want to show the user's message
         if (aiMode === 'chat') {
            setMessages(prev => [...prev, { role: 'user', content: userQuery }]);
         }
         handleGenerateImage(userQuery);
         setSearchValue("");
         return;
      }

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

         if (isVoiceSession) {
            speakMessage(response.answer);
            setIsVoiceSession(false);
         }

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
            recognitionRef.current.finalTranscript = transcript;
         };

         recognitionRef.current.onend = () => {
            setIsListening(false);
            // Auto-send if there's a transcript
            if (recognitionRef.current.finalTranscript) {
               setIsVoiceSession(true);
               handleSend();
            }
         };

         recognitionRef.current.onerror = (event: any) => {
            console.error("Speech recognition error:", event.error);
            setIsListening(false);
            setIsVoiceSession(false);
         };
      }

      recognitionRef.current.finalTranscript = '';
      recognitionRef.current.lang = languageHint === 'tamil' ? 'ta-IN' : 'en-US';
      recognitionRef.current.start();
      setIsListening(true);
   };

   const speakMessage = (text: string) => {
      if ('speechSynthesis' in window) {
         window.speechSynthesis.cancel();
         const utterance = new SpeechSynthesisUtterance(text);
         utterance.lang = languageHint === 'tamil' ? 'ta-IN' : 'en-US';

         utterance.onstart = () => setIsVoiceReplaying(true);
         utterance.onend = () => setIsVoiceReplaying(false);
         utterance.onerror = () => setIsVoiceReplaying(false);

         window.speechSynthesis.speak(utterance);
      }
   };

   const handleLiveVoiceClick = () => {
      // Find the last assistant message to replay
      const lastAssistantMessage = [...messages].reverse().find(m => m.role === 'assistant');
      if (lastAssistantMessage) {
         speakMessage(lastAssistantMessage.content);
      } else if (!isChatActive) {
         // If no chat yet, maybe just a welcome message?
         speakMessage("How can I help you today?");
      }
   };

   return (
      <div className="flex h-screen bg-[#050505] text-[#e4e4e7] overflow-hidden selection:bg-primary/30 selection:text-white">
         <AnimatePresence>
            {(isVoiceReplaying || isListening) && (
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm"
               >
                  <VoiceLoader label={isListening ? "Listening..." : "Speaking..."} />
                  <button
                     onClick={() => {
                        if (isListening) {
                           recognitionRef.current?.stop();
                           setIsListening(false);
                        } else {
                           window.speechSynthesis.cancel();
                           setIsVoiceReplaying(false);
                        }
                     }}
                     className="absolute bottom-20 text-zinc-500 hover:text-white text-xs font-bold transition-all uppercase tracking-widest"
                  >
                     {isListening ? "Stop Listening" : "Stop Speaking"}
                  </button>
               </motion.div>
            )}
         </AnimatePresence>
         {/* Premium Blur Background */}
         <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />

            {/* Subtle Indian Pattern */}
            <div className="absolute inset-0 opacity-[0.03] invert" style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l5.878 18.09h19.022l-15.388 11.18 5.878 18.09L30 36.18l-15.39 11.18 5.878-18.09L5.1 18.09h19.022L30 0z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
               backgroundSize: '120px 120px'
            }} />
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

            <nav className="flex flex-col gap-8 items-center flex-1 w-full px-2">
               <button
                  onClick={handleNewChat}
                  className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 hover:border-primary/50 transition-all duration-300 group relative mb-2"
               >
                  <Plus size={20} />
                  <div className="absolute left-full ml-4 px-3 py-1.5 bg-zinc-900 border border-white/5 rounded-lg text-[10px] uppercase tracking-widest font-bold opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100 pointer-events-none whitespace-nowrap z-[100]">
                     New Chat
                  </div>
               </button>

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

               <button className="text-zinc-500 hover:text-white transition-all duration-300 group relative mt-auto mb-4">
                  <Settings2 size={20} />
                  <div className="absolute left-full ml-4 px-3 py-1.5 bg-zinc-900 border border-white/5 rounded-lg text-[10px] uppercase tracking-widest font-bold opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100 pointer-events-none whitespace-nowrap z-[100]">
                     Settings
                  </div>
               </button>
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
                  {/* Buttons removed as per user request */}
               </div>

            </header>

            <div className="flex-1 overflow-hidden relative flex flex-col">
               <input
                  ref={fileInputRef}
                  type="file"
                  accept="*"
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
                        className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-5xl mx-auto w-full"
                     >
                        <motion.div
                           initial={{ scale: 0.8, opacity: 0 }}
                           animate={{ scale: 1, opacity: 1 }}
                           className="mb-8"
                        >
                           <h1 className="text-xl md:text-3xl lg:text-4xl font-black tracking-[0.15em] bg-clip-text text-transparent bg-gradient-to-b from-white to-white/10 select-none font-['Orbitron'] uppercase whitespace-nowrap">
                              AI BASED INTELLIGENCE CODE REVIEW SYSTEM
                           </h1>
                        </motion.div>


                        {/* Centered Minimal Input */}
                        <div className="w-full max-w-2xl group flex flex-col gap-8">
                           <div className="relative transform-gpu bg-zinc-900/40 backdrop-blur-3xl border border-white/5 p-4 rounded-[32px] transition-all duration-500 focus-within:border-primary/30 focus-within:shadow-[0_0_80px_-12px_rgba(59,130,246,0.1)] ring-1 ring-transparent focus-within:ring-primary/10">
                              <textarea
                                 placeholder={isListening ? "Listening..." : "Ask aiviso anything..."}
                                 value={searchValue}
                                 onChange={(e) => setSearchValue(e.target.value)}
                                 onKeyDown={handleKeyDown}
                                 className="w-full bg-transparent border-none outline-none resize-none text-lg leading-relaxed text-zinc-100 placeholder-zinc-700 min-h-[44px] p-2"
                              />
                              <div className="flex items-center justify-between mt-4">
                                 <div className="flex items-center gap-2">
                                    <div className="relative">
                                       <button
                                          onClick={() => setIsActionMenuOpen(!isActionMenuOpen)}
                                          className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${isActionMenuOpen ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-zinc-500 hover:text-zinc-300'}`}
                                       >
                                          <Plus size={18} className={`transition-transform duration-300 ${isActionMenuOpen ? 'rotate-45' : ''}`} />
                                       </button>

                                       <AnimatePresence>
                                          {isActionMenuOpen && (
                                             <>
                                                <div className="fixed inset-0 z-40" onClick={() => setIsActionMenuOpen(false)} />
                                                <motion.div
                                                   initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                   animate={{ opacity: 1, y: 0, scale: 1 }}
                                                   exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                   className="absolute bottom-full left-0 mb-4 w-60 bg-zinc-900/90 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-50 p-2"
                                                >
                                                   <div className="flex flex-col gap-1">
                                                      <button
                                                         onClick={() => { fileInputRef.current?.click(); setIsActionMenuOpen(false); }}
                                                         className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-zinc-300 hover:text-white rounded-2xl transition-all text-sm group"
                                                      >
                                                         <img src="/clip.png" alt="clip" className="w-5 h-5 object-contain opacity-70 group-hover:opacity-100 transition-opacity" style={{ filter: 'brightness(0) invert(1)' }} />
                                                         <span className="font-medium">Add photos & files</span>
                                                      </button>
                                                      <div className="h-px bg-white/5 mx-4 my-1" />
                                                      <button
                                                         onClick={() => { setAiMode('image'); setIsActionMenuOpen(false); }}
                                                         className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-zinc-300 hover:text-white rounded-2xl transition-all text-sm group"
                                                      >
                                                         <img src="/gallery.png" alt="gallery" className="w-5 h-5 object-contain opacity-70 group-hover:opacity-100 transition-opacity" style={{ filter: 'brightness(0) invert(1)' }} />
                                                         <span className="font-medium">Create image</span>
                                                      </button>
                                                      <button
                                                         onClick={() => { setSearchValue('Thinking: '); setIsActionMenuOpen(false); }}
                                                         className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-zinc-300 hover:text-white rounded-2xl transition-all text-sm group"
                                                      >
                                                         <img src="/thinking.png" alt="thinking" className="w-5 h-5 object-contain opacity-70 group-hover:opacity-100 transition-opacity" style={{ filter: 'brightness(0) invert(1)' }} />
                                                         <span className="font-medium">Thinking</span>
                                                      </button>
                                                      <div className="h-px bg-white/5 mx-4 my-1" />
                                                      <button
                                                         onClick={() => { setSearchValue('Research: '); setIsActionMenuOpen(false); }}
                                                         className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-zinc-300 hover:text-white rounded-2xl transition-all text-sm group"
                                                      >
                                                         <img src="/research.png" alt="research" className="w-5 h-5 object-contain opacity-70 group-hover:opacity-100 transition-opacity" style={{ filter: 'brightness(0) invert(1)' }} />
                                                         <span className="font-medium">Deep research</span>
                                                      </button>
                                                      <button
                                                         onClick={() => { navigate('/explore'); setIsActionMenuOpen(false); }}
                                                         className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-zinc-300 hover:text-white rounded-2xl transition-all text-sm group"
                                                      >
                                                         <img src="/graduation-cap.png" alt="education" className="w-5 h-5 object-contain opacity-70 group-hover:opacity-100 transition-opacity" style={{ filter: 'brightness(0) invert(1)' }} />
                                                         <span className="font-medium">Education</span>
                                                      </button>
                                                   </div>
                                                </motion.div>
                                             </>
                                          )}
                                       </AnimatePresence>
                                    </div>
                                    <button
                                       onClick={toggleVoice}
                                       className={`p-2.5 rounded-xl hover:bg-white/5 transition-all ${isListening ? 'text-primary animate-pulse' : 'text-zinc-500 hover:text-zinc-300'}`}
                                    >
                                       <Mic size={18} />
                                    </button>
                                    <button
                                       onClick={handleLiveVoiceClick}
                                       className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isVoiceReplaying ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
                                    >
                                       <AudioLines size={18} />
                                    </button>
                                 </div>
                                 <div className="flex items-center gap-3">
                                    <button
                                       onClick={() => setLanguageHint(prev => prev === 'english' ? 'tamil' : 'english')}
                                       className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all ${languageHint === 'tamil' ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-transparent text-zinc-500 hover:bg-white/5 hover:text-white border border-transparent'}`}
                                       title="Toggle Language (English / Tamil)"
                                    >
                                       <Languages size={14} />
                                       <span className="text-[10px] font-bold uppercase tracking-widest mt-0.5">
                                          {languageHint === 'english' ? 'ENG' : 'தமிழ்'}
                                       </span>
                                    </button>
                                    <button
                                       onClick={() => setIsModelOpen(!isModelOpen)}
                                       className="flex items-center gap-2 px-1 py-1.5 text-zinc-500 hover:text-white transition-all"
                                    >
                                       <span className="text-[10px] font-bold uppercase tracking-widest">{selectedModel}</span>
                                       <ChevronDown size={14} />
                                    </button>
                                    <button
                                       onClick={handleSend}
                                       disabled={!searchValue.trim() || isGeneratingImage}
                                       className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 ${searchValue.trim() ? 'bg-primary text-white' : 'bg-zinc-800 text-zinc-600 scale-90 opacity-20'}`}
                                    >
                                       {isGeneratingImage ? <Loader2 size={20} className="animate-spin" /> : <ArrowUp size={20} strokeWidth={3} />}
                                    </button>
                                 </div>
                              </div>
                              {attachedFileName && (
                                 <div className="mt-2 px-2 flex items-center gap-2 text-[11px] text-zinc-400 bg-white/5 w-fit rounded-full py-1 pr-3">
                                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                                       <FileText size={10} className="text-primary" />
                                    </div>
                                    <span className="truncate max-w-[150px]">{attachedFileName}</span>
                                    <button onClick={clearAttachedFile} className="ml-1 text-zinc-500 hover:text-red-400 transition-colors">
                                       <X size={12} />
                                    </button>
                                 </div>
                              )}
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
                        <div id="chat-messages-container" className="flex-1 overflow-y-auto pt-10 pb-32 space-y-12 no-scrollbar">
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
                                    <p className="text-[15px] leading-relaxed text-zinc-200 whitespace-pre-wrap font-sans">
                                       {msg.content}
                                    </p>

                                    {msg.role === 'assistant' && msg.content.includes('```') && (
                                       <button
                                          onClick={() => {
                                             const code = msg.content.match(/```(?:[\w]*\n)?([\s\S]*?)```/)?.[1] || msg.content;
                                             setPreviewCode(code);
                                             setIsPreviewOpen(true);
                                          }}
                                          className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl border border-primary/20 transition-all text-xs font-bold w-fit mt-2"
                                       >
                                          <Wand2 size={14} /> Live Preview
                                       </button>
                                    )}


                                    {msg.type === 'image' && msg.imageUrl && (
                                       <div className="relative group/image max-w-lg mt-4">
                                          <div className="rounded-2xl overflow-hidden border border-white/5 bg-zinc-900 shadow-2xl relative min-h-[300px] flex items-center justify-center">
                                             <div className="image-loader absolute inset-0 flex items-center justify-center bg-zinc-900 z-20">
                                                <Loader2 size={24} className="text-primary animate-spin" />
                                             </div>
                                             <div className="image-error hidden absolute inset-0 flex flex-col items-center justify-center bg-zinc-900 z-30 p-4 text-center">
                                                <X size={32} className="text-red-500 mb-2" />
                                                <p className="text-xs text-zinc-400">Failed to generate image. Please try a different prompt.</p>
                                             </div>
                                             <img
                                                src={msg.imageUrl}
                                                alt={msg.content}
                                                className="w-full h-auto object-cover transition-transform duration-700 group-hover/image:scale-105 relative z-10"
                                                onLoad={(e) => {
                                                   const target = e.target as HTMLImageElement;
                                                   target.parentElement?.querySelector('.image-loader')?.classList.add('hidden');
                                                }}
                                                onError={(e) => handleImageError(e, msg.content)}
                                             />
                                          </div>
                                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                             <button
                                                onClick={() => window.open(msg.imageUrl, '_blank')}
                                                className="p-3 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-all border border-white/20"
                                             >
                                                <Maximize2 size={20} />
                                             </button>
                                             <a
                                                href={msg.imageUrl}
                                                download={`image-${Date.now()}.jpg`}
                                                className="p-3 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-all border border-white/20"
                                                onClick={(e) => {
                                                   // Handle cross-origin download
                                                   e.preventDefault();
                                                   fetch(msg.imageUrl!)
                                                      .then(res => res.blob())
                                                      .then(blob => {
                                                         const url = window.URL.createObjectURL(blob);
                                                         const a = document.createElement('a');
                                                         a.href = url;
                                                         a.download = `ai-visual-${Date.now()}.jpg`;
                                                         a.click();
                                                      });
                                                }}
                                             >
                                                <Download size={20} />
                                             </a>
                                             <button
                                                onClick={() => handleGenerateImage(msg.content.replace('Generated: ', ''))}
                                                className="p-3 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-all border border-white/20"
                                                title="Regenerate"
                                             >
                                                <RefreshCw size={20} />
                                             </button>
                                          </div>
                                       </div>
                                    )}
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

                        <div className="absolute bottom-10 left-6 right-6 flex flex-col items-center pointer-events-none">
                           <div className={`w-full max-w-3xl pointer-events-auto bg-zinc-900/60 border-2 ${isListening ? 'border-primary shadow-[0_0_30px_rgba(59,130,246,0.3)]' : 'border-white/10'} rounded-[32px] backdrop-blur-3xl shadow-[0_32px_80px_-16px_rgba(0,0,0,0.6)] p-3 flex flex-col transition-all duration-500 focus-within:border-white/20 focus-within:bg-zinc-900/80`}>
                              <textarea
                                 rows={1}
                                 placeholder={isListening ? "Listening..." : "Ask aiviso anything..."}
                                 value={searchValue}
                                 onChange={(e) => setSearchValue(e.target.value)}
                                 onKeyDown={handleKeyDown}
                                 className="w-full bg-transparent border-none outline-none resize-none text-base text-zinc-200 placeholder-zinc-600 px-3 py-3 min-h-[52px] leading-relaxed"
                              />

                              <div className="flex items-center justify-between px-1 pb-1">
                                 <div className="flex items-center gap-1">
                                    <div className="relative">
                                       <button
                                          onClick={() => setIsActionMenuOpen(!isActionMenuOpen)}
                                          className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${isActionMenuOpen ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-zinc-500 hover:text-white'}`}
                                       >
                                          <Plus size={18} className={`transition-transform duration-300 ${isActionMenuOpen ? 'rotate-45' : ''}`} />
                                       </button>

                                       <AnimatePresence>
                                          {isActionMenuOpen && (
                                             <>
                                                <div className="fixed inset-0 z-40" onClick={() => setIsActionMenuOpen(false)} />
                                                <motion.div
                                                   initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                   animate={{ opacity: 1, y: 0, scale: 1 }}
                                                   exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                   className="absolute bottom-full left-0 mb-4 w-64 bg-zinc-900/90 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-50 p-2"
                                                >
                                                   <div className="flex flex-col gap-1">
                                                      <button
                                                         onClick={() => { fileInputRef.current?.click(); setIsActionMenuOpen(false); }}
                                                         className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-zinc-300 hover:text-white rounded-2xl transition-all text-sm group"
                                                      >
                                                         <span className="font-medium">Add photos & files</span>
                                                      </button>
                                                      <div className="h-px bg-white/5 mx-4 my-1" />
                                                      <button
                                                         onClick={() => { setAiMode('image'); setIsActionMenuOpen(false); }}
                                                         className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-zinc-300 hover:text-white rounded-2xl transition-all text-sm group"
                                                      >
                                                         <span className="font-medium">Create image</span>
                                                      </button>
                                                      <button
                                                         onClick={() => { setSearchValue('Thinking: '); setIsActionMenuOpen(false); }}
                                                         className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-zinc-300 hover:text-white rounded-2xl transition-all text-sm group"
                                                      >
                                                         <span className="font-medium">Thinking</span>
                                                      </button>
                                                      <button
                                                         onClick={() => { setSearchValue('Research: '); setIsActionMenuOpen(false); }}
                                                         className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-zinc-300 hover:text-white rounded-2xl transition-all text-sm group"
                                                      >
                                                         <span className="font-medium">Deep research</span>
                                                      </button>
                                                      <button
                                                         onClick={() => { navigate('/explore'); setIsActionMenuOpen(false); }}
                                                         className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-zinc-300 hover:text-white rounded-2xl transition-all text-sm group"
                                                      >
                                                         <span className="font-medium">Education</span>
                                                      </button>
                                                   </div>
                                                </motion.div>
                                             </>
                                          )}
                                       </AnimatePresence>
                                    </div>
                                    <button
                                       onClick={toggleVoice}
                                       className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${isListening ? 'bg-primary/20 text-primary animate-pulse' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
                                    >
                                       <Mic size={18} />
                                    </button>
                                    <button
                                       onClick={handleLiveVoiceClick}
                                       className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isVoiceReplaying ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
                                    >
                                       <AudioLines size={18} />
                                    </button>
                                 </div>

                                 <div className="flex items-center gap-3">
                                    <button
                                       onClick={() => setIsModelOpen(!isModelOpen)}
                                       className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5 text-zinc-500 hover:text-white hover:bg-white/10 transition-all ml-1"
                                    >
                                       <span className="text-[10px] font-bold uppercase tracking-wider">{selectedModel}</span>
                                       <ChevronDown size={14} />
                                    </button>
                                    <button
                                       onClick={handleSend}
                                       disabled={!searchValue.trim() || isLoading || isGeneratingImage}
                                       className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-500 ${searchValue.trim() ? 'bg-primary text-white shadow-[0_0_20px_rgba(59,130,246,0.4)]' : 'bg-zinc-800 text-zinc-700 opacity-50 scale-90'}`}
                                    >
                                       {isGeneratingImage || isLoading ? <Loader2 size={20} className="animate-spin" /> : <ArrowUp size={22} strokeWidth={2.5} />}
                                    </button>
                                 </div>
                              </div>
                              {attachedFileName && (
                                 <div className="absolute -top-10 left-4 text-[11px] text-zinc-400 bg-zinc-900/90 border border-white/10 rounded-full px-4 py-1.5 flex items-center gap-2 shadow-2xl backdrop-blur-xl">
                                    <FileText size={12} className="text-primary" />
                                    <span className="max-w-[180px] truncate font-medium">{attachedFileName}</span>
                                    <button onClick={clearAttachedFile} className="ml-1 text-zinc-600 hover:text-red-400 transition-colors">
                                       <X size={12} />
                                    </button>
                                 </div>
                              )}
                           </div>
                        </div>
                     </motion.div>
                  )}
               </AnimatePresence>
            </div>
         </main>

         {/* Live Preview Modal */}
         <AnimatePresence>
            {isPreviewOpen && (
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-xl flex items-center justify-center p-6"
                  onClick={() => setIsPreviewOpen(false)}
               >
                  <motion.div
                     initial={{ scale: 0.9, opacity: 0, y: 20 }}
                     animate={{ scale: 1, opacity: 1, y: 0 }}
                     exit={{ scale: 0.9, opacity: 0, y: 20 }}
                     className="bg-zinc-900 border border-white/10 w-full max-w-6xl h-[85vh] rounded-[40px] overflow-hidden flex flex-col relative"
                     onClick={(e) => e.stopPropagation()}
                  >
                     <div className="h-16 border-b border-white/5 px-8 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-4">
                           <div className="flex gap-1.5">
                              <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                              <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                              <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                           </div>
                           <h3 className="text-sm font-bold text-zinc-400">UI Design Preview</h3>
                        </div>
                        <div className="flex items-center gap-3">
                           <button
                              onClick={() => {
                                 const blob = new Blob([previewCode || ""], { type: 'text/html' });
                                 const url = URL.createObjectURL(blob);
                                 const a = document.createElement('a');
                                 a.href = url;
                                 a.download = 'ui-design.html';
                                 a.click();
                              }}
                              className="p-2 text-zinc-500 hover:text-white transition-colors"
                              title="Download HTML"
                           >
                              <Download size={20} />
                           </button>
                           <button
                              onClick={() => setIsPreviewOpen(false)}
                              className="w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center text-zinc-500 hover:text-white transition-all"
                           >
                              <X size={20} />
                           </button>
                        </div>
                     </div>
                     <div className="flex-1 bg-white relative">
                        <iframe
                           title="UI Preview"
                           className="w-full h-full border-none"
                           srcDoc={`
                              <!DOCTYPE html>
                              <html>
                                 <head>
                                    <meta charset="utf-8">
                                    <meta name="viewport" content="width=device-width, initial-scale=1">
                                    <script src="https://cdn.tailwindcss.com"></script>
                                    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Orbitron:wght@400;700;900&display=swap" rel="stylesheet">
                                    <style>
                                       body { font-family: 'Inter', sans-serif; margin: 0; padding: 0; }
                                       .orbitron { font-family: 'Orbitron', sans-serif; }
                                    </style>
                                 </head>
                                 <body>
                                    ${previewCode}
                                 </body>
                              </html>
                           `}
                        />
                     </div>
                  </motion.div>
               </motion.div>
            )}
         </AnimatePresence>

         {/* Model Selection Modal */}
         <AnimatePresence>
            {isModelOpen && (
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[400] bg-black/60 backdrop-blur-md flex items-center justify-center p-6"
                  onClick={() => setIsModelOpen(false)}
               >
                  <motion.div
                     initial={{ scale: 0.95, opacity: 0, y: 10 }}
                     animate={{ scale: 1, opacity: 1, y: 0 }}
                     exit={{ scale: 0.95, opacity: 0, y: 10 }}
                     className="bg-zinc-900 border border-white/10 w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl"
                     onClick={(e) => e.stopPropagation()}
                  >
                     <div className="p-2 py-3 bg-[#0a0a0a]">
                        <div className="space-y-0.5">
                           {models.map((model) => (
                              <button
                                 key={model}
                                 onClick={() => {
                                    setSelectedModel(model);
                                    setIsModelOpen(false);
                                 }}
                                 className={`w-full flex items-center justify-between p-2.5 px-4 rounded-xl transition-all group ${selectedModel === model ? 'bg-white/5 text-white' : 'hover:bg-white/5 text-zinc-500 hover:text-zinc-300'}`}
                              >
                                 <div className="flex items-center gap-4">
                                    <div className={`w-5 h-5 flex items-center justify-center transition-opacity ${selectedModel === model ? 'opacity-100' : 'opacity-40 group-hover:opacity-80'}`}>
                                       {model === "Gemma 3" ? <img src="/google.png" alt="Google" className="w-full h-full object-contain" /> :
                                          model === "gpt-oss" ? <img src="/chat-gpt-v2.png" alt="GPT" className="w-full h-full object-contain" /> :
                                             <img src="/meta.png" alt="Meta" className="w-full h-full object-contain" />}
                                    </div>
                                    <span className="text-sm font-medium tracking-tight">{model}</span>
                                 </div>
                                 {selectedModel === model && (
                                    <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                                       <Check size={14} className="text-primary" />
                                    </motion.div>
                                 )}
                              </button>
                           ))}
                        </div>
                     </div>
                  </motion.div>
               </motion.div>
            )}
         </AnimatePresence>


         <style dangerouslySetInnerHTML={{
            __html: `
            @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');
            .no-scrollbar::-webkit-scrollbar { display: none; }
            .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
 
         `}} />
      </div>
   );
}
