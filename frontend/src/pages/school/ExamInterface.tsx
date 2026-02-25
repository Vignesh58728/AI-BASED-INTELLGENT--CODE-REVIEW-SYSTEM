import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Timer, ChevronLeft, ChevronRight, AlertCircle, CheckCircle2 } from "lucide-react";
import { SCHOOL_EXAMS } from "@/data/schoolExams";

export function ExamInterface() {
   const { id } = useParams<{ id: string }>();
   const navigate = useNavigate();

   const exam = SCHOOL_EXAMS.find(e => e.id === id);
   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
   const [timeLeft, setTimeLeft] = useState<number>(0);
   const [isFinished, setIsFinished] = useState(false);

   // Initialize timer based on duration string (e.g., "45 mins")
   useEffect(() => {
      if (exam) {
         const mins = parseInt(exam.duration);
         setTimeLeft(mins * 60);
      }
   }, [exam]);

   // Timer logic
   useEffect(() => {
      if (timeLeft <= 0 || isFinished) return;

      const timer = setInterval(() => {
         setTimeLeft(prev => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
   }, [timeLeft, isFinished]);

   if (!exam) {
      return (
         <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <AlertCircle className="w-12 h-12 text-destructive" />
            <h2 className="text-xl font-bold">Exam Not Found</h2>
            <Button onClick={() => navigate("/school/exams")}>Back to Exams</Button>
         </div>
      );
   }

   const formatTime = (seconds: number) => {
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      const s = seconds % 60;
      return `${h > 0 ? h + ":" : ""}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
   };

   const currentQuestion = exam.questions[currentQuestionIndex];
   const progress = ((currentQuestionIndex + 1) / exam.questions.length) * 100;

   if (isFinished) {
      return (
         <div className="container max-w-2xl mx-auto py-12 text-center">
            <div className="mb-6 flex justify-center">
               <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-primary" />
               </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">Exam Submitted!</h1>
            <p className="text-muted-foreground mb-8 text-lg">
               Well done on completing the <span className="text-foreground font-semibold">{exam.title}</span>.
               Your results are being analyzed by our AI reviewer.
            </p>
            <div className="flex gap-4 justify-center">
               <Button variant="outline" onClick={() => navigate("/school/exams")}>Back to Exams List</Button>
               <Button onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
            </div>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-background flex flex-col">
         {/* Top Navigation / Status bar */}
         <div className="border-b bg-card sticky top-0 z-10">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <Button variant="ghost" size="icon" onClick={() => navigate("/school/exams")}>
                     <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <div>
                     <h2 className="font-bold text-sm leading-none">{exam.title}</h2>
                     <p className="text-[10px] text-muted-foreground mt-1">
                        Question {currentQuestionIndex + 1} of {exam.questions.length}
                     </p>
                  </div>
               </div>

               <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-colors ${timeLeft < 300 ? 'bg-destructive/10 border-destructive text-destructive font-bold' : 'bg-primary/5 border-primary/20 text-primary'}`}>
                  <Timer className="w-4 h-4" />
                  <span className="text-sm font-mono tabular-nums">{formatTime(timeLeft)}</span>
               </div>

               <Button size="sm" onClick={() => setIsFinished(true)}>Submit Exam</Button>
            </div>
            {/* Progress bar */}
            <div className="h-1 bg-muted w-full overflow-hidden">
               <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${progress}%` }}
               />
            </div>
         </div>

         <div className="flex-1 container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl">
            {/* Left Column: Question Details */}
            <div className="md:col-span-1 space-y-6">
               <Card>
                  <CardHeader>
                     <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                           {currentQuestion.section || "Question"}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-muted font-medium capitalize">
                           {currentQuestion.difficulty}
                        </span>
                     </div>
                     <CardTitle className="text-base leading-relaxed">
                        {currentQuestion.title}
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <p className="text-sm text-muted-foreground italic">
                        Write your Python solution in the editor. Ensure your code handles the inputs correctly and matches the expected output format.
                     </p>
                  </CardContent>
               </Card>

               <div className="grid grid-cols-5 gap-2">
                  {exam.questions.map((_, idx) => (
                     <button
                        key={idx}
                        onClick={() => setCurrentQuestionIndex(idx)}
                        className={`h-8 rounded text-[10px] font-bold border transition-all ${currentQuestionIndex === idx
                           ? "bg-primary text-primary-foreground border-primary"
                           : "bg-card border-border hover:border-primary/50"
                           }`}
                     >
                        {idx + 1}
                     </button>
                  ))}
               </div>
            </div>

            {/* Right Column: Editor Placeholder */}
            <div className="md:col-span-2 space-y-4 flex flex-col">
               <div className="flex-1 border rounded-2xl bg-[#0d1117] flex flex-col overflow-hidden relative group">
                  {/* Editor Header */}
                  <div className="h-10 border-b border-white/5 bg-white/5 flex items-center px-4 justify-between">
                     <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest">editor.py</span>
                  </div>

                  {/* Placeholder content showing it's an editor */}
                  <div className="flex-1 p-6 font-mono text-sm space-y-2 opacity-50 select-none">
                     <div className="text-emerald-500"># Start your solution for Question {currentQuestionIndex + 1} here</div>
                     <div className="text-blue-400">def solution():</div>
                     <div className="ml-4 text-white/80"># Your code logic</div>
                     <div className="ml-4 text-purple-400">pass</div>
                  </div>

                  {/* Overlay showing it's a placeholder for now */}
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                     <p className="text-xs font-medium text-white bg-black/60 px-4 py-2 rounded-full border border-white/10">
                        Full Editor Coming Soon
                     </p>
                  </div>
               </div>

               <div className="flex justify-between items-center">
                  <Button
                     variant="outline"
                     className="gap-2"
                     disabled={currentQuestionIndex === 0}
                     onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                  >
                     <ChevronLeft className="w-4 h-4" /> Previous
                  </Button>

                  {currentQuestionIndex < exam.questions.length - 1 ? (
                     <Button
                        className="gap-2"
                        onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                     >
                        Next Question <ChevronRight className="w-4 h-4" />
                     </Button>
                  ) : (
                     <Button
                        className="bg-primary hover:bg-primary/90 gap-2"
                        onClick={() => setIsFinished(true)}
                     >
                        Complete Exam <CheckCircle2 className="w-4 h-4" />
                     </Button>
                  )}
               </div>
            </div>
         </div>
      </div>
   );
}
