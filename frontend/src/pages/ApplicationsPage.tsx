import React, { useState, useEffect, useMemo } from 'react';
import { applicationService, Application } from '../services/application.service';
import { ApplicationStatus } from '../utils/constants';
import { FilterBar } from '../components/applications/FilterBar';
import { KanbanBoard } from '../components/kanban/KanbanBoard';
import { ApplicationList } from '../components/applications/ApplicationList';
import { ApplicationModal } from '../components/applications/ApplicationModal';
import { InterviewModal } from '../components/interviews/InterviewModal';
import { interviewService } from '../services/interview.service';

export const ApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [locationFilter, setLocationFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');

  // Modals state
  const [isAppModalOpen, setIsAppModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [defaultStatusForNew, setDefaultStatusForNew] = useState<ApplicationStatus>('APPLIED');

  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [interviewAppId, setInterviewAppId] = useState<string>('');

  const fetchApplications = async () => {
    try {
      const res = await applicationService.getApplications({ limit: 100 });
      setApplications(res.data.data);
    } catch (err) {
      console.error('Failed to fetch applications:', err);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Filtered applications
  const filteredApps = useMemo(() => {
    return applications.filter((app) => {
      // Search
      const matchesSearch =
        search.trim() === '' ||
        app.companyName.toLowerCase().includes(search.toLowerCase()) ||
        app.position.toLowerCase().includes(search.toLowerCase()) ||
        (app.location && app.location.toLowerCase().includes(search.toLowerCase()));

      // Status
      const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;

      // Location type
      const matchesLocation = locationFilter === 'ALL' || app.locationType === locationFilter;

      return matchesSearch && matchesStatus && matchesLocation;
    });
  }, [applications, search, statusFilter, locationFilter]);

  // Handle stage drag-and-drop or move
  const handleMoveStatus = async (appId: string, newStatus: ApplicationStatus) => {
    // Optimistic UI update
    setApplications((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, status: newStatus } : app))
    );

    try {
      await applicationService.updateStatus(appId, newStatus);
    } catch (err) {
      console.error('Failed to update stage on server, rolling back', err);
      fetchApplications();
    }
  };

  const handleSaveApp = async (data: Partial<Application>) => {
    if (selectedApp) {
      await applicationService.updateApplication(selectedApp.id, data);
    } else {
      await applicationService.createApplication(data);
    }
    fetchApplications();
  };

  const handleDeleteApp = async (id: string) => {
    await applicationService.deleteApplication(id);
    fetchApplications();
  };

  const handleAddInColumn = (status: ApplicationStatus) => {
    setSelectedApp(null);
    setDefaultStatusForNew(status);
    setIsAppModalOpen(true);
  };

  const handleScheduleInterview = (appId: string) => {
    setIsAppModalOpen(false);
    setInterviewAppId(appId);
    setIsInterviewModalOpen(true);
  };

  const handleSaveInterview = async (data: any) => {
    await interviewService.createInterview(data);
    fetchApplications();
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100 font-outfit">
            Application Pipeline
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Drag cards between stages or switch to table view to manage your applications.
          </p>
        </div>
      </div>

      {/* Filter and controls bar */}
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        locationFilter={locationFilter}
        onLocationFilterChange={setLocationFilter}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onAddNew={() => {
          setSelectedApp(null);
          setDefaultStatusForNew('APPLIED');
          setIsAppModalOpen(true);
        }}
        totalCount={applications.length}
      />

      {/* Main Board or Table view */}
      {viewMode === 'kanban' ? (
        <KanbanBoard
          applications={filteredApps}
          onEdit={(app) => {
            setSelectedApp(app);
            setIsAppModalOpen(true);
          }}
          onMoveStatus={handleMoveStatus}
          onAddInColumn={handleAddInColumn}
        />
      ) : (
        <ApplicationList
          applications={filteredApps}
          onEdit={(app) => {
            setSelectedApp(app);
            setIsAppModalOpen(true);
          }}
          onMoveStatus={handleMoveStatus}
        />
      )}

      {/* Application Details Modal */}
      <ApplicationModal
        isOpen={isAppModalOpen}
        onClose={() => setIsAppModalOpen(false)}
        onSave={handleSaveApp}
        onDelete={handleDeleteApp}
        onScheduleInterview={handleScheduleInterview}
        initialData={selectedApp}
        defaultStatus={defaultStatusForNew}
      />

      {/* Schedule Interview Modal */}
      <InterviewModal
        isOpen={isInterviewModalOpen}
        onClose={() => setIsInterviewModalOpen(false)}
        onSave={handleSaveInterview}
        applications={applications}
        defaultApplicationId={interviewAppId}
      />
    </div>
  );
};
