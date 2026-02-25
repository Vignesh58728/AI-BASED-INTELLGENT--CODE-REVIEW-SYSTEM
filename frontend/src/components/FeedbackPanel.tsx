import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Sparkles } from "lucide-react";

interface AIReviewPanelProps {
   feedback: string | null;
   isLoading: boolean;
}

export function FeedbackPanel({ feedback, isLoading }: AIReviewPanelProps) {
   return (
      <Card className="h-full flex flex-col border border-zinc-200 bg-white shadow-sm">
         <CardHeader className="pb-3 border-b border-zinc-100">
            <CardTitle className="flex items-center gap-2 text-lg text-zinc-900">
               <img src="/artificial-intelligence.png" alt="AI" className="w-5 h-5" />
               AI Code Review
               {isLoading && <Sparkles className="w-4 h-4 animate-pulse text-yellow-500" />}
            </CardTitle>
         </CardHeader>
         <CardContent className="flex-1 p-0 overflow-y-auto min-h-[200px]">
            {isLoading ? (
               <div className="flex flex-col items-center justify-center h-full p-6 text-zinc-500 space-y-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <p className="font-medium">Analyzing your code...</p>
               </div>
            ) : feedback ? (
               <div className="p-4 prose max-w-none text-sm text-zinc-700 leading-relaxed">
                  <pre className="whitespace-pre-wrap font-sans bg-zinc-50 p-4 rounded-lg border border-zinc-100 text-zinc-800">{feedback}</pre>
               </div>
            ) : (
               <div className="flex flex-col items-center justify-center h-full p-6 text-zinc-400">
                  <img src="/artificial-intelligence.png" alt="AI" className="w-12 h-12 mb-4 opacity-10 grayscale" />
                  <p className="text-sm font-medium">Submit your code to get AI feedback.</p>
               </div>
            )}
         </CardContent>
      </Card>
   );
}
