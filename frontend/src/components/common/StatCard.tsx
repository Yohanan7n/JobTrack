import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  colorScheme?: 'indigo' | 'emerald' | 'amber' | 'sky' | 'rose' | 'purple';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtext,
  icon,
  trend,
  colorScheme = 'indigo',
}) => {
  const schemeStyles = {
    indigo: {
      border: 'hover:border-indigo-400',
      iconBg: 'bg-indigo-50 text-indigo-600 border border-indigo-100',
      glow: 'group-hover:shadow-[0_4px_20px_-2px_rgba(99,102,241,0.15)]',
    },
    emerald: {
      border: 'hover:border-emerald-400',
      iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
      glow: 'group-hover:shadow-[0_4px_20px_-2px_rgba(16,185,129,0.15)]',
    },
    amber: {
      border: 'hover:border-amber-400',
      iconBg: 'bg-amber-50 text-amber-600 border border-amber-100',
      glow: 'group-hover:shadow-[0_4px_20px_-2px_rgba(245,158,11,0.15)]',
    },
    sky: {
      border: 'hover:border-sky-400',
      iconBg: 'bg-sky-50 text-sky-600 border border-sky-100',
      glow: 'group-hover:shadow-[0_4px_20px_-2px_rgba(14,165,233,0.15)]',
    },
    rose: {
      border: 'hover:border-rose-400',
      iconBg: 'bg-rose-50 text-rose-600 border border-rose-100',
      glow: 'group-hover:shadow-[0_4px_20px_-2px_rgba(244,63,94,0.15)]',
    },
    purple: {
      border: 'hover:border-purple-400',
      iconBg: 'bg-purple-50 text-purple-600 border border-purple-100',
      glow: 'group-hover:shadow-[0_4px_20px_-2px_rgba(168,85,247,0.15)]',
    },
  };

  const currentScheme = schemeStyles[colorScheme];

  return (
    <div
      className={`group relative p-6 bg-white border border-slate-200/90 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 ${currentScheme.border} ${currentScheme.glow}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        <div className={`p-2.5 rounded-xl ${currentScheme.iconBg}`}>{icon}</div>
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-2xl font-bold text-slate-900 tracking-tight">{value}</span>
        {trend && (
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              trend.isPositive
                ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                : 'text-rose-700 bg-rose-50 border border-rose-200'
            }`}
          >
            {trend.value}
          </span>
        )}
      </div>

      {subtext && <p className="mt-1.5 text-xs text-slate-500">{subtext}</p>}
    </div>
  );
};
