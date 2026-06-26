import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, authApi } from '../lib/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, role?: string) => Promise<void>;
  logout: () => void;
  loadProfile: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isEditor: boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
      isAdmin: false,
      isEditor: false,

      login: async (username: string, password: string) => {
        set({ isLoading: true });
        try {
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
          });
          const data = await res.json();
          if (data.statusCode === 401 || !data.access_token) {
            throw new Error('Invalid credentials');
          }
          set({
            user: data.user,
            token: data.access_token,
            isAuthenticated: true,
            isAdmin: data.user.role === 'admin',
            isEditor: data.user.role === 'editor' || data.user.role === 'admin',
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (username: string, email: string, password: string, role?: string) => {
        set({ isLoading: true });
        try {
          const res = await authApi.register({ username, email, password, role: role as any });
          set({
            user: res.user,
            token: res.access_token,
            isAuthenticated: true,
            isAdmin: res.user.role === 'admin',
            isEditor: res.user.role === 'editor' || res.user.role === 'admin',
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isAdmin: false,
          isEditor: false,
        });
      },

      loadProfile: async () => {
        const token = get().token;
        if (!token) return;
        try {
          const user = await authApi.getProfile(token);
          set({
            user,
            isAuthenticated: true,
            isAdmin: user.role === 'admin',
            isEditor: user.role === 'editor' || user.role === 'admin',
          });
        } catch {
          get().logout();
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token }),
    }
  )
);
