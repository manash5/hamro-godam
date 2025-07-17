"use client"

import React, { useState } from 'react';
import { Plus, MoreHorizontal, Calendar, User } from 'lucide-react';
import Sidebar from '@/components/sidebar';

const page = () => {
  const [columns, setColumns] = useState([
    {
      id: 'to-review',
      title: 'To Review',
      color: 'bg-gray-100',
      count: 3,
      tasks: [
        {
          id: 1,
          title: 'iPhone 15 Pro',
          category: 'Electronics',
          priority: 'urgent',
          priority_color: 'bg-red-500',
          description: 'Review latest iPhone features and specifications',
          assignee: 'JD',
          date: '2 days ago'
        },
        {
          id: 2,
          title: 'MacBook Pro M3',
          category: 'Electronics',
          priority: 'high',
          priority_color: 'bg-orange-500',
          description: 'Evaluate performance improvements',
          assignee: 'AS',
          date: '1 week ago'
        }
      ]
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      color: 'bg-blue-50',
      count: 2,
      tasks: [
        {
          id: 3,
          title: 'AirPods Pro 2',
          category: 'Audio',
          priority: 'active',
          priority_color: 'bg-blue-500',
          description: 'Testing noise cancellation features',
          assignee: 'MK',
          date: '3 days ago'
        },
        {
          id: 4,
          title: 'iPad Pro 12.9"',
          category: 'Tablets',
          priority: 'medium',
          priority_color: 'bg-blue-400',
          description: 'Display and performance analysis',
          assignee: 'RW',
          date: '5 days ago'
        }
      ]
    },
    {
      id: 'ready-to-launch',
      title: 'Ready to Launch',
      color: 'bg-green-50',
      count: 2,
      tasks: [
        {
          id: 5,
          title: 'Apple Watch Series 9',
          category: 'Wearables',
          priority: 'ready',
          priority_color: 'bg-green-500',
          description: 'Final review completed',
          assignee: 'LM',
          date: '1 day ago'
        },
        {
          id: 6,
          title: 'iPhone 14 Pro',
          category: 'Electronics',
          priority: 'ready',
          priority_color: 'bg-green-500',
          description: 'Ready for market launch',
          assignee: 'TC',
          date: '2 days ago'
        }
      ]
    },
    {
      id: 'live',
      title: 'Live',
      color: 'bg-blue-50',
      count: 1,
      tasks: [
        {
          id: 7,
          title: 'MacBook Air M2',
          category: 'Electronics',
          priority: 'live',
          priority_color: 'bg-blue-600',
          description: 'Currently live in production',
          assignee: 'DK',
          date: '1 week ago'
        }
      ]
    }
  ]);

  const [draggedTask, setDraggedTask] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [openMenuTaskId, setOpenMenuTaskId] = useState(null);
  const [newTask, setNewTask] = useState({
    title: '',
    category: '',
    description: '',
    assignee: '',
    columnId: ''
  });

  const handleDragStart = (e, task, sourceColumnId) => {
    setDraggedTask({ task, sourceColumnId });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetColumnId) => {
    e.preventDefault();
    if (!draggedTask || draggedTask.sourceColumnId === targetColumnId) return;

    setColumns(prev => {
      const newColumns = [...prev];
      
      // Find source and target column indexes
      const sourceColIndex = newColumns.findIndex(col => col.id === draggedTask.sourceColumnId);
      const targetColIndex = newColumns.findIndex(col => col.id === targetColumnId);
      
      // Remove from source column
      const sourceTasks = [...newColumns[sourceColIndex].tasks];
      const taskIndex = sourceTasks.findIndex(task => task.id === draggedTask.task.id);
      const [movedTask] = sourceTasks.splice(taskIndex, 1);
      
      // Update task priority based on new column
      const updatedTask = {
        ...movedTask,
        priority: getPriorityByColumn(targetColumnId),
        priority_color: getPriorityColorByColumn(targetColumnId)
      };
      
      // Add to target column
      const targetTasks = [...newColumns[targetColIndex].tasks, updatedTask];
      
      // Create new columns array with updated tasks
      const updatedColumns = [...newColumns];
      updatedColumns[sourceColIndex] = {
        ...updatedColumns[sourceColIndex],
        tasks: sourceTasks,
        count: sourceTasks.length
      };
      updatedColumns[targetColIndex] = {
        ...updatedColumns[targetColIndex],
        tasks: targetTasks,
        count: targetTasks.length
      };
      
      return updatedColumns;
    });
    
    setDraggedTask(null);
  };

  const getPriorityByColumn = (columnId) => {
    const priorityMap = {
      'to-review': 'urgent',
      'in-progress': 'active',
      'ready-to-launch': 'ready',
      'live': 'live'
    };
    return priorityMap[columnId] || 'medium';
  };

  const getPriorityColorByColumn = (columnId) => {
    const colorMap = {
      'to-review': 'bg-red-500',
      'in-progress': 'bg-blue-500',
      'ready-to-launch': 'bg-green-500',
      'live': 'bg-blue-600'
    };
    return colorMap[columnId] || 'bg-gray-500';
  };


  const handleAddTask = () => {
    if (!newTask.title || !newTask.columnId) return;

    const task = {
      id: Math.random().toString(36).substring(2, 9), 
      title: newTask.title,
      category: newTask.category || 'General',
      priority: getPriorityByColumn(newTask.columnId),
      priority_color: getPriorityColorByColumn(newTask.columnId),
      description: newTask.description,
      assignee: newTask.assignee || 'UN',
      date: 'Just now'
    };

    setColumns(prev => {
      return prev.map(col => {
        if (col.id === newTask.columnId) {
          const newTasks = [...col.tasks, task];
          return { ...col, tasks: newTasks, count: newTasks.length };
        }
        return col;
      });
    });

    setNewTask({ title: '', category: '', description: '', assignee: '', columnId: '' });
    setShowAddForm(false);
  };

  const getColumnBadgeColor = (columnId) => {
    const colorMap = {
      'to-review': 'bg-gray-500',
      'in-progress': 'bg-blue-500',
      'ready-to-launch': 'bg-green-500',
      'live': 'bg-blue-600'
    };
    return colorMap[columnId] || 'bg-gray-500';
  };

  const handleDeleteTask = (columnId, taskId) => {
    setColumns(prev =>
      prev.map(col => {
        if (col.id === columnId) {
          const newTasks = col.tasks.filter(task => task.id !== taskId);
          return { ...col, tasks: newTasks, count: newTasks.length };
        }
        return col;
      })
    );
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
                <input
                  type="text"
                  placeholder="Assignee initials"
                  value={newTask.assignee}
                  onChange={(e) => setNewTask({...newTask, assignee: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <select
                  value={newTask.columnId}
                  onChange={(e) => setNewTask({...newTask, columnId: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Column</option>
                  {columns.map(col => (
                    <option key={col.id} value={col.id}>{col.title}</option>
                  ))}
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
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task, column.id)}
                    className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-move border-l-4"
                    style={{ borderLeftColor: task.priority_color.replace('bg-', '#') }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900 text-sm">{task.title}</h4>
                      <div className="relative">
                        <button
                          className="text-gray-400 hover:text-gray-600"
                          onClick={() =>
                            setOpenMenuTaskId(openMenuTaskId === task.id ? null : task.id)
                          }
                        >
                          <MoreHorizontal size={14} />
                        </button>
                        {openMenuTaskId === task.id && (
                          <div className="absolute right-0 mt-2 w-28 bg-white border rounded shadow-lg z-10">
                            <button
                              className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                              onClick={() => handleDeleteTask(column.id, task.id)}
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
                        <span className={`${task.priority_color} text-white text-xs px-2 py-1 rounded-full font-medium`}>
                          {task.priority.toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Calendar size={12} />
                          <span>{task.date}</span>
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