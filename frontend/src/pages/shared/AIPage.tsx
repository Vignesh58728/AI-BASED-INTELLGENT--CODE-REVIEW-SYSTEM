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
   BookOpen,
   Play,
   Presentation,
   FileSpreadsheet,
   FileArchive,
   File
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { submissionService } from '@/services/submissionService';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import pptxgen from 'pptxgenjs';
import { Search } from 'lucide-react';
import VoiceLoader from '@/components/ui/VoiceLoader';
import { notificationService } from '@/services/notificationService';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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

   const handleQuickAction = (text: string) => {
      setSearchValue(text);
      setIsActionMenuOpen(false);
      // Optional: Auto-send if you want it to be immediate
      // setTimeout(() => handleSend(), 100); 
   };

   const actionItems = [
      { icon: <img src="/ppt.png" className="w-5 h-5 object-contain" />, label: "Create PPT", subtitle: "Generate presentation", color: "text-orange-500", onClick: () => handleQuickAction("Create PPT presentation about ") },
      { icon: <img src="/sheets.png" className="w-5 h-5 object-contain" />, label: "Create Excel", subtitle: "Export research data", color: "text-green-500", onClick: () => handleQuickAction("Create Excel spreadsheet") },
      { icon: <img src="/pdf.png" className="w-5 h-5 object-contain" />, label: "Create PDF", subtitle: "Export to study document", color: "text-red-500", onClick: () => handleQuickAction("Create PDF report") },
      { icon: <img src="/newbie.png" className="w-5 h-5 object-contain" />, label: "Analyze", subtitle: "Deep code & architectural review", color: "text-blue-500", onClick: () => handleQuickAction("Analyze this code: ") },
      { icon: <Paperclip size={18} />, label: "Attach", subtitle: "Upload code, PDF or documents", color: "text-zinc-500", onClick: () => { fileInputRef.current?.click(); setIsActionMenuOpen(false); } },
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

   const handleExportPDF = async (elementId: string = 'chat-messages-container') => {
      const element = document.getElementById(elementId);
      if (!element) return;

      const canvas = await html2canvas(element, { backgroundColor: '#FFFFFF' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`AIVISO-Edu-${Date.now()}.pdf`);
      notificationService.triggerDownloadEvent(`Export PDF`);
   };

   const handleExportExcel = (specificMsg?: Message, customTitle?: string) => {
      const data = specificMsg ? [{ Role: specificMsg.role, Content: specificMsg.content, Time: new Date().toLocaleTimeString() }] : messages.map(m => ({
         Role: m.role,
         Content: m.content,
         Time: new Date().toLocaleTimeString()
      }));
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "ChatHistory");
      const fileName = customTitle ? `AIVISO-${customTitle.replace(/\s+/g, '-')}-${Date.now()}.xlsx` : `AIVISO-Data-${Date.now()}.xlsx`;
      XLSX.writeFile(wb, fileName);
      notificationService.triggerDownloadEvent(`Export Excel`);
   };

   const handleExportWord = (content?: string, customTitle?: string) => {
      const contentToExport = content || messages.map(m => `${m.role.toUpperCase()}:\n${m.content}\n\n`).join('');
      const blob = new Blob(['\ufeff', contentToExport], {
         type: 'application/msword'
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const fileName = customTitle ? `AIVISO-${customTitle.replace(/\s+/g, '-')}-${Date.now()}.doc` : `AIVISO-Doc-${Date.now()}.doc`;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);
      notificationService.triggerDownloadEvent(`Chat Export Word`);
   };

   const handleExportPPT = (specificMsg?: Message, userTopic?: string) => {
      const pres = new pptxgen();
      const topic = userTopic || "Educational Research";
      const primaryColor = "3B82F6"; // AIVISO Blue
      const secondaryColor = "000000";
      
      // 1. Premium Title Slide
      let titleSlide = pres.addSlide();
      // Add background accent shape
      titleSlide.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: "30%", h: "100%", fill: { color: primaryColor } });
      
      titleSlide.addText("AIVISO", { 
         x: 0.5, y: 0.5, w: 2, h: 0.5, 
         fontSize: 24, bold: true, color: "FFFFFF", fontFace: "Poppins"
      });

      titleSlide.addText(topic, { 
         x: "35%", y: "35%", w: "60%", h: 1.5, 
         align: "left", fontSize: 42, bold: true, color: secondaryColor, fontFace: "Poppins"
      });

      titleSlide.addText("Comprehensive Intelligence Report & Presentation", { 
         x: "35%", y: "55%", w: "60%", h: 0.5, 
         align: "left", fontSize: 16, color: "666666", fontFace: "Poppins"
      });

      titleSlide.addShape(pres.ShapeType.line, { x: "35%", y: "65%", w: "20%", h: 0, line: { color: primaryColor, width: 3 } });

      titleSlide.addText(`Generated on ${new Date().toLocaleDateString()}`, { 
         x: "35%", y: "85%", w: "60%", h: 0.4, 
         align: "left", fontSize: 12, color: "999999", fontFace: "Poppins"
      });

      // 2. Content Structure Logic
      const content = specificMsg ? specificMsg.content : messages.map(m => m.content).join("\n\n");
      
      // Filter out code blocks for clean slides if necessary, or put them in specific slides
      const sections = content.split(/\n### |\n## |\n# |\n\n\n/);

      sections.forEach((section, idx) => {
         const lines = section.trim().split('\n');
         if (lines.length < 1 || section.trim().length < 20) return;

         const sectionTitle = lines[0].replace(/#+|\*+/g, '').trim();
         const sectionBody = lines.slice(1).join('\n').trim();

         // Add a Slide
         let slide = pres.addSlide();
         
         // Slide Header
         slide.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: "100%", h: 0.8, fill: { color: "F8FAFC" } });
         slide.addText(sectionTitle || topic, { 
            x: 0.5, y: 0.2, w: 8, h: 0.4, 
            fontSize: 22, bold: true, color: primaryColor, fontFace: "Poppins"
         });

         // Slide Footer
         slide.addText(`Mind Arc Intelligence | ${topic}`, { 
            x: 0.5, y: 5.2, w: 5, h: 0.3, 
            fontSize: 10, color: "cbd5e1", fontFace: "Poppins"
         });
         slide.addText(`${idx + 1}`, { 
            x: 9, y: 5.2, w: 0.5, h: 0.3, 
            align: "right", fontSize: 10, color: "cbd5e1", fontFace: "Poppins"
         });

         // Content Layout
         if (sectionBody.includes('```')) {
            // Code Slide Layout
            const code = sectionBody.match(/```(?:[\w]*\n)?([\s\S]*?)```/)?.[1] || sectionBody;
            slide.addShape(pres.ShapeType.rect, { x: 0.5, y: 1, w: 9, h: 4, fill: { color: "1E1E1E" }, line: { color: primaryColor, width: 1 } });
            slide.addText(code.slice(0, 1000), { 
               x: 0.7, y: 1.2, w: 8.6, h: 3.6, 
               fontSize: 10, color: "CCCCCC", fontFace: "Courier New", valign: "top"
            });
         } else {
            // Standard Bullet Layout
            const bullets = sectionBody.split('\n')
               .filter(l => l.trim().length > 0)
               .map(l => ({ text: l.replace(/^[*-]\s+/, '').trim(), options: { bullet: true, indentLevel: l.startsWith('  ') ? 1 : 0 } }));

            slide.addText(bullets.length > 0 ? bullets : sectionBody.slice(0, 1200), { 
               x: 0.5, y: 1.2, w: 9, h: 3.8, 
               fontSize: 14, color: "334155", valign: "top", fontFace: "Poppins",
               lineSpacing: 24
            });
         }
      });

      const fileName = `PPT-${topic.replace(/\s+/g, '-')}-${Date.now()}.pptx`;
      pres.writeFile({ fileName });
      notificationService.triggerDownloadEvent(`Export Premium PPT`);
   };

   const handleSend = async () => {
      if (!searchValue.trim() || isLoading || isGeneratingImage) return;

      const userQuery = searchValue.trim();
      const lowerQuery = userQuery.toLowerCase();

      // Smart Command Detection
      const pptKeywords = ['create ppt', 'make ppt', 'generate presentation', 'ppt format', 'powerpoint'];
      const excelKeywords = ['create excel', 'make excel', 'generate spreadsheet', 'xlsx format', 'excel report'];
      const pdfKeywords = ['create pdf', 'make pdf', 'generate document', 'pdf format'];
      const wordKeywords = ['create word', 'make word', 'generate doc', 'word format'];

      if (pptKeywords.some(kw => lowerQuery.includes(kw))) {
         const topic = userQuery.replace(/create ppt|make ppt|generate presentation|ppt format|powerpoint/gi, '').trim() || "Research Analysis";
         handleExportPPT(undefined, topic);
         setSearchValue("");
         return;
      }
      if (excelKeywords.some(kw => lowerQuery.includes(kw))) {
         const topic = userQuery.replace(/create excel|make excel|generate spreadsheet|xlsx format|excel report/gi, '').trim() || "Research Data";
         handleExportExcel(undefined, topic);
         setSearchValue("");
         return;
      }
      if (pdfKeywords.some(kw => lowerQuery.includes(kw))) {
         handleExportPDF();
         setSearchValue("");
         return;
      }
      if (wordKeywords.some(kw => lowerQuery.includes(kw))) {
         const topic = userQuery.replace(/create word|make word|generate doc|word format/gi, '').trim() || "AIVISO Research";
         handleExportWord(undefined, topic);
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

      const sendWithRetry = async (retryCount = 0): Promise<any> => {
         try {
            return await submissionService.getChatResponse(userQuery, {
               model: selectedModel,
               history: priorHistory,
               fileContext: attachedFileContent || undefined,
               languageHint,
            });
         } catch (err: any) {
            console.warn(`Attempt ${retryCount + 1} failed:`, err);
            // Retry once if it's a timeout or network error (no response)
            if (retryCount < 1 && (err.code === 'ECONNABORTED' || !err.response)) {
               console.log("Retrying AI connection...");
               // Briefly wait before retry
               await new Promise(resolve => setTimeout(resolve, 1000));
               return sendWithRetry(retryCount + 1);
            }
            throw err;
         }
      };

      try {
         const response = await sendWithRetry();
         const assistantMessage: Message = { role: 'assistant', content: response.answer, sources: response.sources };

         if (isVoiceSession) {
            speakMessage(response.answer);
            setIsVoiceSession(false);
         }

         // Update messages UI
         setMessages(prev => [...prev, assistantMessage]);

         // Save history asynchronously (now safely outside the state updater)
         const updatedMessagesForHistory = [...messages, { role: 'user' as const, content: userQuery }, assistantMessage];
         submissionService.saveChatHistory(updatedMessagesForHistory.map(m => ({ role: m.role, content: m.content })));

      } catch (error: any) {
         console.error("AI Core Error:", error);
         let errorMsg = "Error: Could not reach the AI core. Please check if the backend is running and your internet connection.";

         if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
            errorMsg = "Error: AI core connection timed out. The response is taking longer than expected. Please try again.";
         } else if (!error.response) {
            errorMsg = "Error: Backend server is unreachable. Please ensure the backend is running on port 5001.";
         }

         setMessages(prev => [...prev, {
            role: 'assistant',
            content: errorMsg
         }]);
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
      <div className="flex h-screen bg-white text-black overflow-hidden selection:bg-black/20 selection:text-black relative font-['Poppins']">
         {/* Premium subtle gradient for depth */}
         <div className="absolute inset-0 z-0 bg-radial-gradient from-black/[0.03] to-transparent pointer-events-none" />
         
         <AnimatePresence>
            {(isVoiceReplaying || isListening) && (
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[200] flex items-center justify-center bg-white/90 backdrop-blur-md"
               >
                  <VoiceLoader label={isListening ? "LISTENING..." : "Speaking..."} />
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
                     className="absolute bottom-20 text-black hover:text-primary text-xs font-bold transition-all uppercase tracking-widest"
                  >
                     {isListening ? "Stop Listening" : "Stop Speaking"}
                  </button>
               </motion.div>
            )}
         </AnimatePresence>


         {/* Sidebar - Ultra Minimalist White */}
         <aside className="w-16 lg:w-[72px] flex flex-col items-center py-6 border-r border-zinc-100 z-50 bg-white">
            <div className="mb-10 cursor-pointer group" onClick={() => navigate('/explore')}>
               <div className="w-10 h-10 flex items-center justify-center">
                  <img
                     src="/artificial-intelligence.png"
                     alt="AI"
                     className="w-10 h-10 object-contain"
                  />
               </div>
            </div>

            <nav className="flex flex-col gap-8 items-center flex-1 w-full px-2">
               <button
                  onClick={handleNewChat}
                  className="w-10 h-10 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-black hover:text-black hover:bg-white hover:border-black/50 transition-all duration-300 group relative mb-2"
               >
                  <Plus size={20} />
                  <div className="absolute left-full ml-4 px-3 py-1.5 bg-white border-2 border-black rounded-lg text-[10px] uppercase tracking-widest font-bold opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100 pointer-events-none whitespace-nowrap z-[100] shadow-xl text-black">
                     New Chat
                  </div>
               </button>

               {sidebarItems.map((item, idx) => (
                  <button
                     key={idx}
                     onClick={() => navigate(item.path)}
                     className="text-black hover:text-black transition-all duration-300 group relative"
                  >
                     {item.icon}
                     <div className="absolute left-full ml-4 px-3 py-1.5 bg-white border-2 border-black rounded-lg text-[10px] uppercase tracking-widest font-bold opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100 pointer-events-none whitespace-nowrap z-[100] shadow-xl text-black">
                        {item.label}
                     </div>
                  </button>
               ))}

               <button 
                  onClick={() => navigate('/settings')}
                  className="text-black hover:text-black transition-all duration-300 group relative mt-auto mb-4"
               >
                  <Settings2 size={20} />
                  <div className="absolute left-full ml-4 px-3 py-1.5 bg-white border-2 border-black rounded-lg text-[10px] uppercase tracking-widest font-bold opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100 pointer-events-none whitespace-nowrap z-[100] shadow-xl text-black">
                     Settings
                  </div>
               </button>
            </nav>

            <div className="relative mt-auto pt-6 border-t border-zinc-200 w-full flex flex-col items-center gap-6">
               <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="w-9 h-9 rounded-full bg-zinc-100 border border-zinc-200 overflow-hidden hover:border-black transition-colors focus:ring-2 focus:ring-primary/20"
               >
                  <div className="w-full h-full flex items-center justify-center text-xs font-bold text-black">
                     {user?.name?.charAt(0) || "U"}
                  </div>
               </button>
               <AnimatePresence>
                  {isProfileOpen && (
                     <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="absolute bottom-0 left-full ml-4 w-48 bg-white border-2 border-black rounded-2xl shadow-2xl p-2 z-[100]"
                     >
                        <div className="px-3 py-2 border-b border-zinc-100 mb-1">
                           <p className="text-[11px] font-bold text-black truncate">{user?.name}</p>
                           <p className="text-[9px] text-black truncate">{user?.email}</p>
                        </div>
                        <button onClick={() => navigate('/profile')} className="w-full text-left px-3 py-2 hover:bg-zinc-50 rounded-lg text-xs flex items-center gap-2 transition-colors text-black">
                           <UserIcon size={14} /> Profile
                        </button>
                        <button onClick={() => { logout(); navigate('/login'); }} className="w-full text-left px-3 py-2 hover:bg-red-50 rounded-lg text-xs text-red-500 flex items-center gap-2 transition-colors">
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
                        className="flex-1 flex flex-col items-center justify-center p-6 text-center"
                     >
                         <motion.div
                             initial={{ scale: 0.8, opacity: 0 }}
                             animate={{ scale: 1, opacity: 1 }}
                             className="mb-12 relative z-10"
                          >
                             <h1 className="text-xl md:text-3xl lg:text-6xl font-black tracking-[-0.02em] text-black select-none font-['Syncopate'] uppercase drop-shadow-sm leading-tight max-w-4xl">
                                 MIND <br/>
                                 <span className="text-zinc-400">ARC</span>
                             </h1>
                          </motion.div>

                          {/* Dynamic Greeting */}
                          <motion.div 
                             initial={{ opacity: 0, y: 10 }}
                             animate={{ opacity: 1, y: 0 }}
                             transition={{ delay: 0.2 }}
                             className="mb-10 text-center"
                          >
                             <h2 className="text-3xl font-light text-zinc-800">
                                Good to see you, <span className="font-bold">{user?.name?.split(' ')[0]}</span>.
                             </h2>
                          </motion.div>
                        {/* Centered Minimal Input */}
                        <div className="w-full max-w-2xl group flex flex-col gap-8 relative z-20">
                           <div className="relative transform-gpu bg-white border-2 border-black shadow-none p-4 rounded-[32px] transition-all duration-500 focus-within:border-black focus-within:shadow-xl ring-2 ring-transparent focus-within:ring-black/5">
                              <textarea
                                 placeholder={isListening ? "LISTENING..." : "ASK MIND ARC ANYTHING..."}
                                 value={searchValue}
                                 onChange={(e) => setSearchValue(e.target.value)}
                                 onKeyDown={handleKeyDown}
                                 className="w-full bg-transparent border-none outline-none resize-none text-lg leading-relaxed text-black placeholder-zinc-500 min-h-[44px] p-2"
                              />
                              <div className="flex items-center justify-between mt-4">
                                 <div className="flex items-center gap-2">
                                    <div className="relative">
                                       <button
                                          onClick={() => setIsActionMenuOpen(!isActionMenuOpen)}
                                          className={`p-2.5 transition-all rounded-2xl border border-transparent ${isActionMenuOpen ? 'bg-zinc-100 text-black' : 'text-black hover:bg-zinc-50'}`}
                                          title="More Actions"
                                       >
                                          <Plus size={20} className={`transition-transform duration-300 ${isActionMenuOpen ? 'rotate-45' : ''}`} />
                                       </button>

                                       <AnimatePresence>
                                          {isActionMenuOpen && (
                                             <>
                                                <div className="fixed inset-0 z-40" onClick={() => setIsActionMenuOpen(false)} />
                                                <motion.div
                                                   initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                                   animate={{ opacity: 1, scale: 1, y: 0 }}
                                                   exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                                   className="absolute bottom-full mb-4 left-0 w-72 bg-white border border-black rounded-3xl shadow-[0_-30px_60px_rgba(0,0,0,0.12)] overflow-hidden z-50 p-2 text-left"
                                                >
                                                   {actionItems.map((item, idx) => (
                                                      <button
                                                         key={idx}
                                                         onClick={item.onClick}
                                                         className="w-full flex items-start gap-4 p-3.5 rounded-2xl hover:bg-zinc-50 transition-all group"
                                                      >
                                                          <div className={`mt-0.5 p-2 rounded-xl bg-zinc-50 ${item.color} group-hover:scale-110 transition-transform duration-300`}>
                                                             {item.icon}
                                                          </div>
                                                          <div className="flex-1">
                                                             <p className="text-sm font-bold text-black font-['Poppins']">{item.label}</p>
                                                             <p className="text-[10px] text-zinc-400 font-medium font-['Poppins'] leading-tight">{item.subtitle}</p>
                                                          </div>
                                                      </button>
                                                   ))}
                                                </motion.div>
                                             </>
                                          )}
                                       </AnimatePresence>
                                    </div>
                                    <button
                                       onClick={toggleVoice}
                                       className={`p-2.5 rounded-2xl transition-all border ${isListening ? 'bg-black/20 border-black/40 text-black shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 'text-black hover:text-black border-transparent hover:bg-zinc-50'}`}
                                       title="Voice Input"
                                    >
                                       <Mic size={20} />
                                    </button>
                                 </div>
                                 <div className="flex items-center gap-3">
                                    <div className="relative">
                                       <button
                                           onClick={() => setIsModelOpen(!isModelOpen)}
                                           className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-zinc-50 border-none text-black text-sm font-bold hover:bg-zinc-100 transition-all active:scale-95"
                                        >
                                            <div className="w-3.5 h-3.5 flex items-center justify-center">
                                              {selectedModel.toLowerCase().includes('gemini') || selectedModel.toLowerCase().includes('gemma') ? (
                                                 <img src="/google.png" alt="Google" className="w-full h-full object-contain" />
                                              ) : selectedModel.toLowerCase().includes('gpt') ? (
                                                 <img src="/chat-gpt-v2.png" alt="ChatGPT" className="w-full h-full object-contain" />
                                              ) : (
                                                 <img src="/meta.png" alt="Meta" className="w-full h-full object-contain" />
                                              )}
                                           </div>
                                            <span className="uppercase tracking-widest text-[10px]">{selectedModel}</span>
                                            <ChevronDown size={14} className={`transition-transform duration-300 ${isModelOpen ? 'rotate-180' : ''}`} />
                                        </button>
                                       <AnimatePresence>
                                          {isModelOpen && (
                                             <>
                                                <div className="fixed inset-0 z-40" onClick={() => setIsModelOpen(false)} />
                                                <motion.div
                                                   initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                                   animate={{ opacity: 1, scale: 1, y: 0 }}
                                                   exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                                   className="absolute bottom-full mb-4 right-0 w-64 bg-white border-2 border-black rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden z-50 p-1.5 text-left"
                                                >
                                                   <div className="p-3 border-b border-zinc-50 mb-1">
                                                      <div className="relative">
                                                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
                                                          <input 
                                                             type="text" 
                                                             placeholder="Search models..."
                                                             value={modelSearch}
                                                             onChange={(e) => setModelSearch(e.target.value)}
                                                             className="w-full bg-zinc-50 border border-zinc-100 rounded-xl py-2 pl-9 pr-3 text-xs text-black placeholder-zinc-500 outline-none focus:border-zinc-200 transition-all"
                                                          />
                                                      </div>
                                                   </div>
                                                   <div className="max-h-60 overflow-y-auto custom-scrollbar">
                                                       {models.filter(m => m.toLowerCase().includes(modelSearch.toLowerCase())).map((model) => (
                                                          <button
                                                             key={model}
                                                             onClick={() => {
                                                                setSelectedModel(model);
                                                                setIsModelOpen(false);
                                                             }}
                                                             className={`w-full flex items-center justify-between p-3 rounded-xl transition-all group ${selectedModel === model ? 'bg-zinc-50 text-black' : 'hover:bg-zinc-50 text-zinc-600 hover:text-black'}`}
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
                                                             {selectedModel === model && <Check size={14} className="text-black" />}
                                                          </button>
                                                       ))}
                                                   </div>
                                                </motion.div>
                                              </>
                                          )}
                                       </AnimatePresence>
                                    </div>
                                    <button
                                       onClick={handleSend}
                                       disabled={isLoading}
                                       className="w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-500 bg-black text-white shadow-xl rotate-0"
                                    >
                                       <ArrowUp size={22} strokeWidth={3} />
                                    </button>
                                 </div>
                              </div>
                              {attachedFileName && (
                                 <div className="mt-4 px-4 py-2 flex items-center gap-2 text-[11px] text-black bg-zinc-50 border border-zinc-100 w-fit rounded-full pr-4">
                                    <div className="w-6 h-6 rounded-full bg-black/10 flex items-center justify-center">
                                       <FileText size={12} className="text-black" />
                                    </div>
                                    <span className="truncate max-w-[150px] font-medium">{attachedFileName}</span>
                                    <button onClick={clearAttachedFile} className="ml-1 text-zinc-400 hover:text-red-500 transition-colors">
                                       <X size={14} />
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
                                 id={`msg-${i}`}
                                 initial={{ opacity: 0, y: 10 }}
                                 animate={{ opacity: 1, y: 0 }}
                                 className={`flex gap-6 ${msg.role === 'assistant' ? 'bg-white p-8 rounded-[32px] border-2 border-black shadow-sm' : 'px-8 py-2'}`}
                              >
                                 <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1">
                                    {msg.role === 'user' ? (
                                       <div className="w-full h-full rounded-full bg-zinc-100 flex items-center justify-center text-[10px] font-bold text-black">U</div>
                                    ) : (
                                       <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                                          <img
                                             src="/artificial-intelligence.png"
                                             alt="Assistant"
                                             className="w-4 h-4 brightness-0 invert"
                                          />
                                       </div>
                                    )}
                                 </div>
                                 <div className="flex-1 space-y-4">
                                    <div className="text-[15px] leading-relaxed text-black font-['Outfit'] markdown-content">
                                       <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                          {msg.content.replace(/^\s*#+\s*/gm, '')}
                                       </ReactMarkdown>
                                    </div>

                                    {msg.role === 'assistant' && (
                                       <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-zinc-50">
                                          {msg.content.includes('```') && (
                                             <>
                                                <button
                                                   onClick={() => {
                                                      const code = msg.content.match(/```(?:[\w]*\n)?([\s\S]*?)```/)?.[1] || msg.content;
                                                      setPreviewCode(code);
                                                      setIsPreviewOpen(true);
                                                   }}
                                                   className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-zinc-50 text-black rounded-xl border-2 border-black shadow-sm transition-all text-xs font-bold w-fit"
                                                >
                                                   <Wand2 size={14} /> Live Preview
                                                </button>
                                                <button
                                                   onClick={() => {
                                                      const match = msg.content.match(/```([\w]*)\n/);
                                                      const lang = match ? match[1] : 'python';
                                                      const code = msg.content.match(/```(?:[\w]*\n)?([\s\S]*?)```/)?.[1] || msg.content;
                                                      navigate('/ai/practice', { state: { code, language: lang } });
                                                   }}
                                                   className="flex items-center gap-2 px-4 py-2 bg-black text-white hover:bg-black/90 rounded-xl border-2 border-black transition-all text-xs font-bold w-fit"
                                                >
                                                   <Play size={14} fill="currentColor" /> Compile & Run
                                                </button>
                                             </>
                                          )}
                                          
                                          {/* Education Export Buttons per message */}
                                          <div className="flex items-center gap-1.5 ml-auto">
                                             <button
                                                onClick={() => handleExportPDF(`msg-${i}`)}
                                                className="p-1.5 hover:bg-zinc-50 rounded-lg transition-colors border border-transparent hover:border-zinc-100"
                                                title="Export message as PDF"
                                             >
                                                <img src="/pdf.png" className="w-4 h-4 object-contain" />
                                             </button>
                                             <button
                                                onClick={() => handleExportPPT(msg)}
                                                className="p-1.5 hover:bg-zinc-50 rounded-lg transition-colors border border-transparent hover:border-zinc-100"
                                                title="Generate PPT for this topic"
                                             >
                                                <img src="/ppt.png" className="w-4 h-4 object-contain" />
                                             </button>
                                             <button
                                                onClick={() => handleExportExcel(msg)}
                                                className="p-1.5 hover:bg-zinc-50 rounded-lg transition-colors border border-transparent hover:border-zinc-100"
                                                title="Export to Excel"
                                             >
                                                <img src="/sheets.png" className="w-4 h-4 object-contain" />
                                             </button>
                                             <button
                                                onClick={() => handleExportWord(msg.content)}
                                                className="p-1.5 hover:bg-zinc-50 rounded-lg transition-colors border border-transparent hover:border-zinc-100 text-blue-500"
                                                title="Export to Word"
                                             >
                                                <FileArchive size={16} />
                                             </button>
                                          </div>
                                       </div>
                                    )}


                                    {msg.type === 'image' && msg.imageUrl && (
                                       <div className="relative group/image max-w-lg mt-4">
                                          <div className="rounded-2xl overflow-hidden border-2 border-black bg-white shadow-2xl relative min-h-[300px] flex items-center justify-center">
                                             <div className="image-loader absolute inset-0 flex items-center justify-center bg-white z-20">
                                                <Loader2 size={24} className="text-black animate-spin" />
                                             </div>
                                             <div className="image-error hidden absolute inset-0 flex flex-col items-center justify-center bg-white z-30 p-4 text-center">
                                                <X size={32} className="text-red-500 mb-2" />
                                                <p className="text-xs text-black font-bold uppercase tracking-tight">Failed to generate image. Please try a different prompt.</p>
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
                                          <p className="text-[10px] uppercase tracking-wider text-black font-bold">Sources</p>
                                          {msg.sources.map((source, idx) => (
                                             <a
                                                key={`${source.url}-${idx}`}
                                                href={source.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-[11px] text-black/90 hover:text-black flex items-center gap-1 truncate"
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
                              <div className="flex gap-6 bg-white border-2 border-black p-8 rounded-[32px] shadow-sm">
                                 <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center text-black animate-pulse">
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
                           <div className={`w-full max-w-3xl pointer-events-auto bg-white border-2 border-black shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[32px] p-3 flex flex-col transition-all duration-500 focus-within:shadow-[0_20px_60px_rgba(0,0,0,0.15)]`}>
                              <textarea
                                 rows={1}
                                 placeholder={isListening ? "LISTENING..." : "ASK MIND ARC ANYTHING..."}
                                 value={searchValue}
                                 onChange={(e) => setSearchValue(e.target.value)}
                                 onKeyDown={handleKeyDown}
                                 className="w-full bg-transparent border-none outline-none resize-none text-base text-black placeholder-zinc-400 px-3 py-3 min-h-[52px] leading-relaxed"
                              />

                              <div className="flex items-center justify-between px-1 pb-1">
                                 <div className="flex items-center gap-1">
                                    <div className="relative">
                                       <button
                                          onClick={() => setIsActionMenuOpen(!isActionMenuOpen)}
                                          className={`p-2.5 transition-all rounded-xl ${isActionMenuOpen ? 'bg-zinc-100 text-black' : 'text-black hover:bg-zinc-100'}`}
                                          title="More Actions"
                                       >
                                          <Plus size={19} className={`transition-transform duration-300 ${isActionMenuOpen ? 'rotate-45' : ''}`} />
                                       </button>

                                       <AnimatePresence>
                                          {isActionMenuOpen && (
                                             <>
                                                <div className="fixed inset-0 z-40" onClick={() => setIsActionMenuOpen(false)} />
                                                <motion.div
                                                   initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                                   animate={{ opacity: 1, scale: 1, y: 0 }}
                                                   exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                                   className="absolute bottom-full mb-4 left-0 w-72 bg-white border-2 border-black rounded-3xl shadow-[0_-30px_60px_rgba(0,0,0,0.1)] overflow-hidden z-50 p-2 text-left"
                                                >
                                                   {actionItems.map((item, idx) => (
                                                      <button
                                                         key={idx}
                                                         onClick={item.onClick}
                                                         className="w-full flex items-start gap-4 p-3.5 rounded-2xl hover:bg-zinc-50 transition-all group"
                                                      >
                                                         <div className={`mt-0.5 p-2 rounded-xl bg-zinc-50 ${item.color} group-hover:scale-110 transition-transform duration-300`}>
                                                            {item.icon}
                                                         </div>
                                                         <div className="flex-1">
                                                            <p className="text-sm font-bold text-black font-['Poppins']">{item.label}</p>
                                                            <p className="text-[10px] text-zinc-400 font-medium font-['Poppins'] leading-tight">{item.subtitle}</p>
                                                         </div>
                                                      </button>
                                                   ))}
                                                </motion.div>
                                             </>
                                          )}
                                       </AnimatePresence>
                                    </div>
                                    <button
                                       onClick={toggleVoice}
                                       className={`p-2.5 rounded-xl transition-all ${isListening ? 'text-black bg-black/10' : 'text-black hover:text-black hover:bg-zinc-100'}`}
                                       title="Voice Input"
                                    >
                                       <Mic size={19} />
                                    </button>
                                    <button
                                       onClick={handleLiveVoiceClick}
                                       className="p-2.5 text-black hover:text-black transition-all hover:bg-zinc-100 rounded-xl"
                                       title="Read Last Message"
                                    >
                                       <AudioLines size={19} />
                                    </button>
                                 </div>

                                 <div className="flex items-center gap-3">
                                    <div className="relative">
                                       <button
                                          onClick={() => setIsModelOpen(!isModelOpen)}
                                          className="flex items-center gap-2 px-4 py-2 rounded-2xl border-2 border-black bg-white text-black hover:bg-zinc-50 transition-all text-[10px] font-bold uppercase tracking-widest font-['Poppins']"
                                       >
                                          <div className="w-3.5 h-3.5 flex items-center justify-center">
                                             {selectedModel.toLowerCase().includes('gemini') || selectedModel.toLowerCase().includes('gemma') ? (
                                                <img src="/google.png" alt="Google" className="w-full h-full object-contain" />
                                             ) : selectedModel.toLowerCase().includes('gpt') ? (
                                                <img src="/chat-gpt-v2.png" alt="ChatGPT" className="w-full h-full object-contain" />
                                             ) : (
                                                <img src="/meta.png" alt="Meta" className="w-full h-full object-contain" />
                                             )}
                                          </div>
                                          {selectedModel}
                                          <ChevronDown size={14} className={`opacity-40 transition-transform ${isModelOpen ? 'rotate-180' : ''}`} />
                                       </button>

                                       <AnimatePresence>
                                          {isModelOpen && (
                                             <>
                                                <div className="fixed inset-0 z-40" onClick={() => setIsModelOpen(false)} />
                                                <motion.div
                                                   initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                                   animate={{ opacity: 1, scale: 1, y: 0 }}
                                                   exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                                   className="absolute bottom-full mb-4 right-0 w-64 bg-white border-2 border-black rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden z-50 p-1.5 text-left"
                                                >
                                                   <div className="px-3 py-2 border-b border-zinc-50 mb-1">
                                                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-['Poppins']"></span>
                                                   </div>
                                                   {models.map((model) => (
                                                      <button
                                                         key={model}
                                                         onClick={() => {
                                                            setSelectedModel(model);
                                                            setIsModelOpen(false);
                                                         }}
                                                         className={`w-full flex items-center justify-between p-3 rounded-xl transition-all group ${selectedModel === model ? 'bg-zinc-50 text-black' : 'hover:bg-zinc-50 text-zinc-600 hover:text-black'}`}
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
                                                         {selectedModel === model && <Check size={14} className="text-black" />}
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
                                       className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-500 ${searchValue.trim() ? 'bg-black text-white shadow-xl' : 'bg-black/20 text-black scale-90'}`}
                                    >
                                       {isGeneratingImage || isLoading ? <Loader2 size={20} className="animate-spin" /> : <ArrowUp size={22} strokeWidth={2.5} />}
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
                     className="bg-white border-2 border-black w-full max-w-6xl h-[85vh] rounded-[40px] overflow-hidden flex flex-col relative shadow-2xl"
                     onClick={(e) => e.stopPropagation()}
                  >
                     <div className="h-16 border-b border-white/5 px-8 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-4">
                           <div className="flex gap-1.5">
                              <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                              <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                              <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                           </div>
                           <h3 className="text-sm font-bold text-black">UI Design Preview</h3>
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
                              className="p-2 text-black hover:text-white transition-colors"
                              title="Download HTML"
                           >
                              <Download size={20} />
                           </button>
                           <button
                              onClick={() => setIsPreviewOpen(false)}
                              className="w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center text-black hover:text-white transition-all"
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




         <style dangerouslySetInnerHTML={{
            __html: `
            @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
            @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');

            .no-scrollbar::-webkit-scrollbar { display: none; }
            .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

            .markdown-content {
               font-family: 'Outfit', sans-serif;
            }
            .markdown-content h1, .markdown-content h2, .markdown-content h3 {
               font-family: 'Outfit', sans-serif;
               font-weight: 700;
               margin-top: 1.5rem;
               margin-bottom: 0.75rem;
               color: #000;
               letter-spacing: -0.02em;
            }
            .markdown-content h1 { font-size: 1.5rem; }
            .markdown-content h2 { font-size: 1.25rem; }
            .markdown-content h3 { font-size: 1.125rem; }
            .markdown-content p {
               margin-bottom: 1rem;
               line-height: 1.7;
               color: #374151;
            }
            .markdown-content strong {
               font-weight: 600;
               color: #000;
            }
            .markdown-content ul, .markdown-content ol {
               margin-bottom: 1rem;
               padding-left: 1.5rem;
            }
            .markdown-content li {
               margin-bottom: 0.5rem;
            }
            .markdown-content code {
               background-color: #f3f4f6;
               padding: 0.2rem 0.4rem;
               border-radius: 0.375rem;
               font-family: 'Fira Code', monospace;
               font-size: 0.875em;
               color: #ef4444;
            }
            .markdown-content pre {
               background-color: #f9fafb;
               border: 1px border #e5e7eb;
               padding: 1rem;
               border-radius: 1rem;
               overflow-x: auto;
               margin-bottom: 1rem;
            }
            .markdown-content pre code {
               background-color: transparent;
               padding: 0;
               color: inherit;
               font-size: 0.9rem;
            }
            .markdown-content blockquote {
               border-left: 4px solid #000;
               padding-left: 1rem;
               font-style: italic;
               color: #4b5563;
               margin-bottom: 1rem;
            }
            .markdown-content table {
               width: 100%;
               border-collapse: collapse;
               margin-bottom: 1rem;
            }
            .markdown-content th, .markdown-content td {
               border: 1px solid #e5e7eb;
               padding: 0.75rem;
               text-align: left;
            }
            .markdown-content th {
               background-color: #f9fafb;
               font-weight: 600;
            }
  
         `}} />
      </div>
   );
}
