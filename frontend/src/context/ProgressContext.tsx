import { createContext, useContext, useState, ReactNode } from 'react';

// Placeholder type
interface ProgressData {
   completedLevels: number;
   score: number;
}

interface ProgressContextType {
   progress: ProgressData;
   updateProgress: (data: Partial<ProgressData>) => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider = ({ children }: { children: ReactNode }) => {
   const [progress, setProgress] = useState<ProgressData>({
      completedLevels: 0,
      score: 0,
   });

   const updateProgress = (data: Partial<ProgressData>) => {
      setProgress((prev) => ({ ...prev, ...data }));
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
