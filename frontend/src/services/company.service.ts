import { api } from './api';

export interface CompanyApplication {
  id: string;
  position: string;
  status: string;
  applicationDate: string;
  jobUrl?: string | null;
  notes?: string | null;
  salary?: string | null;
  location?: string | null;
  interviews?: Array<{
    id: string;
    title: string;
    scheduledAt: string;
    type: string;
  }>;
}

export interface Company {
  id: string;
  userId: string;
  name: string;
  website?: string | null;
  location?: string | null;
  industry?: string | null;
  contactPerson?: string | null;
  contactEmail?: string | null;
  notes?: string | null;
  createdAt: string;
  applicationCount?: number;
  latestApplication?: CompanyApplication | null;
  applications?: CompanyApplication[];
}

export const companyService = {
  getCompanies: (search?: string) =>
    api.get<{ data: Company[] }>('/companies', { params: { search } }),

  getCompanyById: (id: string) =>
    api.get<{ data: Company }>(`/companies/${id}`),

  createCompany: (data: Partial<Company>) =>
    api.post<{ data: Company }>('/companies', data),

  updateCompany: (id: string, data: Partial<Company>) =>
    api.put<{ data: Company }>(`/companies/${id}`, data),

  deleteCompany: (id: string) =>
    api.delete(`/companies/${id}`),
};
