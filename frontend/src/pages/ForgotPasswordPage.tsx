import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Briefcase, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please provide your email address.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await authService.forgotPassword(email);
      setIsSubmitted(true);
    } catch (err: any) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white shadow-lg shadow-indigo-500/20">
              <Briefcase className="h-5 w-5" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white font-outfit">
              JobTrack
            </span>
          </Link>
          <h2 className="mt-3 text-xl font-bold text-slate-100">Reset your password</h2>
          <p className="text-xs text-slate-400 mt-1">We'll send recovery instructions to your email</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl backdrop-blur-sm">
          {isSubmitted ? (
            <div className="text-center py-4 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-slate-100">Reset Instructions Sent</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                If an account exists for <span className="text-indigo-400">{email}</span>, you will receive password reset instructions shortly.
              </p>
              <Link to="/login" className="inline-block mt-4">
                <Button variant="secondary" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                  Back to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
                  {error}
                </div>
              )}

              <Input
                label="Registered Email Address"
                type="email"
                placeholder="alex@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4" />}
                required
              />

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full mt-2"
                isLoading={isLoading}
              >
                Send Reset Link
              </Button>

              <div className="text-center pt-2">
                <Link
                  to="/login"
                  className="text-xs text-slate-400 hover:text-slate-200 inline-flex items-center gap-1"
                >
                  <ArrowLeft className="w-3 h-3" /> Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
