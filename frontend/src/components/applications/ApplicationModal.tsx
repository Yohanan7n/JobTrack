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
import { Star, Trash2, Calendar, Plus } from 'lucide-react';
import { formatDateTime } from '../../utils/formatters';

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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Application Details & Edit' : 'New Job Application'}
      subtitle={initialData ? `Managing application for ${initialData.companyName}` : 'Add a role to track in your pipeline'}
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl font-medium">
            {error}
          </div>
        )}

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

        {/* Notes & Job Description */}
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

        {/* Associated Interviews list if editing */}
        {initialData?.interviews && initialData.interviews.length > 0 && (
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-sky-600" />
                Interviews ({initialData.interviews.length})
              </span>
              {onScheduleInterview && (
                <button
                  type="button"
                  onClick={() => onScheduleInterview(initialData.id)}
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  Add Round
                </button>
              )}
            </div>

            <div className="space-y-1.5">
              {initialData.interviews.map((iv) => (
                <div
                  key={iv.id}
                  className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-white border border-slate-200 shadow-sm"
                >
                  <div>
                    <span className="font-semibold text-slate-800">{iv.title}</span>
                    <span className="text-slate-500 ml-2">({iv.type})</span>
                  </div>
                  <span className="text-slate-500">{formatDateTime(iv.scheduledAt)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

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
    </Modal>
  );
};
