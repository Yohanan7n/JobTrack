import React from 'react';
import { Application } from '../../services/application.service';
import { formatDate } from '../../utils/formatters';
import { ApplicationStatus, KANBAN_STAGES, STATUS_CONFIG } from '../../utils/constants';
import {
  MapPin,
  DollarSign,
  Calendar,
  Star,
  MoreVertical,
  CalendarCheck,
  Building,
} from 'lucide-react';

interface ApplicationCardProps {
  application: Application;
  onEdit: (app: Application) => void;
  onMoveStatus: (id: string, status: ApplicationStatus) => void;
  onDragStart?: (e: React.DragEvent, id: string) => void;
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
  onEdit,
  onMoveStatus,
  onDragStart,
}) => {
  const [showMenu, setShowMenu] = React.useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', application.id);
    e.dataTransfer.effectAllowed = 'move';
    if (onDragStart) {
      onDragStart(e, application.id);
    }
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={() => onEdit(application)}
      className="group relative p-4 bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/40 rounded-xl shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing transition-all select-none"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-semibold mb-1">
            <Building className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{application.companyName}</span>
          </div>
          <h4 className="text-sm font-bold text-slate-100 group-hover:text-indigo-300 transition-colors line-clamp-2">
            {application.position}
          </h4>
        </div>

        {/* Action dropdown */}
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-7 z-20 w-44 bg-slate-900 border border-slate-800 rounded-lg shadow-xl py-1 text-xs text-slate-300 animate-fade-in">
              <div className="px-3 py-1.5 font-semibold text-[10px] uppercase text-slate-500 border-b border-slate-800">
                Move Stage
              </div>
              {KANBAN_STAGES.map((st) => (
                <button
                  key={st}
                  disabled={st === application.status}
                  onClick={() => {
                    onMoveStatus(application.id, st);
                    setShowMenu(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-slate-800 flex items-center justify-between transition-colors ${
                    st === application.status ? 'opacity-40 cursor-default' : ''
                  }`}
                >
                  <span>{STATUS_CONFIG[st].label}</span>
                  <span className={`w-2 h-2 rounded-full ${STATUS_CONFIG[st].dotColor}`} />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Meta tags: Location, Salary */}
      <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-400">
        {application.location && (
          <span className="inline-flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded-md">
            <MapPin className="w-3 h-3 text-slate-500" />
            {application.location}
          </span>
        )}
        {application.salary && (
          <span className="inline-flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded-md text-emerald-400">
            <DollarSign className="w-3 h-3 text-emerald-500" />
            {application.salary}
          </span>
        )}
      </div>

      {/* Footer: Date, Rating, Interviews */}
      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          <span>{formatDate(application.applicationDate)}</span>
        </div>

        <div className="flex items-center gap-2">
          {application.interviews && application.interviews.length > 0 && (
            <span
              title={`${application.interviews.length} interview(s) recorded`}
              className="inline-flex items-center gap-1 text-sky-400 bg-sky-500/10 px-1.5 py-0.5 rounded text-[10px] font-medium"
            >
              <CalendarCheck className="w-3 h-3" />
              {application.interviews.length}
            </span>
          )}

          <div className="flex items-center text-amber-400">
            <Star className="w-3 h-3 fill-current" />
            <span className="ml-0.5 text-[11px] font-semibold">{application.rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
