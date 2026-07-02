import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import {
   ChevronLeft, Play, Maximize2,
   Settings, ChevronDown, Check, Loader2, XCircle,
   X, Info, Moon, Sun, Trash2, Smartphone, CheckCircle,
   Sparkles, Terminal as TerminalIcon,
   ArrowUp, ChevronRight, Settings2,
   Send, Share2, Zap, User as UserIcon
} from 'lucide-react';
import { submissionService, type ChatMessage } from '../../services/submissionService';
import { useAuth } from '../../context/AuthContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// ── Models & Constants ────────────────────────────────────────────────────────
type Language = 'python' | 'java' | 'javascript' | 'typescript' | 'cpp' | 'c' | 'csharp' | 'html' | 'css' | 'kotlin' | 'sql' | 'r';

// ── Language Sidebar Config ────────────────────────────────────────────────────
interface LangIcon {
   lang: Language;
   label: string;
   icon: string; // devicon class
   color: string;
}

const LANG_ICONS: LangIcon[] = [
   { lang: 'python',     label: 'Python',     icon: 'devicon-python-plain',     color: '#3572a5' },
   { lang: 'r',          label: 'R',          icon: 'devicon-r-plain',          color: '#276dc3' },
   { lang: 'sql',        label: 'SQL',        icon: 'devicon-mysql-plain',      color: '#e38d13' },
   { lang: 'html',       label: 'HTML',       icon: 'devicon-html5-plain',      color: '#e34c26' },
   { lang: 'java',       label: 'Java',       icon: 'devicon-java-plain',       color: '#b07219' },
   { lang: 'kotlin',     label: 'Kotlin',     icon: 'devicon-kotlin-plain',     color: '#7F52FF' },
   { lang: 'c',          label: 'C',          icon: 'devicon-c-plain',          color: '#555555' },
   { lang: 'cpp',        label: 'C++',        icon: 'devicon-cplusplus-plain',  color: '#f34b7d' },
   { lang: 'csharp',     label: 'C#',        icon: 'devicon-csharp-plain',     color: '#178600' },
   { lang: 'javascript', label: 'JS',         icon: 'devicon-javascript-plain', color: '#f1e05a' },
   { lang: 'typescript', label: 'TS',         icon: 'devicon-typescript-plain', color: '#3178c6' },
];

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
   },
   {
      id: 'ts-hello',
      name: 'Hello TypeScript',
      lang: 'typescript',
      code: `// TypeScript Hello World\nfunction greet(name: string): string {\n    return \`Hello, \${name}! 🔷\`;\n}\n\nconsole.log(greet("World"));`
   },
   {
      id: 'kotlin-hello',
      name: 'Hello Kotlin',
      lang: 'kotlin',
      code: `fun main() {\n    println("Hello, Kotlin! 🎯")\n}`
   },
   {
      id: 'r-hello',
      name: 'Hello R',
      lang: 'r',
      code: `# R Hello World\ngreet <- function(name) {\n    cat("Hello,", name, "!\\n")\n}\ngreet("World")`
   },
   {
      id: 'sql-hello',
      name: 'Hello SQL',
      lang: 'sql',
      code: `-- SQL Example\nSELECT \n    'Hello, World!' AS greeting,\n    NOW() AS current_time;`
   }
];

// ── Component ─────────────────────────────────────────────────────────────────
export function AIPracticePage() {
   const { user } = useAuth();
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
   const [showShareModal, setShowShareModal] = useState(false);
   const [shareCopied, setShareCopied] = useState(false);
   const [isDarkMode, setIsDarkMode] = useState(false);



   // Load Example
   const loadExample = (ex: Example) => {
      setLang(ex.lang);
      setCode(ex.code);
      setShowExamples(false);
      setResult(null);
      setRan(false);
   };

   const handleCopyLink = () => {
      const url = `https://mindarc.platform/online-compiler/${Math.random().toString(36).substring(7)}`;
      navigator.clipboard.writeText(url);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
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
            setExplanation("Failed to get Mind Arc explanation.");
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
      <div className={`h-screen font-['Inter',sans-serif] flex flex-col overflow-hidden transition-all duration-300 ${isDarkMode ? 'bg-[#0d1117] text-[#c9d1d9]' : 'bg-white text-slate-800'}`}>
         <style dangerouslySetInnerHTML={{ __html: `
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&family=Baskervville:ital@0;1&display=swap');
            
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
               font-family: 'Fira Code', monospace;
               font-size: 0.9em;
               color: #ef4444;
               font-weight: 500;
               background: transparent;
            }
            .markdown-content pre {
               background-color: transparent;
               border: 1px solid #f4f4f5;
               border-radius: 1rem;
               padding: 1rem;
               margin: 1rem 0;
            }
         ` }} />
         {/* DevIcons CDN */}
         <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/devicon.min.css" />

         {/* ── Main Workspace ────────────────────────────────────────────────── */}
         <div className={`flex-1 flex overflow-hidden p-1 gap-1 transition-colors duration-300 ${isDarkMode ? 'bg-[#0d1117]' : 'bg-white'}`}>

            {/* ── Language Icon Sidebar ── */}
            <div className={`w-[52px] shrink-0 flex flex-col items-center py-2 gap-1 border shadow-sm overflow-y-auto transition-colors duration-300 ${isDarkMode ? 'bg-[#010409] border-[#30363d]' : 'bg-[#f8f9fa] border-zinc-100'}`}>
               {LANG_ICONS.map(({ lang: l, label, icon, color }) => (
                  <button
                     key={l}
                     title={label}
                     onClick={() => {
                        const ex = EXAMPLES.find(e => e.lang === l);
                        if (ex) { setLang(l); setCode(ex.code); setResult(null); setRan(false); }
                        else { setLang(l); setResult(null); setRan(false); }
                     }}
                     className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-200 group relative ${
                        lang === l
                           ? 'bg-white shadow-md ring-2 ring-[#007fd4]/30'
                           : 'hover:bg-white hover:shadow'
                     }`}
                  >
                     <i
                        className={`${icon} text-[22px]`}
                        style={{ color: lang === l ? color : '#999' }}
                     />
                     {/* Tooltip */}
                     <span className="absolute left-full ml-2 px-2 py-0.5 bg-slate-800 text-white text-[10px] font-bold rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                        {label}
                     </span>
                  </button>
               ))}
            </div>

            {/* ── Left Pane: Editor & Console ── */}
            <div className="flex-[2] flex flex-col min-w-0 gap-1">
               {/* Editor Section */}
               <div className={`flex-1 flex flex-col border shadow-sm relative focus-within:ring-1 overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-[#161b22] border-[#30363d] focus-within:ring-indigo-500/30' : 'bg-white border-zinc-100 focus-within:ring-black/5'}`}>
                  <div className="h-[35px] bg-white border-b border-[#eee] flex items-center px-3 justify-between shrink-0">
                     <div className="flex items-center gap-6">

                     </div>



                     <div className="flex items-center gap-2">
                        {/* Maximize Icon */}
                        <button className="p-1 px-1.5 border border-[#ccc] rounded text-[#666] hover:bg-slate-50 transition-colors">
                           <Maximize2 size={16} />
                        </button>

                        {/* Theme icon */}
                        <button 
                           onClick={() => setIsDarkMode(!isDarkMode)}
                           className={`p-1 px-1.5 border rounded transition-colors ${isDarkMode ? 'border-[#30363d] text-amber-400 hover:bg-[#21262d]' : 'border-[#ccc] text-[#666] hover:bg-slate-50'}`}
                        >
                           {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                        </button>

                        {/* Share Button */}
                        <button 
                           onClick={() => setShowShareModal(true)}
                           className="flex items-center gap-1.5 px-3 py-1 border border-[#ccc] rounded text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                           <Share2 size={14} />
                           <span className="text-[12px] font-bold font-['Outfit']">Share</span>
                        </button>

                        {/* Run Button */}
                        <button onClick={handleRun} disabled={running} className="flex items-center gap-1.5 px-5 py-1 bg-[#0052FF] text-white rounded text-[12px] font-bold hover:bg-[#0042cc] transition-colors disabled:opacity-50 font-['Outfit'] tracking-normal ml-1">
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
                        theme={isDarkMode ? 'vs-dark' : 'vs'}
                        onChange={(v) => setCode(v ?? '')}
                        options={{ minimap: { enabled: false }, fontSize: 14, fontFamily: "'JetBrains Mono', monospace", automaticLayout: true, scrollbar: { vertical: 'visible', horizontal: 'visible' }, lineNumbers: 'on', roundedSelection: false, scrollBeyondLastLine: false, readOnly: false, cursorStyle: 'line' }}
                     />
                  </div>
               </div>

               {/* Console/Output Section (Separate) */}
               <div className="h-[200px] bg-white border border-zinc-100 shadow-sm flex flex-col">
                  <div className={`h-[35px] border-b flex items-center px-4 justify-between sticky top-0 z-10 transition-colors duration-300 ${isDarkMode ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-[#eee]'}`}>
                     <span className={`text-[14px] font-bold font-['Outfit'] ${isDarkMode ? 'text-[#c9d1d9]' : 'text-[#1A1A3F]/80'}`}>Output</span>
                     <button 
                        onClick={() => setResult(null)} 
                        className="px-3 py-1 border border-[#ccc] rounded text-[#1A1A3F]/70 text-[12px] font-bold font-['Outfit'] hover:bg-slate-50 transition-colors"
                     >
                        Clear
                     </button>
                  </div>
                  <div className={`flex-1 overflow-auto p-4 font-mono text-[13px] transition-colors duration-300 ${isDarkMode ? 'bg-[#0d1117]' : 'bg-white'}`}>
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
            <div className={`flex-1 min-w-[350px] border shadow-sm flex flex-col transition-colors duration-300 ${isDarkMode ? 'bg-[#0d1117] border-[#30363d]' : 'bg-white border-zinc-100'}`}>
               <div className={`h-[40px] px-4 border-b flex items-center justify-between shrink-0 transition-colors duration-300 ${isDarkMode ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-[#eee]'}`}>
                  <div className="flex items-center gap-2">
                     <span className={`text-[16px] font-medium font-['Baskervville',serif] tracking-normal ${isDarkMode ? 'text-[#c9d1d9]' : 'text-slate-800'}`}>AI Based Code Review System</span>
                  </div>
               </div>

               <div className={`flex-1 overflow-y-auto p-5 space-y-6 transition-colors duration-300 ${isDarkMode ? 'bg-[#0d1117]' : 'bg-white'}`}>
                  {/* Line Specific Insight (Pinned if no history) */}
                  {chatHistory.length === 0 && (
                     <div className="space-y-4">
                        <div className="flex items-center justify-between pb-1 mb-2">
                           <span className="text-[11px] font-bold text-slate-900 font-['Outfit'] uppercase tracking-widest">
                              Line {cursorLine} Explanation
                           </span>
                        </div>
                        <div className={`text-[14px] leading-relaxed py-4 transition-colors duration-300 ${isDarkMode ? 'text-[#c9d1d9]' : 'text-slate-700'}`}>
                           {isExplaining ? (
                              <div className="flex items-center gap-2 animate-pulse text-indigo-400 italic font-medium">
                                 <Loader2 size={14} className="animate-spin" /> Analyzing code...
                              </div>
                           ) : (
                                <div className="markdown-content text-slate-700 font-['Outfit']">
                                   <div className="flex items-center gap-2 mb-3">
                                    
                                 </div>
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
                        <div key={i} className={`flex items-start gap-4 py-6 ${i !== chatHistory.length - 1 ? 'border-b border-zinc-100/50' : ''} ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                           {msg.role === 'assistant' && (
                              <div className="flex-1 max-w-[85%]">
                                 <div className="markdown-content text-slate-800 font-['Outfit'] text-[15px]">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                       {msg.content.replace(/^\s*#+\s*/gm, '')}
                                    </ReactMarkdown>
                                 </div>
                              </div>
                           )}
                           {msg.role === 'user' && (
                              <>
                                 <div className="max-w-[85%] bg-indigo-600 text-white px-5 py-3 rounded-2xl rounded-tr-none">
                                    <div className="markdown-content text-white font-['Outfit'] text-[15px]">
                                       <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                          {msg.content.replace(/^\s*#+\s*/gm, '')}
                                       </ReactMarkdown>
                                    </div>
                                 </div>
                                 <div className="w-8 h-8 rounded-full bg-zinc-100 overflow-hidden flex items-center justify-center shrink-0 mt-1 border border-zinc-200 text-[10px] font-bold text-slate-600">
                                    {user?.photo ? (
                                       <img src={user.photo} alt={user?.name || 'User'} className="w-full h-full object-cover" />
                                    ) : (
                                       <UserIcon size={16} className="text-zinc-500" />
                                    )}
                                 </div>
                              </>
                           )}
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

               <div className={`p-4 border-t transition-colors duration-300 ${isDarkMode ? 'bg-[#0d1117] border-[#30363d]' : 'bg-white border-[#eee]'}`}>
                  <div className={`relative flex items-center border rounded-full px-4 py-1.5 shadow-sm transition-colors group ${isDarkMode ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-slate-200 hover:border-indigo-300'}`}>
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

         {/* ── Share Modal ────────────────────────────────────────────────── */}
         {showShareModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
               <div 
                  className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                  onClick={() => setShowShareModal(false)}
               />
               <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 pt-10 animate-in fade-in zoom-in duration-200">
                  <button 
                     onClick={() => setShowShareModal(false)}
                     className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 transition-colors"
                  >
                     <X size={24} strokeWidth={2.5} />
                  </button>

                  <h2 className="text-3xl font-black text-[#1A1A3E] font-['Outfit'] mb-8">Share your code</h2>

                  <div className="space-y-6">
                     <div className="relative group">
                        <input 
                           type="text" 
                           readOnly 
                           value={`https://mindarc.platform/online-compiler/${Math.random().toString(36).substring(7)}`}
                           className="w-full bg-[#f8faff] border border-[#e2e8f0] rounded-xl px-5 py-4 text-[14px] text-slate-600 font-medium focus:outline-none"
                        />
                     </div>

                     <button 
                        onClick={handleCopyLink}
                        className="w-full h-[54px] bg-[#0052FF] text-white rounded-xl text-[16px] font-bold hover:bg-[#0042cc] transition-all transform active:scale-[0.98] shadow-lg shadow-blue-200"
                     >
                        {shareCopied ? 'Link Copied!' : 'Copy Link'}
                     </button>

                     <div className="flex flex-col items-center gap-6 pt-2">
                        <span className="text-[14px] font-bold text-[#1A1A3E]/60 font-['Outfit'] uppercase tracking-widest">or share using</span>
                        
                        <div className="flex items-center gap-4">
                           {[
                              { icon: 'devicon-twitter-original', color: '#1da1f2' },
                              { icon: 'devicon-reddit-plain', color: '#ff4500' },
                              { icon: 'devicon-linkedin-plain', color: '#0077b5' },
                              { icon: 'devicon-whatsapp-plain', color: '#25d366' },
                              { icon: 'devicon-facebook-plain', color: '#1877f2' }
                           ].map((plat, idx) => (
                              <button 
                                 key={idx}
                                 className="w-[46px] h-[46px] flex items-center justify-center border-2 border-[#0052FF]/20 rounded-full text-[#0052FF] hover:bg-[#0052FF] hover:text-white transition-all transform hover:scale-110"
                              >
                                 <i className={`${plat.icon} text-xl`} />
                              </button>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
}
