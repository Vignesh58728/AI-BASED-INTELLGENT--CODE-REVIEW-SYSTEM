import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import {
   ChevronLeft, Play, RefreshCw, Maximize2,
   Settings, ChevronDown, Check, Loader2, XCircle,
   X, Info, Moon, Sun, Trash2, Smartphone, CheckCircle,
   Sparkles, Terminal as TerminalIcon,
   ArrowUp, ChevronRight, Settings2,
   Send
} from 'lucide-react';
import { submissionService, type ChatMessage } from '../../services/submissionService';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// ── Models & Constants ────────────────────────────────────────────────────────
type Language = 'python' | 'java' | 'javascript' | 'cpp' | 'csharp' | 'html' | 'css';

interface Example {
   id: string;
   name: string;
   lang: Language;
   code: string;
}

const EXAMPLES: Example[] = [
   {
      id: 'py-hello',
      name: 'Hello World',
      lang: 'python',
      code: `# Python Hello World\ndef greet(name: str):\n    return f"Hello, {name}! 🐍"\n\nprint(greet("World"))`
   },
   {
      id: 'js-hello',
      name: 'Hello World',
      lang: 'javascript',
      code: `const value = "Hello World!";\nconsole.log(value);`
   },
   {
      id: 'java-hello',
      name: 'Hello Java',
      lang: 'java',
      code: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, Java! ☕");\n    }\n}`
   },
   {
      id: 'cpp-hello',
      name: 'Hello C++',
      lang: 'cpp',
      code: `#include <iostream>\n\nint main() {\n    std::cout << "Hello, C++! 🚀" << std::endl;\n    return 0;\n}`
   },
   {
      id: 'csharp-hello',
      name: 'Hello C#',
      lang: 'csharp',
      code: `using System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello, C#! ✨");\n    }\n}`
   },
   {
      id: 'html-hello',
      name: 'Hello HTML',
      lang: 'html',
      code: `<!DOCTYPE html>\n<html>\n<head>\n    <style>body { font-family: sans-serif; }</style>\n</head>\n<body>\n    <h1>Hello World</h1>\n    <p>This is a live preview.</p>\n</body>\n</html>`
   },
   {
      id: 'css-hello',
      name: 'Hello CSS',
      lang: 'css',
      code: `/* CSS Example */\nbody {\n    background: #f0f2f5;\n    padding: 2rem;\n}\n.card {\n    background: white;\n    border-radius: 8px;\n    box-shadow: 0 4px 12px rgba(0,0,0,0.1);\n}`
   }
];

// ── Component ─────────────────────────────────────────────────────────────────
export function AIPracticePage() {
   const navigate = useNavigate();
   const location = useLocation();

   // Code state
   const [lang, setLang] = useState<Language>((location.state?.language as Language) || 'python');
   const [code, setCode] = useState(location.state?.code || EXAMPLES[0].code);

   // Execution state
   const [running, setRunning] = useState(false);
   const [result, setResult] = useState<{ out: string; err: string } | null>(null);
   const [ran, setRan] = useState(false);

   // UI state
   const [showExamples, setShowExamples] = useState(false);
   const [showLangMenu, setShowLangMenu] = useState(false);
   const [autoReload, setAutoReload] = useState(true);
   const [previewMode, setPreviewMode] = useState(false);
   const [isMaximized, setIsMaximized] = useState(false);
   const [version, setVersion] = useState('latest stable (0.55.1)');
   const [showVersionMenu, setShowVersionMenu] = useState(false);

   // AI state
   const [isExplaining, setIsExplaining] = useState(false);
   const [explanation, setExplanation] = useState('');
   const [cursorLine, setCursorLine] = useState(1);
   const [aiInput, setAiInput] = useState('');
   const [selectedModel, setSelectedModel] = useState('gpt-4o');
   const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
   const [showModelMenu, setShowModelMenu] = useState(false);
   const [isTamil, setIsTamil] = useState(false);

   // Auto-reload logic
   useEffect(() => {
      if (!autoReload || !code.trim()) return;

      const timer = setTimeout(() => {
         handleRun();
      }, 1500);

      return () => clearTimeout(timer);
   }, [code, lang, autoReload]);

   // Load Example
   const loadExample = (ex: Example) => {
      setLang(ex.lang);
      setCode(ex.code);
      setShowExamples(false);
      setResult(null);
      setRan(false);
   };

   // Execute Code
   const handleRun = async () => {
      setRunning(true); setRan(true); setResult(null);
      if (lang === 'html' || lang === 'css') {
         setPreviewMode(true);
         setRunning(false);
         return;
      }
      try {
         const res = await submissionService.executeCode(code, lang);
         setResult({ out: res.output ?? '', err: res.error ?? '' });
      } catch (e: any) {
         setResult({ out: '', err: e.message || 'Error' });
      } finally {
         setRunning(false);
      }
   };

   const handleReset = () => {
      const defaultEx = EXAMPLES.find(e => e.lang === lang) || EXAMPLES[0];
      setCode(defaultEx.code);
      setResult(null);
      setRan(false);
   };

   // Line-by-line explain logic
   useEffect(() => {
      if (!code.trim()) return;

      const timer = setTimeout(async () => {
         setIsExplaining(true);
         try {
            const res = await submissionService.explainCode(code, lang, cursorLine, selectedModel, isTamil ? 'tamil' : 'english');
            // Find explanation for current line if possible, or just general for now
            setExplanation(res.explanation);
         } catch (e) {
            setExplanation("Failed to get line insight.");
         } finally {
            setIsExplaining(false);
         }
      }, 1000);

      return () => clearTimeout(timer);
   }, [cursorLine, code, lang]);

   const handleEditorDidMount = (editor: any) => {
      editor.onDidChangeCursorPosition((e: any) => {
         setCursorLine(e.position.lineNumber);
      });
   };

   const handleSendMessage = async () => {
      if (!aiInput.trim()) return;

      const userMsg: ChatMessage = { role: 'user', content: aiInput };
      const newHistory = [...chatHistory, userMsg];
      setChatHistory(newHistory);
      setAiInput('');
      setIsExplaining(true);

      try {
         const res = await submissionService.getChatResponse(aiInput, {
            model: selectedModel,
            history: chatHistory,
            languageHint: isTamil ? 'tamil' : 'english',
            fileContext: `Language: ${lang}\nCode Context:\n${code}\nLine ${cursorLine} is active.`
         });
         setChatHistory([...newHistory, { role: 'assistant', content: res.answer }]);
         setExplanation(res.answer); // Keep explanation in sync with latest answer
      } catch (e) {
         setExplanation("Failed to get AI response.");
      } finally {
         setIsExplaining(false);
      }
   };

   return (
      <div className="h-screen bg-white text-slate-800 font-['Inter',sans-serif] flex flex-col overflow-hidden">
         <style dangerouslySetInnerHTML={{ __html: `
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap');
            
            .markdown-content {
               font-family: 'Outfit', sans-serif;
            }
            .markdown-content h1, .markdown-content h2, .markdown-content h3 {
               font-family: 'Outfit', sans-serif;
               font-weight: 700;
               margin-top: 1rem;
               margin-bottom: 0.5rem;
               color: #000;
            }
            .markdown-content p {
               margin-bottom: 0.75rem;
               line-height: 1.6;
            }
            .markdown-content ul, .markdown-content ol {
               margin-bottom: 0.75rem;
               padding-left: 1.25rem;
            }
            .markdown-content li {
               margin-bottom: 0.25rem;
            }
            .markdown-content code {
               background-color: #f3f4f6;
               padding: 0.1rem 0.3rem;
               border-radius: 0.25rem;
               font-family: monospace;
               font-size: 0.9em;
               color: #ef4444;
            }
         ` }} />
         {/* ── Main Workspace ────────────────────────────────────────────────── */}
         <div className="flex-1 flex overflow-hidden p-1 gap-1 bg-white">

            {/* ── Left Pane: Editor & Console ── */}
            <div className="flex-[2] flex flex-col min-w-0 gap-1">
               {/* Editor Section */}
               <div className="flex-1 flex flex-col bg-white border border-zinc-100 shadow-sm relative focus-within:ring-1 focus-within:ring-black/5 overflow-hidden">
                  <div className="h-[35px] bg-white border-b border-[#eee] flex items-center px-3 justify-between shrink-0">
                     <div className="flex items-center gap-6">
                        <button onClick={() => navigate(-1)} className="text-[#333] hover:text-[#007fd4]" title="Back">
                           <ChevronLeft size={18} />
                        </button>

                        <div className="relative">
                           <button onClick={() => setShowLangMenu(!showLangMenu)} className="text-[13px] font-bold text-slate-700 hover:text-[#007fd4] bg-slate-50 px-2 py-0.5 rounded cursor-pointer font-['Outfit'] tracking-tight">
                              {lang === 'cpp' ? 'C++' : lang.toUpperCase()}
                           </button>
                           {showLangMenu && (
                              <div className="absolute top-full left-0 mt-1 w-32 bg-white border border-[#ccc] shadow-lg z-50 py-1">
                                 {['python', 'java', 'cpp', 'javascript', 'csharp', 'html', 'css'].map(l => (
                                    <button key={l} onClick={() => { const ex = EXAMPLES.find(e => e.lang === l); if (ex) loadExample(ex); else setLang(l as any); setShowLangMenu(false); }} className="w-full text-left px-4 py-1 text-[12px] hover:bg-[#f3f3f3] font-medium">
                                       {l === 'cpp' ? 'C++' : l === 'csharp' ? 'C#' : l.toUpperCase()}
                                    </button>
                                 ))}
                              </div>
                           )}
                        </div>
                     </div>

                     <div className="flex items-center gap-4">
                        <button onClick={handleReset} title="Reset Code" className="text-slate-400 hover:text-[#007fd4] transition-colors p-1.5 rounded-full hover:bg-slate-100 flex items-center justify-center">
                           <RefreshCw size={14} />
                        </button>

                        <label className="flex items-center gap-1.5 cursor-pointer group">
                           <input
                              type="checkbox"
                              checked={autoReload}
                              onChange={(e) => setAutoReload(e.target.checked)}
                              className="w-3.5 h-3.5 border-[#ccc] rounded text-[#007fd4] focus:ring-0"
                           />
                           <span className="text-[11px] text-[#666] group-hover:text-[#007fd4] font-medium uppercase tracking-tight">Auto-Run</span>
                        </label>

                        <button onClick={handleRun} disabled={running} className="flex items-center gap-1.5 px-3 py-1 bg-[#007fd4] text-white rounded text-[12px] font-bold hover:bg-[#0062a3] transition-colors disabled:opacity-50 font-['Outfit'] tracking-tight">
                           {running ? <Loader2 size={14} className="animate-spin" /> : <Play size={10} fill="currentColor" />}
                           Run
                        </button>
                     </div>
                  </div>

                  <div className="flex-1 overflow-hidden">
                     <Editor
                        key={lang}
                        height="100%"
                        language={lang}
                        value={code}
                        onMount={handleEditorDidMount}
                        theme="vs"
                        onChange={(v) => setCode(v ?? '')}
                        options={{ minimap: { enabled: false }, fontSize: 14, fontFamily: "'JetBrains Mono', monospace", automaticLayout: true, scrollbar: { vertical: 'visible', horizontal: 'visible' }, lineNumbers: 'on', roundedSelection: false, scrollBeyondLastLine: false, readOnly: false, cursorStyle: 'line' }}
                     />
                  </div>
               </div>

               {/* Console/Output Section (Separate) */}
               <div className="h-[200px] bg-white border border-zinc-100 shadow-sm flex flex-col">
                  <div className="h-[30px] bg-[#f8f9fa] border-b border-[#eee] flex items-center px-4 justify-between">
                     <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-['Outfit']">Console Output</span>
                     <button onClick={() => setResult(null)} className="text-[#999] hover:text-red-500"><X size={14} /></button>
                  </div>
                  <div className="flex-1 overflow-auto p-4 font-mono text-[13px] bg-white">
                     {result ? (
                        <div className="whitespace-pre-wrap leading-relaxed">
                           {result.err ? <div className="text-red-600">{result.err}</div> : <div className="text-slate-800">{result.out || "> Success"}</div>}
                        </div>
                     ) : (
                        <div className="text-slate-300 italic">// execution output will appear here...</div>
                     )}
                  </div>
               </div>
            </div>

            {/* ── Right Pane: Mind Arc ── */}
            <div className="flex-1 min-w-[350px] bg-white border border-zinc-100 shadow-sm flex flex-col">
               <div className="h-[40px] px-4 border-b border-[#eee] flex items-center justify-between bg-white shrink-0">
                  <div className="flex items-center gap-2">
                     <span className="text-[14px] font-bold text-slate-800 font-['Outfit'] uppercase tracking-wider">MIND ARC</span>
                  </div>
               </div>

               <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-white">
                  {/* Line Specific Insight (Pinned if no history) */}
                  {chatHistory.length === 0 && (
                     <div className="space-y-4">
                        <div className="flex items-center justify-between pb-1 mb-2">
                           <span className="text-[11px] font-bold text-slate-900 font-['Outfit'] uppercase tracking-widest">
                              Line {cursorLine} Explanation
                           </span>
                        </div>
                        <div className="text-[13px] text-slate-700 leading-relaxed bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                           {isExplaining ? (
                              <div className="flex items-center gap-2 animate-pulse text-indigo-400 italic">
                                 <Loader2 size={14} className="animate-spin" /> Analyzing code...
                              </div>
                           ) : (
                                <div className="markdown-content text-slate-700 font-['Outfit']">
                                   <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                      {(explanation || "Click on any line to get instant AI explanation.").replace(/^\s*#+\s*/gm, '')}
                                   </ReactMarkdown>
                                </div>
                           )}
                        </div>
                     </div>
                  )}

                  {/* Chat History */}
                  <div className="space-y-4">
                     {chatHistory.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                           <div className={`max-w-[90%] p-3 rounded-2xl text-[13px] leading-relaxed ${msg.role === 'user' ? 'bg-violet-600 text-white rounded-tr-none' : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none shadow-sm'}`}>
                                <div className="markdown-content font-['Outfit']">
                                   <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                      {msg.content.replace(/^\s*#+\s*/gm, '')}
                                   </ReactMarkdown>
                                </div>
                           </div>
                        </div>
                     ))}
                     {isExplaining && chatHistory.length > 0 && (
                        <div className="flex justify-start">
                           <div className="bg-white border border-[#eee] p-3 rounded-2xl rounded-tl-none shadow-sm">
                              <Loader2 size={16} className="animate-spin text-indigo-400" />
                           </div>
                        </div>
                     )}
                  </div>
               </div>

               <div className="p-4 border-t border-[#eee] bg-white">
                  <div className="relative flex items-center bg-white border border-slate-200 rounded-full px-4 py-1.5 shadow-sm hover:border-violet-300 transition-colors group">
                     <textarea
                        rows={1}
                        placeholder="Ask about this code..."
                        className="flex-1 bg-transparent border-none py-1.5 text-[13px] focus:outline-none resize-none font-['Inter'] text-slate-700 placeholder:text-slate-400"
                        value={aiInput}
                        onChange={(e) => setAiInput(e.target.value)}
                        onKeyDown={(e) => {
                           if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                           }
                        }}
                     />
                     <div className="flex items-center ml-2 shrink-0">
                        <button
                           onClick={handleSendMessage}
                           disabled={isExplaining || !aiInput.trim()}
                           className="flex items-center justify-center w-8 h-8 bg-violet-600 text-white rounded-full hover:bg-violet-700 transition-all font-['Outfit'] font-bold shadow-md shadow-violet-200 disabled:opacity-50 disabled:shadow-none"
                        >
                           <Send size={14} />
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
