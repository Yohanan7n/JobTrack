import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { applicationService, Application } from '../../src/services/application.service';
import { analyticsService, AnalyticsData } from '../../src/services/analytics.service';
import { interviewService, Interview } from '../../src/services/interview.service';
import { StatCard } from '../components/common/StatCard';
import { StageFunnelChart } from '../components/analytics/StageFunnelChart';
import { MonthlyTrendChart } from '../components/analytics/MonthlyTrendChart';
import { ApplicationModal } from '../components/applications/ApplicationModal';
import { Badge } from '../components/common/Badge';
import { formatDate, formatDateTime } from '../utils/formatters';
import {
  Briefcase,
  CalendarCheck,
  Award,
  XCircle,
  TrendingUp,
  Percent,
  Plus,
  ArrowRight,
  Video,
  Clock,
} from 'lucide-react';
import { Button } from '../components/common/Button';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [recentApps, setRecentApps] = useState<Application[]>([]);
  const [upcomingInterviews, setUpcomingInterviews] = useState<Interview[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const fetchDashboardData = async () => {
    try {
      const [analyticsRes, appsRes, interviewsRes] = await Promise.all([
        analyticsService.getAnalytics(),
        applicationService.getApplications({ limit: 6, sortBy: 'createdAt', order: 'desc' }),
        interviewService.getInterviews({ timeframe: 'upcoming' }),
      ]);

      setAnalytics(analyticsRes.data.data);
      setRecentApps(appsRes.data.data);
      setUpcomingInterviews(interviewsRes.data.data.slice(0, 3));
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleSaveApp = async (data: Partial<Application>) => {
    if (selectedApp) {
      await applicationService.updateApplication(selectedApp.id, data);
    } else {
      await applicationService.createApplication(data);
    }
    fetchDashboardData();
  };

  const handleDeleteApp = async (id: string) => {
    await applicationService.deleteApplication(id);
    fetchDashboardData();
  };

  const summary = analytics?.summary;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100 font-outfit">
            Welcome back, <span className="gradient-text">{user?.name}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Here's what is happening across your job applications pipeline today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/applications">
            <Button variant="secondary" size="sm">
              Open Kanban
            </Button>
          </Link>
          <Button
            onClick={() => {
              setSelectedApp(null);
              setIsModalOpen(true);
            }}
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Application
          </Button>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Applications"
          value={summary?.totalApplications ?? 0}
          subtext="Active pipeline positions"
          icon={<Briefcase className="w-5 h-5" />}
          colorScheme="indigo"
          trend={{ value: '+12% this mo', isPositive: true }}
        />
        <StatCard
          title="Interview Stage"
          value={summary?.inInterviewStage ?? 0}
          subtext={`${summary?.interviewsScheduled ?? 0} sessions scheduled`}
          icon={<CalendarCheck className="w-5 h-5" />}
          colorScheme="sky"
        />
        <StatCard
          title="Offers Received"
          value={summary?.offers ?? 0}
          subtext="Ready to evaluate & negotiate"
          icon={<Award className="w-5 h-5" />}
          colorScheme="emerald"
        />
        <StatCard
          title="Rejected / Archived"
          value={summary?.rejected ?? 0}
          subtext="Processed applications"
          icon={<XCircle className="w-5 h-5" />}
          colorScheme="rose"
        />
      </div>

      {/* Secondary Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Interview Rate</div>
            <div className="text-xl font-bold text-slate-100">
              {summary?.interviewRate ?? 0}%
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Offer Conversion Rate</div>
            <div className="text-xl font-bold text-emerald-400">
              {summary?.offerRate ?? 0}%
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Percent className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Employer Response Rate</div>
            <div className="text-xl font-bold text-purple-400">
              {summary?.responseRate ?? 0}%
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stage Funnel Chart */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-100">Applications by Stage</h3>
              <p className="text-xs text-slate-400 mt-0.5">Distribution across pipeline stages</p>
            </div>
            <Link to="/analytics" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
              Details <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {analytics?.statusDistribution && (
            <StageFunnelChart data={analytics.statusDistribution} />
          )}
        </div>

        {/* Monthly Trend Chart */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-100">Application Velocity</h3>
              <p className="text-xs text-slate-400 mt-0.5">Applications sent per month</p>
            </div>
            <Link to="/analytics" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
              Trends <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {analytics?.monthlyTrend && (
            <MonthlyTrendChart data={analytics.monthlyTrend} />
          )}
        </div>
      </div>

      {/* Upcoming Interviews & Recent Applications Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Interviews Box */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-400" />
              Upcoming Interviews
            </h3>
            <Link to="/interviews" className="text-xs text-indigo-400 hover:text-indigo-300">
              View all
            </Link>
          </div>

          <div className="flex-1 space-y-3">
            {upcomingInterviews.length === 0 ? (
              <div className="h-40 flex flex-col items-center justify-center text-center p-4 border border-dashed border-slate-800 rounded-xl">
                <p className="text-xs text-slate-400">No interviews scheduled yet.</p>
                <Link to="/interviews" className="mt-2 text-xs text-indigo-400 hover:underline">
                  + Schedule a round
                </Link>
              </div>
            ) : (
              upcomingInterviews.map((iv) => (
                <div
                  key={iv.id}
                  className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-slate-100">{iv.title}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {iv.application?.companyName} • {iv.application?.position}
                      </p>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                      {iv.type}
                    </span>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-900">
                    <span className="text-slate-300">{formatDateTime(iv.scheduledAt)}</span>
                    {iv.location && iv.location.startsWith('http') && (
                      <a
                        href={iv.location}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
                      >
                        <Video className="w-3 h-3" /> Join
                      </a>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Applications Table Preview */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-100">Recent Applications</h3>
              <p className="text-xs text-slate-400 mt-0.5">Latest additions to your pipeline</p>
            </div>
            <Link to="/applications" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
              Open Board <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 border-b border-slate-800 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Company & Role</th>
                  <th className="py-2.5 px-3">Stage</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {recentApps.map((app) => (
                  <tr
                    key={app.id}
                    onClick={() => {
                      setSelectedApp(app);
                      setIsModalOpen(true);
                    }}
                    className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-100">{app.companyName}</div>
                      <div className="text-[11px] text-slate-400">{app.position}</div>
                    </td>
                    <td className="py-3 px-3">
                      <Badge status={app.status} size="sm">
                        {app.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-slate-400">
                      {formatDate(app.applicationDate)}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedApp(app);
                          setIsModalOpen(true);
                        }}
                        className="text-indigo-400 hover:text-indigo-300 font-medium"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit/Create Modal */}
      <ApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveApp}
        onDelete={handleDeleteApp}
        initialData={selectedApp}
      />
    </div>
  );
};
