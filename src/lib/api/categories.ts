import { api } from '../api';
import { Category } from './posts';

export type { Category };

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
}

export interface CreateCategoryDto {
  name: string;
  description?: string;
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {}

export const categoriesApi = {
  getAll: (page = 1, limit = 10) =>
    api.get<PaginatedResponse<Category>>(`/api/categories?page=${page}&limit=${limit}`),

  getById: (id: number) => api.get<Category>(`/api/categories/${id}`),

  create: (data: CreateCategoryDto, token: string) =>
    api.post<Category>('/api/categories', data, token),

  update: (id: number, data: UpdateCategoryDto, token: string) =>
    api.patch<Category>(`/api/categories/${id}`, data, token),

  delete: (id: number, token: string) =>
    api.delete<void>(`/api/categories/${id}`, token),
};
