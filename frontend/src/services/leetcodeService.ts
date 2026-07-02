import axios from 'axios';

export interface LeetCodeProblem {
   title: string;
   titleSlug: string;
   difficulty: string;
   status?: string;
}

export const leetcodeApi = {
   getProblems: async (limit: number = 100, skip: number = 0) => {
      try {
         const response = await axios.get(`https://alfa-leetcode-api.onrender.com/problems?limit=${limit}&skip=${skip}`);
         return response.data;
      } catch (error) {
         console.error('LeetCode API Error:', error);
         return null;
      }
   }
};
