import { LevelCard } from "@/components/levels/LevelCard";
import { useLevel } from "@/context/LevelContext";
import { useNavigate } from "react-router-dom";
// import { GraduationCap, BookOpen, Building2 } from "lucide-react";

export function LevelSelectionPage() {
   const { setLevel } = useLevel();
   const navigate = useNavigate();

   const handleSelectLevel = (level: 'school' | 'college' | 'it') => {
      setLevel(level);
      navigate(`/${level}`);
   };

   return (
      <div className="container mx-auto py-12">
         <h1 className="text-3xl font-bold text-center mb-8">Select Your Level</h1>
         <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Choose the path that best matches your current stage. Each level is tailored to provide the most relevant learning experience and challenges.
         </p>

         <div className="flex flex-wrap justify-center gap-8">
            <LevelCard
               title="School Level"
               description="Perfect for beginners. Learn programming basics, logic building, and intro to Python/Java."
               progress={0}
               isLocked={false}
               onClick={() => handleSelectLevel('school')}
            />
            <LevelCard
               title="College Level"
               description="Master Data Structures, Algorithms, and prepare for campus placements."
               progress={0}
               isLocked={false}
               onClick={() => handleSelectLevel('college')}
            />
            <LevelCard
               title="IT Professional"
               description="Minimize latency, optimize code, and learn advanced system design patterns."
               progress={0}
               isLocked={false} // Could be locked based on logic
               onClick={() => handleSelectLevel('it')}
            />
         </div>
      </div>
   );
}
