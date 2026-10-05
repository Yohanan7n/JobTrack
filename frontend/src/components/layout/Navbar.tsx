import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  Briefcase,
  LogOut,
  User as UserIcon,
  Shield,
  Menu,
  Bell,
  X,
  ChevronDown,
  Sparkles,
  UserCheck,
  Building2,
} from 'lucide-react';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { user, logout, isAuthenticated, switchPersona } = useAuth();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isPersonaOpen, setIsPersonaOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const personaRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close notification & persona dropdowns whenever the user navigates
  useEffect(() => {
    setIsNotificationOpen(false);
    setIsPersonaOpen(false);
  }, [location.pathname]);

  // Close dropdowns when clicking outside or pressing Escape
  useEffect(() => {
    if (!isNotificationOpen && !isPersonaOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setIsNotificationOpen(false);
      }
      if (
        personaRef.current &&
        !personaRef.current.contains(event.target as Node)
      ) {
        setIsPersonaOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsNotificationOpen(false);
        setIsPersonaOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isNotificationOpen, isPersonaOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-200/90 bg-white/95 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-all duration-200"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-600 to-purple-600 text-white shadow-sm">
              <Briefcase className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-1.5 font-outfit">
                Work<span className="text-indigo-600">Hub</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Marketplace
                </span>
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              {/* Active Role / Persona Switcher */}
              <div className="relative" ref={personaRef}>
                <button
                  type="button"
                  onClick={() => setIsPersonaOpen(!isPersonaOpen)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all duration-200 shadow-2xs ${
                    user?.activePersona === 'EMPLOYER'
                      ? 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
                      : user?.activePersona === 'FREELANCER'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                      : 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
                  }`}
                >
                  <span className="text-slate-400 font-medium text-[11px] hidden sm:inline">Active as:</span>
                  <div className="flex items-center gap-1.5">
                    {user?.activePersona === 'EMPLOYER' ? (
                      <Building2 className="w-3.5 h-3.5 text-purple-600" />
                    ) : user?.activePersona === 'FREELANCER' ? (
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
                    )}
                    <span>
                      {user?.activePersona === 'EMPLOYER'
                        ? 'Employer / Client'
                        : user?.activePersona === 'FREELANCER'
                        ? 'Freelancer'
                        : 'Job Seeker'}
                    </span>
                  </div>
                  <ChevronDown className="w-3 h-3 opacity-70" />
                </button>

                {isPersonaOpen && (
                  <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-slate-200/90 shadow-xl p-3 z-50 animate-fade-in text-slate-800">
                    <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Switch Active Mode
                    </div>

                    <div className="space-y-1 mt-1">
                      {/* Job Seeker */}
                      <button
                        type="button"
                        onClick={async () => {
                          setIsPersonaOpen(false);
                          await switchPersona('JOB_SEEKER');
                          navigate('/dashboard');
                        }}
                        className={`w-full p-2.5 rounded-xl text-left transition-all duration-200 flex items-start gap-2.5 ${
                          user?.activePersona === 'JOB_SEEKER' || !user?.activePersona
                            ? 'bg-indigo-50/80 border border-indigo-200 text-indigo-900 font-bold'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
                          <UserCheck className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1">
                          <div className="text-xs font-bold flex items-center justify-between">
                            <span>Job Seeker</span>
                            {(user?.activePersona === 'JOB_SEEKER' || !user?.activePersona) && (
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                            )}
                          </div>
                          <p className="text-[10px] text-slate-500 font-normal leading-tight mt-0.5">
                            Search jobs, manage applications & interview prep
                          </p>
                        </div>
                      </button>

                      {/* Employer */}
                      <button
                        type="button"
                        onClick={async () => {
                          setIsPersonaOpen(false);
                          await switchPersona('EMPLOYER');
                          navigate('/employer');
                        }}
                        className={`w-full p-2.5 rounded-xl text-left transition-all duration-200 flex items-start gap-2.5 ${
                          user?.activePersona === 'EMPLOYER'
                            ? 'bg-purple-50/80 border border-purple-200 text-purple-900 font-bold'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
                          <Building2 className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1">
                          <div className="text-xs font-bold flex items-center justify-between">
                            <span>Employer / Client</span>
                            {user?.activePersona === 'EMPLOYER' && (
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                            )}
                          </div>
                          <p className="text-[10px] text-slate-500 font-normal leading-tight mt-0.5">
                            Post jobs, review applicant CVs & hire talent
                          </p>
                        </div>
                      </button>

                      {/* Freelancer */}
                      <button
                        type="button"
                        onClick={async () => {
                          setIsPersonaOpen(false);
                          await switchPersona('FREELANCER');
                          navigate('/jobs');
                        }}
                        className={`w-full p-2.5 rounded-xl text-left transition-all duration-200 flex items-start gap-2.5 ${
                          user?.activePersona === 'FREELANCER'
                            ? 'bg-emerald-50/80 border border-emerald-200 text-emerald-900 font-bold'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                          <Sparkles className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1">
                          <div className="text-xs font-bold flex items-center justify-between">
                            <span>Freelancer</span>
                            {user?.activePersona === 'FREELANCER' && (
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                            )}
                          </div>
                          <p className="text-[10px] text-slate-500 font-normal leading-tight mt-0.5">
                            Offer freelance services & contract proposals
                          </p>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Notification Center */}
              <div className="relative" ref={notificationRef}>
                <button
                  type="button"
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  title="Pipeline Notifications"
                  className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all duration-200"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
                </button>

                {isNotificationOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-slate-200/90 shadow-xl p-4 z-50 animate-fade-in text-slate-800">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                          Pipeline Notifications
                        </span>
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                          3 updates
                        </span>
                      </div>
                      <button
                        onClick={() => setIsNotificationOpen(false)}
                        className="text-slate-400 hover:text-slate-600 p-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="mt-3 space-y-2.5 max-h-72 overflow-y-auto">
                      {/* AWS Notification */}
                      <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-100 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-rose-900">Amazon Web Services</span>
                          <span className="text-[10px] font-semibold text-rose-600 bg-rose-100 px-1.5 py-0.5 rounded">
                            REJECTED
                          </span>
                        </div>
                        <p className="text-slate-600 text-[11px] leading-relaxed">
                          Cloud Support Associate status updated. Decided to focus on Full-Stack developer positions.
                        </p>
                        <span className="text-[10px] text-slate-400 block">Aug 14, 2026</span>
                      </div>

                      {/* Spotify Notification */}
                      <div className="p-3 rounded-xl bg-sky-50/70 border border-sky-100 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sky-900">Spotify</span>
                          <span className="text-[10px] font-semibold text-sky-600 bg-sky-100 px-1.5 py-0.5 rounded">
                            INTERVIEW
                          </span>
                        </div>
                        <p className="text-slate-600 text-[11px] leading-relaxed">
                          Initial Recruiter Screening scheduled with Sarah Jenkins.
                        </p>
                        <span className="text-[10px] text-slate-400 block">Upcoming</span>
                      </div>

                      {/* Stripe Notification */}
                      <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-indigo-900">Stripe</span>
                          <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-100 px-1.5 py-0.5 rounded">
                            APPLIED
                          </span>
                        </div>
                        <p className="text-slate-600 text-[11px] leading-relaxed">
                          Full-Stack Engineer application is active in your pipeline.
                        </p>
                        <span className="text-[10px] text-slate-400 block">Active</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 text-center">
                      <Link
                        to="/applications"
                        onClick={() => setIsNotificationOpen(false)}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                      >
                        View Full Pipeline Board →
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {user?.role === 'ADMIN' && (
                <Link
                  to="/admin"
                  className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition-all duration-200"
                >
                  <Shield className="w-3.5 h-3.5" />
                  Admin Panel
                </Link>
              )}

              <Link
                to="/profile"
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all duration-200"
              >
                <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center overflow-hidden">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserIcon className="w-4 h-4 text-indigo-600" />
                  )}
                </div>
                <div className="hidden md:flex flex-col text-left">
                  <span className="text-xs font-semibold text-slate-800 leading-tight">
                    {user?.name}
                  </span>
                  <span className="text-[10px] text-slate-500 capitalize">
                    {user?.role.toLowerCase()}
                  </span>
                </div>
              </Link>

              <button
                onClick={handleLogout}
                title="Log out"
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-xl transition-all duration-200"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="text-xs sm:text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-1.5 rounded-xl shadow-sm hover:shadow transition-all duration-200"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
