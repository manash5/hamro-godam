"use client"

import React, { useState, useEffect } from 'react';
import { Check, Clock, AlertCircle, Calendar, User } from 'lucide-react';
import Sidebar from '@/components/employee/sidebar';

export default function EmployeeTaskSection() {
  const [employeeId, setEmployeeId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = localStorage.getItem('employeeId');
    setEmployeeId(id);
  }, []);

  useEffect(() => {
    if (!employeeId) return;
    setLoading(true);
    fetch(`/api/task?assignedTo=${employeeId}`)
      .then(res => res.json())
      .then(data => {
        setTasks(data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [employeeId]);

  const toggleTaskStatus = (taskId) => {
    setTasks(tasks.map(task => 
      task._id === taskId 
        ? { ...task, status: task.status === 'pending' ? 'completed' : 'pending' }
        : task
    ));
    // Optionally, send a PUT request to update status in backend
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    return status === 'completed' ? (
      <Check className="w-5 h-5 text-green-600" />
    ) : (
      <Clock className="w-5 h-5 text-gray-400" />
    );
  };

  const pendingTasks = tasks.filter(task => task.status === 'pending');
  const completedTasks = tasks.filter(task => task.status === 'completed');

  return (
    <div className="h-screen bg-gray-50 flex">
        <Sidebar/>
      <div className="min-w-6xl mx-auto mt-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Tasks</h1>
          <p className="text-gray-600">Manage your assigned tasks and track progress</p>
        </div>

        {/* Task Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{pendingTasks.length}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{completedTasks.length}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Check className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{tasks.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <AlertCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Task List */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading tasks...</div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div 
                key={task._id} 
                className={`bg-white rounded-xl p-6 border transition-all duration-200 hover:shadow-md ${
                  task.status === 'completed' ? 'border-green-200 bg-green-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <button
                        onClick={() => toggleTaskStatus(task._id)}
                        className={`p-2 rounded-full transition-colors ${
                          task.status === 'completed' 
                            ? 'bg-green-100 hover:bg-green-200' 
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        {getStatusIcon(task.status)}
                      </button>
                      <h3 className={`text-lg font-semibold ${
                        task.status === 'completed' ? 'text-gray-500' : 'text-gray-900'
                      }`}>
                        {task.title}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>

                    <p className="text-gray-600 mb-4">
                      {task.description}
                    </p>

                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>Assigned by: {task.assignedTo?.name || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>Status: {task.status}</span>
                      </div>
                    </div>
                  </div>

                  <div className="ml-4">
                    <button
                      onClick={() => toggleTaskStatus(task._id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        task.status === 'completed'
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {task.status === 'completed' ? 'Mark Pending' : 'Mark Done'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && tasks.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
              <Check className="w-8 h-8 text-gray-400 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks assigned</h3>
            <p className="text-gray-600">You're all caught up! New tasks will appear here when assigned.</p>
          </div>
        )}
      </div>
    </div>
  );
}