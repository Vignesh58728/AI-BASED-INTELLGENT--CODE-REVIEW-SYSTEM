import api from './api';
import { AuthResponse, User } from '@/types/user';

export const authApi = {
   login: async (credentials: any): Promise<AuthResponse> => {
      const response = await api.post('/auth/login', credentials);
      return response.data;
   },
   register: async (userData: any): Promise<AuthResponse> => {
      const response = await api.post('/auth/register', userData);
      return response.data;
   },
   getProfile: async (): Promise<User> => {
      const response = await api.get('/auth/profile');
      return response.data;
   },
   logout: async () => {
      await api.post('/auth/logout');
   }
};
