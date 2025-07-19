'use client';

import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Edit, Trash2, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import Sidebar from '@/components/sidebar';
import AddEditUser from '@/components/user/AddEditUser';

const UserTable = () => {
  const [employees, setEmployees] = useState([]);
  const [visibleSalaries, setVisibleSalaries] = useState({});
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/employee', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setEmployees(data.data || []);
        } else {
          setEmployees([]);
        }
      } catch (error) {
        setEmployees([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
    // Expose fetchEmployees for refresh after add/edit
    UserTable.fetchEmployees = fetchEmployees;
  }, []);

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
    const displayStatus = status || 'ACTIVE';
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusStyles[displayStatus] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
        {displayStatus}
      </span>
    );
  };

  const formatSalary = (salary) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(salary);
  };

  const handleEdit = (userId) => {
    const user = employees.find(u => u.id === userId);
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const res = await fetch(`/api/employee/${userId}`, { method: 'DELETE' });
      if (res) {
        setEmployees(prev => prev.filter(u => u.id !== userId));
      } else {
        alert('Failed to delete user');
      }
    } catch (error) {
      alert('Failed to delete user');
    }
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setModalOpen(true);
  };

  const handleSaveUser = async (userData) => {
    try {
      let res, data;
      const token = localStorage.getItem('token');
      // Map phone to contact_number for backend compatibility
      const payload = {
        ...userData,
        contact_number: userData.phone,
      };
      delete payload.phone;
      if (selectedUser) {
        // Edit user
        res = await fetch(`/api/employee/${selectedUser.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(payload),
        });
      } else {
        // Add user
        res = await fetch('/api/employee', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(payload),
        });
      }
      data = await res.json();
      if (res) {
        // Refresh list
        const fetchEmployees = UserTable.fetchEmployees || (()=>{});
        await fetchEmployees();
        setModalOpen(false);
      } else {
        alert(data.message || data.error || 'Failed to save user');
      }
    } catch (error) {
      alert('Failed to save user');
    }
  };

  const handleCancel = () => {
    setModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <div className="bg-slate-100 min-h-screen flex">
      <Sidebar/>
      <div className="min-w-6xl mx-auto mt-20">
        {/* Add/Edit User Modal */}
        <AddEditUser
          user={selectedUser}
          isOpen={modalOpen}
          onSave={handleSaveUser}
          onCancel={handleCancel}
        />
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
              {loading ? (
                <tr><td colSpan={6} className="text-center py-8 text-gray-500">Loading...</td></tr>
              ) : employees.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-gray-500">No users found.</td></tr>
              ) : (
                employees.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center`}>
                          <span className={`text-sm font-medium text-blue-600`}>
                            {user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : '?'}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">ID: {user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-gray-900">{user.role || 'Employee'}</span>
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
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-700">
            Showing 1 to {employees.length} of {employees.length} users
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