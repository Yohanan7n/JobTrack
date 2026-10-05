import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Kanban,
  Building2,
  Calendar,
  FileText,
  BarChart3,
  User,
  Shield,
  X,
  Briefcase,
  Users,
  Plus,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const isEmployer = user?.activePersona === 'EMPLOYER';

  const navItems = isEmployer
    ? [
        { to: '/employer', label: 'Employer Dashboard', icon: <Building2 className="w-4 h-4 text-purple-400" /> },
        { to: '/employer/post-job', label: 'Post a New Job', icon: <Plus className="w-4 h-4 text-indigo-400" /> },
        { to: '/employer/candidates', label: 'Candidate Pipeline', icon: <Users className="w-4 h-4" /> },
        { to: '/employer/talent', label: 'Browse Freelancers', icon: <Sparkles className="w-4 h-4 text-amber-400" /> },
        { to: '/jobs', label: 'Marketplace Feed', icon: <Briefcase className="w-4 h-4" /> },
        { to: '/companies', label: 'Companies & Partners', icon: <Building2 className="w-4 h-4" /> },
        { to: '/profile', label: 'Company Profile', icon: <User className="w-4 h-4" /> },
      ]
    : [
        { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
        { to: '/jobs', label: 'Find Jobs & Gigs', icon: <Briefcase className="w-4 h-4 text-amber-400" /> },
        { to: '/applications', label: 'Job Pipeline', icon: <Kanban className="w-4 h-4" /> },
        { to: '/companies', label: 'Target Companies', icon: <Building2 className="w-4 h-4" /> },
        { to: '/interviews', label: 'Interviews', icon: <Calendar className="w-4 h-4" /> },
        { to: '/documents', label: 'Documents & CVs', icon: <FileText className="w-4 h-4" /> },
        { to: '/analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
        { to: '/profile', label: 'Profile & Settings', icon: <User className="w-4 h-4" /> },
      ];

  if (user?.role === 'ADMIN') {
    navItems.push({
      to: '/admin',
      label: 'Admin Control Center',
      icon: <Shield className="w-4 h-4 text-purple-400" />,
    });
  }

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container - Dark Navy Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 border-r border-slate-800/80 bg-[#0B132B] p-4 flex flex-col transition-transform duration-200 lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800 lg:hidden">
          <span className="font-bold text-white font-outfit">WorkHub Menu</span>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-3 mb-2">
          {isEmployer ? 'Employer Portal' : 'Job Seeker Workspace'}
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70 border border-transparent'
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Quick summary box in dark navy sidebar */}
        <div className="p-3.5 mt-auto rounded-xl bg-slate-900/80 border border-slate-800/90 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-200">
              {isEmployer ? 'Employer Mode' : 'Job Seeker Mode'}
            </span>
            <span className="text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
              Active
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400 leading-relaxed">
            {isEmployer
              ? 'Post open vacancies and review incoming candidate applications in real time.'
              : 'Apply to jobs in the marketplace and track your progress across Kanban stages.'}
          </p>
        </div>
      </aside>
    </>
  );
};
