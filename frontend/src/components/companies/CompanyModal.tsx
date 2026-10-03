import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Company } from '../../services/company.service';
import { Trash2 } from 'lucide-react';

interface CompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Company>) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  initialData?: Company | null;
}

export const CompanyModal: React.FC<CompanyModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialData,
}) => {
  const [formData, setFormData] = useState<Partial<Company>>({
    name: '',
    website: '',
    location: '',
    industry: '',
    contactPerson: '',
    contactEmail: '',
    notes: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: '',
        website: '',
        location: '',
        industry: '',
        contactPerson: '',
        contactEmail: '',
        notes: '',
      });
    }
    setError(null);
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      setError('Company name is required');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await onSave(formData);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save company');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!initialData?.id || !onDelete) return;
    if (window.confirm('Delete this company? This will keep your application history.')) {
      try {
        setIsDeleting(true);
        await onDelete(initialData.id);
        onClose();
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to delete company');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Company' : 'Add Company'}
      subtitle={initialData ? `Managing profile for ${initialData.name}` : 'Record company details and contacts'}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-xs text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-lg">
            {error}
          </div>
        )}

        <Input
          label="Company Name *"
          placeholder="e.g. Stripe, OpenAI, Airbnb"
          value={formData.name || ''}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Website"
            placeholder="https://company.com"
            value={formData.website || ''}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
          />

          <Input
            label="Industry / Domain"
            placeholder="e.g. Fintech, AI, Cloud"
            value={formData.industry || ''}
            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
          />
        </div>

        <Input
          label="Headquarters / Location"
          placeholder="e.g. San Francisco, CA / Remote"
          value={formData.location || ''}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Primary Contact"
            placeholder="e.g. John Doe (Tech Lead)"
            value={formData.contactPerson || ''}
            onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
          />

          <Input
            label="Contact Email"
            placeholder="john@company.com"
            value={formData.contactEmail || ''}
            onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Internal Notes
          </label>
          <textarea
            rows={3}
            placeholder="Interview insights, company mission, team structure notes..."
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
              {initialData ? 'Save Changes' : 'Create Company'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
