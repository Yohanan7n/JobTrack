import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/auth.service';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import {
  Briefcase,
  Lock,
  Mail,
  User,
  ArrowRight,
  Sparkles,
  Shield,
  ShieldCheck,
  CheckCircle2,
  Zap,
} from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accountRole, setAccountRole] = useState<'USER' | 'ADMIN'>('USER');
  const [error, setError] = useState<string | null>(null);
  const [isExistingAccount, setIsExistingAccount] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName || !cleanEmail || !password) {
      setError('All fields are required.');
      setIsExistingAccount(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      setIsExistingAccount(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setIsExistingAccount(false);
      const response = await authService.register({
        name: cleanName,
        email: cleanEmail,
        password,
        role: accountRole,
      });
      const { user, token } = response.data.data;
      login(token, user);

      if (user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      const serverMsg = err.response?.data?.error || '';
      const isDuplicate =
        err.response?.status === 409 ||
        serverMsg.toLowerCase().includes('already exists') ||
        serverMsg.toLowerCase().includes('already in use');

      if (isDuplicate) {
        setIsExistingAccount(true);
        setError(`An account with the email "${cleanEmail}" already exists.`);
      } else {
        setIsExistingAccount(false);
        setError(serverMsg || 'Registration failed. Please check your information.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden flex flex-col justify-center items-center p-4 sm:p-6">
      {/* Vibrant Ambient Glow Accents */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-200/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-200/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-20 w-80 h-80 bg-blue-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#e0e7ff_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/90 text-indigo-700 text-xs font-semibold mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Join 10,000+ Job Seekers</span>
          </div>

          <div className="flex justify-center mb-2">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 ring-4 ring-white group-hover:scale-105 transition-transform duration-200">
                <Briefcase className="h-5 w-5" />
              </div>
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-outfit">
                Job<span className="gradient-text">Track</span>
              </span>
            </Link>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Create your account
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Start tracking your job search pipeline in seconds
          </p>
        </div>

        <div className="bg-white/95 border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 backdrop-blur-md">
          {error && (
            <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                <span className="font-semibold">{error}</span>
              </div>

              {isExistingAccount && (
                <div className="pt-2 border-t border-rose-200/80 flex items-center justify-between">
                  <span className="text-[11px] text-rose-600">Already registered?</span>
                  <Link
                    to={`/login?email=${encodeURIComponent(email.trim().toLowerCase())}`}
                    className="font-bold text-indigo-600 hover:text-indigo-800 underline flex items-center gap-1 text-xs"
                  >
                    Sign In with this email →
                  </Link>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Account Purpose / Role Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                I am creating an account as:
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setAccountRole('USER')}
                  className={`p-3 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                    accountRole === 'USER'
                      ? 'bg-indigo-50/80 border-indigo-500 ring-2 ring-indigo-500/20 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                      <User className="w-4 h-4" />
                    </div>
                    {accountRole === 'USER' && (
                      <span className="w-2 h-2 rounded-full bg-indigo-600" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Job Seeker</div>
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                      Seek jobs, track applications & interviews
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setAccountRole('ADMIN')}
                  className={`p-3 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                    accountRole === 'ADMIN'
                      ? 'bg-purple-50/80 border-purple-500 ring-2 ring-purple-500/20 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                      <Shield className="w-4 h-4 text-purple-700" />
                    </div>
                    {accountRole === 'ADMIN' && (
                      <span className="w-2 h-2 rounded-full bg-purple-600" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Employer / Admin</div>
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                      Recruit talent, manage target companies & platform
                    </p>
                  </div>
                </button>
              </div>

              {/* Dynamic Role Capability Breakdown */}
              <div className="mt-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/90 text-xs">
                <div className="flex items-center justify-between font-bold text-[11px] text-slate-700 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    {accountRole === 'USER' ? (
                      <>
                        <User className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Job Seeker Privileges:</span>
                      </>
                    ) : (
                      <>
                        <Shield className="w-3.5 h-3.5 text-purple-600" />
                        <span>Employer / Admin Privileges:</span>
                      </>
                    )}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      accountRole === 'USER'
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'bg-purple-100 text-purple-700'
                    }`}
                  >
                    {accountRole === 'USER' ? 'Seeking Employment' : 'Employing & Overseeing'}
                  </span>
                </div>

                {accountRole === 'USER' ? (
                  <ul className="text-[11px] text-slate-600 space-y-1 list-disc list-inside">
                    <li>Apply to job positions & organize on Kanban board</li>
                    <li>Research Target Companies & track applications</li>
                    <li>Schedule & log interview dates and rounds</li>
                    <li>Upload resumes & view personal job search analytics</li>
                  </ul>
                ) : (
                  <ul className="text-[11px] text-slate-600 space-y-1 list-disc list-inside">
                    <li>Access the Admin Control Center & user directory</li>
                    <li>Review registered candidates, applicants, and statuses</li>
                    <li>Promote users, assign permissions & manage access</li>
                    <li>Monitor platform metrics and application health</li>
                  </ul>
                )}
              </div>
            </div>

            <Input
              label="Full Name"
              type="text"
              placeholder="Alex Rivera"
              value={name}
              onChange={(e) => setName(e.target.value)}
              leftIcon={<User className="w-4 h-4 text-indigo-500" />}
              required
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="you@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4 text-indigo-500" />}
              required
            />

            <Input
              label="Password (min 6 characters)"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4 text-indigo-500" />}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className={`w-full mt-2 font-bold shadow-md transition-all ${
                accountRole === 'ADMIN'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-purple-500/20'
                  : 'shadow-indigo-500/20'
              }`}
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {accountRole === 'ADMIN' ? 'Create Employer / Admin Account' : 'Create Job Seeker Account'}
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline transition-colors"
            >
              Sign in here
            </Link>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 mt-6 text-[11px] text-slate-500 font-medium">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Secure & Encrypted</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>100% Free Setup</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Instant Access</span>
          </div>
        </div>
      </div>
    </div>
  );
};

