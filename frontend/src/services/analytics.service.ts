import { api } from './api';

export interface AnalyticsData {
  summary: {
    totalApplications: number;
    interviewsScheduled: number;
    inInterviewStage: number;
    offers: number;
    rejected: number;
    screening: number;
    applied: number;
    interviewRate: number;
    offerRate: number;
    responseRate: number;
  };
  statusDistribution: Array<{
    name: string;
    status: string;
    count: number;
    color: string;
  }>;
  monthlyTrend: Array<{
    month: string;
    key: string;
    applications: number;
  }>;
  topRoles: Array<{
    name: string;
    count: number;
  }>;
  locationDistribution: Array<{
    type: string;
    count: number;
  }>;
}

export const analyticsService = {
  getAnalytics: () =>
    api.get<{ data: AnalyticsData }>('/analytics'),
};
