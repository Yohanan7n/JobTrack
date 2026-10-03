import React from 'react';
import { Search, LayoutGrid, List, Plus, Filter } from 'lucide-react';
import { Button } from '../common/Button';
import { KANBAN_STAGES, LOCATION_TYPES, STATUS_CONFIG } from '../../utils/constants';

interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  locationFilter: string;
  onLocationFilterChange: (location: string) => void;
  viewMode: 'kanban' | 'table';
  onViewModeChange: (mode: 'kanban' | 'table') => void;
  onAddNew: () => void;
  totalCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  locationFilter,
  onLocationFilterChange,
  viewMode,
  onViewModeChange,
  onAddNew,
  totalCount,
}) => {
  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3 bg-slate-900/80 border border-slate-800 rounded-xl mb-6">
      {/* Left side: Search & Filters */}
      <div className="flex flex-wrap items-center gap-2.5 flex-1">
        {/* Search */}
        <div className="relative min-w-[220px] flex-1 sm:max-w-xs">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search company, title, or location..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="ALL">All Stages ({totalCount})</option>
            {KANBAN_STAGES.map((s) => (
              <option key={s} value={s}>
                {STATUS_CONFIG[s].label}
              </option>
            ))}
          </select>
        </div>

        {/* Workplace Type filter */}
        <select
          value={locationFilter}
          onChange={(e) => onLocationFilterChange(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option value="ALL">All Locations</option>
          {LOCATION_TYPES.map((lt) => (
            <option key={lt.value} value={lt.value}>
              {lt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Right side: View Toggle & Add Button */}
      <div className="flex items-center justify-between md:justify-end gap-2 border-t md:border-t-0 pt-2 md:pt-0 border-slate-800">
        <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => onViewModeChange('kanban')}
            className={`p-1.5 rounded-md text-xs flex items-center gap-1 transition-colors ${
              viewMode === 'kanban'
                ? 'bg-indigo-600 text-white font-medium shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Pipeline Board view"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Board</span>
          </button>
          <button
            onClick={() => onViewModeChange('table')}
            className={`p-1.5 rounded-md text-xs flex items-center gap-1 transition-colors ${
              viewMode === 'table'
                ? 'bg-indigo-600 text-white font-medium shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Table List view"
          >
            <List className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">List</span>
          </button>
        </div>

        <Button
          onClick={onAddNew}
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Application
        </Button>
      </div>
    </div>
  );
};
