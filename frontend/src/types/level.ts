export type LevelType = 'school' | 'college' | 'it';

export interface LevelInfo {
   id: string;
   type: LevelType;
   name: string;
   description: string;
   totalStages: number;
   unlocked: boolean;
}

export interface Stage {
   id: string;
   levelId: string;
   name: string;
   description: string;
   isLocked: boolean;
   isCompleted: boolean;
   problems: string[]; // Problem IDs
}
