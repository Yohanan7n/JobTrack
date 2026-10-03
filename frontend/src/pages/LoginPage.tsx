import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/auth.service';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Briefcase, Lock, Mail, ArrowRight, UserCheck, Shield } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillCredentials = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4">
      {/* Background glow */}
      <div className="absolute w-[500px] h-[300px] bg-indigo-600/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white shadow-lg shadow-indigo-500/20">
              <Briefcase className="h-5 w-5" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white font-outfit">
              JobTrack
            </span>
          </Link>
          <h2 className="mt-3 text-xl font-bold text-slate-100">Welcome back</h2>
          <p className="text-xs text-slate-400 mt-1">Sign in to your application dashboard</p>
        </div>

        {/* 1-Click Quick Demo Login Box */}
        <div className="mb-4 p-3 bg-indigo-950/30 border border-indigo-500/30 rounded-xl">
          <p className="text-xs font-semibold text-indigo-300 mb-2 flex items-center justify-between">
            <span>Instant Demo Accounts:</span>
            <span className="text-[10px] text-slate-400 font-mono">click to auto-fill</span>
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillCredentials('demo@jobtrack.dev', 'Password123!')}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-600/20 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5" />
              Demo User
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('admin@jobtrack.dev', 'Password123!')}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-purple-500/30 text-purple-300 hover:bg-purple-600/20 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <Shield className="w-3.5 h-3.5" />
              Admin User
            </button>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl backdrop-blur-sm">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full mt-2"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-indigo-400 hover:text-indigo-300">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
