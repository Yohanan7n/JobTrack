import React from 'react';
import { Application } from '../../services/application.service';
import { Badge } from '../common/Badge';
import { formatDate } from '../../utils/formatters';
import { Star, ExternalLink, CalendarCheck, MapPin, DollarSign } from 'lucide-react';
import { ApplicationStatus } from '../../utils/constants';

interface ApplicationListProps {
  applications: Application[];
  onEdit: (app: Application) => void;
  onMoveStatus: (id: string, status: ApplicationStatus) => void;
}

export const ApplicationList: React.FC<ApplicationListProps> = ({
  applications,
  onEdit,
}) => {
  if (applications.length === 0) {
    return (
      <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800">
        <p className="text-sm text-slate-400">No applications found matching your filters.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 shadow-sm">
      <table className="w-full text-left text-xs sm:text-sm">
        <thead className="bg-slate-950/70 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[11px]">
          <tr>
            <th className="py-3 px-4">Company & Role</th>
            <th className="py-3 px-4">Stage</th>
            <th className="py-3 px-4">Location</th>
            <th className="py-3 px-4">Salary</th>
            <th className="py-3 px-4">Applied</th>
            <th className="py-3 px-4">Priority</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/80">
          {applications.map((app) => (
            <tr
              key={app.id}
              onClick={() => onEdit(app)}
              className="hover:bg-slate-800/40 cursor-pointer transition-all duration-200"
            >
              <td className="py-3.5 px-4">
                <div>
                  <div className="font-semibold text-slate-100 flex items-center gap-1.5">
                    {app.companyName}
                    {app.jobUrl && (
                      <a
                        href={app.jobUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-slate-500 hover:text-indigo-400 inline-flex transition-all duration-200"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">{app.position}</div>
                </div>
              </td>

              <td className="py-3.5 px-4">
                <Badge status={app.status}>{app.status}</Badge>
              </td>

              <td className="py-3.5 px-4 text-slate-300">
                <div className="flex items-center gap-1 text-xs">
                  <MapPin className="w-3 h-3 text-slate-500" />
                  <span>{app.location || 'Remote'}</span>
                </div>
                <span className="text-[10px] text-slate-500 capitalize">
                  {app.locationType.toLowerCase()}
                </span>
              </td>

              <td className="py-3.5 px-4 text-slate-300 font-medium">
                {app.salary ? (
                  <div className="flex items-center gap-0.5 text-emerald-400 text-xs">
                    <DollarSign className="w-3 h-3" />
                    <span>{app.salary}</span>
                  </div>
                ) : (
                  <span className="text-slate-500 text-xs">—</span>
                )}
              </td>

              <td className="py-3.5 px-4 text-slate-400 text-xs">
                {formatDate(app.applicationDate)}
              </td>

              <td className="py-3.5 px-4">
                <div className="flex items-center text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="ml-1 text-xs font-semibold">{app.rating}</span>
                </div>
              </td>

              <td className="py-3.5 px-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  {app.interviews && app.interviews.length > 0 && (
                    <span
                      title="Interviews scheduled"
                      className="p-1 rounded-full bg-sky-500/10 text-sky-400 text-xs flex items-center gap-1 px-2"
                    >
                      <CalendarCheck className="w-3 h-3" />
                      {app.interviews.length}
                    </span>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(app);
                    }}
                    className="text-xs text-indigo-400 hover:text-indigo-300 px-2.5 py-1 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 transition-all duration-200"
                  >
                    View / Edit
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
