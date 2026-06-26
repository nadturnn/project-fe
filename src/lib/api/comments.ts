import { api } from '../api';
import { Comment } from './posts';

export type { Comment };

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
}

export interface CreateCommentDto {
  content: string;
  postId: number;
}

export interface UpdateCommentDto {
  content: string;
}

export const commentsApi = {
  getByPost: (postId: number, page = 1, limit = 10) =>
    api.get<PaginatedResponse<Comment>>(`/api/comments/post/${postId}?page=${page}&limit=${limit}`),

  getById: (id: number) => api.get<Comment>(`/api/comments/${id}`),

  create: (data: CreateCommentDto, token: string) =>
    api.post<Comment>('/api/comments', data, token),

  update: (id: number, data: UpdateCommentDto, token: string) =>
    api.patch<Comment>(`/api/comments/${id}`, data, token),

  delete: (id: number, token: string) =>
    api.delete<void>(`/api/comments/${id}`, token),
};
