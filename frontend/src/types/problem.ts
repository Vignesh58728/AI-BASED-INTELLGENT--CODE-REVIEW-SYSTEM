export type Difficulty = 'easy' | 'medium' | 'hard' | 'beginner' | 'intermediate' | 'advanced';

export interface Problem {
   id: number | string;
   title: string;
   description: string;
   module?: string;
   difficulty: Difficulty | string;
   points?: number;
   tags?: string[];
   template_code?: Record<string, string>;
   initialCode?: string;
   testCases?: TestCase[];
}

export interface TestCase {
   id: string;
   input: string;
   expectedOutput: string;
   isHidden: boolean;
}
