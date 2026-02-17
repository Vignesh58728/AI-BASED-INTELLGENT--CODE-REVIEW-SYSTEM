import { LevelType } from './level';

export interface UserProgress {
   userId: string;
   levelProgress: Record<LevelType, number>; // Percentage or stage count
   completedProblems: string[]; // Problem IDs
   totalScore: number;
   streakDays: number;
   lastActiveDate: string;
}
