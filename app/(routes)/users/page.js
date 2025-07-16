'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Edit, Trash2, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import Sidebar from '@/components/sidebar';

const UserTable = () => {
  const [visibleSalaries, setVisibleSalaries] = useState({});
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [statusFilter, setStatusFilter] = useState('All Status');

  const users = [
    {
      id: 'USR001',
      name: 'John Doe',
      initials: 'JD',
      role: 'Administrator',
      email: 'john.do@company.com',
      status: 'ACTIVE',
      salary: 85000,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600'
    },
    {
      id: 'USR002',
      name: 'Sarah Miller',
      initials: 'SM',
      role: 'Manager',
      email: 'sarah.miller@company.com',
      status: 'ACTIVE',
      salary: 72000,
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600'
    },
    {
      id: 'USR003',
      name: 'Mike Johnson',
      initials: 'MJ',
      role: 'Employee',
      email: 'mike.johnson@company.com',
      status: 'INACTIVE',
      salary: 58000,
      bgColor: 'bg-pink-100',
      textColor: 'text-pink-600'
    },
    {
      id: 'USR004',
      name: 'Emma Brown',
      initials: 'EB',
      role: 'Employee',
      email: 'emma.brown@company.com',
      status: 'ACTIVE',
      salary: 62000,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600'
    },
    {
      id: 'USR005',
      name: 'Robert Wilson',
      initials: 'RW',
      role: 'Manager',
      email: 'robert.wilson@company.com',
      status: 'PENDING',
      salary: 75000,
      bgColor: 'bg-green-100',
      textColor: 'text-green-600'
    }
  ];

  const toggleSalaryVisibility = (userId) => {
    setVisibleSalaries(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      'ACTIVE': 'bg-green-100 text-green-700 border-green-200',
      'INACTIVE': 'bg-red-100 text-red-700 border-red-200',
      'PENDING': 'bg-yellow-100 text-yellow-700 border-yellow-200'
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusStyles[status]}`}>
        {status}
      </span>
    );
  };

  const formatSalary = (salary) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(salary);
  };

  const handleEdit = (userId) => {
    // Handle edit functionality
    console.log('Edit user:', userId);
  };

  const handleDelete = (userId) => {
    // Handle delete functionality
    console.log('Delete user:', userId);
  };

  const handleAddUser = () => {
    // Handle add user functionality
    console.log('Add new user');
  };

  return (
    <div className="bg-slate-100 min-h-screen flex">
      <Sidebar/>
      <div className="min-w-6xl mx-auto mt-20">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Users</h1>
            <p className="text-gray-600 mt-1">Manage your users and their access</p>
          </div>
          <button 
            onClick={handleAddUser}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={16} />
            Add User
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <select 
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All Roles">All Roles</option>
            <option value="Administrator">Administrator</option>
            <option value="Manager">Manager</option>
            <option value="Employee">Employee</option>
          </select>
          
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All Status">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="PENDING">Pending</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Salary
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${user.bgColor} flex items-center justify-center`}>
                        <span className={`text-sm font-medium ${user.textColor}`}>
                          {user.initials}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">ID: {user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-gray-900">{user.role}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-gray-900">{user.email}</span>
                  </td>
                  <td className="py-4 px-6">
                    {getStatusBadge(user.status)}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-900">
                        {visibleSalaries[user.id] ? formatSalary(user.salary) : '••••••'}
                      </span>
                      <button
                        onClick={() => toggleSalaryVisibility(user.id)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {visibleSalaries[user.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleEdit(user.id)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-700">
            Showing 1 to 5 of 5 users
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <ChevronLeft size={16} />
            </button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded">
              1
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTable;