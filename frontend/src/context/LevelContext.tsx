import { createContext, useContext, useState, ReactNode } from 'react';

type Level = 'school' | 'college' | 'it';

interface LevelContextType {
   currentLevel: Level;
   setLevel: (level: Level) => void;
}

const LevelContext = createContext<LevelContextType | undefined>(undefined);

export const LevelProvider = ({ children }: { children: ReactNode }) => {
   const [currentLevel, setLevel] = useState<Level>('school');

   return (
      <LevelContext.Provider value={{ currentLevel, setLevel }}>
         {children}
      </LevelContext.Provider>
   );
};

export const useLevel = () => {
   const context = useContext(LevelContext);
   if (context === undefined) {
      throw new Error('useLevel must be used within a LevelProvider');
   }
   return context;
};
