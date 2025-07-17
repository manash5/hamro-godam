"use client"

import React, { useState, useEffect } from 'react';
import { Plus, MoreHorizontal, Calendar, User } from 'lucide-react';
import Sidebar from '@/components/sidebar';

const COLUMN_CONFIG = [
  { id: 'to-review', title: 'To Review', color: 'bg-gray-100', status: 'To Review' },
  { id: 'in-progress', title: 'In Progress', color: 'bg-blue-50', status: 'In Progress' },
  { id: 'ready-to-launch', title: 'Ready to Launch', color: 'bg-green-50', status: 'Ready to Launch' },
  { id: 'live', title: 'Live', color: 'bg-blue-50', status: 'Live' },
];

const PRIORITY_MAP = {
  'To Review': { priority: 'URGENT', color: 'bg-red-500' },
  'In Progress': { priority: 'ACTIVE', color: 'bg-blue-500' },
  'Ready to Launch': { priority: 'READY', color: 'bg-green-500' },
  'Live': { priority: 'LIVE', color: 'bg-blue-600' },
};

const getColumnBadgeColor = (columnId) => {
  const colorMap = {
    'to-review': 'bg-gray-500',
    'in-progress': 'bg-blue-500',
    'ready-to-launch': 'bg-green-500',
    'live': 'bg-blue-600',
  };
  return colorMap[columnId] || 'bg-gray-500';
};

const groupTasksByStatus = (tasks) => {
  const columns = COLUMN_CONFIG.map(col => ({ ...col, tasks: [] }));
  tasks.forEach(task => {
    const col = columns.find(c => c.status === task.status);
    if (col) col.tasks.push(task);
  });
  return columns.map(col => ({ ...col, count: col.tasks.length }));
};

const page = () => {
  const [columns, setColumns] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [draggedTask, setDraggedTask] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [openMenuTaskId, setOpenMenuTaskId] = useState(null);
  const [newTask, setNewTask] = useState({
    title: '',
    category: '',
    description: '',
    columnId: '',
    priority: 'MEDIUM',
  });
  const [loading, setLoading] = useState(false);

  // Fetch all tasks from backend
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/kanban', {
        method: 'GET', 
        headers: { Authorization: `Bearer ${token}`}
      });
      const data = await res.json();
      setAllTasks(data.data || []);
      setColumns(groupTasksByStatus(data.data || []));
    } catch (err) {
      setAllTasks([]);
      setColumns(groupTasksByStatus([]));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Drag and drop handlers
  const handleDragStart = (e, task, sourceColumnId) => {
    setDraggedTask({ task, sourceColumnId });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, targetColumnId) => {
    e.preventDefault();
    if (!draggedTask) return;
    const sourceCol = COLUMN_CONFIG.find(col => col.id === draggedTask.sourceColumnId);
    const targetCol = COLUMN_CONFIG.find(col => col.id === targetColumnId);
    if (!sourceCol || !targetCol || sourceCol.id === targetCol.id) return;

    // Update status and priority
    const update = {
      status: targetCol.status,
      priority: PRIORITY_MAP[targetCol.status].priority,
    };
    try {
      const token = localStorage.getItem('token'); 
      await fetch(`/api/kanban/${draggedTask.task._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 
           Authorization: `Bearer ${token}`
         },
        body: JSON.stringify(update),
      });
      fetchTasks();
    } catch (err) {}
    setDraggedTask(null);
  };

  // Add task
  const handleAddTask = async () => {
    if (!newTask.title || !newTask.columnId) return;
    const col = COLUMN_CONFIG.find(c => c.id === newTask.columnId);
    if (!col) return;
    const body = {
      title: newTask.title,
      category: newTask.category || 'General',
      description: newTask.description,
      status: col.status,
      priority: newTask.priority || 'MEDIUM',
    };
    try {
      const token = localStorage.getItem('token'); 
      await fetch('/api/kanban', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',  Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      fetchTasks();
    } catch (err) {}
    setNewTask({ title: '', category: '', description: '', columnId: '', priority: 'MEDIUM' });
    setShowAddForm(false);
  };

  // Delete task
  const handleDeleteTask = async (columnId, taskId) => {
    try {
      const token = localStorage.getItem('token'); 
      await fetch(`/api/kanban/${taskId}`, { method: 'DELETE' , 
        headers: {Authorization: `Bearer ${token}`}
      }
      );
      fetchTasks();
    } catch (err) {}
    setOpenMenuTaskId(null);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex justify-start items-center">
      <Sidebar/>
      <div className="min-w-7xl px-20 h-[90vh] ">
        <div className="my-10 flex justify-between w-full">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Kanban</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Plus size={16} />
              Add Task
            </button>
          </div>
        </div>

        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md text-black">
              <h3 className="text-lg font-semibold mb-4">Add New Task</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Task title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  className="w-full  text-black p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Category"
                  value={newTask.category}
                  onChange={(e) => setNewTask({...newTask, category: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <textarea
                  placeholder="Description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                />
                <select
                  value={newTask.columnId}
                  onChange={(e) => setNewTask({...newTask, columnId: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Column</option>
                  {COLUMN_CONFIG.map(col => (
                    <option key={col.id} value={col.id}>{col.title}</option>
                  ))}
                </select>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="MEDIUM">Medium</option>
                  <option value="URGENT">Urgent</option>
                  <option value="HIGH">High</option>
                  <option value="LOW">Low</option>
                  <option value="ACTIVE">Active</option>
                  <option value="READY">Ready</option>
                  <option value="LIVE">Live</option>
                </select>
              </div>
              <div className="flex gap-2 mt-6">
                <button
                  onClick={handleAddTask}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium transition-colors"
                >
                  Add Task
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {columns.map((column) => (
            <div
              key={column.id}
              className={`${column.color} rounded-lg p-4 min-h-[600px]`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-800">{column.title}</h3>
                  <span className={`${getColumnBadgeColor(column.id)} text-white text-xs px-2 py-1 rounded-full`}>
                    {column.count}
                  </span>
                </div>
                <button className="text-gray-500 hover:text-gray-700">
                  <MoreHorizontal size={16} />
                </button>
              </div>

              <div className="space-y-3">
                {column.tasks.map((task) => (
                  <div
                    key={task._id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task, column.id)}
                    className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-move border-l-4"
                    style={{ borderLeftColor: '' }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900 text-sm">{task.title}</h4>
                      <div className="relative">
                        <button
                          className="text-gray-400 hover:text-gray-600"
                          onClick={() =>
                            setOpenMenuTaskId(openMenuTaskId === task._id ? null : task._id)
                          }
                        >
                          <MoreHorizontal size={14} />
                        </button>
                        {openMenuTaskId === task._id && (
                          <div className="absolute right-0 mt-2 w-28 bg-white border rounded shadow-lg z-10">
                            <button
                              className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                              onClick={() => handleDeleteTask(column.id, task._id)}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">{task.category}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`${PRIORITY_MAP[task.status]?.color || 'bg-gray-500'} text-white text-xs px-2 py-1 rounded-full font-medium`}>
                          {task.priority?.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Calendar size={12} />
                          <span>{new Date(task.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                          {task.assignee}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default page;