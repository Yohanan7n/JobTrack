import { Response, NextFunction } from 'express';
import { prisma } from '../services/prisma.service';
import { successResponse } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const getAnalytics = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;

    const applications = await prisma.application.findMany({
      where: { userId },
      orderBy: { applicationDate: 'asc' },
    });

    const interviews = await prisma.interview.findMany({
      where: { userId },
    });

    const totalApplications = applications.length;

    // Status distribution
    const statusCounts: Record<string, number> = {
      APPLIED: 0,
      SCREENING: 0,
      INTERVIEW: 0,
      OFFER: 0,
      REJECTED: 0,
    };

    // Location type distribution
    const locationCounts: Record<string, number> = {
      REMOTE: 0,
      HYBRID: 0,
      ONSITE: 0,
    };

    // Role counts
    const roleCounts: Record<string, number> = {};

    // Monthly applications
    const monthlyCounts: Record<string, number> = {};

    applications.forEach((app) => {
      // Status
      if (statusCounts[app.status] !== undefined) {
        statusCounts[app.status]++;
      } else {
        statusCounts[app.status] = 1;
      }

      // Location
      const loc = app.locationType || 'REMOTE';
      locationCounts[loc] = (locationCounts[loc] || 0) + 1;

      // Role (clean & normalize common job titles)
      const role = app.position.trim();
      roleCounts[role] = (roleCounts[role] || 0) + 1;

      // Month: YYYY-MM
      const d = new Date(app.applicationDate);
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      monthlyCounts[monthKey] = (monthlyCounts[monthKey] || 0) + 1;
    });

    // Rate calculations
    const interviewCount = (statusCounts.INTERVIEW || 0) + (statusCounts.OFFER || 0);
    const offerCount = statusCounts.OFFER || 0;
    const responseCount = totalApplications - (statusCounts.APPLIED || 0);

    const interviewRate = totalApplications > 0 ? ((interviewCount / totalApplications) * 100).toFixed(1) : '0';
    const offerRate = totalApplications > 0 ? ((offerCount / totalApplications) * 100).toFixed(1) : '0';
    const responseRate = totalApplications > 0 ? ((responseCount / totalApplications) * 100).toFixed(1) : '0';

    // Format Monthly Trend for Recharts
    const monthlyTrend = Object.keys(monthlyCounts)
      .sort()
      .map((key) => {
        const [year, month] = key.split('-');
        const dateObj = new Date(parseInt(year), parseInt(month) - 1, 1);
        const label = dateObj.toLocaleString('default', { month: 'short', year: '2-digit' });
        return {
          month: label,
          key,
          applications: monthlyCounts[key],
        };
      });

    // Format Top Roles (top 5)
    const topRoles = Object.entries(roleCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    // Format Status Distribution for Charts
    const statusDistribution = [
      { name: 'Applied', status: 'APPLIED', count: statusCounts.APPLIED, color: '#6366f1' },
      { name: 'Screening', status: 'SCREENING', count: statusCounts.SCREENING, color: '#f59e0b' },
      { name: 'Interview', status: 'INTERVIEW', count: statusCounts.INTERVIEW, color: '#3b82f6' },
      { name: 'Offer', status: 'OFFER', count: statusCounts.OFFER, color: '#10b981' },
      { name: 'Rejected', status: 'REJECTED', count: statusCounts.REJECTED, color: '#ef4444' },
    ];

    // Format Location Type
    const locationDistribution = Object.entries(locationCounts).map(([type, count]) => ({
      type,
      count,
    }));

    return successResponse(res, {
      summary: {
        totalApplications,
        interviewsScheduled: interviews.length,
        inInterviewStage: statusCounts.INTERVIEW,
        offers: offerCount,
        rejected: statusCounts.REJECTED,
        screening: statusCounts.SCREENING,
        applied: statusCounts.APPLIED,
        interviewRate: Number(interviewRate),
        offerRate: Number(offerRate),
        responseRate: Number(responseRate),
      },
      statusDistribution,
      monthlyTrend,
      topRoles,
      locationDistribution,
    });
  } catch (error) {
    next(error);
  }
};
