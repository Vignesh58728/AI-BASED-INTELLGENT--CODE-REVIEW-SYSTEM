export type SubmissionStatus = 'accepted' | 'wrong_answer' | 'compile_error' | 'runtime_error' | 'pending';

export interface Submission {
   id: string;
   problemId: string;
   userId: string;
   code: string;
   language: string;
   status: SubmissionStatus;
   executionTime?: number;
   memoryUsed?: number;
   createdAt: string;
}
