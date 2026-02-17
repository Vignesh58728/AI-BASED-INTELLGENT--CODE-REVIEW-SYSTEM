import { useState } from "react";
import { useParams } from "react-router-dom";
// import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
// For now, I'll use a fixed layout or simple grid.
import { MonacoEditor } from "@/components/editor/MonacoEditor";
import { AIReviewPanel } from "@/components/ai/AIReviewPanel";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Play, Send } from "lucide-react";
// import { problemsApi } from "@/services/problemsApi";
// import { aiApi } from "@/services/aiApi";

export function ProblemSolverPage() {
   const { id } = useParams<{ id: string }>();
   // fetch problem details using id...
   const [code, setCode] = useState("// Write your code here\n");
   const [aiFeedback, setAiFeedback] = useState<string | null>(null);
   const [isAnalyzing, setIsAnalyzing] = useState(false);

   const handleRun = () => {
      console.log("Running code:", code);
      // Execute locally or send to backend
   };

   const handleSubmit = async () => {
      console.log("Submitting code:", code);
      setIsAnalyzing(true);
      try {
         // Mocking AI response for now or call API
         // const feedback = await aiApi.analyzeCode(code, id!);
         setTimeout(() => {
            setAiFeedback("## Code Review\n\n**Logic**: The logic seems correct for basic cases.\n**Style**: Good indentation.\n**Suggestion**: Consider edge cases where input might be null.");
            setIsAnalyzing(false);
         }, 2000);
      } catch (e) {
         setIsAnalyzing(false);
         setAiFeedback("Error analyzing code.");
      }
   };

   return (
      <div className="h-[calc(100vh-100px)] flex flex-col gap-4">
         <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-1 space-y-4 flex flex-col">
               <Card className="flex-1 overflow-auto">
                  <CardHeader>
                     <CardTitle>Problem Title {id}</CardTitle>
                  </CardHeader>
                  <CardContent>
                     <p>Problem description goes here. Write a function that...</p>
                     <div className="mt-4">
                        <h3 className="font-semibold">Input Format</h3>
                        <p className="text-sm text-muted-foreground">...</p>
                     </div>
                     <div className="mt-4">
                        <h3 className="font-semibold">Output Format</h3>
                        <p className="text-sm text-muted-foreground">...</p>
                     </div>
                  </CardContent>
               </Card>
            </div>

            <div className="lg:col-span-2 flex flex-col gap-4">
               <div className="flex-1 min-h-[400px]">
                  <MonacoEditor value={code} onChange={(val) => setCode(val || "")} />
               </div>
               <div className="h-[200px]">
                  <AIReviewPanel feedback={aiFeedback} isLoading={isAnalyzing} />
               </div>
            </div>
         </div>

         <div className="flex justify-end gap-4 p-4 border-t bg-background">
            <Button variant="outline" onClick={handleRun}>
               <Play className="mr-2 h-4 w-4" /> Run Code
            </Button>
            <Button onClick={handleSubmit}>
               <Send className="mr-2 h-4 w-4" /> Submit & AI Review
            </Button>
         </div>
      </div>
   );
}
