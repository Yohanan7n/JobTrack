import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { jobService, JobPosting } from '../services/job.service';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Modal } from '../components/common/Modal';
import {
  Briefcase,
  Users,
  Plus,
  CheckCircle2,
  Clock,
  Trash2,
  Sparkles,
  Building2,
} from 'lucide-react';

interface EmployerHubPageProps {
  activeTab?: 'jobs' | 'post' | 'candidates' | 'talent';
}

export const EmployerHubPage: React.FC<EmployerHubPageProps> = ({ activeTab: initialTab = 'jobs' }) => {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState<'jobs' | 'post' | 'candidates' | 'talent'>(initialTab);

  const [myJobs, setMyJobs] = useState<JobPosting[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Post Job Form State
  const [formData, setFormData] = useState({
    title: '',
    companyName: user?.companyName || 'TechVentures Studio',
    location: 'Remote',
    locationType: 'REMOTE' as 'REMOTE' | 'HYBRID' | 'ONSITE',
    employmentType: 'FULL_TIME' as 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'FREELANCE',
    salaryRange: '$120,000 - $150,000',
    description: '',
    requirements: '',
    skills: 'React, TypeScript, Node.js',
  });
  const [isSubmittingJob, setIsSubmittingJob] = useState(false);
  const [postJobSuccess, setPostJobSuccess] = useState(false);

  // Review Applicants Modal State
  const [selectedJobForReview, setSelectedJobForReview] = useState<JobPosting | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [jobApplicants, setJobApplicants] = useState<any[]>([]);
  const [isLoadingApplicants, setIsLoadingApplicants] = useState(false);

  const fetchMyJobs = async () => {
    try {
      setIsLoading(true);
      const res = await jobService.getMyJobs();
      setMyJobs(res.data.data);
    } catch (err) {
      console.error('Failed to fetch employer jobs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      alert('Please provide a job title and description.');
      return;
    }

    try {
      setIsSubmittingJob(true);
      await jobService.createJob(formData);
      setPostJobSuccess(true);
      fetchMyJobs();
      setTimeout(() => {
        setPostJobSuccess(false);
        setCurrentTab('jobs');
        setFormData({
          title: '',
          companyName: user?.companyName || 'TechVentures Studio',
          location: 'Remote',
          locationType: 'REMOTE',
          employmentType: 'FULL_TIME',
          salaryRange: '$120,000 - $150,000',
          description: '',
          requirements: '',
          skills: 'React, TypeScript, Node.js',
        });
      }, 1200);
    } catch (err: any) {
      console.error('Failed to post job:', err);
      alert(err.response?.data?.error || 'Failed to post job.');
    } finally {
      setIsSubmittingJob(false);
    }
  };

  const handleOpenReview = async (job: JobPosting) => {
    setSelectedJobForReview(job);
    setIsReviewModalOpen(true);
    try {
      setIsLoadingApplicants(true);
      const res = await jobService.getJobById(job.id);
      setJobApplicants(res.data.data.applicants || []);
    } catch (err) {
      console.error('Failed to load applicants:', err);
    } finally {
      setIsLoadingApplicants(false);
    }
  };

  const handleUpdateStatus = async (applicationId: string, newStatus: string) => {
    if (!selectedJobForReview) return;
    try {
      await jobService.updateApplicantStatus(selectedJobForReview.id, applicationId, {
        status: newStatus,
      });
      setJobApplicants((prev) =>
        prev.map((app) => (app.id === applicationId ? { ...app, status: newStatus } : app))
      );
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job posting?')) return;
    try {
      await jobService.deleteJob(jobId);
      fetchMyJobs();
    } catch (err) {
      console.error('Failed to delete job:', err);
    }
  };

  // Metrics
  const totalApplicants = myJobs.reduce((acc, j) => acc + (j.applicantCount || 0), 0);
  const openPositions = myJobs.filter((j) => j.status === 'OPEN').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-purple-200 text-xs font-semibold mb-3">
            <Building2 className="w-3.5 h-3.5 text-purple-300" />
            <span>Employer & Recruiter Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-outfit">
            Hiring & Candidate Management
          </h1>
          <p className="text-xs sm:text-sm text-purple-100/90 mt-2 leading-relaxed">
            Post open positions, source top engineering talent, review inbound candidate resumes, and
            shortlist applicants for interview rounds.
          </p>
        </div>

        {/* Decorative ambient blur */}
        <div className="absolute right-0 top-0 w-80 h-80 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
            <span>Open Jobs</span>
            <Briefcase className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-outfit">{openPositions}</div>
          <span className="text-[11px] text-emerald-600 font-medium">Actively accepting candidates</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
            <span>Total Applicants</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-outfit">{totalApplicants}</div>
          <span className="text-[11px] text-slate-500 font-medium">Inbound profile submissions</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
            <span>Live Interviews</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-outfit">3</div>
          <span className="text-[11px] text-amber-600 font-medium">Scheduled this week</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
            <span>Offers Extended</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-outfit">2</div>
          <span className="text-[11px] text-emerald-600 font-medium">Ready for onboarding</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setCurrentTab('jobs')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center gap-2 ${
            currentTab === 'jobs'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>My Job Postings ({myJobs.length})</span>
        </button>

        <button
          onClick={() => setCurrentTab('post')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center gap-2 ${
            currentTab === 'post'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Post a New Job</span>
        </button>

        <button
          onClick={() => setCurrentTab('talent')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center gap-2 ${
            currentTab === 'talent'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Browse Talent & Freelancers</span>
        </button>
      </div>

      {/* TAB CONTENT: MY JOB POSTINGS */}
      {currentTab === 'jobs' && (
        <div className="space-y-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((n) => (
                <div key={n} className="h-44 rounded-2xl bg-white border border-slate-200 animate-pulse" />
              ))}
            </div>
          ) : myJobs.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No active job postings</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Post your first open role or freelance project to start receiving applications.
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setCurrentTab('post')}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Post Your First Job
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myJobs.map((job) => (
                <div
                  key={job.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:border-purple-300 transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <h3 className="text-base font-bold text-slate-900">{job.title}</h3>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                          <span className="font-semibold text-slate-700">{job.companyName}</span>
                          <span>•</span>
                          <span>{job.location || 'Remote'}</span>
                          <span>•</span>
                          <span className="uppercase text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                            {job.locationType}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          job.status === 'OPEN'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {job.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 my-2.5">
                      {job.salaryRange && (
                        <span className="text-xs font-semibold text-slate-700 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200/80">
                          {job.salaryRange}
                        </span>
                      )}
                      <span className="text-xs text-slate-600 bg-purple-50 text-purple-700 font-semibold px-2 py-0.5 rounded-md">
                        {job.applicantCount || 0} candidate(s) applied
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>
                  </div>

                  <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => handleDeleteJob(job.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Posting"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleOpenReview(job)}
                      className="bg-purple-600 hover:bg-purple-700 text-xs font-bold"
                      rightIcon={<Users className="w-3.5 h-3.5" />}
                    >
                      Review Candidates ({job.applicantCount || 0})
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: POST A NEW JOB */}
      {currentTab === 'post' && (
        <div className="max-w-2xl bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900 font-outfit">Create Job Vacancy</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Fill in the details to publish your job posting to the WorkHub Marketplace.
            </p>
          </div>

          {postJobSuccess ? (
            <div className="p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Job Published Successfully!</h3>
              <p className="text-xs text-slate-500">
                Candidates can now discover and apply to this position in the marketplace.
              </p>
            </div>
          ) : (
            <form onSubmit={handleCreateJob} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Job Title"
                  placeholder="e.g. Senior Frontend Engineer"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
                <Input
                  label="Company Name"
                  placeholder="e.g. Acme Inc."
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. San Francisco, CA"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Workplace Type
                  </label>
                  <select
                    value={formData.locationType}
                    onChange={(e: any) => setFormData({ ...formData, locationType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-500/20"
                  >
                    <option value="REMOTE">Remote</option>
                    <option value="HYBRID">Hybrid</option>
                    <option value="ONSITE">On-Site</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Employment Type
                  </label>
                  <select
                    value={formData.employmentType}
                    onChange={(e: any) => setFormData({ ...formData, employmentType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-500/20"
                  >
                    <option value="FULL_TIME">Full-Time</option>
                    <option value="CONTRACT">Contract</option>
                    <option value="FREELANCE">Freelance</option>
                    <option value="PART_TIME">Part-Time</option>
                  </select>
                </div>
              </div>

              <Input
                label="Salary Range / Hourly Rate"
                placeholder="e.g. $130,000 - $160,000 or $75/hr"
                value={formData.salaryRange}
                onChange={(e) => setFormData({ ...formData, salaryRange: e.target.value })}
              />

              <Input
                label="Required Skills (comma separated)"
                placeholder="e.g. React, TypeScript, Node.js, GraphQL"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              />

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Job Description & Responsibilities
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe the role, day-to-day responsibilities, and team culture..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-500/20"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Qualifications & Requirements (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Key qualifications, years of experience, or degree requirements..."
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentTab('jobs')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={isSubmittingJob}
                  className="bg-purple-600 hover:bg-purple-700 font-bold"
                  rightIcon={<Plus className="w-4 h-4" />}
                >
                  Publish Job Posting
                </Button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* TAB CONTENT: BROWSE TALENT & FREELANCERS */}
      {currentTab === 'talent' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-100 flex items-center justify-between text-xs text-indigo-900">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>
                <strong>Freelancer & Talent Directory:</strong> Directly hire vetted engineers, designers, and contractors.
              </span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-200 text-indigo-800 px-2 py-0.5 rounded-full">
              Phase 2 Live
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Talent Card: Alex Rivera */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-200">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
                      alt="Alex Rivera"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Alex Rivera</h3>
                    <p className="text-xs text-indigo-600 font-medium">Full-Stack Developer</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 w-fit mb-3">
                  <span>$65 / hour</span>
                  <span className="text-slate-300">•</span>
                  <span>Available for Hire</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  Passionate developer specializing in React, TypeScript, Node.js, and Postgres. Built multiple production web apps with rich UX.
                </p>

                <div className="flex flex-wrap gap-1">
                  {['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'TailwindCSS'].map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700 font-medium"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">2+ years exp</span>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => alert('Invitation sent to candidate!')}
                  className="text-xs font-semibold"
                >
                  Invite to Job
                </Button>
              </div>
            </div>

            {/* Talent Card: Elena Rostova */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-200">
                    <img
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150"
                      alt="Elena Rostova"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Elena Rostova</h3>
                    <p className="text-xs text-purple-600 font-medium">UI/UX & Product Designer</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 w-fit mb-3">
                  <span>$80 / hour</span>
                  <span className="text-slate-300">•</span>
                  <span>Available for Hire</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  Creating human-centered design systems, design tokens, and high-fidelity prototypes in Figma for modern SaaS and mobile platforms.
                </p>

                <div className="flex flex-wrap gap-1">
                  {['Figma', 'Design Systems', 'Prototyping', 'User Research'].map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700 font-medium"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">4+ years exp</span>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => alert('Invitation sent to candidate!')}
                  className="text-xs font-semibold"
                >
                  Invite to Job
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Review Applicants Modal */}
      {selectedJobForReview && (
        <Modal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          title={`Applicants for ${selectedJobForReview.title}`}
          subtitle={`${jobApplicants.length} candidate(s) applied`}
        >
          {isLoadingApplicants ? (
            <div className="py-8 text-center text-xs text-slate-500">Loading candidate records...</div>
          ) : jobApplicants.length === 0 ? (
            <div className="py-8 text-center space-y-2">
              <Users className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-500">No applications received yet for this position.</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              {jobApplicants.map((app) => (
                <div
                  key={app.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full overflow-hidden bg-indigo-100 flex items-center justify-center font-bold text-indigo-700">
                        {app.user?.name?.slice(0, 2) || 'CA'}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{app.user?.name}</div>
                        <div className="text-[11px] text-slate-500">{app.user?.email}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="text-[10px] font-semibold text-slate-500">Stage:</label>
                      <select
                        value={app.status}
                        onChange={(e) => handleUpdateStatus(app.id, e.target.value)}
                        className="px-2.5 py-1 rounded-lg border border-slate-300 bg-white font-bold text-[11px] text-slate-800"
                      >
                        <option value="APPLIED">Applied</option>
                        <option value="SCREENING">Screening</option>
                        <option value="INTERVIEW">Interview</option>
                        <option value="OFFER">Offer Extended</option>
                        <option value="REJECTED">Archived</option>
                      </select>
                    </div>
                  </div>

                  {app.notes && (
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 text-[11px] text-slate-700">
                      <strong>Cover Note:</strong> {app.notes}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span>Applied on {new Date(app.applicationDate).toLocaleDateString()}</span>
                    <span className="font-semibold text-indigo-600">
                      {app.user?.title || 'Job Seeker Candidate'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};
