
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Mic, Send, User, Bot, Briefcase, Play, ChevronLeft, Sparkles, MessageSquare } from "lucide-react";
import { submissionService } from "@/services/submissionService";
import { problemsApi } from "@/services/problemsApi";

interface Message {
   role: "user" | "bot";
   content: string;
}

export function MockInterviewPage() {
   const [selectedSession, setSelectedSession] = useState<any>(null);
   const [messages, setMessages] = useState<Message[]>([]);
   const [input, setInput] = useState("");
   const [isInterviewerThinking, setIsInterviewerThinking] = useState(false);
   const [placementPrograms, setPlacementPrograms] = useState<any[]>([]);

   const scrollRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      if (scrollRef.current) {
         scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
   }, [messages]);

   useEffect(() => {
      const fetchData = async () => {
         try {
            // In a real app, we'd have a specific endpoint for placement programs
            // For now, we use college problems with interview/placement tags or just mock if not found
            // But let's try to fetch if we have them.
            const data = await problemsApi.getCollegeProblems();
            const interviewProblems = data.filter(p => p.tags && (p.tags.includes("interview") || p.tags.includes("placement")));

            if (interviewProblems.length > 0) {
               // Map to the expected format
               setPlacementPrograms(interviewProblems.map(p => ({
                  id: p.id,
                  company: p.title.split("-")[0].trim() || "Company",
                  role: "Software Engineer",
                  type: "Technical Interview",
                  duration: "45 mins",
                  questions: 3,
                  difficulty: p.difficulty,
                  available: true
               })));
            } else {
               // Fallback to minimal mock if db is empty (though we just seeded)
               setPlacementPrograms([
                  { id: "1", company: "Google", role: "SDE-1", type: "Mock Interview", duration: "45 mins", questions: 2, difficulty: "Hard", available: true },
                  { id: "2", company: "Amazon", role: "SDE-1", type: "Technical SDE-1", duration: "60 mins", questions: 3, difficulty: "Medium", available: true }
               ]);
            }
         } catch (e) {
            console.error("Error fetching placement data:", e);
         }
      };
      fetchData();
   }, []);

   const startInterview = (program: any) => {
      setSelectedSession(program);
      const initialMessage = `Hello! I am your AI interviewer for the ${program.company} ${program.role} role. Let's begin the technical screening. Tell me about a challenging project you've worked on recently.`;
      setMessages([{ role: "bot", content: initialMessage }]);
   };

   const handleSendMessage = async () => {
      if (!input.trim()) return;

      const userMessage = input.trim();
      setMessages(prev => [...prev, { role: "user", content: userMessage }]);
      setInput("");
      setIsInterviewerThinking(true);

      try {
         const chatQuery = `I am in a mock interview for ${selectedSession?.role} at ${selectedSession?.company}. Here is my answer: ${userMessage}. Please provide a follow-up technical question or feedback.`;
         const response = await submissionService.getChatResponse(chatQuery);
         setMessages(prev => [...prev, { role: "bot", content: response.answer || response.response || "" }]);
      } catch (err) {
         console.error("Chat error:", err);
         setMessages(prev => [...prev, { role: "bot", content: "Sorry, I'm having trouble connecting to the interview brain. Please try again." }]);
      } finally {
         setIsInterviewerThinking(false);
      }
   };

   if (selectedSession) {
      return (
         <div className="h-screen flex flex-col bg-[#0a0a0a] text-white overflow-hidden">
            <header className="h-14 border-b border-white/10 flex items-center px-6 justify-between bg-[#111]">
               <div className="flex items-center gap-4">
                  <button onClick={() => setSelectedSession(null)} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                     <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                        <MessageSquare className="w-4 h-4 text-primary" />
                     </div>
                     <div>
                        <h1 className="text-sm font-semibold">{selectedSession.company} Interview</h1>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Live AI Session</p>
                     </div>
                  </div>
               </div>
               <div className="flex items-center gap-3">
                  <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                     <span className="text-[10px] font-bold text-green-500 uppercase">Connected</span>
                  </div>
               </div>
            </header>

            <main className="flex-1 flex overflow-hidden">
               <div className="flex-1 flex flex-col relative bg-zinc-950">
                  <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                     {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                           <div className={`flex gap-3 max-w-[80%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 
                                 ${msg.role === "user" ? "bg-primary/20" : "bg-zinc-800"}`}>
                                 {msg.role === "user" ? <User className="w-4 h-4 text-primary" /> : <Bot className="w-4 h-4 text-zinc-400" />}
                              </div>
                              <div className={`p-4 rounded-2xl text-sm leading-relaxed
                                 ${msg.role === "user" ? "bg-primary text-primary-foreground rounded-tr-none" : "bg-zinc-900 border border-white/5 rounded-tl-none text-zinc-200"}`}>
                                 {msg.content}
                              </div>
                           </div>
                        </div>
                     ))}
                     {isInterviewerThinking && (
                        <div className="flex justify-start">
                           <div className="flex gap-3">
                              <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
                                 <Bot className="w-4 h-4 text-zinc-400" />
                              </div>
                              <div className="bg-zinc-900 border border-white/5 p-4 rounded-2xl rounded-tl-none">
                                 <div className="flex gap-1">
                                    <div className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                    <div className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                    <div className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce" />
                                 </div>
                              </div>
                           </div>
                        </div>
                     )}
                  </div>

                  <div className="p-6 bg-gradient-to-t from-zinc-950 to-transparent">
                     <div className="max-w-3xl mx-auto flex gap-3 p-2 bg-zinc-900/50 border border-white/10 rounded-2xl focus-within:border-primary/50 transition-colors">
                        <button className="p-3 hover:bg-white/5 rounded-xl transition-colors text-zinc-400">
                           <Mic className="w-5 h-5" />
                        </button>
                        <input
                           value={input}
                           onChange={(e) => setInput(e.target.value)}
                           onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                           placeholder="Type your response or ask for hints..."
                           className="flex-1 bg-transparent border-none focus:outline-none text-sm"
                        />
                        <Button
                           onClick={handleSendMessage}
                           disabled={isInterviewerThinking || !input.trim()}
                           size="sm"
                           className="rounded-xl px-4"
                        >
                           <Send className="w-4 h-4 mr-2" />
                           Send
                        </Button>
                     </div>
                  </div>
               </div>
            </main>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
         <div className="max-w-6xl mx-auto">
            <header className="flex justify-between items-center mb-12">
               <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">AI Mock Interviews</h1>
                  <p className="text-zinc-500 mt-2">Practice for top tech companies with our intelligent interviewer.</p>
               </div>
               <div className="flex gap-4">
                  <div className="bg-zinc-900/50 border border-white/5 px-4 py-2 rounded-xl flex items-center gap-3">
                     <Sparkles className="w-4 h-4 text-primary" />
                     <div>
                        <p className="text-[10px] text-zinc-500 uppercase font-black">AI Model</p>
                        <p className="text-xs font-bold">Llama 3.3 70B</p>
                     </div>
                  </div>
               </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {placementPrograms.map((program) => (
                  <Card key={program.id} className="bg-zinc-900/40 border-white/5 hover:border-primary/30 transition-all group overflow-hidden">
                     <CardHeader className="p-6">
                        <div className="flex justify-between items-start mb-4">
                           <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                              <Briefcase className="w-6 h-6 text-zinc-400" />
                           </div>
                           <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${program.difficulty === "Hard" ? "bg-red-500/10 text-red-500" :
                              program.difficulty === "Medium" ? "bg-amber-500/10 text-amber-500" :
                                 "bg-green-500/10 text-green-500"
                              }`}>
                              {program.difficulty}
                           </span>
                        </div>
                        <CardTitle className="text-xl font-bold text-white mb-1">{program.company}</CardTitle>
                        <p className="text-zinc-500 text-sm">{program.role}</p>
                     </CardHeader>
                     <CardContent className="p-6 pt-0">
                        <div className="space-y-4">
                           <div className="grid grid-cols-2 gap-4">
                              <div className="bg-white/5 rounded-lg p-3">
                                 <p className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Duration</p>
                                 <p className="text-xs font-semibold">{program.duration}</p>
                              </div>
                              <div className="bg-white/5 rounded-lg p-3">
                                 <p className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Questions</p>
                                 <p className="text-xs font-semibold">{program.questions} Problems</p>
                              </div>
                           </div>
                           <Button
                              onClick={() => startInterview(program)}
                              className="w-full group/btn relative overflow-hidden h-12"
                           >
                              <span className="relative z-10 flex items-center justify-center gap-2">
                                 <Play className="w-4 h-4 fill-current" />
                                 Start Session
                              </span>
                           </Button>
                        </div>
                     </CardContent>
                  </Card>
               ))}
            </div>
         </div>
      </div>
   );
}
