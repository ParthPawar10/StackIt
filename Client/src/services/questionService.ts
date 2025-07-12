import api from '../utils/api';
import type { Question } from '../types/index';

export interface CreateQuestionData {
  title: string;
  content: string;
  tags: string[];
}

export interface QuestionFilters {
  search?: string;
  tags?: string[];
  sort?: 'newest' | 'votes' | 'answers' | 'views';
  page?: number;
  limit?: number;
}

export const getQuestions = async (filters: QuestionFilters = {}): Promise<{ questions: Question[], total: number, page: number, totalPages: number }> => {
  const params = new URLSearchParams();
  
  if (filters.search) params.append('search', filters.search);
  if (filters.tags?.length) params.append('tags', filters.tags.join(','));
  if (filters.sort) params.append('sort', filters.sort);
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());

  const response = await api.get(`/questions?${params.toString()}`);
  if (response.data.success) {
    return response.data.data;
  }
  throw new Error(response.data.message || 'Failed to fetch questions');
};

export const getQuestionById = async (id: string): Promise<Question> => {
  const response = await api.get(`/questions/${id}`);
  if (response.data.success) {
    return response.data.data;
  }
  throw new Error(response.data.message || 'Failed to fetch question');
};

export const createQuestion = async (questionData: CreateQuestionData): Promise<Question> => {
  const response = await api.post('/questions', questionData);
  if (response.data.success) {
    return response.data.data;
  }
  throw new Error(response.data.message || 'Failed to create question');
};

export const voteQuestion = async (id: string, type: 'up' | 'down'): Promise<{ votes: number, userVote: 'up' | 'down' | null }> => {
  const response = await api.post(`/questions/${id}/vote`, { type });
  if (response.data.success) {
    return response.data.data;
  }
  throw new Error(response.data.message || 'Failed to vote on question');
};
