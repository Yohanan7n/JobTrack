import React, { useState, useEffect } from 'react';
import { interviewService, Interview } from '../services/interview.service';
import { applicationService, Application } from '../services/application.service';
import { InterviewModal } from '../components/interviews/InterviewModal';
import { Button } from '../components/common/Button';
import { formatDateTime } from '../utils/formatters';
import {
  Calendar,
  Video,
  Clock,
  User,
  Plus,
  Building,
  CheckCircle,
  FileEdit,
} from 'lucide-react';

export const InterviewsPage: React.FC = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [timeframe, setTimeframe] = useState<'all' | 'upcoming' | 'past'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);

  const fetchInterviews = async () => {
    try {
      const params: any = {};
      if (timeframe !== 'all') params.timeframe = timeframe;
      const res = await interviewService.getInterviews(params);
      setInterviews(res.data.data);
    } catch (err) {
      console.error('Failed to load interviews:', err);
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
    fetchInterviews();
  }, [timeframe]);

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleSaveInterview = async (data: any) => {
    if (selectedInterview) {
      await interviewService.updateInterview(selectedInterview.id, data);
    } else {
      await interviewService.createInterview(data);
    }
    fetchInterviews();
  };

  const handleDeleteInterview = async (id: string) => {
    await interviewService.deleteInterview(id);
    fetchInterviews();
  };

  const handleMarkStatus = async (id: string, status: 'COMPLETED' | 'CANCELLED') => {
    await interviewService.updateInterview(id, { status });
    fetchInterviews();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-outfit">
            Interview Schedule
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Never miss a technical screening, coding round, or behavioral interview.
          </p>
        </div>

        <Button
          onClick={() => {
            setSelectedInterview(null);
            setIsModalOpen(true);
          }}
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Schedule Interview
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        {(['all', 'upcoming', 'past'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTimeframe(t)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize shadow-sm transition-all duration-200 ${
              timeframe === t
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            {t} ({interviews.length})
          </button>
        ))}
      </div>

      {/* Interviews list */}
      {interviews.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/90 shadow-sm">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">No interviews found</h3>
          <p className="text-xs text-slate-500 mt-1">
            Schedule an upcoming interview round to keep track of prep notes and links.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {interviews.map((iv) => (
            <div
              key={iv.id}
              className="p-6 rounded-2xl bg-white border border-slate-200/90 hover:border-indigo-400/80 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200/80">
                    {iv.type}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${
                      iv.status === 'COMPLETED'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : iv.status === 'CANCELLED'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                    }`}
                  >
                    {iv.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900">{iv.title}</h3>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5 text-indigo-600 font-medium">
                    <Building className="w-3.5 h-3.5" />
                    <span>{iv.application?.companyName} — {iv.application?.position}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Clock className="w-3.5 h-3.5 text-sky-600" />
                    <span>{formatDateTime(iv.scheduledAt)}</span>
                  </div>

                  {iv.interviewer && (
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{iv.interviewer}</span>
                    </div>
                  )}
                </div>

                {iv.notes && (
                  <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed max-w-3xl">
                    <strong className="text-slate-800">Prep notes:</strong> {iv.notes}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                {iv.location && iv.location.startsWith('http') && (
                  <a
                    href={iv.location}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Video className="w-3.5 h-3.5" /> Join Call
                  </a>
                )}

                {iv.status === 'SCHEDULED' && (
                  <button
                    onClick={() => handleMarkStatus(iv.id, 'COMPLETED')}
                    title="Mark as completed"
                    className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors border border-transparent hover:border-emerald-200"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={() => {
                    setSelectedInterview(iv);
                    setIsModalOpen(true);
                  }}
                  title="Edit details"
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors border border-transparent hover:border-slate-200"
                >
                  <FileEdit className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <InterviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveInterview}
        onDelete={handleDeleteInterview}
        applications={applications}
        initialData={selectedInterview}
      />
    </div>
  );
};
