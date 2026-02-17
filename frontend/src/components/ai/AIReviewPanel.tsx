import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Bot, Sparkles } from "lucide-react";

interface AIReviewPanelProps {
   feedback: string | null;
   isLoading: boolean;
}

export function AIReviewPanel({ feedback, isLoading }: AIReviewPanelProps) {
   return (
      <Card className="h-full flex flex-col">
         <CardHeader className="pb-3 border-b">
            <CardTitle className="flex items-center gap-2 text-lg">
               <Bot className="w-5 h-5 text-primary" />
               AI Code Review
               {isLoading && <Sparkles className="w-4 h-4 animate-pulse text-yellow-500" />}
            </CardTitle>
         </CardHeader>
         <CardContent className="flex-1 p-0 overflow-y-auto min-h-[200px]">
            {isLoading ? (
               <div className="flex flex-col items-center justify-center h-full p-6 text-muted-foreground space-y-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <p>Analyzing your code...</p>
               </div>
            ) : feedback ? (
               <div className="p-4 prose dark:prose-invert max-w-none text-sm">
                  {/* Using a markdown parser here would be ideal, but for now just text */}
                  <pre className="whitespace-pre-wrap font-sans">{feedback}</pre>
               </div>
            ) : (
               <div className="flex flex-col items-center justify-center h-full p-6 text-muted-foreground">
                  <Bot className="w-12 h-12 mb-2 opacity-20" />
                  <p>Submit your code to get AI feedback.</p>
               </div>
            )}
         </CardContent>
      </Card>
   );
}
