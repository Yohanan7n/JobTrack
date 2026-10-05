import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobService, JobPosting } from '../services/job.service';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import {
  Search,
  Briefcase,
  MapPin,
  DollarSign,
  Sparkles,
  CheckCircle2,
  Send,
  ChevronRight,
  UserCheck,
} from 'lucide-react';

export const JobMarketplacePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState<string>('ALL');
  const [employmentFilter, setEmploymentFilter] = useState<string>('ALL');

  // Apply Modal state
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applyNotes, setApplyNotes] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [applySuccessMsg, setApplySuccessMsg] = useState<string | null>(null);

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      const res = await jobService.getJobs({
        search: search || undefined,
        locationType: locationFilter !== 'ALL' ? locationFilter : undefined,
        employmentType: employmentFilter !== 'ALL' ? employmentFilter : undefined,
      });
      setJobs(res.data.data);
    } catch (err) {
      console.error('Failed to load marketplace jobs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchJobs();
    }, 250);
    return () => clearTimeout(delayDebounce);
  }, [search, locationFilter, employmentFilter]);

  const handleOpenApply = (job: JobPosting) => {
    setSelectedJob(job);
    setApplyNotes('');
    setApplySuccessMsg(null);
    setIsApplyModalOpen(true);
  };

  const handleSubmitApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;

    try {
      setIsApplying(true);
      await jobService.applyToJob(selectedJob.id, {
        notes: applyNotes || `Applied directly via WorkHub Marketplace for ${selectedJob.title}`,
      });
      setApplySuccessMsg('Application submitted successfully! Added to your Pipeline.');
      setTimeout(() => {
        setIsApplyModalOpen(false);
        fetchJobs();
      }, 1500);
    } catch (err: any) {
      console.error('Failed to apply:', err);
      alert(err.response?.data?.error || 'Failed to submit application.');
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 p-6 sm:p-8 text-white shadow-xl shadow-indigo-950/10">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-indigo-200 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>WorkHub Marketplace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-outfit">
            Explore Open Roles & Freelance Gigs
          </h1>
          <p className="text-xs sm:text-sm text-indigo-100/90 mt-2 leading-relaxed">
            Apply with 1-click using your profile. Applications are automatically synchronized with
            your personal Kanban Pipeline and Interview tracker.
          </p>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
        <div className="absolute right-32 -bottom-20 w-72 h-72 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by job title, company, or tech stack (e.g. React, Node.js)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all duration-200"
          />
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Location Type */}
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="ALL">All Workplaces</option>
            <option value="REMOTE">Remote</option>
            <option value="HYBRID">Hybrid</option>
            <option value="ONSITE">On-Site</option>
          </select>

          {/* Employment Type */}
          <select
            value={employmentFilter}
            onChange={(e) => setEmploymentFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="ALL">All Job Types</option>
            <option value="FULL_TIME">Full-Time</option>
            <option value="CONTRACT">Contract / Freelance</option>
            <option value="PART_TIME">Part-Time</option>
            <option value="INTERNSHIP">Internship</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-semibold text-slate-600">
          Showing <span className="text-indigo-600 font-bold">{jobs.length}</span> verified job postings
        </span>
        <button
          onClick={() => navigate('/applications')}
          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group"
        >
          <span>View My Pipeline</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Job Listings Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="h-48 rounded-2xl bg-white border border-slate-200 animate-pulse p-6"
            />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-sm">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No jobs match your search</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search query or clear filters to see more opportunities.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="p-6 rounded-2xl bg-white border border-slate-200/90 hover:border-indigo-400/80 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-base font-outfit shadow-xs">
                      {job.companyName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {job.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-semibold text-slate-700">{job.companyName}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-[11px] text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {job.location || 'Remote'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  {job.hasApplied ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Applied
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
                      {job.locationType}
                    </span>
                  )}
                </div>

                {/* Badges: Salary, Employment Type */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {job.salaryRange && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 font-semibold text-xs border border-emerald-100">
                      <DollarSign className="w-3 h-3 text-emerald-600" />
                      {job.salaryRange}
                    </span>
                  )}
                  <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-medium text-xs">
                    {job.employmentType.replace('_', ' ')}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-lg bg-purple-50 text-purple-700 font-medium text-xs">
                    {job.applicantCount || 0} applicants
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                  {job.description}
                </p>

                {/* Skills tags */}
                {job.skills && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {job.skills.split(',').slice(0, 4).map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600 font-medium"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Footer: Action */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Posted {new Date(job.createdAt).toLocaleDateString()}
                </span>

                {job.hasApplied ? (
                  <Button
                    onClick={() => navigate('/applications')}
                    variant="outline"
                    size="sm"
                    className="text-xs font-semibold"
                  >
                    View in Pipeline
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleOpenApply(job)}
                    variant="primary"
                    size="sm"
                    className="text-xs font-bold shadow-xs hover:shadow"
                    rightIcon={<Send className="w-3.5 h-3.5" />}
                  >
                    1-Click Apply
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Apply Modal */}
      {selectedJob && (
        <Modal
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
          title={`Apply for ${selectedJob.title}`}
          subtitle={`Submit your application to ${selectedJob.companyName}`}
        >
          {applySuccessMsg ? (
            <div className="p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">{applySuccessMsg}</h3>
              <p className="text-xs text-slate-500">
                You can view and manage this application on your Kanban Pipeline.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmitApply} className="space-y-4">
              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-indigo-600" />
                  <span>Applying as: {user?.name} ({user?.email})</span>
                </div>
                <p className="text-[11px] text-indigo-700">
                  Your profile information and stored CVs will be shared with {selectedJob.companyName}.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Application Note / Cover Note (Optional)
                </label>
                <textarea
                  rows={4}
                  value={applyNotes}
                  onChange={(e) => setApplyNotes(e.target.value)}
                  placeholder="Introduce yourself, your key experience with these skills, and why you are excited about this opportunity..."
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsApplyModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={isApplying}
                  rightIcon={<Send className="w-3.5 h-3.5" />}
                >
                  Confirm Application
                </Button>
              </div>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
};
