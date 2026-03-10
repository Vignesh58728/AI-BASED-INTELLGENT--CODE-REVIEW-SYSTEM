import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FeedbackPanel } from "@/components/FeedbackPanel";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Play, Send, HelpCircle, Zap, ChevronLeft, Wrench, ShieldAlert, Sparkles, Terminal, X } from "lucide-react";
import { submissionService } from "@/services/submissionService";
import { problemsApi } from "@/services/problemsApi";
import { debounce } from "lodash";
import { AIChat } from "@/components/ai/AIChat";
import { FillTheBlank } from "@/components/FillTheBlank";
import { ModelSelector } from "@/components/ai/ModelSelector";
import { offlineExecutor } from "@/lib/offlineExecutor";
import Editor from "@monaco-editor/react";

export function Practice() {
   const { id } = useParams<{ id: string }>();
   const navigate = useNavigate();
   const [problem, setProblem] = useState<any>(null);
   const [code, setCode] = useState("// Write your code here\n");
   const [aiFeedback, setAiFeedback] = useState<string | null>(null);
   const [output, setOutput] = useState<string | null>(null);
   const [isAnalyzing, setIsAnalyzing] = useState(false);
   const [isExecuting, setIsExecuting] = useState(false);
   const [suggestions, setSuggestions] = useState<string[]>([]);
   const [isTyping, setIsTyping] = useState(false);
   const [isChatOpen, setIsChatOpen] = useState(false);
   const [isLoading, setIsLoading] = useState(true);
   const [selectedModel, setSelectedModel] = useState("gpt-oss");
   const [language, setLanguage] = useState("python");

   useEffect(() => {
      const fetchProblemData = async () => {
         if (!id) return;
         setIsLoading(true);
         try {
            const data = await problemsApi.getProblemById(id);
            setProblem(data);
            if (data.template_code) {
               const isBeginner =
                  data.difficulty?.toLowerCase() === "beginner" ||
                  data.difficulty?.toLowerCase() === "easy" ||
                  data.module?.toLowerCase() === "school";

               const initialCode = isBeginner
                  ? "# Write your code here...\n"
                  : (data.template_code.python || data.template_code.text || "// Write your code here\n");
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

   const fetchSuggestions = useCallback(
      debounce(async (currentCode: string, currentLang: string) => {
         if (!currentCode.trim()) return;
         try {
            const result = await submissionService.getSuggestions(currentCode, currentLang);
            setSuggestions(result.suggestions);
         } catch (e) {
            console.error("Error fetching suggestions:", e);
         } finally {
            setIsTyping(false);
         }
      }, 1000),
      []
   );

   useEffect(() => {
      if (code.trim()) {
         setIsTyping(true);
         fetchSuggestions(code, language);
      } else {
         setSuggestions([]);
      }
   }, [code, language, fetchSuggestions]);

   const handleRun = async () => {
      setIsExecuting(true);
      setOutput(null);
      setAiFeedback("⏳ Process started: Sending code to execution api...");
      try {
         // Try backend first
         const result = await submissionService.executeCode(code, language);
         if (result.status === "success") {
            setOutput(result.output || "(No output from program)");
            setAiFeedback("✅ Code executed successfully.");
         } else if (result.status === "timeout") {
            setOutput(`Error: Timeout\n${result.error}`);
            setAiFeedback("⏱️ Execution timed out.");
         } else {
            setOutput(`Error:\n${result.error}`);
            setAiFeedback("❌ Execution error occurred.");
         }
      } catch (e) {
         console.warn("Backend execution failed, falling back to offline mode.");
         // Fallback to offline executor
         try {
            const offlineResult = await offlineExecutor.execute(code, language);
            if (offlineResult.status === "success") {
               setOutput(`[Offline Mode Output]\n${offlineResult.output || "(No output)"}`);
               setAiFeedback("✅ Executed in browser fallback.");
            } else {
               setOutput(`[Offline Error]\n${offlineResult.error}`);
               setAiFeedback("❌ Browser execution error.");
            }
         } catch (offlineErr: any) {
            setAiFeedback(`### ❌ Connection Error\n\nBackend is unreachable and offline fallback failed: ${offlineErr.message}`);
         }
      } finally {
         setIsExecuting(false);
      }
   };

   const handleSubmit = async () => {
      setIsAnalyzing(true);
      try {
         const result = await submissionService.analyzeCode(code, language, id || "0");
         setAiFeedback(`### Score: ${result.score}/100\n\n${result.feedback}\n\n${result.detailed_reviews.map((r: any) => `**Line ${r.line}**: ${r.comment}`).join('\n')}`);
      } catch (e) {
         setAiFeedback("Error analyzing code.");
      } finally {
         setIsAnalyzing(false);
      }
   };

   const handleExplain = async () => {
      setIsAnalyzing(true);
      try {
         const result = await submissionService.explainCode(code, language, undefined, selectedModel);
         setAiFeedback(result.explanation);
         setIsChatOpen(true);
      } catch (e) {
         setAiFeedback("Error explaining code.");
      } finally {
         setIsAnalyzing(false);
      }
   };

   const handleComplexity = async () => {
      setIsAnalyzing(true);
      try {
         const result = await submissionService.analyzeComplexity(code, language);
         setAiFeedback(`### Complexity Analysis\n\n**Time Complexity**: ${result.time_complexity}\n**Space Complexity**: ${result.space_complexity}\n\n**Reasoning**: ${result.explanation}`);
      } catch (e) {
         setAiFeedback("Error analyzing complexity.");
      } finally {
         setIsAnalyzing(false);
      }
   };

   const handlePredictEdgeCases = async () => {
      setIsAnalyzing(true);
      try {
         const result = await submissionService.predictEdgeCases(code, language, id || "0");
         setAiFeedback(`### Predicted Edge Cases\n\n${result.cases.map((c: any) => `- **Input**: \`${c.input}\` \n  **Reason**: ${c.reason}`).join('\n')}`);
      } catch (e) {
         setAiFeedback("Error predicting edge cases.");
      } finally {
         setIsAnalyzing(false);
      }
   };


   if (isLoading) {
      return (
         <div className="h-screen flex items-center justify-center bg-white text-foreground">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mr-3" />
            <p>Loading problem...</p>
         </div>
      );
   }

   if (!problem) {
      return (
         <div className="h-screen flex flex-col items-center justify-center bg-white text-foreground">
            <h2 className="text-xl font-bold mb-4">Problem not found</h2>
            <Button onClick={() => navigate(-1)}>Go Back</Button>
         </div>
      );
   }

   const isSchoolOrEasy =
      problem.difficulty?.toLowerCase() === "easy" ||
      problem.module?.toLowerCase() === "school";

   return (
      <div className="flex flex-col gap-4 p-4 pb-24 bg-white min-h-screen">
         <div className="flex gap-4">
            {/* ── Left + Center grid ── */}
            <div className={`flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 transition-all duration-300 ${isChatOpen ? "w-[calc(100%-320px)]" : "w-full"}`}>

               {/* ── LEFT PANEL: Problem description (LeetCode style) ── */}
               <div className={`lg:col-span-1 flex flex-col ${isChatOpen ? "hidden xl:flex" : "flex"}`}>
                  <Card className="flex-1 overflow-auto border border-zinc-200 bg-zinc-50/50 shadow-sm">
                     {/* Header */}
                     <div className="p-5 border-b border-zinc-200">
                        <div className="flex items-center gap-2 mb-3">
                           <button
                              onClick={() => navigate(-1)}
                              className="text-black hover:text-black transition-colors"
                           >
                              <ChevronLeft size={18} />
                           </button>
                           <h1 className="text-xl font-black text-black">{problem.title}</h1>
                        </div>

                     </div>

                     {/* Body */}
                     <div className="p-5 bg-white">
                        {/* Description rendered line-by-line */}
                        <div className="text-sm leading-7 mb-4 space-y-1">
                           {problem.description?.split("\n").map((line: string, i: number) => {
                              if (/^Example\s*\d+/i.test(line.trim())) {
                                 return <p key={i} className="font-bold mt-4 mb-1 text-black">{line.trim()}</p>;
                              }
                              if (/^(Input|Output|Explanation)\s*:/i.test(line.trim())) {
                                 const ci = line.indexOf(":");
                                 const lbl = line.slice(0, ci).trim();
                                 const val = line.slice(ci + 1);
                                 return (
                                    <div key={i} className="font-mono text-sm rounded-lg px-4 py-1.5 border border-zinc-200 bg-zinc-50">
                                       <span className="font-bold text-black">{lbl}:</span>
                                       <span className="ml-1 text-green-700">{val}</span>
                                    </div>
                                 );
                              }
                              if (!line.trim()) return <br key={i} />;
                              return <p key={i} className="text-sm leading-relaxed text-black">{line}</p>;
                           })}
                        </div>

                        {/* Fill-in-the-blank for school/easy */}
                        {isSchoolOrEasy && <FillTheBlank problem={problem} />}
                     </div>
                  </Card>
               </div>

               {/* ── RIGHT: Code Editor + Feedback ── */}
               <div className={`${isChatOpen ? "lg:col-span-3 xl:col-span-2" : "lg:col-span-2"} flex flex-col gap-4`}>
                  {/* Code Editor */}
                  <div className="min-h-[400px] h-[400px] relative rounded-xl overflow-hidden border border-zinc-200 shadow-xl bg-white">
                     <Editor
                        height="100%"
                        language={language}
                        value={code}
                        theme="light"
                        onChange={(value) => setCode(value || "")}
                        options={{
                           minimap: { enabled: false },
                           fontSize: 14,
                           scrollBeyondLastLine: false,
                           lineNumbers: "on",
                           glyphMargin: false,
                           folding: true,
                           lineDecorationsWidth: 0,
                           lineNumbersMinChars: 3,
                           fontFamily: "JetBrains Mono, Fira Code, monospace",
                           automaticLayout: true,
                           padding: { top: 16, bottom: 16 },
                        }}
                     />
                     {suggestions.length > 0 && (
                        <div className="absolute bottom-4 right-4 bg-white/95 border border-primary/20 rounded-xl p-3 shadow-lg z-10 max-w-xs animate-in fade-in slide-in-from-bottom-2">
                           <div className="flex items-center justify-between gap-2 mb-2 text-primary text-[10px] font-bold uppercase tracking-tighter">
                              <div className="flex items-center gap-2 font-black">
                                 <Zap size={14} fill="currentColor" /> AI Pair Programmer
                              </div>
                              {isTyping && <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />}
                           </div>
                           <div className="space-y-1.5">
                              {suggestions.map((s: string, i: number) => (
                                 <div
                                    key={i}
                                    className="text-[11px] text-black bg-zinc-50 p-2 rounded-lg cursor-pointer hover:bg-primary/10 hover:text-primary transition-all border border-transparent hover:border-primary/20"
                                    onClick={() => setCode(code + (code.endsWith("\n") ? "" : "\n") + s)}
                                 >
                                    {s}
                                 </div>
                              ))}
                           </div>
                        </div>
                     )}
                  </div>

                  {/* Terminal Output Area */}
                  {output && (
                     <div className="min-h-[150px] max-h-[250px] bg-white border-t border-zinc-200 p-4 font-mono text-xs overflow-auto animate-in slide-in-from-bottom-4 shadow-inner relative group">
                        <div className="flex justify-between items-center mb-3 border-b border-zinc-100 pb-2">
                           <div className="flex items-center gap-2">
                              <Terminal size={12} className="text-primary" />
                              <span className="text-primary font-bold uppercase tracking-widest text-[10px]">Output Terminal</span>
                           </div>
                           <button
                              className="text-black hover:text-black transition-colors"
                              onClick={() => setOutput(null)}
                           >
                              <X size={14} />
                           </button>
                        </div>
                        <pre className="text-black leading-relaxed font-['JetBrains_Mono'] whitespace-pre-wrap">{output}</pre>
                        <div className="absolute top-4 right-12 opacity-0 group-hover:opacity-100 transition-opacity">
                           <span className="text-[9px] text-black bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-100 uppercase tracking-tighter">Compiled locally</span>
                        </div>
                     </div>
                  )}

                  {/* Feedback Panel */}
                  <div className="min-h-[200px] flex-1 rounded-xl overflow-y-auto border border-zinc-200 bg-zinc-50/30">
                     <FeedbackPanel feedback={aiFeedback} isLoading={isAnalyzing || isExecuting} />
                  </div>
               </div>
            </div>

            {/* ── AI Chat Sidebar ── */}
            {isChatOpen && (
               <div className="w-80 min-h-[600px] border-l border-zinc-200 flex flex-col bg-white animate-in slide-in-from-right-full duration-300">
                  <AIChat
                     onClose={() => setIsChatOpen(false)}
                     selectedModel={selectedModel}
                     code={code}
                     language={language}
                     problemContext={`Problem: ${problem.title}\nDescription: ${problem.description}\nCurrent Code:\n${code}`}
                  />
               </div>
            )}
         </div>

         {/* ── Bottom Action Bar ── */}
         <div className="flex justify-between items-center w-full px-6 py-4 border-t border-zinc-200 bg-zinc-50/80 backdrop-blur-md shrink-0 rounded-b-2xl">
            <div className="flex gap-2">
               <Button
                  variant={isChatOpen ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setIsChatOpen(!isChatOpen)}
                  className={isChatOpen ? "bg-primary text-black" : "h-9 text-xs text-black hover:text-black"}
               >
                  <img src="/artificial-intelligence.png" alt="AI" className="mr-2 h-4 w-4" /> Code Reviewer
               </Button>
               <Button variant="ghost" size="sm" onClick={handleExplain} disabled={isAnalyzing} className="h-9 text-xs text-black hover:text-black">
                  <HelpCircle className="mr-2 h-4 w-4" /> Explain
               </Button>
               <Button variant="ghost" size="sm" onClick={handleComplexity} disabled={isAnalyzing} className="h-9 text-xs text-black hover:text-black">
                  <img src="/career-path.png" alt="Complexity" className="mr-2 h-4 w-4" /> Complexity
               </Button>
               <Button variant="ghost" size="sm" onClick={handlePredictEdgeCases} disabled={isAnalyzing} className="h-9 text-xs text-black hover:text-black">
                  <img src="/chaos.png" alt="Edge Cases" className="mr-2 h-4 w-4" /> Edge Cases
               </Button>
               <div className="border-l border-zinc-200 h-6 mx-1" />
            </div>
            <div className="flex gap-3 items-center">
               <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-zinc-100 border border-zinc-200 rounded-lg h-9 text-[10px] font-bold px-2 text-black outline-none focus:border-primary/50 transition-all uppercase tracking-tighter"
               >
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                  <option value="javascript">JavaScript</option>
               </select>
               <div className="border-l border-zinc-200 h-6 mx-1" />
               <Button variant="outline" size="sm" onClick={handleRun} disabled={isAnalyzing} className="h-9 text-xs gap-2 border-zinc-200 text-black hover:bg-zinc-50">
                  <Play size={13} /> Run Code
               </Button>
               <Button size="sm" onClick={handleSubmit} disabled={isAnalyzing} className="h-9 text-xs gap-2 bg-primary">
                  <Send size={13} /> Submit
               </Button>
               <div className="border-l border-zinc-200 h-6 mx-1" />
            </div>
         </div>
      </div>
   );
}
