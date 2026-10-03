import React from 'react';
import { ApplicationStatus, STATUS_CONFIG } from '../../utils/constants';

interface BadgeProps {
  status?: ApplicationStatus;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral';
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  status,
  variant,
  children,
  className = '',
  size = 'md',
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  if (status && STATUS_CONFIG[status]) {
    const config = STATUS_CONFIG[status];
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${config.badgeBg} ${config.badgeText} ${config.badgeBorder} ${sizeClasses} ${className}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />
        {children || config.label}
      </span>
    );
  }

  const variantStyles = {
    primary: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    secondary: 'bg-purple-50 text-purple-700 border-purple-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${
        variantStyles[variant || 'neutral']
      } ${sizeClasses} ${className}`}
    >
      {children}
    </span>
  );
};
