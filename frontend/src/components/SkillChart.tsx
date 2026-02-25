import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";

export function SkillChart() {
   return (
      <Card className="w-full h-64 bg-black/40 border-primary/20 backdrop-blur-md">
         <CardHeader>
            <CardTitle className="text-sm font-medium text-primary">Skill Distribution</CardTitle>
         </CardHeader>
         <CardContent className="flex items-center justify-center h-full">
            <p className="text-muted-foreground text-xs italic">Visualization Placeholder (Recharts coming soon...)</p>
         </CardContent>
      </Card>
   );
}
