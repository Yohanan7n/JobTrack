import { api } from './api';

export interface Interview {
  id: string;
  userId: string;
  applicationId: string;
  title: string;
  type: string;
  scheduledAt: string;
  location?: string | null;
  interviewer?: string | null;
  notes?: string | null;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  feedback?: string | null;
  createdAt: string;
  application?: {
    id: string;
    companyName: string;
    position: string;
    status: string;
  };
}

export const interviewService = {
  getInterviews: (params?: { status?: string; timeframe?: string }) =>
    api.get<{ data: Interview[] }>('/interviews', { params }),

  createInterview: (data: {
    applicationId: string;
    title: string;
    type?: string;
    scheduledAt: string;
    location?: string;
    interviewer?: string;
    notes?: string;
  }) => api.post<{ data: Interview }>('/interviews', data),

  updateInterview: (id: string, data: Partial<Interview>) =>
    api.put<{ data: Interview }>(`/interviews/${id}`, data),

  deleteInterview: (id: string) =>
    api.delete(`/interviews/${id}`),
};
