import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/auth.service';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import {
  Briefcase,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Zap,
  User as UserIcon,
  Shield,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const paramEmail = searchParams.get('email') || '';

  const [email, setEmail] = useState(paramEmail);
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [targetPortal, setTargetPortal] = useState<'user' | 'admin'>('user');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await authService.login({ email, password });
      const { user, token } = response.data.data;
      login(token, user);

      // Route according to selected portal and user permissions
      if (targetPortal === 'admin') {
        if (user.role === 'ADMIN') {
          navigate('/admin');
        } else {
          // Standard user logged into Admin portal tab
          navigate('/dashboard');
        }
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid credentials. Please check your email and password.');
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
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/90 text-indigo-700 text-xs font-semibold mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Secure Career Pipeline Management</span>
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
            Welcome back!
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Sign in to access your confidential pipeline and applications
          </p>
        </div>

        {/* Portal Destination Selector */}
        <div className="mb-4 p-1.5 bg-slate-100/90 border border-slate-200 rounded-2xl grid grid-cols-2 gap-1.5 shadow-inner">
          <button
            type="button"
            onClick={() => setTargetPortal('user')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all duration-200 ${
              targetPortal === 'user'
                ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/80 scale-[1.01]'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <UserIcon className="w-4 h-4 text-indigo-600" />
            <span>User Side</span>
          </button>

          <button
            type="button"
            onClick={() => setTargetPortal('admin')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all duration-200 ${
              targetPortal === 'admin'
                ? 'bg-white text-purple-700 shadow-sm border border-slate-200/80 scale-[1.01]'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Shield className="w-4 h-4 text-purple-600" />
            <span>Admin Side</span>
          </button>
        </div>

        {/* Form Card */}
        <div className="bg-white/95 border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 backdrop-blur-md">
          {/* Active Portal Indicator Banner */}
          <div
            className={`mb-4 p-3 rounded-xl border flex items-center justify-between text-xs transition-colors ${
              targetPortal === 'admin'
                ? 'bg-purple-50/80 border-purple-200 text-purple-900'
                : 'bg-indigo-50/80 border-indigo-200 text-indigo-900'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span
                className={`w-2.5 h-2.5 rounded-full shrink-0 animate-pulse ${
                  targetPortal === 'admin' ? 'bg-purple-600' : 'bg-indigo-600'
                }`}
              />
              <span className="font-bold truncate">
                Destination: {targetPortal === 'admin' ? 'Admin Control Center' : 'User Pipeline Dashboard'}
              </span>
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
                targetPortal === 'admin'
                  ? 'bg-purple-100 text-purple-700 border border-purple-200'
                  : 'bg-indigo-100 text-indigo-700 border border-indigo-200'
              }`}
            >
              {targetPortal === 'admin' ? 'Admin Portal' : 'User Portal'}
            </span>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder={targetPortal === 'admin' ? 'admin@jobtrack.dev' : 'you@domain.com'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4 text-indigo-500" />}
              required
            />

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4 text-indigo-500" />}
                required
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                />
                <span className="text-xs text-slate-600 font-medium">Keep me signed in</span>
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className={`w-full mt-2 font-bold shadow-md transition-all ${
                targetPortal === 'admin'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-purple-500/20'
                  : 'shadow-indigo-500/20'
              }`}
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {targetPortal === 'admin' ? 'Sign In as Administrator / Employer' : 'Sign In as Job Seeker'}
            </Button>
          </form>

          {/* Quick Demo Credentials Box */}
          <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
            <div className="font-bold text-slate-800 flex items-center justify-between text-[11px]">
              <span>Demo Test Credentials:</span>
              <span className="text-[10px] text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded-full">
                Ready to use
              </span>
            </div>

            <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-200/80">
              <div className="text-[11px]">
                <span className="font-bold text-indigo-700">Job Seeker:</span>{' '}
                <span className="font-mono text-slate-800">demo@jobtrack.dev</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEmail('demo@jobtrack.dev');
                  setPassword('Password123!');
                  setTargetPortal('user');
                }}
                className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 px-2 py-0.5 rounded-md hover:bg-indigo-50"
              >
                Use
              </button>
            </div>

            <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-200/80">
              <div className="text-[11px]">
                <span className="font-bold text-purple-700">Admin / Employer:</span>{' '}
                <span className="font-mono text-slate-800">admin@jobtrack.dev</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@jobtrack.dev');
                  setPassword('Password123!');
                  setTargetPortal('admin');
                }}
                className="text-[11px] font-bold text-purple-600 hover:text-purple-800 px-2 py-0.5 rounded-md hover:bg-purple-50"
              >
                Use
              </button>
            </div>

            <div className="text-[11px] text-slate-500 text-center font-mono">
              Password for both: <strong className="text-slate-800">Password123!</strong>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline transition-colors"
            >
              Create free account
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
            <span>Always Free for Seekers</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Real-time Tracking</span>
          </div>
        </div>
      </div>
    </div>
  );
};

