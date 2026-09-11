'use client';

import {
  Users,
  UserPlus,
  RefreshCw,
  Search,
  Shield,
  Briefcase,
  User,
  CheckCircle2,
  X,
  AlertCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useMemo } from 'react';

import { EmployeeUser } from '../../types';

interface EmployeesTabProps {
  users: EmployeeUser[];
  isLoadingUsers: boolean;
  onRefreshUsers: () => Promise<void>;
  onUpdateRole: (userId: string, newRole: 'customer' | 'admin' | 'employee') => Promise<void>;
  onAddEmployee: (data: { name: string; email: string }) => Promise<void>;
  currentUserId?: string;
}

export default function EmployeesTab({
  users,
  isLoadingUsers,
  onRefreshUsers,
  onUpdateRole,
  onAddEmployee,
  currentUserId,
}: EmployeesTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'employee' | 'customer' | 'admin'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  // Statistics
  const stats = useMemo(() => {
    const total = users.length;
    const employees = users.filter((u) => u.role === 'employee').length;
    const admins = users.filter((u) => u.role === 'admin').length;
    const customers = users.filter((u) => u.role === 'customer').length;
    return { total, employees, admins, customers };
  }, [users]);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesRole = roleFilter === 'all' || u.role === roleFilter;
      const matchesSearch =
        searchTerm.trim() === '' ||
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesRole && matchesSearch;
    });
  }, [users, roleFilter, searchTerm]);

  const handleCreateEmployee = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) {
      setFormError('Please enter both name and email');
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError('');
      await onAddEmployee({ name: newName.trim(), email: newEmail.trim() });
      setNewName('');
      setNewEmail('');
      setIsAddModalOpen(false);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Failed to add employee');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleChange = async (
    userId: string,
    targetRole: 'customer' | 'admin' | 'employee',
  ) => {
    try {
      setUpdatingUserId(userId);
      await onUpdateRole(userId, targetRole);
    } catch (err: unknown) {
      console.error('Failed to change user role:', err);
    } finally {
      setUpdatingUserId(null);
    }
  };

  return (
    <motion.div
      key="employees"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-6"
    >
      {/* Header with Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-heading font-bold text-wellness-navy flex items-center gap-2">
            <Users size={22} className="text-wellness-green" />
            Employee & User Access Control
          </h3>
          <p className="text-xs text-wellness-charcoal/60 mt-1 font-medium">
            Manage operational employees, assign privileges, and promote registered accounts to
            staff.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              void onRefreshUsers();
            }}
            disabled={isLoadingUsers}
            className="bg-white border border-wellness-gray-200 text-wellness-navy text-xs font-bold py-2.5 px-3.5 rounded-xl hover:bg-wellness-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
            title="Refresh Users"
          >
            <RefreshCw size={14} className={isLoadingUsers ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={() => {
              setFormError('');
              setIsAddModalOpen(true);
            }}
            className="bg-wellness-navy hover:bg-wellness-green text-white font-extrabold text-xs py-2.5 px-4 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer uppercase tracking-wider"
          >
            <UserPlus size={15} />
            <span>Add Employee</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-wellness-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-wellness-charcoal/60">
              Total Accounts
            </span>
            <div className="w-7 h-7 rounded-lg bg-wellness-navy/5 text-wellness-navy flex items-center justify-center">
              <Users size={14} />
            </div>
          </div>
          <p className="text-2xl font-heading font-extrabold text-wellness-navy mt-2">
            {stats.total}
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-xs bg-gradient-to-br from-white to-emerald-50/20">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">
              Active Employees
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Briefcase size={14} />
            </div>
          </div>
          <p className="text-2xl font-heading font-extrabold text-emerald-800 mt-2">
            {stats.employees}
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-purple-100 shadow-xs bg-gradient-to-br from-white to-purple-50/20">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700">
              Administrators
            </span>
            <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
              <Shield size={14} />
            </div>
          </div>
          <p className="text-2xl font-heading font-extrabold text-purple-900 mt-2">
            {stats.admins}
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-wellness-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-wellness-charcoal/60">
              Customers
            </span>
            <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
              <User size={14} />
            </div>
          </div>
          <p className="text-2xl font-heading font-extrabold text-wellness-navy mt-2">
            {stats.customers}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-wellness-gray-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-wellness-charcoal/40"
          />
          <input
            type="text"
            placeholder="Search by user name or email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
            className="w-full bg-[#FAF8F5] border border-wellness-gray-200 rounded-xl pl-9.5 pr-4 py-2 text-xs font-semibold text-wellness-navy focus:outline-hidden focus:border-wellness-green transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {(
            [
              { id: 'all', label: 'All Users' },
              { id: 'employee', label: 'Employees Only' },
              { id: 'customer', label: 'Customers' },
              { id: 'admin', label: 'Admins' },
            ] as const
          ).map((filter) => (
            <button
              key={filter.id}
              onClick={() => {
                setRoleFilter(filter.id);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                roleFilter === filter.id
                  ? 'bg-wellness-navy text-white shadow-xs'
                  : 'text-wellness-charcoal/60 hover:text-wellness-navy hover:bg-wellness-gray-50'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table / List */}
      <div className="bg-white rounded-2xl border border-wellness-gray-200 overflow-hidden shadow-xs">
        {isLoadingUsers && users.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-3 border-wellness-green/30 border-t-wellness-green rounded-full animate-spin mx-auto"></div>
            <p className="mt-3 text-xs font-bold text-wellness-navy uppercase tracking-wider">
              Loading Users & Staff...
            </p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-16 text-center text-wellness-charcoal/50">
            <Users size={32} className="mx-auto mb-2 text-wellness-charcoal/30" />
            <h4 className="text-sm font-bold text-wellness-navy">No users found</h4>
            <p className="text-xs text-wellness-charcoal/60 mt-1 max-w-sm mx-auto">
              No registered user accounts match your search or filter criteria.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-wellness-gray-100 bg-[#FAF8F5]/80 text-[10px] font-extrabold text-wellness-charcoal/60 uppercase tracking-wider">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Current Role</th>
                  <th className="py-3 px-4">Joined Date</th>
                  <th className="py-3 px-4 text-right">Role Management</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-wellness-gray-100 text-xs">
                {filteredUsers.map((u) => {
                  const isSelf = u.id === currentUserId;
                  const isUpdating = updatingUserId === u.id;

                  return (
                    <tr key={u.id} className="hover:bg-wellness-gray-50/50 transition-colors">
                      {/* Name and Avatar */}
                      <td className="py-3.5 px-4 font-bold text-wellness-navy">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-wellness-navy/5 border border-wellness-gray-200 flex items-center justify-center font-black text-xs text-wellness-navy shrink-0">
                            {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-heading font-extrabold">
                              {u.name || 'Anonymous User'}
                            </p>
                            {isSelf && (
                              <span className="text-[9px] font-extrabold text-wellness-green bg-wellness-green/10 px-1.5 py-0.2 rounded border border-wellness-green/20">
                                You (Current)
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-3.5 px-4 text-wellness-charcoal/70 font-mono text-[11px]">
                        {u.email}
                      </td>

                      {/* Role Badge */}
                      <td className="py-3.5 px-4">
                        {u.role === 'admin' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
                            <Shield size={11} className="shrink-0" />
                            Admin
                          </span>
                        ) : u.role === 'employee' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                            <Briefcase size={11} className="shrink-0" />
                            Employee
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                            <User size={11} className="shrink-0" />
                            Customer
                          </span>
                        )}
                      </td>

                      {/* Joined Date */}
                      <td className="py-3.5 px-4 text-wellness-charcoal/60 text-[11px] font-medium">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                      </td>

                      {/* Role Actions */}
                      <td className="py-3.5 px-4 text-right">
                        {isSelf ? (
                          <span className="text-[10px] text-wellness-charcoal/40 font-semibold italic">
                            Cannot self-modify
                          </span>
                        ) : (
                          <div className="flex items-center justify-end gap-1.5">
                            {isUpdating ? (
                              <span className="text-[10px] font-bold text-wellness-charcoal/50 flex items-center gap-1">
                                <RefreshCw size={11} className="animate-spin" />
                                Updating...
                              </span>
                            ) : (
                              <div className="inline-flex items-center gap-1 bg-[#FAF8F5] p-1 rounded-xl border border-wellness-gray-200">
                                <span className="text-[9px] font-extrabold text-wellness-charcoal/40 px-1 uppercase">
                                  Set:
                                </span>

                                {u.role !== 'employee' && (
                                  <button
                                    onClick={() => {
                                      void handleRoleChange(u.id, 'employee');
                                    }}
                                    className="px-2 py-1 rounded-lg text-[10px] font-black text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer uppercase tracking-wider"
                                    title="Promote to Employee"
                                  >
                                    Employee
                                  </button>
                                )}

                                {u.role !== 'customer' && (
                                  <button
                                    onClick={() => {
                                      void handleRoleChange(u.id, 'customer');
                                    }}
                                    className="px-2 py-1 rounded-lg text-[10px] font-bold text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer uppercase tracking-wider"
                                    title="Revert to Customer"
                                  >
                                    Customer
                                  </button>
                                )}

                                {u.role !== 'admin' && (
                                  <button
                                    onClick={() => {
                                      void handleRoleChange(u.id, 'admin');
                                    }}
                                    className="px-2 py-1 rounded-lg text-[10px] font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-colors cursor-pointer uppercase tracking-wider"
                                    title="Make Administrator"
                                  >
                                    Admin
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Employee Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-wellness-navy/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-wellness-gray-200 shadow-2xl text-left relative"
            >
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                }}
                className="absolute top-5 right-5 text-wellness-charcoal/40 hover:text-wellness-navy p-1 rounded-lg transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-wellness-navy text-wellness-green flex items-center justify-center font-black">
                  <UserPlus size={20} />
                </div>
                <div>
                  <h4 className="text-base font-heading font-extrabold text-wellness-navy">
                    Add Employee
                  </h4>
                  <p className="text-[11px] text-wellness-charcoal/60 font-semibold">
                    Promote an existing customer or invite a new staff member.
                  </p>
                </div>
              </div>

              {formError && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-bold flex items-center gap-2">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={(e) => void handleCreateEmployee(e)} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-wellness-charcoal/70 mb-1.5">
                    Employee Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={newName}
                    onChange={(e) => {
                      setNewName(e.target.value);
                    }}
                    className="w-full bg-[#FAF8F5] border border-wellness-gray-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-wellness-navy focus:outline-hidden focus:border-wellness-green transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-wellness-charcoal/70 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. sarah@wellness.com"
                    value={newEmail}
                    onChange={(e) => {
                      setNewEmail(e.target.value);
                    }}
                    className="w-full bg-[#FAF8F5] border border-wellness-gray-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-wellness-navy focus:outline-hidden focus:border-wellness-green transition-colors"
                  />
                  <p className="text-[10px] text-wellness-charcoal/50 mt-1.5 leading-relaxed font-medium">
                    If this user already exists as a customer, their role will be upgraded to
                    Employee. If new, their account will be pre-created and linked when they sign
                    in.
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddModalOpen(false);
                    }}
                    className="px-4 py-2.5 rounded-xl border border-wellness-gray-200 text-xs font-extrabold text-wellness-charcoal hover:bg-wellness-gray-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-wellness-navy hover:bg-wellness-green text-white text-xs font-extrabold py-2.5 px-5 rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer uppercase tracking-wider disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <RefreshCw size={14} className="animate-spin" />
                    ) : (
                      <CheckCircle2 size={14} />
                    )}
                    <span>Save Employee</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
