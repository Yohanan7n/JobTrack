import React from 'react';
import { Application } from '../../services/application.service';
import { ApplicationStatus, KANBAN_STAGES } from '../../utils/constants';
import { KanbanColumn } from './KanbanColumn';

interface KanbanBoardProps {
  applications: Application[];
  onEdit: (app: Application) => void;
  onMoveStatus: (id: string, status: ApplicationStatus) => void;
  onAddInColumn: (status: ApplicationStatus) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  applications,
  onEdit,
  onMoveStatus,
  onAddInColumn,
}) => {
  return (
    <div className="flex gap-4 overflow-x-auto pb-6 pt-1">
      {KANBAN_STAGES.map((stage) => {
        const stageApps = applications.filter((app) => app.status === stage);
        return (
          <KanbanColumn
            key={stage}
            status={stage}
            applications={stageApps}
            onEdit={onEdit}
            onMoveStatus={onMoveStatus}
            onAddInColumn={onAddInColumn}
          />
        );
      })}
    </div>
  );
};
