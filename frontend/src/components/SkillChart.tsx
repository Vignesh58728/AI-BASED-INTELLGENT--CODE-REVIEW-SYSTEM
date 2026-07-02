import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer 
} from 'recharts';
import api from '@/services/api';

const defaultData = [
  { subject: 'Arrays', A: 0, fullMark: 100 },
  { subject: 'Strings', A: 0, fullMark: 100 },
  { subject: 'Trees', A: 0, fullMark: 100 },
  { subject: 'Graphs', A: 0, fullMark: 100 },
  { subject: 'Logic', A: 0, fullMark: 100 },
  { subject: 'Patterns', A: 0, fullMark: 100 },
];

export function SkillChart() {
   const [data, setData] = useState(defaultData);
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      const fetchSkills = async () => {
         try {
            const response = await api.get('/skill/skills');
            if (response.data && response.data.length > 0) {
               const formatted = response.data.map((s: any) => ({
                  subject: s.skill_name,
                  A: s.proficiency_level,
                  fullMark: 100
               }));
               setData(formatted);
            }
         } catch (e) {
            console.error("Failed to fetch skills:", e);
         } finally {
            setIsLoading(false);
         }
      };
      fetchSkills();
   }, []);

   return (
      <Card className="w-full h-80 bg-zinc-900 border-zinc-800 shadow-2xl rounded-[32px] overflow-hidden">
         <CardHeader className="pb-0 pt-6 px-8">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
               Neural Skill Distribution
            </CardTitle>
            <h3 className="text-xl font-black text-white uppercase tracking-tight">Skill Gap Map</h3>
         </CardHeader>
         <CardContent className="h-full pb-8">
            {isLoading ? (
               <div className="flex items-center justify-center h-full">
                  <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
               </div>
            ) : (
               <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                     <PolarGrid stroke="#27272a" />
                     <PolarAngleAxis 
                       dataKey="subject" 
                       tick={{ fill: '#71717a', fontSize: 10, fontWeight: 'bold' }} 
                     />
                     <PolarRadiusAxis 
                       angle={30} 
                       domain={[0, 100]} 
                       tick={false} 
                       axisLine={false}
                     />
                     <Radar
                       name="Proficiency"
                       dataKey="A"
                       stroke="#ffffff"
                       fill="#ffffff"
                       fillOpacity={0.1}
                     />
                  </RadarChart>
               </ResponsiveContainer>
            )}
         </CardContent>
      </Card>
   );
}
