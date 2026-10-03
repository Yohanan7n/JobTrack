import React, { useState, useEffect } from 'react';
import { documentService, DocumentItem } from '../services/document.service';
import { applicationService, Application } from '../services/application.service';
import { DocumentUploadModal } from '../components/documents/DocumentUploadModal';
import { Button } from '../components/common/Button';
import { formatFileSize, formatDate } from '../utils/formatters';
import { DOCUMENT_TYPES } from '../utils/constants';
import {
  FileText,
  Upload,
  Download,
  Trash2,
  Briefcase,
} from 'lucide-react';

export const DocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      const res = await documentService.getDocuments(selectedType === 'ALL' ? undefined : selectedType);
      setDocuments(res.data.data);
    } catch (err) {
      console.error('Failed to load documents:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await applicationService.getApplications({ limit: 100 });
      setApplications(res.data.data);
    } catch (err) {
      console.error('Failed to load applications:', err);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [selectedType]);

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleUpload = async (formData: FormData) => {
    await documentService.uploadDocument(formData);
    fetchDocuments();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this document?')) {
      await documentService.deleteDocument(id);
      fetchDocuments();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-outfit">
            Documents & Resumes
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Store and organize tailored resumes, cover letters, and portfolios.
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          variant="primary"
          size="sm"
          leftIcon={<Upload className="w-4 h-4" />}
        >
          Upload Document
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setSelectedType('ALL')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-sm transition-all duration-200 ${
            selectedType === 'ALL'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          All Types ({documents.length})
        </button>
        {DOCUMENT_TYPES.map((dt) => (
          <button
            key={dt.value}
            onClick={() => setSelectedType(dt.value)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-sm transition-all duration-200 ${
              selectedType === dt.value
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            {dt.label}
          </button>
        ))}
      </div>

      {/* Document Grid */}
      {documents.length === 0 && !isLoading ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/90 shadow-sm">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">No documents stored</h3>
          <p className="text-xs text-slate-500 mt-1">
            Upload your master resume or application cover letters to track them.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-indigo-400/80 transition-all duration-200 flex flex-col justify-between group shadow-sm hover:shadow-md"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                    {doc.fileType.replace('_', ' ')}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                  {doc.title}
                </h3>
                <p className="text-xs text-slate-500 truncate mt-0.5">{doc.fileName}</p>

                {doc.application && (
                  <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span className="truncate">
                      {doc.application.companyName} — {doc.application.position}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div>
                  <span>{formatFileSize(doc.fileSize)}</span>
                  <span className="mx-1.5">•</span>
                  <span>{formatDate(doc.createdAt)}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    download
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-colors"
                    title="Download / Open file"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    title="Delete document"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <DocumentUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpload={handleUpload}
        applications={applications}
      />
    </div>
  );
};
