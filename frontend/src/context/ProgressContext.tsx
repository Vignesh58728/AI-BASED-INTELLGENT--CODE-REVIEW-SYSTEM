import { createContext, useContext, useState, ReactNode } from 'react';

interface ProgressData {
   completedLevels: number;
   score: number;
   completedProblemIds: number[];
}

interface ProgressContextType {
   progress: ProgressData;
   updateProgress: (data: Partial<ProgressData>) => void;
   completeProblem: (id: number) => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider = ({ children }: { children: ReactNode }) => {
   const [progress, setProgress] = useState<ProgressData>(() => {
      const saved = localStorage.getItem('userProgress');
      if (saved) {
         try {
            return JSON.parse(saved);
         } catch (e) {
            console.error("Failed to parse user progress", e);
         }
      }
      return {
         completedLevels: 0,
         score: 0,
         completedProblemIds: []
      };
   });

   const updateProgress = (data: Partial<ProgressData>) => {
      const nextProgress = { ...progress, ...data };
      setProgress(nextProgress);
      localStorage.setItem('userProgress', JSON.stringify(nextProgress));
   };

   const completeProblem = (id: number) => {
      if (!progress.completedProblemIds.includes(id)) {
         const nextIds = [...progress.completedProblemIds, id];
         updateProgress({ completedProblemIds: nextIds });
      }
   };

   return (
      <ProgressContext.Provider value={{ progress, updateProgress }}>
         {children}
      </ProgressContext.Provider>
   );
};

export const useProgress = () => {
   const context = useContext(ProgressContext);
   if (context === undefined) {
      throw new Error('useProgress must be used within a ProgressProvider');
   }
   return context;
};
