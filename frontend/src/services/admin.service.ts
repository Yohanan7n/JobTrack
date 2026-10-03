import { api } from './api';
import { User } from '../store/authStore';

export interface AdminUser extends User {
  _count: {
    applications: number;
    interviews: number;
    documents: number;
  };
}

export interface SystemMetrics {
  totalUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  totalApplications: number;
  totalInterviews: number;
  totalDocuments: number;
  totalCompanies: number;
  uptimeSeconds: number;
  nodeVersion: string;
}

export const adminService = {
  getAllUsers: (params?: { search?: string; role?: string; status?: string }) =>
    api.get<{ data: AdminUser[] }>('/admin/users', { params }),

  updateUserStatus: (id: string, status: 'ACTIVE' | 'SUSPENDED') =>
    api.patch<{ data: AdminUser }>(`/admin/users/${id}/status`, { status }),

  updateUserRole: (id: string, role: 'USER' | 'ADMIN') =>
    api.patch<{ data: AdminUser }>(`/admin/users/${id}/role`, { role }),

  getSystemMetrics: () =>
    api.get<{ data: SystemMetrics }>('/admin/metrics'),
};
