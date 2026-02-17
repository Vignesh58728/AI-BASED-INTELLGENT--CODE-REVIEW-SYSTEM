import api from './api';
import { UserProgress } from '@/types/progress';

export const progressApi = {
   getUserProgress: async (): Promise<UserProgress> => {
      const response = await api.get('/progress');
      return response.data;
   },
   updateProgress: async (data: any): Promise<UserProgress> => {
      const response = await api.put('/progress', data);
      return response.data;
   }
};
