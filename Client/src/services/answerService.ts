import api from '../utils/api';
import type { Answer } from '../types';

export interface CreateAnswerData {
  content: string;
  questionId: string;
}

export const getAnswersByQuestion = async (questionId: string): Promise<Answer[]> => {
  const response = await api.get(`/questions/${questionId}/answers`);
  return response.data.data.answers;
};

export const createAnswer = async (answerData: CreateAnswerData): Promise<Answer> => {
  const response = await api.post('/answers', answerData);
  return response.data.data.answer;
};

export const updateAnswer = async (id: string, content: string): Promise<Answer> => {
  const response = await api.put(`/answers/${id}`, { content });
  return response.data.data.answer;
};

export const deleteAnswer = async (id: string): Promise<void> => {
  await api.delete(`/answers/${id}`);
};

export const voteAnswer = async (id: string, voteType: 'up' | 'down'): Promise<{ votes: number }> => {
  const response = await api.post(`/answers/${id}/vote`, { voteType });
  return response.data.data;
};

export const acceptAnswer = async (id: string): Promise<{ isAccepted: boolean }> => {
  const response = await api.post(`/answers/${id}/accept`);
  return response.data.data;
};
