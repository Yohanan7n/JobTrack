import React from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Kanban,
  BarChart3,
  CalendarCheck,
  ShieldCheck,
  FileText,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { Button } from '../components/common/Button';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white shadow-lg shadow-indigo-500/20">
              <Briefcase className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white font-outfit">
              JobTrack
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-28 md:pb-24 overflow-hidden">
        {/* Ambient glow backgrounds */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[350px] h-[250px] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-6 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5" />
            The Modern Job Search Operating System
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-100 max-w-4xl mx-auto leading-[1.1] font-outfit">
            Master your job hunt with <span className="gradient-text">JobTrack</span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Manage your full-stack application pipeline, drag-and-drop stages, track interview rounds, and analyze response metrics — all in one centralized dashboard.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link to="/register">
              <Button
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight className="w-5 h-5" />}
                className="shadow-glow"
              >
                Start Tracking Today
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" size="lg">
                Explore Demo Dashboard
              </Button>
            </Link>
          </div>

          {/* Quick Demo Credentials Box for Reviewers & Recruiters */}
          <div className="mt-10 max-w-md mx-auto p-3.5 rounded-xl bg-slate-900/90 border border-indigo-500/30 text-left shadow-lg">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1.5">
              <span className="flex items-center gap-1.5 text-indigo-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> Quick Demo Credentials
              </span>
              <span className="text-[10px] text-slate-500 font-mono">1-click test</span>
            </div>
            <div className="text-xs text-slate-400 font-mono space-y-0.5">
              <div><strong className="text-slate-200">Demo User:</strong> demo@jobtrack.dev / Password123!</div>
              <div><strong className="text-slate-200">Admin User:</strong> admin@jobtrack.dev / Password123!</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="py-16 bg-slate-900/40 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-100">
              Designed for serious tech job seekers
            </h2>
            <p className="mt-3 text-sm text-slate-400">
              Stop maintaining messy spreadsheets. Enjoy a fast, reactive pipeline built with React, TypeScript, and Prisma.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mb-4">
                <Kanban className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-100">Pipeline Board</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Smooth drag-and-drop workflow spanning Applied, Screening, Interview, Offer, and Rejected stages.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-4">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-100">Deep Analytics</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Visualize interview conversion rates, monthly trends, and role distribution with interactive Recharts.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-sky-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center mb-4">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-100">Interview Scheduler</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Log upcoming live coding sessions, system design rounds, interviewer names, and feedback notes.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mb-4">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-100">Document & CV Vault</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Attach tailored resumes and cover letters directly to job applications with fast local upload and previews.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-100">Role-Based Admin Panel</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Granular permissions, account management, user suspension, and global system health monitoring.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-rose-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mb-4">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-100">Company Intelligence</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Keep track of company contacts, recruiter emails, salary ranges, and career page portals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 JobTrack Systems. Built with React, TypeScript, Express, and PostgreSQL.</p>
          <div className="flex items-center gap-4">
            <Link to="/login" className="hover:text-slate-300">Sign In</Link>
            <Link to="/register" className="hover:text-slate-300">Create Account</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
