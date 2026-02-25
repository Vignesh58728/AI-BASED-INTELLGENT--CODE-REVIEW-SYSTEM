import { Card, CardContent } from "@/components/ui/Card";

export function ReviewHistory() {
   return (
      <div className="p-8 space-y-8">
         <h1 className="text-3xl font-bold">Review History</h1>
         <Card className="bg-black/20 border-white/10">
            <CardContent className="p-8 text-center text-muted-foreground">
               No previous reviews found. Start a project to see your history!
            </CardContent>
         </Card>
      </div>
   );
}
