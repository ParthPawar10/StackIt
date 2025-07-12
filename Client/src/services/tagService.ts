import api from '../utils/api';
import type { Tag } from '../types';

export const getTags = async (search?: string): Promise<Tag[]> => {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  
  const response = await api.get(`/tags?${params.toString()}`);
  return response.data.data.tags;
};

export const getPopularTags = async (limit = 20): Promise<Tag[]> => {
  const response = await api.get(`/tags?popular=true&limit=${limit}`);
  return response.data.data.tags;
};

export const createTag = async (name: string, description?: string): Promise<Tag> => {
  const response = await api.post('/tags', { name, description });
  return response.data.data.tag;
};
