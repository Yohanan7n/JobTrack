import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Interview } from '../../services/interview.service';
import { Application } from '../../services/application.service';
import { INTERVIEW_TYPES } from '../../utils/constants';
import { Trash2 } from 'lucide-react';

interface InterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  applications: Application[];
  initialData?: Interview | null;
  defaultApplicationId?: string;
}

export const InterviewModal: React.FC<InterviewModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  applications,
  initialData,
  defaultApplicationId,
}) => {
  const [formData, setFormData] = useState<any>({
    applicationId: defaultApplicationId || '',
    title: '',
    type: 'TECHNICAL',
    scheduledAt: '',
    location: '',
    interviewer: '',
    notes: '',
    status: 'SCHEDULED',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      // Format to datetime-local string
      const dt = initialData.scheduledAt ? new Date(initialData.scheduledAt) : new Date();
      const localIso = new Date(dt.getTime() - dt.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);

      setFormData({
        ...initialData,
        scheduledAt: localIso,
      });
    } else {
      const now = new Date();
      const defaultTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);

      setFormData({
        applicationId: defaultApplicationId || (applications[0]?.id || ''),
        title: '',
        type: 'TECHNICAL',
        scheduledAt: defaultTime,
        location: '',
        interviewer: '',
        notes: '',
        status: 'SCHEDULED',
      });
    }
    setError(null);
  }, [initialData, defaultApplicationId, applications, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.applicationId) {
      setError('Please select an application');
      return;
    }
    if (!formData.title?.trim()) {
      setError('Interview title is required');
      return;
    }
    if (!formData.scheduledAt) {
      setError('Please select date and time');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await onSave({
        ...formData,
        scheduledAt: new Date(formData.scheduledAt).toISOString(),
      });
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save interview');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!initialData?.id || !onDelete) return;
    if (window.confirm('Delete this interview schedule?')) {
      try {
        setIsDeleting(true);
        await onDelete(initialData.id);
        onClose();
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to delete interview');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Interview' : 'Schedule Interview'}
      subtitle="Track your technical screens, system design rounds, and HR chats"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-xs text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Job Application *
          </label>
          <select
            value={formData.applicationId}
            onChange={(e) => setFormData({ ...formData, applicationId: e.target.value })}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          >
            <option value="">Select Application</option>
            {applications.map((app) => (
              <option key={app.id} value={app.id}>
                {app.companyName} — {app.position}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Interview Title *"
          placeholder="e.g. Technical Screen / System Architecture"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Round Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {INTERVIEW_TYPES.map((it) => (
                <option key={it.value} value={it.value}>
                  {it.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Date & Time *
            </label>
            <input
              type="datetime-local"
              value={formData.scheduledAt}
              onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Location / Meeting URL"
            placeholder="e.g. https://meet.google.com/..."
            value={formData.location || ''}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />

          <Input
            label="Interviewer(s)"
            placeholder="e.g. Kevin (Staff Engineer)"
            value={formData.interviewer || ''}
            onChange={(e) => setFormData({ ...formData, interviewer: e.target.value })}
          />
        </div>

        {initialData && (
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="SCHEDULED">Scheduled</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Preparation Notes & Feedback
          </label>
          <textarea
            rows={3}
            placeholder="Topics to prepare, questions asked, algorithmic challenge details..."
            value={formData.notes || ''}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-500"
          />
        </div>

        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
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
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isLoading}>
              {initialData ? 'Save Changes' : 'Schedule Interview'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
