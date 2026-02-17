export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Problem {
   id: string;
   title: string;
   description: string;
   difficulty: Difficulty;
   tags: string[];
   initialCode: string;
   testCases: TestCase[];
}

export interface TestCase {
   id: string;
   input: string;
   expectedOutput: string;
   isHidden: boolean;
}
