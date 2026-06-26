import { api } from '../api';
import { User } from '../auth';

export type { User };

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
}

export const usersApi = {
  getAll: (token: string, page = 1, limit = 10) =>
    api.get<PaginatedResponse<User>>(`/api/users?page=${page}&limit=${limit}`, token),

  getById: (id: number, token: string) =>
    api.get<User>(`/api/users/${id}`, token),

  update: (id: number, data: Partial<User>, token: string) =>
    api.patch<User>(`/api/users/${id}`, data, token),

  delete: (id: number, token: string) =>
    api.delete<void>(`/api/users/${id}`, token),
};
