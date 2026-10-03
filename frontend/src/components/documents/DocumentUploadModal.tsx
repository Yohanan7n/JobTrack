import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { DOCUMENT_TYPES } from '../../utils/constants';
import { Application } from '../../services/application.service';
import { UploadCloud, FileText } from 'lucide-react';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (formData: FormData) => Promise<void>;
  applications: Application[];
}

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  onClose,
  onUpload,
  applications,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [fileType, setFileType] = useState('RESUME');
  const [applicationId, setApplicationId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      if (!title) {
        setTitle(selected.name);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = new FormData();
      data.append('file', file);
      data.append('title', title || file.name);
      data.append('fileType', fileType);
      if (applicationId) {
        data.append('applicationId', applicationId);
      }

      await onUpload(data);
      onClose();
      setFile(null);
      setTitle('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to upload document');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Upload Document / CV"
      subtitle="Store resumes, customized cover letters, and project portfolios"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-xs text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-lg">
            {error}
          </div>
        )}

        {/* Dropzone container */}
        <div className="border-2 border-dashed border-slate-800 hover:border-indigo-500/50 rounded-xl p-6 text-center bg-slate-950/40 transition-colors">
          <input
            type="file"
            id="file-upload"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.txt,.png,.jpg"
            className="hidden"
          />
          <label htmlFor="file-upload" className="cursor-pointer block">
            <UploadCloud className="w-10 h-10 text-indigo-400 mx-auto mb-2 opacity-80" />
            <span className="text-sm font-semibold text-slate-200 block">
              {file ? file.name : 'Choose file or drag here'}
            </span>
            <span className="text-xs text-slate-500 mt-1 block">
              Supports PDF, DOC, DOCX, TXT, PNG, JPG (up to 10MB)
            </span>
          </label>
        </div>

        {file && (
          <div className="p-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center gap-2 text-xs text-indigo-300">
            <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className="truncate">{file.name}</span>
            <span className="text-slate-400 ml-auto shrink-0">
              {(file.size / 1024).toFixed(0)} KB
            </span>
          </div>
        )}

        <Input
          label="Document Label / Title"
          placeholder="e.g. Alex_Rivera_Senior_Resume_2026"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Document Type
            </label>
            <select
              value={fileType}
              onChange={(e) => setFileType(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {DOCUMENT_TYPES.map((dt) => (
                <option key={dt.value} value={dt.value}>
                  {dt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Link to Application (Optional)
            </label>
            <select
              value={applicationId}
              onChange={(e) => setApplicationId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">None / General</option>
              {applications.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.companyName} — {app.position}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isLoading}
            disabled={!file}
          >
            Upload Document
          </Button>
        </div>
      </form>
    </Modal>
  );
};
