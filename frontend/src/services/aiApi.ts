import api from './api';

export const aiApi = {
   analyzeCode: async (code: string, problemId: string) => {
      const response = await api.post('/ai/analyze', { code, problemId });
      return response.data;
   },
   getSuggestions: async (code: string) => {
      const response = await api.post('/ai/suggest', { code });
      return response.data;
   }
};
