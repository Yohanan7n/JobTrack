import React, { useState } from 'react';
import { Application } from '../../services/application.service';
import { ApplicationStatus, STATUS_CONFIG } from '../../utils/constants';
import { ApplicationCard } from './ApplicationCard';
import { Plus } from 'lucide-react';

interface KanbanColumnProps {
  status: ApplicationStatus;
  applications: Application[];
  onEdit: (app: Application) => void;
  onMoveStatus: (id: string, status: ApplicationStatus) => void;
  onAddInColumn: (status: ApplicationStatus) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  status,
  applications,
  onEdit,
  onMoveStatus,
  onAddInColumn,
}) => {
  const [isOver, setIsOver] = useState(false);
  const config = STATUS_CONFIG[status];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(false);
    const applicationId = e.dataTransfer.getData('text/plain');
    if (applicationId) {
      onMoveStatus(applicationId, status);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col flex-1 min-w-[280px] max-w-[340px] rounded-2xl bg-slate-950/60 border ${
        isOver
          ? 'border-indigo-500/80 bg-indigo-950/15'
          : 'border-slate-800/80'
      } p-3.5 transition-all`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800/60">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${config.dotColor}`} />
          <h3 className="text-sm font-semibold text-slate-200">{config.label}</h3>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
            {applications.length}
          </span>
        </div>

        <button
          onClick={() => onAddInColumn(status)}
          className="p-1 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-colors"
          title={`Add application in ${config.label}`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Cards list */}
      <div className="flex-1 space-y-3 overflow-y-auto max-h-[calc(100vh-250px)] pr-1 pb-1">
        {applications.length === 0 ? (
          <div className="h-32 flex flex-col items-center justify-center border-2 border-dashed border-slate-800/60 rounded-xl p-4 text-center">
            <p className="text-xs text-slate-500">No applications in this stage</p>
            <button
              onClick={() => onAddInColumn(status)}
              className="mt-2 text-xs font-medium text-indigo-400 hover:text-indigo-300"
            >
              + Add card
            </button>
          </div>
        ) : (
          applications.map((app) => (
            <ApplicationCard
              key={app.id}
              application={app}
              onEdit={onEdit}
              onMoveStatus={onMoveStatus}
            />
          ))
        )}
      </div>
    </div>
  );
};
