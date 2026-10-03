import { api } from './api';
import { ApplicationStatus } from '../utils/constants';

export interface Application {
  id: string;
  userId: string;
  companyId?: string | null;
  companyName: string;
  position: string;
  location?: string | null;
  locationType: 'REMOTE' | 'HYBRID' | 'ONSITE';
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP';
  salary?: string | null;
  status: ApplicationStatus;
  applicationDate: string;
  jobDescription?: string | null;
  jobUrl?: string | null;
  contactPerson?: string | null;
  contactEmail?: string | null;
  cvUsed?: string | null;
  notes?: string | null;
  rating: number;
  createdAt: string;
  updatedAt: string;
  company?: {
    id: string;
    name: string;
    website?: string | null;
    location?: string | null;
  } | null;
  interviews?: Array<{
    id: string;
    title: string;
    scheduledAt: string;
    status: string;
    type: string;
  }>;
  documents?: Array<{
    id: string;
    title: string;
    fileName: string;
    fileUrl: string;
    fileType: string;
  }>;
}

export interface ApplicationFilters {
  status?: string;
  search?: string;
  companyId?: string;
  locationType?: string;
  employmentType?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export const applicationService = {
  getApplications: (params?: ApplicationFilters) =>
    api.get<{ data: Application[]; pagination: any }>('/applications', { params }),

  getApplicationById: (id: string) =>
    api.get<{ data: Application }>(`/applications/${id}`),

  createApplication: (data: Partial<Application>) =>
    api.post<{ data: Application }>('/applications', data),

  updateApplication: (id: string, data: Partial<Application>) =>
    api.put<{ data: Application }>(`/applications/${id}`, data),

  updateStatus: (id: string, status: ApplicationStatus) =>
    api.patch<{ data: Application }>(`/applications/${id}/status`, { status }),

  deleteApplication: (id: string) =>
    api.delete(`/applications/${id}`),
};
