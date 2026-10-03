import React, { useState, useEffect } from 'react';
import { analyticsService, AnalyticsData } from '../services/analytics.service';
import { StageFunnelChart } from '../components/analytics/StageFunnelChart';
import { MonthlyTrendChart } from '../components/analytics/MonthlyTrendChart';
import { RolesPieChart } from '../components/analytics/RolesPieChart';
import { StatCard } from '../components/common/StatCard';
import {
  TrendingUp,
  Award,
  Percent,
  Briefcase,
  PieChart as PieIcon,
  BarChart,
  MapPin,
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await analyticsService.getAnalytics();
        setData(res.data.data);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      }
    };
    fetchAnalytics();
  }, []);

  const summary = data?.summary;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="pb-2 border-b border-slate-800">
        <h1 className="text-2xl font-bold tracking-tight text-slate-100 font-outfit">
          Search Intelligence & Analytics
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Measure application throughput, interview conversion rates, and role breakdowns.
        </p>
      </div>

      {/* High level conversion metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Pipeline Volume"
          value={summary?.totalApplications ?? 0}
          subtext="Total applications recorded"
          icon={<Briefcase className="w-5 h-5" />}
          colorScheme="indigo"
        />
        <StatCard
          title="Interview Rate"
          value={`${summary?.interviewRate ?? 0}%`}
          subtext={`${summary?.inInterviewStage ?? 0} in interview pipeline`}
          icon={<TrendingUp className="w-5 h-5" />}
          colorScheme="sky"
        />
        <StatCard
          title="Offer Rate"
          value={`${summary?.offerRate ?? 0}%`}
          subtext={`${summary?.offers ?? 0} offers received`}
          icon={<Award className="w-5 h-5" />}
          colorScheme="emerald"
        />
        <StatCard
          title="Response Rate"
          value={`${summary?.responseRate ?? 0}%`}
          subtext="Positions moved beyond initial stage"
          icon={<Percent className="w-5 h-5" />}
          colorScheme="purple"
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly applications */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <BarChart className="w-4 h-4 text-indigo-400" />
                Applications Per Month
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Historical submission volume</p>
            </div>
          </div>
          {data?.monthlyTrend && <MonthlyTrendChart data={data.monthlyTrend} />}
        </div>

        {/* Funnel distribution */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <BarChart className="w-4 h-4 text-emerald-400" />
                Applications by Stage
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Count of roles across pipeline</p>
            </div>
          </div>
          {data?.statusDistribution && (
            <StageFunnelChart data={data.statusDistribution} />
          )}
        </div>
      </div>

      {/* Roles & Workplace Type Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most common roles */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-purple-400" />
                Target Job Roles
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Distribution of applied positions</p>
            </div>
          </div>
          {data?.topRoles && data.topRoles.length > 0 ? (
            <RolesPieChart data={data.topRoles} />
          ) : (
            <div className="h-64 flex items-center justify-center text-xs text-slate-500">
              Not enough data yet
            </div>
          )}
        </div>

        {/* Workplace Type Breakdown */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 mb-1">
              <MapPin className="w-4 h-4 text-amber-400" />
              Workplace Model Breakdown
            </h3>
            <p className="text-xs text-slate-400 mb-6">Remote vs Hybrid vs On-site positions</p>

            <div className="space-y-4">
              {data?.locationDistribution?.map((loc) => {
                const total = summary?.totalApplications || 1;
                const percentage = Math.round((loc.count / total) * 100);
                return (
                  <div key={loc.type} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-300 capitalize">{loc.type.toLowerCase()}</span>
                      <span className="text-slate-400">
                        {loc.count} ({percentage}%)
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          loc.type === 'REMOTE'
                            ? 'bg-indigo-500'
                            : loc.type === 'HYBRID'
                            ? 'bg-sky-500'
                            : 'bg-amber-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/20 mt-6">
            <span className="text-xs font-semibold text-indigo-300 block mb-1">
              Key Insight
            </span>
            <p className="text-xs text-slate-400 leading-relaxed">
              Targeting Remote roles yields the highest initial interview conversion rate across your pipeline.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
