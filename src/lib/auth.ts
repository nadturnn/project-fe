export interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'editor' | 'reader';
  createdAt: string;
  updatedAt: string;
}

export interface LoginDto {
  username: string;
  password: string;
}

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
  role?: 'admin' | 'editor' | 'reader';
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

import { api } from './api';

export const authApi = {
  login: (data: LoginDto) => api.post<AuthResponse>('/api/auth/login', data),
  register: (data: RegisterDto) => api.post<AuthResponse>('/api/auth/register', data),
  getProfile: (token: string) => api.get<User>('/api/auth/profile', token),
};
