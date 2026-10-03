import React, { useState, useEffect } from 'react';
import { adminService, AdminUser, SystemMetrics } from '../services/admin.service';
import { useAuth } from '../hooks/useAuth';
import { StatCard } from '../components/common/StatCard';
import { formatDate } from '../utils/formatters';
import {
  Users,
  Briefcase,
  CalendarCheck,
  Server,
  Shield,
  Search,
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchAdminData = async () => {
    try {
      const [usersRes, metricsRes] = await Promise.all([
        adminService.getAllUsers({
          search: search || undefined,
          role: roleFilter || undefined,
          status: statusFilter || undefined,
        }),
        adminService.getSystemMetrics(),
      ]);

      setUsers(usersRes.data.data);
      setMetrics(metricsRes.data.data);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [search, roleFilter, statusFilter]);

  const handleToggleStatus = async (user: AdminUser) => {
    const nextStatus = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    if (user.id === currentUser?.id) {
      alert('You cannot suspend your own account');
      return;
    }
    if (
      window.confirm(
        `Are you sure you want to set ${user.name}'s account status to ${nextStatus}?`
      )
    ) {
      await adminService.updateUserStatus(user.id, nextStatus);
      fetchAdminData();
    }
  };

  const handleToggleRole = async (user: AdminUser) => {
    const nextRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
    if (user.id === currentUser?.id) {
      alert('You cannot demote your own administrator privileges');
      return;
    }
    if (
      window.confirm(
        `Change ${user.name}'s role to ${nextRole}?`
      )
    ) {
      await adminService.updateUserRole(user.id, nextRole);
      fetchAdminData();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="pb-2 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-outfit flex items-center gap-2">
            <Shield className="w-6 h-6 text-purple-600" />
            Admin Control Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            System metrics, user moderation, account suspension, and global usage analytics.
          </p>
        </div>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Registered Users"
          value={metrics?.totalUsers ?? 0}
          subtext={`${metrics?.activeUsers ?? 0} active, ${metrics?.suspendedUsers ?? 0} suspended`}
          icon={<Users className="w-5 h-5" />}
          colorScheme="purple"
        />
        <StatCard
          title="System Applications"
          value={metrics?.totalApplications ?? 0}
          subtext="Applications across all users"
          icon={<Briefcase className="w-5 h-5" />}
          colorScheme="indigo"
        />
        <StatCard
          title="Total Interviews"
          value={metrics?.totalInterviews ?? 0}
          subtext="Rounds logged in system"
          icon={<CalendarCheck className="w-5 h-5" />}
          colorScheme="sky"
        />
        <StatCard
          title="Server Health & Uptime"
          value={`${Math.floor((metrics?.uptimeSeconds ?? 0) / 60)} min`}
          subtext={`Node.js ${metrics?.nodeVersion || 'v22.x'}`}
          icon={<Server className="w-5 h-5" />}
          colorScheme="emerald"
        />
      </div>

      {/* Users moderation section */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-base font-bold text-slate-900">User Management</h3>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search user name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 shadow-sm"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 shadow-sm"
            >
              <option value="">All Roles</option>
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 shadow-sm"
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>
        </div>

        {/* User table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/90 text-slate-600 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Applications</th>
                <th className="py-3 px-4">Interviews</th>
                <th className="py-3 px-4">Joined Date</th>
                <th className="py-3 px-4 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900">{u.name}</div>
                    <div className="text-[11px] text-slate-500">{u.email}</div>
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${
                        u.role === 'ADMIN'
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${
                        u.status === 'ACTIVE'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-slate-700 font-medium">
                    {u._count.applications}
                  </td>

                  <td className="py-3 px-4 text-slate-700 font-medium">
                    {u._count.interviews}
                  </td>

                  <td className="py-3 px-4 text-slate-500">{formatDate(u.createdAt)}</td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleToggleRole(u)}
                        disabled={u.id === currentUser?.id}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        title="Toggle Admin / User role"
                      >
                        {u.role === 'ADMIN' ? 'Demote' : 'Make Admin'}
                      </button>

                      <button
                        onClick={() => handleToggleStatus(u)}
                        disabled={u.id === currentUser?.id}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-colors ${
                          u.status === 'ACTIVE'
                            ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                        }`}
                        title="Suspend or Reactivate account"
                      >
                        {u.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
