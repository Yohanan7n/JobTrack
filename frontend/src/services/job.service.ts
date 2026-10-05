import { api } from './api';

export interface JobPosting {
  id: string;
  employerId: string;
  title: string;
  companyName: string;
  location?: string | null;
  locationType: 'REMOTE' | 'HYBRID' | 'ONSITE';
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'FREELANCE' | 'INTERNSHIP';
  salaryRange?: string | null;
  description: string;
  requirements?: string | null;
  skills?: string | null;
  status: 'OPEN' | 'PAUSED' | 'CLOSED';
  createdAt: string;
  updatedAt: string;
  applicantCount?: number;
  hasApplied?: boolean;
  employer?: {
    id: string;
    name: string;
    email: string;
    avatar?: string | null;
    companyName?: string | null;
  };
  applicants?: Array<{
    id: string;
    userId: string;
    position: string;
    status: string;
    applicationDate: string;
    salary?: string;
    notes?: string;
    user: {
      id: string;
      name: string;
      email: string;
      avatar?: string | null;
      title?: string | null;
      bio?: string | null;
      skills?: string | null;
    };
    documents?: Array<{
      id: string;
      title: string;
      fileName: string;
      fileUrl: string;
      fileType: string;
    }>;
  }>;
}

export const jobService = {
  getJobs: (params?: {
    search?: string;
    locationType?: string;
    employmentType?: string;
    status?: string;
  }) => api.get<{ success: boolean; data: JobPosting[] }>('/jobs', { params }),

  getMyJobs: () =>
    api.get<{ success: boolean; data: JobPosting[] }>('/jobs/my'),

  getJobById: (id: string) =>
    api.get<{ success: boolean; data: JobPosting }>(`/jobs/${id}`),

  createJob: (data: Partial<JobPosting>) =>
    api.post<{ success: boolean; data: JobPosting }>('/jobs', data),

  updateJob: (id: string, data: Partial<JobPosting>) =>
    api.patch<{ success: boolean; data: JobPosting }>(`/jobs/${id}`, data),

  deleteJob: (id: string) =>
    api.delete<{ success: boolean; data: null }>(`/jobs/${id}`),

  applyToJob: (id: string, payload?: { notes?: string; cvUsed?: string }) =>
    api.post<{ success: boolean; data: any }>(`/jobs/${id}/apply`, payload || {}),

  updateApplicantStatus: (
    jobId: string,
    applicationId: string,
    payload: { status?: string; notes?: string }
  ) =>
    api.patch<{ success: boolean; data: any }>(
      `/jobs/${jobId}/applicants/${applicationId}`,
      payload
    ),
};
