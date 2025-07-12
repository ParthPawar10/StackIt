import api from '../utils/api';
import type { Question, CreateQuestionData, QuestionFilters } from '../types';

export interface QuestionsResponse {
  questions: Question[];
  pagination: {
    current: number;
    total: number;
    totalQuestions: number;
    count: number;
  };
}

export const getQuestions = async (filters?: QuestionFilters): Promise<QuestionsResponse> => {
  const params = new URLSearchParams();
  
  if (filters?.page) params.append('page', filters.page.toString());
  if (filters?.limit) params.append('limit', filters.limit.toString());
  if (filters?.sort) params.append('sort', filters.sort);
  if (filters?.tags) params.append('tags', filters.tags.join(','));
  if (filters?.search) params.append('search', filters.search);
  if (filters?.author) params.append('author', filters.author);

  const response = await api.get(`/questions?${params.toString()}`);
  return response.data.data;
};

export const getQuestionById = async (id: string): Promise<Question> => {
  const response = await api.get(`/questions/${id}`);
  return response.data.data.question;
};

export const createQuestion = async (questionData: CreateQuestionData): Promise<Question> => {
  const response = await api.post('/questions', questionData);
  return response.data.data.question;
};

export const updateQuestion = async (id: string, questionData: Partial<CreateQuestionData>): Promise<Question> => {
  const response = await api.put(`/questions/${id}`, questionData);
  return response.data.data.question;
};

export const deleteQuestion = async (id: string): Promise<void> => {
  await api.delete(`/questions/${id}`);
};

export const voteQuestion = async (id: string, voteType: 'up' | 'down'): Promise<{ votes: number }> => {
  const response = await api.post(`/questions/${id}/vote`, { voteType });
  return response.data.data;
};

export const bookmarkQuestion = async (id: string): Promise<{ isBookmarked: boolean }> => {
  const response = await api.post(`/questions/${id}/bookmark`);
  return response.data.data;
};
