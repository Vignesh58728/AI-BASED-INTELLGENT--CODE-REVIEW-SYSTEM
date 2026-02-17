import api from './api';
import { Problem } from '@/types/problem';
import { Submission } from '@/types/submission';

export const problemsApi = {
   getProblems: async (filters?: any): Promise<Problem[]> => {
      const response = await api.get('/problems', { params: filters });
      return response.data;
   },
   getProblemById: async (id: string): Promise<Problem> => {
      const response = await api.get(`/problems/${id}`);
      return response.data;
   },
   submitSolution: async (submissionData: any): Promise<Submission> => {
      const response = await api.post('/submissions', submissionData);
      return response.data;
   }
};
