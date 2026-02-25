import api from './api';

export const progressApi = {
   getUserProgress: async (): Promise<any> => {
      const response = await api.get('/skill/progress');
      return response.data;
   },
   getUserSkills: async (): Promise<any[]> => {
      const response = await api.get('/skill/skills');
      return response.data;
   },
   updateSkill: async (skillName: string, proficiencyLevel: number): Promise<any> => {
      const response = await api.post('/skill/update-skill', {
         skill_name: skillName,
         proficiency_level: proficiencyLevel
      });
      return response.data;
   }
};
