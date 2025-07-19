"use client"
import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Clock, User, Tag, CheckCircle, Circle } from 'lucide-react';
import Sidebar from '@/components/sidebar';
import { v4 as uuidv4 } from 'uuid';
import AuthGuard from '@/components/AuthGuard';
import TokenManager from '@/utils/tokenManager';

const TaskAssignmentPage = () => {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'medium',
    dueDate: '',
    tags: '',
    category: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTasks();
    fetchEmployees();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const token = TokenManager.getToken(false);
      const res = await fetch('/api/task',{ 
        method: 'GET', 
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    });
      const data = await res.json();
      setTasks(data.data || []);
    } catch (err) {
      alert('Failed to fetch tasks');
    }
    setLoading(false);
  };

  const fetchEmployees = async () => {
    try {
      const token = TokenManager.getToken(false);
      const res = await fetch('/api/employee', {
        method: 'GET', 
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });
      const data = await res.json();
      setEmployees(data.data || []);
    } catch (err) {
      alert('Failed to fetch employees');
    }
  };

  const handleSubmit = async () => {
    if (!newTask.title || !newTask.description || !newTask.assignedTo || !newTask.dueDate || !newTask.category) {
      alert('Please fill in all required fields');
      return;
    }
    // Debug log
    console.log('Employees:', employees, 'Selected assignedTo:', newTask.assignedTo);
    // Check if assignedTo is a valid employee id (compare as strings)
    const validEmployee = employees.find(emp => String(emp.id) === String(newTask.assignedTo));
    if (!validEmployee) {
      alert('Please select a valid employee');
      return;
    }
    setLoading(true);
    try {
      const token = TokenManager.getToken(false);
      const res = await fetch('/api/task', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          title: newTask.title,
          description: newTask.description,
          assignedTo: newTask.assignedTo,
          dueDate: newTask.dueDate,
          status: newTask.status || 'pending',
          priority: newTask.priority || 'medium',
          tags: typeof newTask.tags === 'string' ? newTask.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : (Array.isArray(newTask.tags) ? newTask.tags : []),
          category: newTask.category || 'General',
        }),
      });
      const data = await res.json();
      if (!res) throw new Error(data.error || 'Failed to create task');
      setShowModal(false);
      setNewTask({ title: '', description: '', assignedTo: '', priority: 'medium', dueDate: '', tags: '', category: '' });
      fetchTasks();
    } catch (err) {
      alert(err.message || 'Failed to create task');
    }
    setLoading(false);
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    setLoading(true);
    try {
      const token = TokenManager.getToken(false);
      const res = await fetch(`/api/task/${taskId}`, {
        method: 'PUT',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update task');
      fetchTasks();
    } catch (err) {
      alert('Failed to update task');
    }
    setLoading(false);
  };

  // Add delete handler
  const handleDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    setLoading(true);
    try {
      const token = TokenManager.getToken(false);
      const res = await fetch(`/api/task/${taskId}`, {
        method: 'DELETE',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error('Failed to delete task');
      fetchTasks();
    } catch (err) {
      alert('Failed to delete task');
    }
    setLoading(false);
  };

  const priorityColors = {
    high: 'bg-red-100 text-red-800 border-red-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    low: 'bg-green-100 text-green-800 border-green-200',
  };

  const statusIcons = {
    pending: <Circle className="w-5 h-5 text-gray-400" />,
    'in-progress': <Clock className="w-5 h-5 text-blue-500" />,
    completed: <CheckCircle className="w-5 h-5 text-green-500" />,
  };

  // Warn if any employee is missing id
  employees?.forEach(emp => {
    if (!emp || !emp.id) {
      console.warn('Employee with missing id:', emp);
    }
  });

  return (
    <AuthGuard requireAuth={true} isEmployeeRoute={false}>
      <div className="h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex">
        <Sidebar />
        <div className="min-w-6xl mx-10 mt-10 text-black">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Task Management</h1>
                <p className="text-gray-600 text-lg">Assign and track tasks for your team</p>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="bg-blue-900 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                New Task
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Tasks</p>
                  <p className="text-3xl font-bold text-gray-900">{tasks.length}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-xl">
                  <Tag className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Pending</p>
                  <p className="text-3xl font-bold text-yellow-600">{tasks.filter(t => t.status === 'pending').length}</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-xl">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Completed</p>
                  <p className="text-3xl font-bold text-green-600">{tasks.filter(t => t.status === 'completed').length}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Tasks Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full text-center text-gray-500">Loading...</div>
            ) : tasks.map(task => (
              <div key={task._id || task.id} className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:scale-105 flex flex-col justify-between min-h-[320px]">
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      {statusIcons[task.status]}
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${priorityColors[task.priority]}`}>
                        {task.priority?.toUpperCase()}
                      </span>
                    </div>
                    {/* Delete button */}
                    <button
                      onClick={() => handleDelete(task._id || task.id)}
                      className="ml-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-full p-2 shadow-sm transition-all duration-150"
                      title="Delete Task"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{task.title}</h3>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-2">{task.description}</p>

                  <div className="flex items-center gap-2 mb-3">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700 font-medium">{task.assignedTo?.name || 'Unassigned'}</span>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : ''}</span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-2">
                    {task.tags?.map((tag, index) => (
                      <span key={index} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Status badge or select */}
                <div className="flex items-center justify-between mt-4">
                  {task.status === 'pending' ? (
                    <span className="inline-block px-4 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800 border border-yellow-200 shadow-sm">Pending</span>
                  ) : task.status === 'completed' ? (
                    <span className="inline-block px-4 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200 shadow-sm">Complete</span>
                  ) : (
                    <select
                      value={task.status}
                      onChange={(e) => updateTaskStatus(task._id || task.id, e.target.value)}
                      className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                    >
                      <option key="status-in-progress" value="in-progress">In Progress</option>
                      <option key="status-completed" value="completed">Completed</option>
                    </select>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Task</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Task Title</label>
                    <input
                      type="text"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows="3"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Assign to</label>
                    <select
                      value={newTask.assignedTo}
                      onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option key="select-default" value="">Select employee</option>
                      {employees
                        ?.filter(emp => emp && emp.id)
                        .map(emp => (
                          <option 
                            key={emp.id}
                            value={emp.id}
                          >
                            {emp.name}
                          </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                      <select
                        value={newTask.priority}
                        onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                      <input
                        type="date"
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma-separated)</label>
                    <input
                      type="text"
                      value={newTask.tags}
                      onChange={(e) => setNewTask({ ...newTask, tags: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Design, Frontend, Urgent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <input
                      type="text"
                      value={newTask.category}
                      onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="flex-1 px-6 py-3 bg-blue-900 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                      disabled={employees.length === 0}
                    >
                      Create Task
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
};

export default TaskAssignmentPage;


