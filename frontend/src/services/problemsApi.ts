import api from './api';
import { Problem } from '@/types/problem';
import { Submission } from '@/types/submission';

export const problemsApi = {
   getProblems: async (filters?: any): Promise<Problem[]> => {
      const response = await api.get('/problems', { params: filters });
      return response.data;
   },
   getCollegeProblems: async (): Promise<Problem[]> => {
      const response = await api.get('/problems/college');
      return response.data;
   },
   getSchoolProblems: async (): Promise<Problem[]> => {
      const response = await api.get('/problems/school');
      return response.data;
   },
   getITProblems: async (): Promise<Problem[]> => {
      const response = await api.get('/problems/it');
      return response.data;
   },
   getProblemById: async (id: string): Promise<Problem> => {
      const response = await api.get(`/problems/${id}`);
      return response.data;
   },
   getLeetCodeProblems: async (skip: number = 0, limit: number = 2000): Promise<any[]> => {
      const response = await api.get('/problems/leetcode/all', { params: { skip, limit } });
      return response.data;
   },
   submitSolution: async (submissionData: any): Promise<Submission> => {
      const response = await api.post('/submissions', submissionData);
      return response.data;
   },
   getSubmissions: async (userId: string): Promise<Submission[]> => {
      const response = await api.get(`/submissions/user/${userId}`);
      return response.data;
   }
};
