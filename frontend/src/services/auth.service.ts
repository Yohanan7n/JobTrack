import { api } from './api';

export const authService = {
  register: (data: { name: string; email: string; password: string; role?: 'USER' | 'ADMIN' }) =>
    api.post('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),

  getMe: () =>
    api.get('/auth/me'),

  updateProfile: (data: { name?: string; avatar?: string; currentPassword?: string; newPassword?: string }) =>
    api.put('/auth/profile', data),

  uploadAvatar: (formData: FormData) =>
    api.post('/auth/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),

  switchPersona: (persona: 'JOB_SEEKER' | 'EMPLOYER' | 'FREELANCER') =>
    api.patch('/auth/persona', { persona }),
};
