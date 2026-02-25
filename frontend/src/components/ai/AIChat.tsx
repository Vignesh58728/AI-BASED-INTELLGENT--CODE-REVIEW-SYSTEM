import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, X, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { submissionService } from '@/services/submissionService';

interface Message {
   role: 'user' | 'ai';
   content: string;
}

interface AIChatProps {
   onClose: () => void;
   problemContext?: string;
}

export const AIChat: React.FC<AIChatProps> = ({ onClose, problemContext }) => {
   const [messages, setMessages] = useState<Message[]>([
      { role: 'ai', content: "Hello! I'm your AI Tutor. How can I help you with this problem today?" }
   ]);
   const [input, setInput] = useState('');
   const [isLoading, setIsLoading] = useState(false);
   const messagesEndRef = useRef<HTMLDivElement>(null);

   const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
   };

   useEffect(scrollToBottom, [messages]);

   const handleSend = async () => {
      if (!input.trim() || isLoading) return;

      const userMessage = input.trim();
      setInput('');
      setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
      setIsLoading(true);

      try {
         // Append context if available for the first message or every message
         const query = problemContext
            ? `Problem Context: ${problemContext}\n\nUser Question: ${userMessage}`
            : userMessage;

         const response = await submissionService.getChatResponse(query);
         setMessages(prev => [...prev, { role: 'ai', content: response.answer }]);
      } catch (error) {
         console.error("AI Chat Error:", error);
         setMessages(prev => [...prev, { role: 'ai', content: "Sorry, I'm having trouble connecting right now. Please try again later." }]);
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <div className="flex flex-col h-full bg-[#111] border-l border-white/10 animate-in slide-in-from-right-full duration-300 shadow-2xl">
         {/* Header */}
         <div className="p-4 border-b border-white/10 flex items-center justify-between bg-primary/5">
            <div className="flex items-center gap-2">
               <div className="bg-primary/20 p-1.5 rounded-lg">
                  <Bot size={18} className="text-primary" />
               </div>
               <div>
                  <h3 className="text-sm font-bold">AI Tutor</h3>
                  <p className="text-[10px] text-primary animate-pulse">Online & Ready to Help</p>
               </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-red-500/20 hover:text-red-500 transition-colors">
               <X size={18} />
            </Button>
         </div>

         {/* Messages */}
         <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
            {messages.map((m, i) => (
               <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                     <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border ${m.role === 'user' ? 'bg-zinc-800 border-zinc-700' : 'bg-primary/10 border-primary/20'
                        }`}>
                        {m.role === 'user' ? <User size={14} /> : <Bot size={14} className="text-primary" />}
                     </div>
                     <div className={`p-3 rounded-2xl text-xs leading-relaxed ${m.role === 'user'
                        ? 'bg-primary text-white rounded-tr-none'
                        : 'bg-white/5 border border-white/10 text-zinc-300 rounded-tl-none'
                        }`}>
                        {m.content}
                     </div>
                  </div>
               </div>
            ))}
            {isLoading && (
               <div className="flex justify-start">
                  <div className="max-w-[85%] flex gap-3 flex-row">
                     <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                        <Bot size={14} className="text-primary" />
                     </div>
                     <div className="bg-white/5 border border-white/10 text-zinc-300 p-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                        <Loader2 size={12} className="animate-spin text-primary" />
                        <span className="text-[10px] italic">Thinking...</span>
                     </div>
                  </div>
               </div>
            )}
            <div ref={messagesEndRef} />
         </div>

         {/* Input Area */}
         <div className="p-4 border-t border-white/10 bg-black/20">
            <div className="relative">
               <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask a question..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-xs focus:outline-none focus:border-primary/50 transition-all placeholder:text-zinc-600"
               />
               <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all ${!input.trim() || isLoading ? 'text-zinc-600' : 'text-primary hover:bg-primary/10'
                     }`}
               >
                  <Send size={16} />
               </button>
            </div>
            <p className="text-[10px] text-center text-zinc-600 mt-3 flex items-center justify-center gap-1">
               <Sparkles size={10} /> Powered by Advanced AI
            </p>
         </div>
      </div>
   );
};
