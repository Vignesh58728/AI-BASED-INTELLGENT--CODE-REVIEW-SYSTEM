import api from './api';

export interface ChatMessage {
   role: 'user' | 'assistant';
   content: string;
}

export interface ChatResponse {
   answer: string;
   response?: string;
   sources: Array<{ title: string; url: string }>;
   suggested_questions: string[];
   status: string;
}

interface ChatOptions {
   model?: string;
   history?: ChatMessage[];
   fileContext?: string;
   languageHint?: 'english' | 'tamil';
   useWebSearch?: boolean;
}

export const submissionService = {
   analyzeCode: async (code: string, language: string, problemId: string, model: string = 'default') => {
      const response = await api.post('/reviewer/review', { code, language, problem_id: parseInt(problemId) || 0, model });
      return response.data;
   },
   explainCode: async (code: string, language: string, line?: number, model: string = 'default', languageHint?: string) => {
      const response = await api.post('/reviewer/explain', { code, language, line, model, language_hint: languageHint });
      return response.data;
   },
   analyzeComplexity: async (code: string, language: string, model: string = 'default') => {
      const response = await api.post('/reviewer/complexity', { code, language, problem_id: 0, model });
      return response.data;
   },
   getSuggestions: async (code: string, language: string, model: string = 'default') => {
      const response = await api.post('/reviewer/suggest', { code, language, model });
      return response.data;
   },
   predictEdgeCases: async (code: string, language: string, problemId: string, model: string = 'default') => {
      const response = await api.post('/reviewer/edge-cases', { code, language, problem_id: parseInt(problemId) || 0, model });
      return response.data;
   },
   getChatResponse: async (query: string, options?: ChatOptions): Promise<ChatResponse> => {
      const response = await api.post('/reviewer/chat', {
         query,
         model: options?.model ?? 'default',
         history: options?.history ?? [],
         file_context: options?.fileContext ?? null,
         language_hint: options?.languageHint ?? 'english',
         use_web_search: options?.useWebSearch ?? false,
      });
      const data = response.data ?? {};
      return {
         answer: data.answer ?? data.response ?? '',
         response: data.response ?? data.answer ?? '',
         sources: data.sources ?? [],
         suggested_questions: data.suggested_questions ?? [],
         status: data.status ?? 'completed',
      } as ChatResponse;
   },
   executeCode: async (code: string, language: string) => {
      const response = await api.post('/reviewer/execute', { code, language, problem_id: 0 });
      return response.data;
   },
   saveChatHistory: async (messages: ChatMessage[]) => {
      const response = await api.post('/reviewer/history/save', { messages });
      return response.data;
   },
   getChatHistory: async () => {
      const response = await api.get('/reviewer/history');
      return response.data;
   },
   fixCode: async (code: string, language: string, model: string = 'default') => {
      const response = await api.post('/reviewer/fix', { code, language, model });
      return response.data;
   },
   checkPlagiarism: async (code: string, language: string, model: string = 'default') => {
      const response = await api.post('/reviewer/plagiarism', { code, language, problem_id: 0, model });
      return response.data;
   },
   generateCode: async (prompt: string, language: string, model: string = 'default') => {
      const response = await api.post('/reviewer/generate-code', { prompt, language, model });
      return response.data;
   }
};
