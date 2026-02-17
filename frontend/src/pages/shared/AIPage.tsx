import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Bot, Sparkles, Code, BrainCircuit } from "lucide-react";

export function AIPage() {
   return (
      <div className="container mx-auto py-12 px-4">
         <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="flex justify-center mb-4">
               <div className="p-3 rounded-full bg-primary/10">
                  <Bot className="h-10 w-10 text-primary" />
               </div>
            </div>
            <h1 className="text-4xl font-bold mb-4">AI Assistant</h1>
            <p className="text-muted-foreground text-lg">
               Your intelligent coding companion. Get instant code reviews, optimizations, and explanations.
            </p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="hover:border-primary/50 transition-colors">
               <CardContent className="pt-6 text-center">
                  <Code className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Code Review</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                     Paste your code and get instant feedback on quality, security, and performance.
                  </p>
                  <Button variant="outline" className="w-full">Start Review</Button>
               </CardContent>
            </Card>

            <Card className="hover:border-primary/50 transition-colors">
               <CardContent className="pt-6 text-center">
                  <BrainCircuit className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Logic Assistant</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                     Stuck on a problem using logic? Describe it and let AI help you brainstorm solutions.
                  </p>
                  <Button variant="outline" className="w-full">Get Help</Button>
               </CardContent>
            </Card>

            <Card className="hover:border-primary/50 transition-colors">
               <CardContent className="pt-6 text-center">
                  <Sparkles className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Code Optimization</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                     Transform your O(n²) solution into O(n) with detailed explanations.
                  </p>
                  <Button variant="outline" className="w-full">Optimize</Button>
               </CardContent>
            </Card>
         </div>
      </div>
   );
}
