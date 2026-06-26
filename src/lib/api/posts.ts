import { api } from '../api';

export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  status: 'draft' | 'published';
  authorId: number;
  categoryId: number;
  author?: User;
  category?: Category;
  comments?: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: number;
  content: string;
  authorId: number;
  postId: number;
  author?: User;
  post?: Post;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
}

export interface CreatePostDto {
  title: string;
  content: string;
  excerpt?: string;
  status?: 'draft' | 'published';
  categoryId?: number;
}

export interface UpdatePostDto extends Partial<CreatePostDto> {}

export interface QueryPostParams {
  page?: number;
  limit?: number;
  status?: string;
  categoryId?: number;
  authorId?: number;
  search?: string;
}

export const postsApi = {
  getAll: (params: QueryPostParams = {}) => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set('page', String(params.page));
    if (params.limit) searchParams.set('limit', String(params.limit));
    if (params.status) searchParams.set('status', params.status);
    if (params.categoryId) searchParams.set('categoryId', String(params.categoryId));
    if (params.authorId) searchParams.set('authorId', String(params.authorId));
    if (params.search) searchParams.set('search', params.search);
    const query = searchParams.toString();
    return api.get<PaginatedResponse<Post>>(`/api/posts${query ? `?${query}` : ''}`);
  },

  getById: (id: number) => api.get<Post>(`/api/posts/${id}`),

  create: (data: CreatePostDto, token: string) =>
    api.post<Post>('/api/posts', data, token),

  update: (id: number, data: UpdatePostDto, token: string) =>
    api.patch<Post>(`/api/posts/${id}`, data, token),

  delete: (id: number, token: string) =>
    api.delete<void>(`/api/posts/${id}`, token),
};
