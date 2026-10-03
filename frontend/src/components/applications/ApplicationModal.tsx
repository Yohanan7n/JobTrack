import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Application } from '../../services/application.service';
import {
  ApplicationStatus,
  KANBAN_STAGES,
  LOCATION_TYPES,
  EMPLOYMENT_TYPES,
  STATUS_CONFIG,
} from '../../utils/constants';
import {
  Star,
  Trash2,
  Calendar,
  Plus,
  ExternalLink,
  Briefcase,
  AlertCircle,
  CheckCircle2,
  Clock,
  Edit3,
  FileText,
  Mail,
  User,
  Info,
  Video,
} from 'lucide-react';
import { formatDateTime, formatDate } from '../../utils/formatters';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (appData: Partial<Application>) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  onScheduleInterview?: (appId: string) => void;
  initialData?: Application | null;
  defaultStatus?: ApplicationStatus;
}

export const ApplicationModal: React.FC<ApplicationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  onScheduleInterview,
  initialData,
  defaultStatus = 'APPLIED',
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'edit'>('overview');
  const [formData, setFormData] = useState<Partial<Application>>({
    companyName: '',
    position: '',
    status: defaultStatus,
    location: '',
    locationType: 'REMOTE',
    employmentType: 'FULL_TIME',
    salary: '',
    applicationDate: new Date().toISOString().split('T')[0],
    jobDescription: '',
    jobUrl: '',
    contactPerson: '',
    contactEmail: '',
    cvUsed: '',
    notes: '',
    rating: 3,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        applicationDate: initialData.applicationDate
          ? new Date(initialData.applicationDate).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
      });
      setActiveTab('overview');
    } else {
      setFormData({
        companyName: '',
        position: '',
        status: defaultStatus,
        location: '',
        locationType: 'REMOTE',
        employmentType: 'FULL_TIME',
        salary: '',
        applicationDate: new Date().toISOString().split('T')[0],
        jobDescription: '',
        jobUrl: '',
        contactPerson: '',
        contactEmail: '',
        cvUsed: '',
        notes: '',
        rating: 3,
      });
      setActiveTab('edit');
    }
    setError(null);
  }, [initialData, defaultStatus, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName?.trim() || !formData.position?.trim()) {
      setError('Company name and job position are required.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await onSave(formData);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save application');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!initialData?.id || !onDelete) return;
    if (window.confirm('Are you sure you want to delete this job application?')) {
      try {
        setIsDeleting(true);
        await onDelete(initialData.id);
        onClose();
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to delete application');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const renderStatusNotification = (status: ApplicationStatus) => {
    switch (status) {
      case 'REJECTED':
        return (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200/90 text-rose-900 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-rose-100 text-rose-700 shrink-0 mt-0.5">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
                    Status Notification • Rejected
                  </span>
                  <span className="text-[11px] text-rose-500 font-medium">
                    {formatDate(formData.applicationDate)}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-rose-900 mt-0.5">
                  Application Not Moving Forward
                </h4>
                <p className="text-xs text-rose-700/90 mt-1 leading-relaxed">
                  {formData.notes ||
                    'Candidate profile was not selected for this position. Review recruiter notes below.'}
                </p>
              </div>
            </div>
          </div>
        );

      case 'OFFER':
        return (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/90 text-emerald-900 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 shrink-0 mt-0.5">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                    Status Notification • Offer Extended 🎉
                  </span>
                  {formData.salary && (
                    <span className="text-xs font-bold text-emerald-800">
                      {formData.salary}
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-bold text-emerald-900 mt-0.5">
                  Job Offer Received!
                </h4>
                <p className="text-xs text-emerald-700/90 mt-1 leading-relaxed">
                  {formData.notes ||
                    'Congratulations! An official offer has been made. Compare benefits and prepare your counter-offer if needed.'}
                </p>
              </div>
            </div>
          </div>
        );

      case 'INTERVIEW':
      case 'SCREENING':
        return (
          <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200/90 text-sky-900 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-sky-100 text-sky-700 shrink-0 mt-0.5">
                <Clock className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-700">
                    Status Notification • Active Interview
                  </span>
                  <span className="text-[11px] text-sky-600 font-medium">
                    {initialData?.interviews?.length || 0} Round(s) scheduled
                  </span>
                </div>
                <h4 className="text-sm font-bold text-sky-900 mt-0.5">
                  Interviewing in Progress
                </h4>
                <p className="text-xs text-sky-700/90 mt-1 leading-relaxed">
                  {formData.notes ||
                    'Currently undergoing technical evaluations or behavioral interviews.'}
                </p>
              </div>
            </div>
          </div>
        );

      case 'APPLIED':
        return (
          <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200/90 text-indigo-900 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700 shrink-0 mt-0.5">
                <Briefcase className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                    Status Notification • Application Submitted
                  </span>
                  <span className="text-[11px] text-indigo-600 font-medium">
                    {formatDate(formData.applicationDate)}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-indigo-900 mt-0.5">
                  Application Under Review
                </h4>
                <p className="text-xs text-indigo-700/90 mt-1 leading-relaxed">
                  Application logged into your pipeline. Follow up within 5-7 business days if no response.
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 shadow-sm">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-semibold text-slate-700">
                Pipeline Stage: {formData.status}
              </span>
            </div>
          </div>
        );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? `${formData.companyName} • Application Overview` : 'New Job Application'}
      subtitle={initialData ? formData.position : 'Add a role to track in your pipeline'}
      maxWidth="2xl"
    >
      {/* Mode Switcher Tabs for existing application */}
      {initialData && (
        <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all duration-200 ${
              activeTab === 'overview'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            Overview & Notification Details
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('edit')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all duration-200 ${
              activeTab === 'edit'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            Edit Application
          </button>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl font-medium">
          {error}
        </div>
      )}

      {/* OVERVIEW & NOTIFICATION MODE */}
      {activeTab === 'overview' && initialData ? (
        <div className="space-y-5">
          {/* Status Notification Banner */}
          {renderStatusNotification(formData.status || 'APPLIED')}

          {/* Key Quick Facts Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-medium text-slate-500 block">Stage</span>
              <span className="text-xs font-bold text-slate-900 mt-0.5 block">
                {formData.status}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-medium text-slate-500 block">Compensation</span>
              <span className="text-xs font-bold text-emerald-600 mt-0.5 block truncate">
                {formData.salary || 'Undisclosed'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-medium text-slate-500 block">Location</span>
              <span className="text-xs font-bold text-slate-900 mt-0.5 block truncate">
                {formData.location || 'Remote'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-medium text-slate-500 block">Priority</span>
              <div className="flex items-center text-amber-500 mt-0.5">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span className="ml-1 text-xs font-bold text-slate-800">
                  {formData.rating || 3} / 5
                </span>
              </div>
            </div>
          </div>

          {/* Job Description Card */}
          {formData.jobDescription && (
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1.5">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                <FileText className="w-3.5 h-3.5 text-indigo-600" />
                Role Description
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                {formData.jobDescription}
              </p>
            </div>
          )}

          {/* Notes & Feedback Card */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <Info className="w-3.5 h-3.5 text-indigo-600" />
              Notes, Interview Feedback & Action Items
            </span>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {formData.notes || 'No specific notes logged yet for this application.'}
            </p>
          </div>

          {/* Recruiter & Material details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Recruiter & Contact
              </span>
              <div className="flex items-center gap-2 text-xs text-slate-800 font-semibold">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>{formData.contactPerson || 'Not specified'}</span>
              </div>
              {formData.contactEmail && (
                <div className="flex items-center gap-2 text-xs text-indigo-600">
                  <Mail className="w-3.5 h-3.5" />
                  <a href={`mailto:${formData.contactEmail}`} className="hover:underline">
                    {formData.contactEmail}
                  </a>
                </div>
              )}
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Resume & Links
              </span>
              <div className="flex items-center gap-2 text-xs text-slate-700">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>{formData.cvUsed || 'Master Resume'}</span>
              </div>
              {formData.jobUrl && (
                <a
                  href={formData.jobUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  View Original Job Posting
                </a>
              )}
            </div>
          </div>

          {/* Associated Interviews list */}
          {initialData?.interviews && initialData.interviews.length > 0 && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                  <Calendar className="w-3.5 h-3.5 text-sky-600" />
                  Interview Schedule ({initialData.interviews.length})
                </span>
                {onScheduleInterview && (
                  <button
                    type="button"
                    onClick={() => onScheduleInterview(initialData.id)}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Add Round
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {initialData.interviews.map((iv: any) => (
                  <div
                    key={iv.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between text-xs p-3 rounded-xl bg-white border border-slate-200 shadow-sm gap-2"
                  >
                    <div>
                      <span className="font-bold text-slate-900">{iv.title}</span>
                      <span className="text-slate-500 ml-2">({iv.type})</span>
                      {iv.interviewer && (
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Interviewer: {iv.interviewer}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-600 font-medium">
                        {formatDateTime(iv.scheduledAt)}
                      </span>
                      {iv.location && iv.location.startsWith('http') && (
                        <a
                          href={iv.location}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 font-semibold flex items-center gap-1 text-[11px]"
                        >
                          <Video className="w-3 h-3" /> Join
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
            {initialData?.id && onDelete ? (
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={handleDelete}
                isLoading={isDeleting}
                leftIcon={<Trash2 className="w-4 h-4" />}
              >
                Delete
              </Button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="sm" onClick={onClose}>
                Close
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => setActiveTab('edit')}
                leftIcon={<Edit3 className="w-4 h-4" />}
              >
                Edit Information
              </Button>
            </div>
          </div>
        </div>
      ) : (
        /* EDIT FORM MODE */
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Company Name *"
              placeholder="e.g. Stripe, Google, Linear"
              value={formData.companyName || ''}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              required
            />

            <Input
              label="Position / Role Title *"
              placeholder="e.g. Full-Stack Software Engineer"
              value={formData.position || ''}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              required
            />
          </div>

          {/* Stage & Rating */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Stage / Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as ApplicationStatus })
                }
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 shadow-sm"
              >
                {KANBAN_STAGES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_CONFIG[s].label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Priority Rating (1 - 5)
              </label>
              <div className="flex items-center gap-1.5 h-[42px] px-3 bg-white border border-slate-200 rounded-xl shadow-sm">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className="p-1 text-slate-300 hover:text-amber-400 transition-colors"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        (formData.rating || 0) >= star
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs text-slate-600 ml-2 font-medium">
                  {formData.rating} / 5
                </span>
              </div>
            </div>
          </div>

          {/* Location & Salary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Location"
              placeholder="e.g. San Francisco or Remote"
              value={formData.location || ''}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Workplace Type
              </label>
              <select
                value={formData.locationType}
                onChange={(e) =>
                  setFormData({ ...formData, locationType: e.target.value as any })
                }
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 shadow-sm"
              >
                {LOCATION_TYPES.map((lt) => (
                  <option key={lt.value} value={lt.value}>
                    {lt.label}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Salary Range / Offer"
              placeholder="e.g. $140k - $160k"
              value={formData.salary || ''}
              onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
            />
          </div>

          {/* Date, Employment type & Job URL */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Application Date
              </label>
              <input
                type="date"
                value={formData.applicationDate ? String(formData.applicationDate).slice(0, 10) : ''}
                onChange={(e) => setFormData({ ...formData, applicationDate: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Employment
              </label>
              <select
                value={formData.employmentType}
                onChange={(e) =>
                  setFormData({ ...formData, employmentType: e.target.value as any })
                }
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 shadow-sm"
              >
                {EMPLOYMENT_TYPES.map((et) => (
                  <option key={et.value} value={et.value}>
                    {et.label}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Job Posting URL"
              placeholder="https://company.com/jobs/..."
              value={formData.jobUrl || ''}
              onChange={(e) => setFormData({ ...formData, jobUrl: e.target.value })}
            />
          </div>

          {/* Contact Person & CV Used */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Contact Person / Recruiter"
              placeholder="e.g. Sarah Jenkins"
              value={formData.contactPerson || ''}
              onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
            />

            <Input
              label="Contact Email"
              placeholder="e.g. s.jenkins@company.com"
              value={formData.contactEmail || ''}
              onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
            />

            <Input
              label="Resume / CV Used"
              placeholder="e.g. Resume_2026_v2.pdf"
              value={formData.cvUsed || ''}
              onChange={(e) => setFormData({ ...formData, cvUsed: e.target.value })}
            />
          </div>

          {/* Job Description field */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Role Description / Job Overview
            </label>
            <textarea
              rows={2}
              placeholder="Add key responsibilities, requirements, or tech stack..."
              value={formData.jobDescription || ''}
              onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 placeholder-slate-400 shadow-sm"
            />
          </div>

          {/* Notes & Feedback */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Notes, Interview Feedback & Action Items
            </label>
            <textarea
              rows={2}
              placeholder="Add key talking points, referral notes, interview feedback..."
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 placeholder-slate-400 shadow-sm"
            />
          </div>

          {/* Form actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
            {initialData?.id && onDelete ? (
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={handleDelete}
                isLoading={isDeleting}
                leftIcon={<Trash2 className="w-4 h-4" />}
              >
                Delete Application
              </Button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" isLoading={isLoading}>
                {initialData ? 'Save Changes' : 'Create Application'}
              </Button>
            </div>
          </div>
        </form>
      )}
    </Modal>
  );
};
