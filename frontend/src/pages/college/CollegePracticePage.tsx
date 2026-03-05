import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Send, Zap, Sparkles, ChevronLeft, Bot } from "lucide-react";
import { submissionService } from "@/services/submissionService";
import { problemsApi } from "@/services/problemsApi";
import { debounce } from "lodash";
import { AIChat } from "@/components/ai/AIChat";
import { offlineExecutor } from "@/lib/offlineExecutor";

export function CollegePracticePage() {
   const { id } = useParams<{ id: string }>();
   const navigate = useNavigate();
   const [problem, setProblem] = useState<any>(null);
   const [code, setCode] = useState("// Write your solution here\n");
   const [aiFeedback, setAiFeedback] = useState<string | null>(null);
   const [isAnalyzing, setIsAnalyzing] = useState(false);
   const [suggestions, setSuggestions] = useState<string[]>([]);
   const [isTyping, setIsTyping] = useState(false);
   const [output, setOutput] = useState<string | null>(null);
   const [isExecuting, setIsExecuting] = useState(false);
   const [showProactivePrompt, setShowProactivePrompt] = useState(false);
   const [isLoading, setIsLoading] = useState(true);
   const [isChatOpen, setIsChatOpen] = useState(false);
   const [language, setLanguage] = useState("python");

   useEffect(() => {
      const fetchProblemData = async () => {
         if (!id) return;
         setIsLoading(true);
         try {
            const data = await problemsApi.getProblemById(id);
            setProblem(data);
            if (data.template_code) {
               const initialCode = data.template_code.python || data.template_code.text || "// Write your solution here\n";
               setCode(initialCode);
            }
         } catch (e) {
            console.error("Error fetching problem details:", e);
         } finally {
            setIsLoading(false);
         }
      };
      fetchProblemData();
   }, [id]);

   // Inactivity timer for Proactive AI Tutor
   useEffect(() => {
      const timer = setTimeout(() => {
         if (!isTyping && !aiFeedback && code.length > 20) {
            setShowProactivePrompt(true);
         }
      }, 20000); // 20 seconds inactivity

      return () => clearTimeout(timer);
   }, [code, isTyping, aiFeedback]);

   const fetchSuggestions = useCallback(
      debounce(async (currentCode: string) => {
         if (!currentCode.trim() || currentCode.length < 10) return;
         try {
            const result = await submissionService.getSuggestions(currentCode, "python");
            setSuggestions(result.suggestions);
         } catch (e) {
            console.error("Error fetching suggestions:", e);
         } finally {
            setIsTyping(false);
         }
      }, 1500),
      []
   );

   useEffect(() => {
      if (code.trim()) {
         setIsTyping(true);
         setShowProactivePrompt(false);
         fetchSuggestions(code);
      } else {
         setSuggestions([]);
      }
   }, [code, fetchSuggestions]);

   const handleRun = async () => {
      setIsExecuting(true);
      setOutput(null);
      try {
         // Try backend first
         const result = await submissionService.executeCode(code, language);
         if (result.status === "success") {
            setOutput(result.output || "Program executed successfully with no output.");
         } else {
            setOutput(`Error:\n${result.error}`);
         }
      } catch (e) {
         console.warn("Backend execution failed, falling back to offline mode.");
         try {
            const result = await offlineExecutor.execute(code, language);
            if (result.status === "success") {
               setOutput(`[Offline Mode] Output:\n${result.output || "(No output)"}`);
            } else {
               setOutput(`[Offline Error]:\n${result.error}`);
            }
         } catch (offlineErr: any) {
            setOutput(`Execution error: Backend unreachable and offline mode failed. ${offlineErr.message}`);
         }
      } finally {
         setIsExecuting(false);
      }
   };

   const handleSubmit = async () => {
      setIsAnalyzing(true);
      setAiFeedback(null);
      try {
         const result = await submissionService.analyzeCode(code, "python", id || "0");
         setAiFeedback(result.feedback || "Code submitted and reviewed by AI.");
      } catch (e) {
         setAiFeedback("Error analyzing code. Please ensure the backend is running and the Groq API key is valid.");
      } finally {
         setIsAnalyzing(false);
      }
   };

   const handleExplain = async () => {
      setIsAnalyzing(true);
      setShowProactivePrompt(false);
      try {
         const result = await submissionService.explainCode(code, "python");
         setAiFeedback(result.explanation);
         setIsChatOpen(true); // Open chat when explaining
      } catch (e: any) {
         if (e.code === 'ECONNABORTED') {
            setAiFeedback("AI is taking a bit longer to think. Please try again in a moment.");
         } else {
            setAiFeedback("Error explaining code. Please check your internet or API key.");
         }
      } finally {
         setIsAnalyzing(false);
      }
   };

   if (isLoading) {
      return (
         <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a0a] text-white">
            <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mb-4" />
            <p className="text-zinc-500 font-medium">Loading problem details...</p>
         </div>
      );
   }

   if (!problem) {
      return (
         <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a] text-white">
            <div className="text-center">
               <h2 className="text-2xl font-bold mb-4">Problem not found</h2>
               <Button onClick={() => navigate(-1)}>Go Back</Button>
            </div>
         </div>
      );
   }

   return (
      <div className="h-screen flex flex-col bg-white text-zinc-900">
         {/* Top Header */}
         <header className="h-14 border-b border-zinc-200 flex items-center px-6 justify-between bg-zinc-50">
            <div className="flex items-center gap-4">
               <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-zinc-600 hover:text-black">
                  <ChevronLeft size={20} />
               </Button>
               <h2 className="font-bold flex items-center gap-2 text-zinc-900">
                  <span className="text-primary tracking-tighter uppercase text-xs font-black px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                     {problem.category}
                  </span>
                  {problem.title}
               </h2>
            </div>
            <div className="flex items-center gap-3">
               <div className="text-xs text-zinc-500 mr-4 hidden md:block">
                  Difficulty: <span className={problem.difficulty === 'Hard' ? 'text-red-600' : 'text-green-600'}>{problem.difficulty}</span>
               </div>
               <Button
                  variant={isChatOpen ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsChatOpen(!isChatOpen)}
                  className={isChatOpen ? "bg-primary text-white" : "border-zinc-200 text-zinc-600"}
               >
                  <Bot className="mr-2 h-4 w-4" /> Ask AI Tutor
               </Button>
               <div className="border-l border-zinc-200 h-6 mx-1" />
               <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-zinc-100 border border-zinc-200 rounded-lg h-9 text-[10px] font-bold px-2 text-zinc-600 outline-none focus:border-primary/50 transition-all uppercase tracking-tighter"
               >
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                  <option value="javascript">JavaScript</option>
               </select>
               <Button size="sm" onClick={handleSubmit} disabled={isAnalyzing} className="bg-primary text-white">
                  <Send className="mr-2 h-4 w-4" /> Submit solution
               </Button>
            </div>
         </header>

         <main className="flex-1 flex overflow-hidden">
            {/* Left Column: Problem & AI Feedback */}
            <div className={`w-1/3 border-r border-zinc-200 flex flex-col bg-zinc-50 transition-all duration-300 ${isChatOpen ? 'hidden lg:flex' : 'flex'}`}>
               <div className="flex-1 overflow-auto p-6 space-y-6">
                  <section>
                     <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-3">Description</h3>
                     <div className="text-zinc-700 text-sm leading-relaxed space-y-4">
                        {problem.description?.split('\n\n').map((part: string, i: number) => {
                           if (part.startsWith('**Example')) {
                              const [title, ...rest] = part.split('\n');
                              return (
                                 <div key={i} className="bg-white border border-zinc-200 rounded-xl p-4 my-4 shadow-sm">
                                    <p className="text-zinc-900 font-bold mb-2 text-xs">{title.replace(/\*\*/g, '')}</p>
                                    <pre className="font-mono text-[11px] text-zinc-600 bg-zinc-50 p-3 rounded-lg overflow-x-auto border border-zinc-100">
                                       {rest.join('\n')}
                                    </pre>
                                 </div>
                              );
                           }
                           return <p key={i} className="whitespace-pre-wrap">{part}</p>;
                        })}
                     </div>
                  </section>

                  <section className="bg-white rounded-xl border border-zinc-200 p-4 shadow-sm">
                     <h3 className="text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Sparkles size={14} className="text-primary" /> AI Insights
                     </h3>
                     <div className="text-xs text-zinc-600 leading-relaxed whitespace-pre-wrap">
                        {aiFeedback || "Start coding to get real-time AI feedback and logic analysis."}
                        {isAnalyzing && <div className="animate-pulse mt-2 text-primary font-medium">AI is thinking...</div>}
                     </div>
                  </section>
               </div>
            </div>

            {/* Right Column: Code Editor */}
            <div className="flex-1 flex flex-col relative overflow-hidden bg-white">
               <div className="flex-1">
                  <textarea
                     className="w-full h-full p-4 font-mono text-sm outline-none resize-none bg-zinc-50/50"
                     value={code}
                     onChange={(e) => setCode(e.target.value)}
                     placeholder="Write your solution here..."
                  />
               </div>

               {/* AI Pair Programmer Suggestions */}
               {suggestions.length > 0 && (
                  <div className="absolute right-6 top-6 bg-white border border-primary/20 rounded-xl p-4 shadow-xl z-10 max-w-sm animate-in fade-in slide-in-from-right-4">
                     <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-tighter">
                           <Zap size={14} fill="currentColor" /> AI Pair Programmer
                        </div>
                        {isTyping && <div className="w-2 h-2 rounded-full bg-primary animate-ping" />}
                     </div>
                     <div className="space-y-2">
                        {suggestions.map((s, i) => (
                           <button
                              key={i}
                              className="w-full text-left text-xs text-zinc-700 bg-zinc-50 py-2 px-3 rounded-lg hover:bg-primary/10 hover:text-primary transition-all border border-transparent hover:border-primary/20"
                              onClick={() => setCode(code + (code.endsWith('\n') ? '' : '\n') + s)}
                           >
                              {s}
                           </button>
                        ))}
                     </div>
                  </div>
               )}

               <footer className="h-12 border-t border-zinc-200 bg-zinc-50 flex items-center px-4 justify-between">
                  <div className="flex gap-4">
                     <span className="text-[10px] font-mono text-zinc-500">{language}</span>
                     <span className="text-[10px] font-mono text-zinc-500">UTF-8</span>
                  </div>
                  <div className="flex gap-2">
                     <Button variant="ghost" size="sm" className="h-8 text-[10px] text-zinc-500 hover:text-black" disabled={isAnalyzing} onClick={() => setCode("")}>
                        Clear Editor
                     </Button>
                     <Button size="sm" className="h-8 text-[10px] bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20" onClick={handleRun} disabled={isExecuting}>
                        {isExecuting ? "Running..." : "Run Code"}
                     </Button>
                  </div>
               </footer>

               {/* Terminal Output Area */}
               {output && (
                  <div className="h-1/3 bg-zinc-50 border-t border-zinc-200 p-4 font-mono text-xs overflow-auto animate-in slide-in-from-bottom-4 shadow-inner">
                     <div className="flex justify-between items-center mb-2 border-b border-zinc-100 pb-2">
                        <span className="text-primary font-bold uppercase tracking-widest text-[10px]">Output Terminal</span>
                        <button className="text-zinc-400 hover:text-black" onClick={() => setOutput(null)}>Close</button>
                     </div>
                     <pre className="text-zinc-800 leading-relaxed">{output}</pre>
                  </div>
               )}

               {/* Proactive AI Tutor Prompt */}
               {showProactivePrompt && (
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-20 bg-primary/95 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom-10 backdrop-blur-md border border-white/20 z-100">
                     <div className="bg-white/20 p-2 rounded-xl">
                        <Bot size={24} />
                     </div>
                     <div>
                        <p className="text-sm font-bold">Stuck on this problem?</p>
                        <p className="text-[10px] text-white/80">I can teach you how to solve it step-by-step.</p>
                     </div>
                     <div className="flex gap-2 ml-4">
                        <Button size="sm" variant="ghost" className="h-8 text-[10px] hover:bg-white/10" onClick={() => setShowProactivePrompt(false)}>Later</Button>
                        <Button size="sm" className="h-8 text-[10px] bg-white text-primary hover:bg-white/90 font-bold" onClick={handleExplain}>Teach Me</Button>
                     </div>
                  </div>
               )}
            </div>

            {/* AI Chat Sidebar */}
            {isChatOpen && (
               <div className="w-80 h-full border-l border-white/10 flex flex-col transition-all duration-300 animate-in slide-in-from-right-full">
                  <AIChat
                     onClose={() => setIsChatOpen(false)}
                     problemContext={`Problem: ${problem.title}\nDescription: ${problem.description}\nCurrent Code:\n${code}`}
                  />
               </div>
            )}
         </main>
      </div>
   );
}
