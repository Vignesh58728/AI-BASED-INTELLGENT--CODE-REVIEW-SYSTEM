import axios from 'axios';

export interface CFProblem {
   contestId: number;
   index: string;
   name: string;
   type: string;
   points?: number;
   rating?: number;
   tags: string[];
}

export interface CFProblemResult {
   problemStatistics: any[];
   problems: CFProblem[];
}

export const codeforcesApi = {
   getProblems: async (tags: string[] = ['implementation', 'data structures', 'algorithms']) => {
      try {
         const tagsQuery = tags.join(';');
         const response = await axios.get(`https://codeforces.com/api/problemset.problems?tags=${tagsQuery}`);
         if (response.data.status === 'OK') {
            return response.data.result as CFProblemResult;
         }
         throw new Error('Failed to fetch from Codeforces');
      } catch (error) {
         console.error('Codeforces API Error:', error);
         return null;
      }
   },

   getContests: async (gym: boolean = true) => {
      try {
         const response = await axios.get(`https://codeforces.com/api/contest.list?gym=${gym}`);
         if (response.data.status === 'OK') {
            return response.data.result;
         }
         return [];
      } catch (error) {
         console.error('Codeforces Contest Error:', error);
         return [];
      }
   }
};
