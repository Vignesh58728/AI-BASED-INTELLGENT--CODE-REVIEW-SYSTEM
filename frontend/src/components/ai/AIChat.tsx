import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp, User, Bot, X, Sparkles, Loader2, ShieldAlert, Zap, Search, Code2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { submissionService } from '@/services/submissionService';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
   role: 'user' | 'ai';
   content: string;
}

interface AIChatProps {
   onClose: () => void;
   problemContext?: string;
   selectedModel?: string;
   code?: string;
   language?: string;
}

export const AIChat: React.FC<AIChatProps> = ({ onClose, problemContext, selectedModel: initialModel = "gpt-oss", code, language = "python" }) => {
   const [messages, setMessages] = useState<Message[]>([
      { role: 'ai', content: "Initializing AI Code Review..." }
   ]);
   const [input, setInput] = useState('');
   const [isLoading, setIsLoading] = useState(false);
   const [isAnalyzing, setIsAnalyzing] = useState(false);
   const [selectedModel, setSelectedModel] = useState(initialModel);
   const messagesEndRef = useRef<HTMLDivElement>(null);

   const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
   };

   useEffect(() => {
      if (messages.length > 0) scrollToBottom();
   }, [messages]);

   // Proactive Review on mount
   useEffect(() => {
      const runInitialReview = async () => {
         setIsAnalyzing(true);
         try {
            // Extract code from problemContext if not provided directly
            let targetCode = code;
            if (!targetCode && problemContext) {
               const codeIndex = problemContext.indexOf("Current Code:\n");
               if (codeIndex !== -1) {
                  targetCode = problemContext.slice(codeIndex + "Current Code:\n".length);
               }
            }

            if (targetCode) {
               const review = await submissionService.analyzeCode(targetCode, language, "0", selectedModel);
               const feedback = `### Code Review Report\n\n**Overall Score: ${review.score}/100**\n\n${review.feedback}\n\n${review.detailed_reviews?.map((r: any) => `- **Line ${r.line}**: ${r.comment}`).join('\n') || ''}`;
               setMessages([{ role: 'ai', content: feedback }]);
            } else {
               setMessages([{ role: 'ai', content: "Hello! I am your Code Reviewer. I have analyzed your context. How can I help you improve your code today?" }]);
            }
         } catch (error) {
            console.error("Initial review failed:", error);
            setMessages([{ role: 'ai', content: "Hello! I'm your AI Code Reviewer. How can I help you with this problem today?" }]);
         } finally {
            setIsAnalyzing(false);
         }
      };
      runInitialReview();
   }, []);

   const handleSend = async () => {
      if (!input.trim() || isLoading) return;

      const userMessage = input.trim();
      setInput('');
      setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
      setIsLoading(true);

      const sendWithRetry = async (retryCount = 0): Promise<any> => {
         try {
            // Append context if available for the first message or every message
            const query = problemContext
               ? `Problem Context: ${problemContext}\n\nUser Question: ${userMessage}`
               : userMessage;

            return await submissionService.getChatResponse(query, {
               model: selectedModel
            });
         } catch (err: any) {
            console.warn(`AI Chat Attempt ${retryCount + 1} failed:`, err);
            if (retryCount < 1 && (err.code === 'ECONNABORTED' || !err.response)) {
               await new Promise(resolve => setTimeout(resolve, 1000));
               return sendWithRetry(retryCount + 1);
            }
            throw err;
         }
      };

      try {
         const response = await sendWithRetry();
         setMessages(prev => [...prev, { role: 'ai', content: response.answer }]);
      } catch (error: any) {
         console.error("AI Chat Error:", error);
         let errorMsg = "Sorry, I'm having trouble connecting right now. Please check your internet.";
         if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
            errorMsg = "The AI is taking a bit longer than usual. Please try sending your message again.";
         }
         setMessages(prev => [...prev, { role: 'ai', content: errorMsg }]);
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <div className="flex flex-col h-full bg-white border-l border-zinc-200 shadow-2xl overflow-hidden font-['Outfit']">
         {/* Header */}
         <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-white shrink-0">
            <div className="flex items-center gap-3">
               <div className="bg-black p-2 rounded-xl shadow-lg ring-4 ring-black/5">
                  <ShieldAlert size={20} className="text-white" />
               </div>
               <div>
                  <h3 className="text-sm font-black text-black tracking-tight uppercase">AI Code Reviewer</h3>
                  <div className="flex items-center gap-1.5">
                     <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                     <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Live Analysis</p>
                  </div>
               </div>
            </div>
            <div className="flex items-center gap-1">
               <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-black/5 rounded-full h-9 w-9 text-zinc-400 hover:text-black transition-all">
                  <X size={20} />
               </Button>
            </div>
         </div>

         {/* Dashboard Content */}
         <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6 bg-slate-50/50 no-scrollbar">
            {isAnalyzing ? (
               <div className="flex flex-col items-center justify-center py-32 space-y-6">
                  <div className="relative">
                     <div className="w-16 h-16 border-[3px] border-zinc-100 border-t-black rounded-full animate-spin" />
                     <ShieldAlert className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black" size={24} />
                  </div>
                  <div className="text-center">
                     <p className="text-[12px] font-black uppercase tracking-[0.3em] text-black mb-1">Scanning Architecture</p>
                     <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Identifying logic patterns...</p>
                  </div>
               </div>
            ) : (
               <>
                  {/* Summary Card */}
                  <div className="bg-white border border-zinc-200/60 rounded-[32px] p-6 shadow-sm ring-1 ring-black/[0.02]">
                     <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                           <div className="bg-black p-2 rounded-xl">
                              <Zap size={18} className="text-white" />
                           </div>
                           <h4 className="text-[11px] font-black uppercase tracking-widest text-black">Executive Summary</h4>
                        </div>
                        <div className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase tracking-tighter border border-green-100">
                           Optimized
                        </div>
                     </div>
                     <div className="markdown-content text-[13px] leading-relaxed">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                           {(messages.find(m => m.role === 'ai')?.content || "No analysis available. Please try again.").replace(/^\s*#+\s*/gm, '')}
                        </ReactMarkdown>
                     </div>
                  </div>

                  {/* Proactive Help Cards */}
                  <div className="grid grid-cols-1 gap-4">
                     <div className="bg-zinc-900 border border-zinc-800 rounded-[28px] p-5 shadow-xl group hover:border-zinc-700 transition-all cursor-pointer">
                        <div className="flex items-center gap-4 mb-3">
                           <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                              <Code2 size={20} className="text-white" />
                           </div>
                           <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Security Audit</p>
                              <p className="text-xs font-bold text-white">No vulnerabilities found</p>
                           </div>
                        </div>
                     </div>

                     <div className="bg-white border border-zinc-200/60 rounded-[28px] p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                        <div className="flex items-center gap-4 mb-3">
                           <div className="w-10 h-10 rounded-2xl bg-zinc-50 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                              <Search size={20} className="text-zinc-400 group-hover:text-white" />
                           </div>
                           <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Logic Check</p>
                              <p className="text-xs font-bold text-black">Click to re-verify flow</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </>
            )}
            
            {/* Show follow up responses as new cards if any */}
            {!isAnalyzing && messages.filter((m, idx) => m.role === 'ai' && idx > 0).map((m, i) => (
               <div key={i} className="bg-white border border-zinc-200/60 rounded-[32px] p-6 shadow-sm animate-in slide-in-from-bottom-4">
                  <div className="flex items-center gap-3 mb-4">
                     <div className="w-8 h-8 rounded-full bg-zinc-50 flex items-center justify-center border border-zinc-100">
                        <Bot size={14} className="text-black" />
                     </div>
                     <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Follow-up Insight</span>
                  </div>
                  <div className="markdown-content text-[13px] leading-relaxed">
                     <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {m.content.replace(/^\s*#+\s*/gm, '')}
                     </ReactMarkdown>
                  </div>
               </div>
            ))}

            {isLoading && (
               <div className="flex items-center gap-3 px-4 py-3 bg-white/80 backdrop-blur rounded-2xl border border-zinc-100 shadow-sm animate-pulse">
                  <div className="w-2 h-2 rounded-full bg-black animate-bounce" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black">Processing Query...</span>
               </div>
            )}
            <div ref={messagesEndRef} />
         </div>

         {/* Minimalist Action Bar */}
         <div className="p-6 border-t border-zinc-100 bg-white">
            <div className="relative flex items-center bg-zinc-50 border border-zinc-200 rounded-2xl p-1 focus-within:ring-2 focus-within:ring-black/5 transition-all">
               <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Need further clarification?"
                  className="flex-1 bg-transparent border-none py-3 pl-4 text-[12px] font-bold focus:outline-none placeholder:text-zinc-400 placeholder:uppercase"
               />
               <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className={`p-3 rounded-xl transition-all ${!input.trim() || isLoading ? 'text-zinc-300' : 'bg-black text-white shadow-lg'}`}
               >
                  <ArrowUp size={18} strokeWidth={3} />
               </button>
            </div>
         </div>
         <style dangerouslySetInnerHTML={{ __html: `
            .markdown-content h1, .markdown-content h2, .markdown-content h3 {
               font-family: 'Outfit', sans-serif;
               font-weight: 800;
               margin-top: 1.5rem;
               margin-bottom: 0.75rem;
               color: #000;
               letter-spacing: -0.02em;
               text-transform: uppercase;
               font-size: 0.85rem;
            }
            .markdown-content p { margin-bottom: 1rem; color: #444; }
            .markdown-content strong { color: #000; font-weight: 700; }
            .markdown-content ul { margin-bottom: 1rem; list-style-type: none; padding: 0; }
            .markdown-content li { 
               position: relative; 
               padding-left: 1.5rem; 
               margin-bottom: 0.5rem;
               border-left: 2px solid #f3f4f6;
               margin-left: 0.5rem;
            }
            .markdown-content code {
               background-color: #f8fafc;
               color: #e11d48;
               padding: 0.2rem 0.4rem;
               border-radius: 6px;
               font-family: 'JetBrains Mono', monospace;
               font-size: 0.85em;
               border: 1px solid #f1f5f9;
            }
            .no-scrollbar::-webkit-scrollbar { display: none; }
         ` }} />
      </div>
   );
};
